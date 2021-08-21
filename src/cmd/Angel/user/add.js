const chalk = require('chalk');
const rs = require('readline-sync');
const Logger = require('../../../common/Logger');
const Database = require('../../../common/database/Database');

const TAG = 'user/add: ';
async function addUser() {
  console.log(chalk.green.bold('Create a new user \n'));
  const clientCode = rs.question('Client-Code/Username: ') || '';
  const password = rs.question('Password: ') || '';

  const config = [
    { key: 'Client Code', value: clientCode },
    { key: 'Password', value: password },
  ];

  let error = false;
  for (let i = 0; i < config.length; i += 1) {
    const c = config[i];
    if (c.value.trim() === '') {
      Logger.logError(TAG, `Required field - ${c.key}`);
      error = true;
      break;
    }
  }

  if (error) return;

  const db = await Database.getDatabase();

  try {
    const query = `insert into users (client_code, client_pass) values ("${clientCode}", "${password}")`;
    await db.run(query);
    await Database.closeDatabase(db);
  } catch (e) {
    await Database.closeDatabase(db);
    Logger.logError(TAG, 'can add user: ');
    Logger.logError(TAG, e);
  }
}

const command = {
  command: 'user:add',
  describe: 'add new user to the database.',
  handler: () => {
    addUser().then();
  },
};

module.exports = {
  command,
};
