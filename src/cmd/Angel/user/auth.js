const open = require('open');
const Logger = require('../../../common/Logger');
const Prefs = require('../../../common/Preferences');
const { PrefKeys } = require('../../../common/Preferences');

const TAG = 'user/auth: ';
const AUTH_URL = 'https://smartapi.angelbroking.com/publisher-login?api_key=';
async function authUser() {
  Logger.logInfo(TAG, 'SignIn');
  const apiKey = await Prefs.get_pref(PrefKeys.KEY_ANGEL_API_KEY, '');
  await open(AUTH_URL + apiKey);
}

const command = {
  command: 'user:auth',
  describe: 'To sign in angel broking system via web-browser (required to use this utility.)',
  handler: () => {
    authUser().then();
  },
};

module.exports = {
  command,
};
