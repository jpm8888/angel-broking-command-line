const Table = require('cli-table3');
const Logger = require('../../../common/Logger');
const Database = require('../../../common/database/Database');

const TAG = 'user/utils: ';

async function getUser(userId) {
  const id = userId.toString().trim();
  const errorObject = {
    status: false,
    message: 'id not found',
  };
  if (id === '') return errorObject;
  const db = await Database.getDatabase();
  try {
    const query = `select * from users where id = ${id} limit 1`;
    const rows = await db.all(query, []);
    const user = rows.length > 0 ? rows[0] : undefined;
    await Database.closeDatabase(db);
    if (!user) {
      return errorObject;
    }
    return {
      status: true,
      message: 'user found.',
      user,
    };
  } catch (e) {
    Logger.logError(TAG, e);
  }
  return errorObject;
}

async function getAllUser() {
  const db = await Database.getDatabase();
  const query = 'select * from users';
  const rows = await db.all(query, []);
  await Database.closeDatabase(db);
  return rows;
}

async function printUserDetails(userId) {
  try {
    const response = await getUser(userId);
    if (!response.status) {
      Logger.logError(TAG, response.message);
      return;
    }
    const { user } = response;
    const table = new Table({
      head: ['ID', 'Client Name', 'Client Code', 'Password'],
    });

    table.push([user.id, user.client_name, user.client_code, '****']);

    console.log(table.toString());
  } catch (e) {
    Logger.logError(TAG, e);
  }
}

module.exports = {
  printUserDetails,
  getUser,
  getAllUser,
};
