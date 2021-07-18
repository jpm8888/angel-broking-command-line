const Table = require('cli-table3');
const network = require('../../common/NetworkOps');
const Config = require('../../common/Config');
const Prefs = require('../../common/Preferences');
const Logger = require('../../common/Logger');

const TAG = 'user: ';
const { PrefKeys } = Prefs;

async function tryLogin() {
  const params = {
    clientcode: Config.CLIENT_CODE,
    password: Config.CLIENT_PASSWORD,
  };

  const res = await network.makePostRequest(Config.ANGEL_URLS.login, params);
  if (!res.status) return;
  const { jwtToken, refreshToken, feedToken } = res.data;
  await Prefs.save_pref(PrefKeys.KEY_AUTH_TOKEN, jwtToken);
  await Prefs.save_pref(PrefKeys.KEY_REFRESH_TOKEN, refreshToken);
  await Prefs.save_pref(PrefKeys.KEY_FEED_TOKEN, feedToken);
  Logger.logInfo(TAG, 'Login success : ');
}

async function getProfile() {
  const res = await network.makeGetRequest(Config.ANGEL_URLS.getProfile);
  if (!res.status) return;
  const { data } = res;
  const {
    clientcode, name, email, mobileno, exchanges, products, brokerid,
  } = data;

  const table = new Table();

  table.push(
    { 'Client Code': clientcode },
    { Name: name },
    { Email: email },
    { 'Mobile Number': mobileno },
    { Exchanges: JSON.stringify(exchanges) },
    { Products: JSON.stringify(products) },
    { 'Broker Id': brokerid },
  );
  // eslint-disable-next-line no-console
  console.log(table.toString());
}

async function funds() {
  const res = await network.makeGetRequest(Config.ANGEL_URLS.funds);
  if (!res.status) return;
  const { data } = res;
  const {
    net, availablecash, availableintradaypayin, availablelimitmargin, m2munrealized, m2mrealized,
  } = data;

  const table = new Table();

  table.push(
    { 'Net Amt.': net },
    { 'Available Cash': availablecash },
    { 'Intraday PayIn': availableintradaypayin },
    { 'Available Limit Margin': availablelimitmargin },
    { 'M2M-Un-Realized': m2munrealized },
    { 'M2M-Realized': m2mrealized },
  );
  // eslint-disable-next-line no-console
  console.log(table.toString());
}

tryLogin().then(async () => {
  await getProfile();
  await funds();
});
