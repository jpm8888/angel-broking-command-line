const cliProgress = require('cli-progress');
const { from } = require('rxjs');
const { mergeMap } = require('rxjs');
const dayjs = require('dayjs');
const Logger = require('../../common/Logger');
const Database = require('../../common/database/Database');
const network = require('../../common/NetworkOps');
const Config = require('../../common/Config');
const migration_v1 = require('../../common/database/migration_v1');
const migration_v2 = require('../../common/database/migration_v2');

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

async function insert(db, item) {
  const table_name = 'instruments';
  let query = `insert into ${table_name} `;
  query += '(token, symbol, name, expiry, strike, lotsize, instrumenttype, exch_seg, tick_size) ';
  query += 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const {
    token, symbol, name, expiry, strike, lotsize, instrumenttype, exch_seg, tick_size,
  } = item;

  const params = [
    token, symbol,
    name, expiry,
    strike, lotsize,
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
    const arr = await network.makeGetRequest(Config.ANGEL_URLS.tradedStocks);
    await truncateInstrumentsTable(db);
    progress.start(arr.length, 0);

    const source = from(arr);
    const ob$ = source.pipe(
      mergeMap((item) => from(insert(db, item))),
    );

    ob$.subscribe({
      next: () => progress.increment(),
      complete: () => {
        Database.closeDatabase(db).then(() => {
          progress.stop();
        });
      },
    });
  } catch (e) {
    console.log(e);
  }
};

const populateExpiry = async () => {
  const query = 'select distinct expiry from instruments';
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
      const date = dayjs(expiry, 'DDMMMYYYY');
      const exp_date = date.format('YYYY-MM-DD');
      insertQuery += `('${exp_date}', '${expiry}'),`;
    }
  });

  const finalQuery = `${insertQuery.slice(0, -1)};`;
  await db.run(finalQuery, []);
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
