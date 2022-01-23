const inquirer = require('inquirer');
const {
  Exchange, InstrumentSection, InstrumentType, ExpiryType,
} = require('../../../common/Angel');
const { getResultFromDatabase } = require('../../../common/database/Database');
const {
  whichCode,
  whichFutures,
  whichOptions,
  whichExchange,
  whichSymbolRow, whichOptionType,
  whichExpiry,
} = require('./inquries');
const Logger = require('../../../common/Logger');
const network = require('../../../common/NetworkOps');
const Config = require('../../../common/Config');

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

// rate limit 10 req per second.
async function getLTPData(exchange, symbol, symbolToken) {
  const params = {
    exchange,
    tradingsymbol: symbol,
    symboltoken: symbolToken,
  };

  const response = await network.makePostRequest(
    Config.ANGEL_URLS.getLtpData,
    params,
  );

  const { data, status, message } = response;

  if (status) {
    return data;
  }

  Logger.logError(message);
  return undefined;
}

const getSymbol = async (code, instrumentType, exchange, isEquity = false) => {
  const suffix = isEquity ? '-EQ' : '';
  let query = `SELECT * from instruments where (symbol like '${code}%${suffix}') and `;
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
};

async function findSymbol() {
  const info = await inquirer.prompt(whichCode);
  const { code, type } = info;
  const instrumentType = await getInstrumentType(type);
  const exchange = await getExchange(type);

  if (type === InstrumentSection.STOCKS) {
    const mSymbol = await getSymbol(code, instrumentType, exchange, true);
    return mSymbol;
  }

  if (type === InstrumentSection.FUTURES) {
    const mSymbol = await getSymbol(code, instrumentType, exchange);
    return mSymbol;
  }

  if (type === InstrumentSection.OPTIONS) {
    const { option_type } = await inquirer.prompt(whichOptionType);

    const expiryType = (instrumentType === InstrumentType.OptionIndex)
      ? undefined : ExpiryType.MONTHLY;

    const expiry = await whichExpiry(expiryType);

    let ltp = 0;
    let tickSize = 0;
    let stockName = '';
    if (instrumentType === InstrumentType.OptionStock) {
      const {
        symbol, token, tick_size, name,
      } = await getSymbol(code, '', Exchange.NSE, true);
      const ltpData = await getLTPData(Exchange.NSE, symbol, token);
      ltp = ltpData?.ltp || 0;
      tickSize = tick_size;
      stockName = name;
    }

    const limit = 5 * 2;
    const strikePriceFrom = ltp - (tickSize * limit);

    let query = `SELECT * from instruments where (symbol like '${code}%') and `;
    query += `name = '${stockName}' and `;
    query += `option_type = '${option_type}' and `;
    query += `expiry = '${expiry}' and `;
    query += `strike >= '${strikePriceFrom}' `;
    query += 'order by strike asc ';
    query += `limit ${limit}`;

    console.log(query);
  }

  return undefined;
}

module.exports = {
  findSymbol,
  getLTPData,
};
