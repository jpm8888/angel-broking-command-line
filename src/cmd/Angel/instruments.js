const cliProgress = require('cli-progress');
const { from } = require('rxjs');
const { mergeMap } = require('rxjs');
const Logger = require('../../common/Logger');
const Database = require('../../common/database/Database');
const network = require('../../common/NetworkOps');
const Config = require('../../common/Config');

const TAG = 'instruments: ';

async function truncateInstrumentsTable(db) {
  const table_name = 'instruments';
  const query = `delete from ${table_name} `;
  await db.run(query);
  Logger.logSuccess(TAG, 'truncated instruments table.');
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

const dump_stocks = async () => {
  const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  const db = await Database.getDatabase();
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

const commandUpdateInstruments = {
  command: 'dump_stocks',
  describe: 'Retrieve the CSV dump of all traded instruments',
  handler: () => {
    dump_stocks().then(() => {});
  },
};

module.exports = {
  commandUpdateInstruments,
};
