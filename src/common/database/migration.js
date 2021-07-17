const Logger = require('../Logger');

const TAG = 'migration: ';
const table_name = 'migrations';
const create_table_migrations = async (db) => {
  let query = `create table if not exists ${table_name}(`;
  query += 'id integer primary key not null, ';
  query += 'name unique)';

  try {
    const results = await db.run(query, []);
    Logger.logInfo(TAG, `created ${table_name} success ${JSON.stringify(results)}`);
  } catch (error) {
    Logger.logInfo(TAG, `creation error on ${table_name}${JSON.stringify(error)}`);
  }
};

const register_migration = async (db, migration_name) => {
  Logger.logInfo(TAG, `registering migration : ${migration_name}`);
  let query = `insert into ${table_name} `;
  query += '(name) ';
  query += `VALUES ('${migration_name}')`;

  try {
    await db.run(query, []);
    Logger.logInfo(TAG, `successfully insert in ${table_name}`);
  } catch (error) {
    Logger.logInfo(TAG, `insert error in ${table_name} :${JSON.stringify(error)}`);
  }
};

const is_migration_registered = async (db, migration_name) => {
  await create_table_migrations(db);
  const query = `select * from ${table_name} where name = '${migration_name}'`;
  try {
    const results = await db.all(query, []);
    Logger.logInfo(TAG, 'migration data fetched successfully');
    return (results.length !== 0);
  } catch (error) {
    Logger.logInfo(TAG, `select error in ${table_name} :${JSON.stringify(error)}`);
    return false;
  }
};

module.exports = {
  register_migration,
  is_migration_registered,
};
