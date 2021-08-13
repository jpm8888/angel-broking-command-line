const rs = require('readline-sync');
const chalk = require('chalk');
const migration_v1 = require('../../common/database/migration_v1');
const Logger = require('../../common/Logger');
const Prefs = require('../../common/Preferences');

const { PrefKeys } = Prefs;

const TAG = 'Init: ';

async function initDatabase() {
  await migration_v1.run_migration_v1();
  Logger.logInfo(TAG, 'trying to open authentication url.');
}

function fire() {
  console.log(chalk.green.bold('Welcome to The Angel!!!\n'));
  const angelApiKey = rs.question('ANGEL_API_KEY: ') || '';
  const angelSecretKey = rs.question('ANGEL_SECRET_KEY: ') || '';
  const clientCode = rs.question('CLIENT_CODE: ') || '';
  const clientPassword = rs.question('CLIENT_PASSWORD: ') || '';
  const macAddress = rs.question('MAC_ADDRESS: ') || '';
  const clientPublicIp = rs.question('CLIENT_PUBLIC_IP [192.168.0.1]: ') || '192.168.0.1';
  const clientLocalIp = rs.question('CLIENT_LOCAL_IP [192.168.0.1]: ') || '192.168.0.1';

  const config = [
    { key: PrefKeys.KEY_ANGEL_API_KEY, value: angelApiKey },
    { key: PrefKeys.KEY_ANGEL_SECRET_KEY, value: angelSecretKey },
    { key: PrefKeys.KEY_ANGEL_CLIENT_CODE, value: clientCode },
    { key: PrefKeys.KEY_ANGEL_CLIENT_PASS, value: clientPassword },
    { key: PrefKeys.KEY_MAC_ADDRESS, value: macAddress },
    { key: PrefKeys.KEY_CLIENT_PUBLIC_IP, value: clientPublicIp },
    { key: PrefKeys.KEY_CLIENT_LOCAL_IP, value: clientLocalIp },
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

  initDatabase().then(async () => {
    await Prefs.save_all(config);
    Logger.logSuccess(TAG, 'success.');
  });
}

module.exports = {
  command: 'init',
  describe: 'initialise with username and password.',
  handler: () => {
    fire();
  },
};
