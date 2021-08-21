const Database = require('./database/Database');
const Logger = require('./Logger');

const TAG = 'Preferences';

const PrefKeys = {
  KEY_ANGEL_API_KEY: 'angel_api_key',
  KEY_ANGEL_SECRET_KEY: 'secret_key',
  KEY_MAC_ADDRESS: 'mac_address',
  KEY_CLIENT_PUBLIC_IP: 'client_public_ip',
  KEY_CLIENT_LOCAL_IP: 'client_local_ip',

  KEY_CURRENT_USER_ID: 'current_user_id', // current session user.
  KEY_CURRENT_USER_TOKEN: 'current_user_token',
};

const table_name = 'prefs';

async function save_pref(k, v) {
  const key = k.toString().trim();
  const value = (v) ? v.toString().trim() : null;
  const db = await Database.getDatabase();
  try {
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
  await Database.closeDatabase(db);
}

async function get_pref(k, dV) {
  const key = k.toString().trim();
  const defaultValue = dV.toString().trim();
  const db = await Database.getDatabase();
  try {
    const query = `select * from ${table_name} where key = '${key}' limit 1`;
    const rows = await db.all(query, []);
    await Database.closeDatabase(db);
    return rows.length > 0 ? rows[0].value : defaultValue;
  } catch (e) {
    await Database.closeDatabase(db);
    Logger.logError(TAG, 'get_pref() error :');
    Logger.logError(TAG, e);
  }
  return defaultValue;
}
// arr = [{key:'', value: ''}, ...]
async function save_all(arr = []) {
  const db = await Database.getDatabase();
  await Promise.all(arr.map(async (item) => {
    const key = item.key.toString().trim();
    const value = (item.value) ? item.value.toString().trim() : '';
    try {
      const query = `select * from ${table_name} where key = '${key}' limit 1`;
      const rows = await db.all(query, []);
      if (rows.length > 0) {
        const row = rows[0];
        const updateQuery = `update ${table_name} set value = '${value}' where id = ${row.id}`;
        await db.run(updateQuery);
      } else {
        const insertQuery = `insert into ${table_name} (key, value) values('${key}', '${value}')`;
        await db.run(insertQuery);
      }
    } catch (e) {
      Logger.logError(TAG, 'save_pref() error :');
      Logger.logError(TAG, e);
    }
  }));
  await Database.closeDatabase(db);
}

module.exports = {
  save_pref,
  get_pref,
  save_all,
  PrefKeys,
};
