const inquirer = require('inquirer');
const Logger = require('../../../common/Logger');
const { findSymbol } = require('../utils/symbol');
const {
  whichOrderType, whichCNCOrder, howManyQuantity,
  whichPrice, whichFnoOrder,
  askFnoQty, confirmation,
} = require('../utils/inquries');
const {
  OrderType, Variety, TransactionType, Exchange, Confirmation,
} = require('../../../common/Angel');

const { commandString } = require('./place');
const { runShellCommand } = require('../../../common/Util');

const TAG = 'order/buy: ';

async function place_buy_order() {
  const symbol = await findSymbol();

  if (symbol) {
    const isFno = symbol.exch_seg === Exchange.NFO;

    const { productType } = await inquirer.prompt(isFno ? whichFnoOrder : whichCNCOrder);
    const { orderType } = await inquirer.prompt(whichOrderType);

    let price = 0;
    if (orderType === OrderType.LIMIT) {
      const pricePrompt = await inquirer.prompt(whichPrice);
      price = pricePrompt.price;
    }

    let quantity = 0;

    if (isFno) {
      quantity = await askFnoQty(symbol.lotsize);
    } else {
      const output = await inquirer.prompt(howManyQuantity);
      quantity = output.quantity;
    }

    let c = `angel ${commandString} `;
    c += `--v ${Variety.NORMAL} `;
    c += `--s ${symbol.symbol} `;
    c += `--st ${symbol.token} `;
    c += `--tt ${TransactionType.BUY} `;
    c += `--e ${symbol.exch_seg} `;
    c += `--ot ${orderType} `;
    c += `--pt ${productType} `;
    c += `--p ${price} `;
    c += `--q ${quantity} `;

    const { confirm } = await inquirer.prompt(confirmation('Are you sure', Confirmation.YES));

    if (confirm === Confirmation.YES) {
      const output = await runShellCommand(c);
      Logger.logSuccess(output);
    } else {
      Logger.logSuccess(TAG, 'order cancelled');
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
