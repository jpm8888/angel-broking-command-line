const Database = require('sqlite');
const sqlite3 = require('sqlite3');
const ID = require('nanoid');
const Logger = require('../Logger');
const Utils = require('../Util');
const Config = require('../Config');
const FSUtils = require('../FSUtils');

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
  let homeDir = await Utils.runShellCommand('echo $HOME');
  homeDir = homeDir.toString().replace(/\n/g, '');

  const appDirPath = `${homeDir}/${Config.APP_DIR}`;
  const isDirectoryPresent = await FSUtils.isDir(appDirPath);
  if (!isDirectoryPresent) {
    await FSUtils.mkdir(appDirPath);
    Logger.logInfo(TAG, `created new dir - ${appDirPath}`);
  }

  const dbPath = `${homeDir}/${Config.APP_DIR}/${Config.DB_NAME}`;
  // Logger.logInfo(TAG, `db_path -> ${dbPath}`);
  const db = await Database.open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  return db;
};

const closeDatabase = async (db) => {
  await db
    .close()
    // .then(() => Logger.logInfo(TAG, 'Closing database connection.'))
    .catch((err) => Logger.logError(TAG, err.message));
};

const getResultFromDatabase = async (query) => {
  const db = await getDatabase();
  const rows = await db.all(query, []);
  await closeDatabase(db);
  return rows;
};

module.exports = {
  getDatabase,
  create_index,
  create_unique_idx,
  closeDatabase,
  getResultFromDatabase,
};
