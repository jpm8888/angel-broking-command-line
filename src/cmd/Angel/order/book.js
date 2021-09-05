const Table = require('cli-table3');

const network = require('../../../common/NetworkOps');
const Config = require('../../../common/Config');

// const TAG = 'order/buy: ';

async function printOrderBook() {
  const response = await network.makeGetRequest(Config.ANGEL_URLS.getOrderBook);
  const table = new Table({
    head: ['Symbol', 'Variety', 'ProductType', 'Price/TriggerPrice', 'Qty', 'Status', 'Update Time'],
  });

  response.data.forEach((order) => {
    const {
      tradingsymbol, variety, producttype, price, triggerprice, quantity, status, updatetime,
    } = order;
    table.push([tradingsymbol, variety, producttype, `${price}/${triggerprice}`, quantity, status, updatetime]);
  });

  // multiple table based OrderStatus...
  console.log(table.toString());
}

const command = {
  command: 'order:book',
  describe: 'Prints all the order book',
  handler: () => {
    printOrderBook().then();
  },
};

module.exports = {
  command,
};
