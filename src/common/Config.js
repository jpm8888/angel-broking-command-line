const ANGEL_API_HOST = 'https://apiconnect.angelbroking.com';
const APP_BUILD = 1;
const APP_VERSION = 1;
const APP_ENV = 'dev';

const APP_DIR = '.angel';
const DB_NAME = 'angel_1.sqlite';

// https://smartapi.angelbroking.com/docs/User
const ANGEL_URLS = {
  test: 'https://jsonplaceholder.typicode.com/todos/1',
  login: `${ANGEL_API_HOST}/rest/auth/angelbroking/user/v1/loginByPassword`,
  refreshToken: `${ANGEL_API_HOST}/rest/auth/angelbroking/jwt/v1/generateTokens`,
  getProfile: `${ANGEL_API_HOST}/rest/secure/angelbroking/user/v1/getProfile`,
  funds: `${ANGEL_API_HOST}/rest/secure/angelbroking/user/v1/getRMS`,

  placeOrder: `${ANGEL_API_HOST}/rest/secure/angelbroking/order/v1/placeOrder`,
  modifyOrder: `${ANGEL_API_HOST}/rest/secure/angelbroking/order/v1/modifyOrder`,
  cancelOrder: `${ANGEL_API_HOST}/rest/secure/angelbroking/order/v1/cancelOrder`,
  getOrderBook: `${ANGEL_API_HOST}/rest/secure/angelbroking/order/v1/getOrderBook`,
  getTradeBook: `${ANGEL_API_HOST}/rest/secure/angelbroking/order/v1/getTradeBook`,
  getLtpData: `${ANGEL_API_HOST}/rest/secure/angelbroking/order/v1/getLtpData`,

  getHolding: `${ANGEL_API_HOST}/rest/secure/angelbroking/portfolio/v1/getHolding`,
  getPosition: `${ANGEL_API_HOST}/rest/secure/angelbroking/order/v1/getPosition`,
  convertPosition: `${ANGEL_API_HOST}/rest/secure/angelbroking/order/v1/convertPosition`,

  tradedStocks: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
};

module.exports = {
  APP_ENV,
  ANGEL_API_HOST,
  APP_VERSION,
  APP_BUILD,
  ANGEL_URLS,
  APP_DIR,
  DB_NAME,
};
