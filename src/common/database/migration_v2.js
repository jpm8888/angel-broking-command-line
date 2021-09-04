const Logger = require('../Logger');
const migration = require('./migration');
const Database = require('./Database');
const { ExpiryType } = require('../Angel');

const TAG = 'migration_v2: ';
const migration_name = 'create_expiry_tables';

const create_table_expiry = async (db) => {
  const table_name = 'expiry';
  let query = `create table if not exists ${table_name}(`;
  query += `exp_type TEXT CHECK( exp_type IN ('${ExpiryType.WEEKLY}', '${ExpiryType.MONTHLY}') ) NOT NULL DEFAULT ${ExpiryType.MONTHLY},`;
  query += 'exp_date text, ';
  query += 'query_date text)';

  try {
    await db.run(query, []);
    Logger.logInfo(TAG, `created ${table_name} success`);
  } catch (error) {
    Logger.logInfo(TAG, `creation error on ${table_name}${JSON.stringify(error)}`);
  }
};

const run_migration_v2 = async () => {
  const db = await Database.getDatabase();
  const is_registered = await migration.is_migration_registered(db, migration_name);
  if (is_registered) {
    Logger.logInfo(TAG, `already migrated : ${migration_name}`);
    return;
  }

  await create_table_expiry(db);

  await migration.register_migration(db, migration_name);
};

module.exports = {
  run_migration_v2,
};
