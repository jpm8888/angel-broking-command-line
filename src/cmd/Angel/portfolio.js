const Table = require('cli-table3');
const network = require('../../common/NetworkOps');
const Config = require('../../common/Config');
const Logger = require('../../common/Logger');

const TAG = 'portfolio: ';

async function getHoldings() {
  const res = await network.makeGetRequest(Config.ANGEL_URLS.getHolding);
  if (!res.status) return;
  const { data } = res;
  Logger.logInfo(TAG, 'generating holdings');
  const table = new Table({
    head: ['Symbol', 'Qty', 'Type', 'Avg Price', 'LTP', 'Change', 'Profit'],
  });

  let totalProfit = 0;

  data.forEach((item) => {
    const {
      tradingsymbol, exchange, t1quantity, quantity, product, averageprice, ltp,
    } = item;
    const symbol = `${exchange} : ${tradingsymbol}`;
    const qty = (t1quantity + quantity);
    const change = `${(((ltp - averageprice) * 100) / averageprice).toFixed(2)} %`;
    const profit = ((ltp - averageprice) * qty);

    totalProfit += profit;

    table.push(
      [symbol, qty, product, averageprice.toFixed(2), ltp.toFixed(2), change, profit.toFixed(2)],
    );
  });

  table.push(['', '', '', '', '', 'Total: ', totalProfit.toFixed(2)]);
  console.log(table.toString());
}

module.exports = {
  getHoldings,
};
