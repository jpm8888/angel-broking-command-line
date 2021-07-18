const open = require('open');
const migration_v1 = require('../../common/database/migration_v1');
const Logger = require('../../common/Logger');
const Config = require('../../common/Config');

const TAG = 'Init: ';

async function init() {
  await migration_v1.run_migration_v1();
  Logger.logInfo(TAG, 'trying to open authentication url.');
  await open(Config.AUTH_URL);
}

init().then(() => {
  Logger.logInfo(TAG, 'success.');
});
