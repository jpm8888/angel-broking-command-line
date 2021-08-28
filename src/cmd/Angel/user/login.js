const rs = require('readline-sync');
const { mergeMap, from } = require('rxjs');
const network = require('../../../common/NetworkOps');
const Config = require('../../../common/Config');
const Logger = require('../../../common/Logger');
const { printAllUsers } = require('./all');
const Database = require('../../../common/database/Database');
const { getUser, getAllUser } = require('./utils');
const { setCurrentUser } = require('./select');

const TAG = 'user/login: ';

async function saveTokens(id, jwtAuthToken, refreshToken, feedToken) {
  const db = await Database.getDatabase();
  try {
    const query = 'update users set auth_token=?, refresh_token=?, feed_token=? where id=?';
    await db.run(query, [jwtAuthToken, refreshToken, feedToken, id]);
    await Database.closeDatabase(db);
  } catch (e) {
    Logger.logError(TAG, e);
    await Database.closeDatabase(db);
  }
}

async function login(user) {
  const params = {
    clientcode: user.client_code,
    password: user.client_pass,
  };

  const res = await network.makePostRequest(Config.ANGEL_URLS.login, params);
  if (!res.status) {
    Logger.logError(TAG, res.message);
    return;
  }

  const { jwtToken, refreshToken, feedToken } = res.data;
  await saveTokens(user.id, jwtToken, refreshToken, feedToken);
  await setCurrentUser(user.id, jwtToken);
  Logger.logInfo(TAG, 'Login success : ');
}

async function allUserLogin() {
  const users = await getAllUser();
  const source = from(users);
  const ob$ = source.pipe(
    mergeMap((user) => from(login(user))),
  );

  ob$.subscribe({
    next: () => {},
    complete: () => {
      Logger.logInfo(TAG, 'logged into all accounts.');
    },
  });
}

async function singleUserLogin() {
  const users = await getAllUser();
  if (users.length <= 1) {
    await allUserLogin();
    return;
  }
  await printAllUsers();
  const userId = rs.question('\nEnter User ID: eg. 1, 2... :- ') || '';

  const response = await getUser(userId);
  if (!response.status) {
    Logger.logError(TAG, response.message);
    return;
  }

  const { user } = response;
  await login(user);
}

const commandLogin = {
  command: 'user:login [all]',
  describe: 'login using your username and password.',
  aliases: ['l'],
  builder: (yargs) => {
    yargs.positional('all', {
      describe: 'to login into all user accounts.',
      type: 'boolean',
      alias: 'a',
    });
  },
  handler: (argv) => {
    const loginAllAccount = argv.all;

    if (loginAllAccount) {
      allUserLogin().then();
    } else {
      singleUserLogin().then();
    }
  },
};

module.exports = {
  commandLogin,
};
