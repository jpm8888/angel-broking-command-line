const rs = require('readline-sync');
const network = require('../../../common/NetworkOps');
const Config = require('../../../common/Config');
const Logger = require('../../../common/Logger');
const { printAllUsers } = require('./all');
const Database = require('../../../common/database/Database');
const { getUser } = require('./utils');
const { setCurrentUser } = require('./select');

const TAG = 'user/login: ';

async function saveTokens(id, jwtAuthToken, refreshToken, feedToken, db) {
  try {
    const query = 'update users set auth_token=?, refresh_token=?, feed_token=? where id=?';
    await db.run(query, [jwtAuthToken, refreshToken, feedToken, id]);
  } catch (e) {
    Logger.logError(TAG, e);
  }
}

async function tryLogin() {
  await printAllUsers();
  const userId = rs.question('\nEnter User ID: eg. 1, 2... :- ') || '';

  const db = await Database.getDatabase();
  const response = await getUser(userId);

  if (!response.status) {
    Logger.logError(TAG, response.message);
    await Database.closeDatabase(db);
    return;
  }

  const { user } = response;
  const params = {
    clientcode: user.client_code,
    password: user.client_pass,
  };

  const res = await network.makePostRequest(Config.ANGEL_URLS.login, params);
  if (!res.status) {
    Logger.logError(TAG, res.message);
    await Database.closeDatabase(db);
    return;
  }

  const { jwtToken, refreshToken, feedToken } = res.data;
  await saveTokens(user.id, jwtToken, refreshToken, feedToken, db);
  await setCurrentUser(user.id, jwtToken);
  Logger.logInfo(TAG, 'Login success : ');
}

const commandLogin = {
  command: 'user:login',
  describe: 'login using your username and password.',
  handler: () => {
    tryLogin().then();
  },
};

module.exports = {
  commandLogin,
};
