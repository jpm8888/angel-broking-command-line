const Logger = require('../Logger');
const migration = require('./migration');
const Database = require('./Database');

const TAG = 'migration_v1: ';
const migration_name = 'create_base_tables';

const create_table_prefs = async (db) => {
  const table_name = 'prefs';
  let query = `create table if not exists ${table_name}(`;
  query += 'id integer primary key autoincrement not null, ';
  query += 'key text, ';
  query += 'value text)';

  try {
    await db.run(query, []);
    Logger.logInfo(TAG, `created ${table_name} success`);
  } catch (error) {
    Logger.logInfo(TAG, `creation error on ${table_name}${JSON.stringify(error)}`);
  }
};

const run_migration_v1 = async () => {
  const db = await Database.getDatabase();
  const is_registered = await migration.is_migration_registered(db, migration_name);
  if (is_registered) {
    Logger.logInfo(TAG, `already migrated : ${migration_name}`);
    return;
  }

  await create_table_prefs(db);

  await migration.register_migration(db, migration_name);
};

module.exports = {
  run_migration_v1,
};
