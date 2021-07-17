const { APP_ENV, APP_BUILD, APP_VERSION } = process.env;
const { ANGEL_API_HOST, ANGEL_API_KEY, ANGEL_SECRET_KEY } = process.env;
const { CLIENT_CODE, CLIENT_PASSWORD } = process.env;
const DB_NAME = `${process.env.DB_NAME}_${APP_BUILD}.sqlite`;

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
};
