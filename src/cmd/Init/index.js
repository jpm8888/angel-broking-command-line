const migration_v1 = require('../../common/database/migration_v1');
const Logger = require('../../common/Logger');

const TAG = 'Init: ';
migration_v1.run_migration_v1().then(() => {
  Logger.logInfo(TAG, 'migration_v1_success');
});
