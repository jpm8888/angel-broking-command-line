const inquirer = require('inquirer');
const Logger = require('../../../common/Logger');
const { findSymbol } = require('../utils/symbol');
const {
  whichOrderType, whichCNCOrder, howManyQuantity, whichPrice,
} = require('../utils/inquries');
const {
  OrderType, Variety, TransactionType, Duration,
} = require('../../../common/Angel');
const network = require('../../../common/NetworkOps');
const Config = require('../../../common/Config');

const TAG = 'order/buy: ';

async function place_buy_order() {
  const symbol = await findSymbol();

  if (symbol) {
    const { productType } = await inquirer.prompt(whichCNCOrder);
    const { orderType } = await inquirer.prompt(whichOrderType);

    let price = 0;
    if (orderType === OrderType.LIMIT) {
      const pricePrompt = await inquirer.prompt(whichPrice);
      price = pricePrompt.price;
    }

    const { quantity } = await inquirer.prompt(howManyQuantity);

    const params = {
      variety: Variety.NORMAL,
      tradingsymbol: symbol.symbol,
      symboltoken: symbol.token,
      transactiontype: TransactionType.BUY,
      exchange: symbol.exch_seg,
      ordertype: orderType,
      producttype: productType,
      duration: Duration.DAY,
      price,
      squareoff: '0',
      stoploss: '0',
      quantity,
    };

    const response = await network.makePostRequest(Config.ANGEL_URLS.placeOrder, params);

    if (response.status) {
      Logger.logSuccess(TAG, `Order Placed - ${response.data.orderid}`);
    } else {
      Logger.logError(response.message);
    }
  } else {
    Logger.logError(TAG, 'no symbol found');
  }
}

const command = {
  command: 'order:buy',
  describe: 'place a buy order',
  handler: () => {
    place_buy_order().then();
  },
};

module.exports = {
  command,
};
