const cliProgress = require('cli-progress');
const dayjs = require('dayjs');
const Logger = require('../../common/Logger');
const Database = require('../../common/database/Database');
const network = require('../../common/NetworkOps');
const Config = require('../../common/Config');
const migration_v1 = require('../../common/database/migration_v1');
const migration_v2 = require('../../common/database/migration_v2');
const Angel = require('../../common/Angel');
const { ExpiryType, InstrumentType } = require('../../common/Angel');
const DumpService = require('./DumpService');

const TAG = 'instruments: ';

async function truncateInstrumentsTable(db) {
  const table_name = 'instruments';
  const query = `delete from ${table_name} `;
  await db.run(query);
  Logger.logSuccess(TAG, 'truncated instruments table.');
}

async function truncateExpiryTable(db) {
  const table_name = 'expiry';
  const query = `delete from ${table_name} `;
  const resetAutoIncQuery = `DELETE FROM SQLITE_SEQUENCE WHERE name = '${table_name}';`;
  await db.run(query);
  await db.run(resetAutoIncQuery);
  Logger.logSuccess(TAG, 'truncated expiry table.');
}

function extractOptionType(symbol, instrumentType) {
  if (instrumentType === InstrumentType.OptionStock
      || instrumentType === InstrumentType.OptionIndex
      || instrumentType === InstrumentType.OptionCurrency
  ) {
    return symbol.toString().trim().slice(-2);
  }
  return null;
}

async function insert(db, item) {
  const table_name = 'instruments';
  let query = `insert into ${table_name} `;
  query += '(token, symbol, name, expiry, strike, option_type, lotsize, instrumenttype, exch_seg, tick_size) ';
  query += 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const {
    token, symbol, name, expiry, strike, lotsize, instrumenttype, exch_seg, tick_size,
  } = item;

  let exp_date = expiry;
  if (expiry.length > 0) {
    const date = dayjs(expiry, 'DDMMMYYYY');
    exp_date = date.format('YYYY-MM-DD');
  }

  let strike_price = parseFloat(strike);
  if (strike_price > 0) strike_price /= 100;

  const optionType = extractOptionType(symbol, instrumenttype);

  const params = [
    token, symbol,
    name, exp_date,
    strike_price, optionType, lotsize,
    instrumenttype, exch_seg,
    tick_size,
  ];

  await db.run(query, params);
  // console.log('inserted...');
}

async function runMigration() {
  await migration_v1.run_migration_v1();
  await migration_v2.run_migration_v2();
}

const dump_stocks = async () => {
  await runMigration();
  const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  const db = await Database.getDatabase();
  Logger.logInfo(TAG, 'It takes about 3-5 minutes (max), Please wait.');
  try {
    const arr = await network.makeGetRequest(Config.ANGEL_URLS.tradedStocks) || [];
    await truncateInstrumentsTable(db);
    progress.start(arr.length, 0);

    const queue = new DumpService();
    queue.results.subscribe({
      next: () => progress.increment(),
      complete: () => {
        Database.closeDatabase(db).then(() => {
          progress.stop();
          Logger.logSuccess(TAG, 'success');
        });
      },
    });

    arr.forEach((item) => {
      queue.addToQueue(() => insert(db, item));
    });
    queue.finish();
  } catch (e) {
    console.log(e);
  }
};

const setExpType = async (db) => {
  const query = 'select * from expiry order by exp_date;';
  const rows = await db.all(query, []);
  await Promise.all(rows.map(async (item, index) => {
    let type = ExpiryType.MONTHLY;
    if (index < rows.length - 1) {
      const next = rows[index + 1];
      const currentExpiryDate = dayjs(item.exp_date, 'YYYY-MM-DD');
      const nextExpiryDate = dayjs(next.exp_date, 'YYYY-MM-DD');

      if (currentExpiryDate.month() === nextExpiryDate.month()) {
        type = ExpiryType.WEEKLY;
      }
    }

    await db.run('update expiry set exp_type = ? where query_date = ? ', [type, item.query_date]);
  }));
};

const populateExpiry = async () => {
  const query = `select distinct expiry from instruments where exch_seg = '${Angel.Exchange.NFO}'`;
  const db = await Database.getDatabase();
  await truncateExpiryTable(db);
  const rows = await db.all(query, []);

  if (rows.length === 0) {
    Logger.logError(TAG, 'no expiry dates found');
    return;
  }

  let insertQuery = 'insert into expiry (\'exp_date\', \'query_date\') values ';
  rows.forEach((item) => {
    const expiry = item.expiry.trim();
    if (expiry.length > 0) {
      const formatted = dayjs(expiry, 'YYYY-MM-DD').format('DD MMM YYYY');
      insertQuery += `('${expiry}', '${formatted}'),`;
    }
  });

  const finalQuery = `${insertQuery.slice(0, -1)};`;
  await db.run(finalQuery, []);
  await setExpType(db);
  Logger.logSuccess(TAG, 'expiry table updated.');
  await Database.closeDatabase(db);
};

const commandUpdateInstruments = {
  command: 'dump_stocks',
  describe: 'Retrieve the CSV dump of all traded instruments',
  handler: () => {
    dump_stocks().then(async () => {
      await populateExpiry();
    });
  },
};

module.exports = {
  commandUpdateInstruments,
};
