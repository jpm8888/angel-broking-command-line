const Table = require('cli-table3');
const Database = require('../../../common/database/Database');
const Logger = require('../../../common/Logger');

const TAG = 'user/all: ';
async function printAllUsers() {
  const db = await Database.getDatabase();
  let showWarning = false;
  try {
    const query = 'select * from users';
    const rows = await db.all(query, []);
    if (rows.length === 0) {
      Logger.logWarning(TAG, 'no users found');
      return;
    }
    const table = new Table({
      head: ['ID', 'Client Name', 'Client Code', 'Password'],
    });

    rows.forEach((item) => {
      if (!item.client_name) showWarning = true;
      const name = item.client_name || '-';
      const code = item.client_code || '-';
      table.push([item.id, name, code, '****']);
    });

    if (showWarning) {
      Logger.logWarning('Note: ', 'If client name is empty run angel user:profile');
    }

    console.log(table.toString());
  } catch (e) {
    Logger.logError(TAG, e.message);
  }
  await Database.closeDatabase(db);
}

const command = {
  command: 'user:all',
  describe: 'show all users in the database.',
  handler: () => {
    printAllUsers().then();
  },
};

module.exports = {
  command,
  printAllUsers,
};
