const Table = require('cli-table3');
const network = require('../../../common/NetworkOps');
const Config = require('../../../common/Config');
const Logger = require('../../../common/Logger');

const TAG = 'positions: ';

async function getPositions() {
  const res = await network.makeGetRequest(Config.ANGEL_URLS.getPosition);
  if (!res.status) return;
  const { data } = res;
  if (!data) {
    Logger.logWarning(TAG, 'no positions found.');
    return;
  }
  Logger.logInfo(TAG, 'generating positions');
  const table = new Table({
    head: ['Symbol', 'Type', 'Net Qty', 'Buy Avg.', 'Sell Avg', 'LTP', 'PnL'],
  });

  let totalPnl = 0;

  data.forEach((item) => {
    const {
      symbolname, producttype, strikeprice, optiontype, expirydate,
      netqty, totalbuyavgprice, totalsellavgprice, pnl, ltp,
    } = item;

    const expiry = expirydate === '' ? '' : `\n${expirydate}`;

    const strikePrice = strikeprice === '-1' ? '' : `\n${strikeprice}`;
    const symbol = `${symbolname} ${strikePrice}${optiontype} ${expiry}`;
    const buyAverage = totalbuyavgprice;
    const sellAvg = totalsellavgprice;

    totalPnl += parseFloat(pnl);

    table.push(
      [symbol, producttype, netqty, buyAverage, sellAvg, ltp, pnl],
    );
  });

  table.push(['', '', '', '', '', 'Total: ', totalPnl.toFixed(2)]);
  console.log(table.toString());
}

module.exports = {
  command: 'user:positions',
  describe: 'check user current positions',
  handler: () => {
    getPositions().then(() => {});
  },
};
