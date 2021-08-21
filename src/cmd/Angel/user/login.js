const rs = require('readline-sync');
const network = require('../../../common/NetworkOps');
const Config = require('../../../common/Config');
const Logger = require('../../../common/Logger');
const { printAllUsers } = require('./all');
const Database = require('../../../common/database/Database');

const TAG = 'user/login: ';

async function getUser(userId, db) {
  const id = userId.toString().trim();
  const errorObject = {
    status: false,
    message: 'id not found',
  };
  if (id === '') return errorObject;

  try {
    const query = `select * from users where id = ${id} limit 1`;
    const rows = await db.all(query, []);
    const user = rows.length > 0 ? rows[0] : undefined;
    if (!user) return errorObject;
    return {
      status: true,
      message: 'user found.',
      id: user.id,
      client_name: user.client_name,
      client_code: user.client_code,
      client_pass: user.client_pass,
    };
  } catch (e) {
    Logger.logError(TAG, e);
  }
  return errorObject;
}

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
  const user = await getUser(userId, db);

  if (!user.status) {
    Logger.logError(TAG, user.message);
    await Database.closeDatabase(db);
    return;
  }

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
