// const Database = require('../../common/database/Database');
const Config = require('../../common/Config');
const Logger = require('../../common/Logger');
const Prefs = require('../../common/Preferences'); // make sure to run init
const Util = require('../../common/Util');

const TAG = 'Hello: ';
Logger.logInfo(TAG, `environment : ${Config.APP_ENV}`);
Logger.logInfo(TAG, `database_name : ${Config.DB_NAME}`);
Logger.logSuccess(TAG, 'Hello World - Success');
Logger.logError(TAG, 'Hello World - Error');
Logger.logWarning(TAG, 'Hello World - Warning');
Logger.logInfo(TAG, 'Hello World - Info');

// Prefs.savePref('some_key', 1231222322323);
// Prefs.savePref('some_key_123', '123432');
Prefs.save_pref(Prefs.KEY_AUTH_TOKEN, 'bing').then(() => {
  Logger.logInfo(TAG, `saved value: ${Prefs.KEY_AUTH_TOKEN} : bing`);

  Prefs.get_pref(Prefs.KEY_AUTH_TOKEN, '').then((value) => {
    Logger.logInfo(TAG, `retrieved : ${value}`);
  });
});

Util.uuid().then((id) => Logger.logInfo(TAG, id));

// Database.getDatabase().then(async (db) => {
//   const res = await db.all('select * from prefs', []);
//   console.log(res);
// });
