const Table = require('cli-table3');
const network = require('../../../common/NetworkOps');
const Config = require('../../../common/Config');
const Prefs = require('../../../common/Preferences');
const { PrefKeys } = require('../../../common/Preferences');
const Database = require('../../../common/database/Database');

async function updateClientName(clientName) {
  const currentUserId = await Prefs.get_pref(PrefKeys.KEY_CURRENT_USER_ID, '');
  if (currentUserId.trim() === '') return;

  const query = 'update users set client_name = ? where id = ?';
  const db = await Database.getDatabase();
  await db.run(query, [clientName, currentUserId]);
  await Database.closeDatabase(db);
}

async function getProfile() {
  const res = await network.makeGetRequest(Config.ANGEL_URLS.getProfile);
  if (!res.status) return;
  const { data } = res;
  const {
    clientcode, name, email, mobileno, exchanges, products, brokerid,
  } = data;

  const table = new Table();

  table.push(
    { 'Client Code': clientcode },
    { Name: name },
    { Email: email },
    { 'Mobile Number': mobileno },
    { Exchanges: JSON.stringify(exchanges) },
    { Products: JSON.stringify(products) },
    { 'Broker Id': brokerid },
  );

  await updateClientName(name);

  console.log(table.toString());
}

const command = {
  command: 'user:profile',
  describe: 'shows and update information about your profile in local database.',
  handler: () => {
    getProfile().then();
  },
};

module.exports = {
  command,
};
