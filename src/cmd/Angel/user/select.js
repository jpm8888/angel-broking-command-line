const rs = require('readline-sync');
const Logger = require('../../../common/Logger');
const Prefs = require('../../../common/Preferences');
const { printAllUsers } = require('./all');
const Database = require('../../../common/database/Database');
const { PrefKeys } = require('../../../common/Preferences');
const { getUser } = require('./utils');

const TAG = 'user/select: ';

async function setCurrentUser(userId, authToken) {
  try {
    await Prefs.save_pref(PrefKeys.KEY_CURRENT_USER_ID, userId);
    await Prefs.save_pref(PrefKeys.KEY_CURRENT_USER_TOKEN, authToken);
  } catch (e) {
    Logger.logError(TAG, e);
  }
}

async function selectUser() {
  await printAllUsers();
  const userId = rs.question('\nEnter User ID: eg. 1, 2... :- ') || '';

  const db = await Database.getDatabase();
  const response = await getUser(userId);
  await Database.closeDatabase(db);

  if (!response.status) {
    Logger.logError(TAG, response.message);
    return;
  }

  const { user } = response;
  const { id, auth_token } = user;
  if (!auth_token || auth_token.toString().trim() === '') {
    Logger.logError(TAG, 'auth token is empty.');
    Logger.logInfo(TAG, 'use angel user:login');
    return;
  }
  await setCurrentUser(id, auth_token);
  Logger.logSuccess(TAG, 'success.');
  Logger.logInfo(TAG, 'use angel user:which - to view current session user.');
}

const command = {
  command: 'user:select',
  describe: 'select user for the current session.',
  handler: () => {
    selectUser().then();
  },
};

module.exports = {
  command,
  setCurrentUser,
};
