const Database = require('sqlite');
const sqlite3 = require('sqlite3');
const ID = require('nanoid');
const Config = require('../Config');
const Logger = require('../Logger');

const TAG = 'Database: ';
function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

function getUniqueId() {
  const id = ID.nanoid(10);
  return replaceAll(id, '-', 'x');
}

const create_index = async (db, table_name, column_name) => {
  const id = getUniqueId();

  const index_name = `${table_name}_${column_name}_${id}_index`;
  const query = `create index ${index_name} ON ${table_name} (${column_name})`;

  try {
    await db.run(query, []);
    Logger.logInfo(TAG, `created ${index_name} on ${table_name} success`);
  } catch (error) {
    Logger.logInfo(TAG, `creation error on ${table_name}${JSON.stringify(error)}`);
    return false;
  }
  return false;
};

const create_unique_idx = async (db, table_name, column_name) => {
  const id = getUniqueId();

  const index_name = `${table_name}_${column_name}_${id}_unique_idx`;
  const query = `create unique index ${index_name} ON ${table_name} (${column_name})`;

  try {
    await db.run(query, []);
    Logger.logInfo(TAG, `created ${index_name} on ${table_name} success`);
  } catch (error) {
    Logger.logInfo(TAG, `creation error on ${table_name}${JSON.stringify(error)}`);
    return false;
  }
  return false;
};

const getDatabase = async () => {
  const db = await Database.open({
    filename: Config.DB_NAME,
    driver: sqlite3.Database,
  });
  return db;
};

module.exports = {
  getDatabase,
  create_index,
  create_unique_idx,
};
