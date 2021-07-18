const { APP_ENV, APP_BUILD, APP_VERSION } = process.env;
const { ANGEL_API_HOST, ANGEL_API_KEY, ANGEL_SECRET_KEY } = process.env;
const { CLIENT_CODE, CLIENT_PASSWORD } = process.env;
const { MAC_ADDRESS, CLIENT_PUBLIC_IP, CLIENT_LOCAL_IP } = process.env;
const DB_NAME = `${process.env.DB_NAME}_${APP_BUILD}.sqlite`;

const AUTH_URL = `https://smartapi.angelbroking.com/publisher-login?api_key=${ANGEL_API_KEY}`;

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

};

module.exports = {
  APP_ENV,
  DB_NAME,
  ANGEL_API_HOST,
  ANGEL_API_KEY,
  ANGEL_SECRET_KEY,
  CLIENT_CODE,
  CLIENT_PASSWORD,
  APP_VERSION,
  APP_BUILD,
  AUTH_URL,
  ANGEL_URLS,
  MAC_ADDRESS,
  CLIENT_PUBLIC_IP,
  CLIENT_LOCAL_IP,
};
