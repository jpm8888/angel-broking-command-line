const Logger = require('../../../common/Logger');
const Prefs = require('../../../common/Preferences');
const { PrefKeys } = require('../../../common/Preferences');
const { printUserDetails } = require('./utils');

const TAG = 'user/which: ';

async function whichUser() {
  const userId = await Prefs.get_pref(PrefKeys.KEY_CURRENT_USER_ID, '');
  if (!userId && userId.trim() === '') {
    Logger.logError(TAG, 'no user in the session');
    Logger.logInfo(TAG, 'use angel user:select');
    return;
  }

  await printUserDetails(userId);
}

const command = {
  command: 'user:which',
  describe: 'details about the current session user.',
  handler: () => {
    whichUser().then();
  },
};

module.exports = {
  command,
};
