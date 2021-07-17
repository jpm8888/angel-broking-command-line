const Database = require('./database/Database');
const Logger = require('./Logger');

const TAG = 'Preferences';
const KEY_AUTH_TOKEN = 'auth_token'; // bearer token
const table_name = 'prefs';

async function save_pref(k, v) {
  const key = k.toString().trim();
  const value = (v) ? v.toString().trim() : null;
  try {
    const db = await Database.getDatabase();
    const query = `select * from ${table_name} where key = '${key}' limit 1`;
    const rows = await db.all(query, []);
    if (rows.length > 0) {
      const item = rows[0];
      const updateQuery = `update ${table_name} set value = '${value}' where id = ${item.id}`;
      await db.run(updateQuery);
    } else {
      const insertQuery = `insert into ${table_name} (key, value) values('${key}', '${value}')`;
      await db.run(insertQuery);
    }
  } catch (e) {
    Logger.logError(TAG, 'save_pref() error :');
    Logger.logError(TAG, e);
  }
}

async function get_pref(k, dV) {
  const key = k.toString().trim();
  const defaultValue = dV.toString().trim();
  try {
    const db = await Database.getDatabase();
    const query = `select * from ${table_name} where key = '${key}' limit 1`;
    const rows = await db.all(query, []);
    return rows.length > 0 ? rows[0].value : defaultValue;
  } catch (e) {
    Logger.logError(TAG, 'get_pref() error :');
    Logger.logError(TAG, e);
  }
  return defaultValue;
}

module.exports = {
  save_pref,
  get_pref,
  KEY_AUTH_TOKEN,
};
