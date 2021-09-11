const inquirer = require('inquirer');
const { Exchange, InstrumentSection } = require('../../../common/Angel');
const { getResultFromDatabase } = require('../../../common/database/Database');
const {
  whichCode,
  whichFutures,
  whichOptions,
  whichExchange,
  whichSymbolRow,
} = require('./inquries');
const Logger = require('../../../common/Logger');

const TAG = 'utils/symbol: ';

async function getInstrumentType(type) {
  if (type === InstrumentSection.STOCKS) return '';
  if (type === InstrumentSection.FUTURES) {
    const out = await inquirer.prompt(whichFutures);
    return out.instrument_type;
  }

  if (type === InstrumentSection.OPTIONS) {
    const out = await inquirer.prompt(whichOptions);
    return out.instrument_type;
  }
  return '';
}

async function getExchange(type) {
  if (type === InstrumentSection.STOCKS) {
    const out = await inquirer.prompt(whichExchange);
    return out.exchange;
  }
  if (type === InstrumentSection.FUTURES || type === InstrumentSection.OPTIONS) {
    return Exchange.NFO;
  }

  return '';
}

async function findSymbol() {
  const info = await inquirer.prompt(whichCode);
  const { code, type } = info;
  const instrumentType = await getInstrumentType(type);
  const exchange = await getExchange(type);

  if (type === InstrumentSection.STOCKS) {
    let query = `SELECT * from instruments where (symbol like '${code}%-EQ') and `;
    query += `instrumenttype = '${instrumentType}' and `;
    query += `exch_seg = '${exchange}' `;
    query += 'order by symbol ';
    query += 'limit 5';

    const rows = await getResultFromDatabase(query);
    if (rows.length === 0) {
      Logger.logError(TAG, 'No symbol found');
      return undefined;
    }

    const { details } = await inquirer.prompt(whichSymbolRow(rows));
    return details;
  }

  if (type === InstrumentSection.FUTURES) {
    let query = `SELECT * from instruments where (symbol like '${code}%') and `;
    query += `instrumenttype = '${instrumentType}' and `;
    query += `exch_seg = '${exchange}' `;
    query += 'order by date(expiry) asc, symbol asc ';
    query += 'limit 5';

    const rows = await getResultFromDatabase(query);
    if (rows.length === 0) {
      Logger.logError(TAG, 'No symbol found');
      return undefined;
    }

    const { details } = await inquirer.prompt(whichSymbolRow(rows));
    return details;
  }

  return undefined;
}

module.exports = {
  findSymbol,
};
