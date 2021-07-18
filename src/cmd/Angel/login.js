const network = require('../../common/NetworkOps');
const Config = require('../../common/Config');
const Prefs = require('../../common/Preferences');
const Logger = require('../../common/Logger');

const TAG = 'login: ';
const { PrefKeys } = Prefs;

const params = {
  clientcode: Config.CLIENT_CODE,
  password: Config.CLIENT_PASSWORD,
};

async function tryLogin() {
  const res = await network.makePostRequest(Config.ANGEL_URLS.login, params);
  if (!res.status) return;
  const { jwtToken, refreshToken, feedToken } = res.data;
  await Prefs.save_pref(PrefKeys.KEY_AUTH_TOKEN, jwtToken);
  await Prefs.save_pref(PrefKeys.KEY_REFRESH_TOKEN, refreshToken);
  await Prefs.save_pref(PrefKeys.KEY_FEED_TOKEN, feedToken);
  Logger.logInfo(TAG, 'Login success : ');
}

tryLogin().then(() => {

});
