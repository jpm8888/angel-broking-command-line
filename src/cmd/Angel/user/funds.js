const Table = require('cli-table3');
const network = require('../../../common/NetworkOps');
const Config = require('../../../common/Config');

// const TAG = 'user/funds: ';

async function userFunds() {
  const res = await network.makeGetRequest(Config.ANGEL_URLS.funds);
  if (!res.status) return;
  const { data } = res;
  const {
    net, availablecash, availableintradaypayin, availablelimitmargin, m2munrealized, m2mrealized,
  } = data;

  const table = new Table();

  table.push(
    { 'Net Amt.': Math.round(net, 2) },
    { 'Available Cash': Math.round(availablecash, 2) },
    { 'Intraday PayIn': Math.round(availableintradaypayin, 2) },
    { 'Available Limit Margin': availablelimitmargin },
    { 'M2M-Un-Realized': m2munrealized },
    { 'M2M-Realized': m2mrealized },
  );

  console.log(table.toString());
}
const command = {
  command: 'user:funds',
  describe: 'displays user funds',
  handler: () => {
    userFunds().then();
  },
};

module.exports = {
  command,
};
