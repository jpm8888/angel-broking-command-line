const inquirer = require('inquirer');
const Logger = require('../../../common/Logger');
const { findSymbol } = require('../utils/symbol');
const {
  whichOrderType, whichCNCOrder, howManyQuantity, whichPrice,
} = require('../utils/inquries');
const {
  OrderType, Variety, TransactionType,
} = require('../../../common/Angel');

const { commandString } = require('./place');
const { runShellCommand } = require('../../../common/Util');

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

    const output = await runShellCommand(c);
    Logger.logSuccess(output);
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
