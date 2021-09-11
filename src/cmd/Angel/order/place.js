const Logger = require('../../../common/Logger');
const {
  OrderType,
  Variety,
  TransactionType,
  Duration,
  Exchange,
  ProductType,
} = require('../../../common/Angel');
const network = require('../../../common/NetworkOps');
const Config = require('../../../common/Config');

const TAG = 'order/place: ';
const commandString = 'order:place';
// angel order:place --s HDFC-EQ --st 1330 --v NORMAL
// --tt BUY --e NSE --ot LIMIT --pt DELIVERY --price 118 --q 100

// angel order:place --s HDFC-EQ --st 1330 --v STOPLOSS --tt BUY --e NSE
// --ot STOPLOSS_MARKET --pt DELIVERY --price 118 --q 100 --tp 100
async function place_order(argv) {
  const { order_type, trigger_price } = argv;
  const price = (order_type === OrderType.MARKET || OrderType.STOPLOSS_MARKET) ? 0 : argv.price;
  const isTriggerPriceRequired = order_type === OrderType.STOPLOSS_LIMIT
      || order_type === OrderType.STOPLOSS_MARKET;

  let triggerPriceOb = {};
  if (isTriggerPriceRequired) {
    if (!trigger_price || trigger_price === '') {
      Logger.logError(TAG, 'trigger price is required.');
      return;
    }
    triggerPriceOb = {
      triggerprice: trigger_price,
    };
  }

  const params = {
    variety: argv.variety,
    tradingsymbol: argv.symbol,
    symboltoken: argv.symbol_token,
    transactiontype: argv.transaction_type,
    exchange: argv.exchange,
    ordertype: order_type,
    producttype: argv.product_type,
    duration: Duration.DAY,
    price,
    quantity: argv.quantity,
    ...triggerPriceOb,
  };

  const response = await network.makePostRequest(
    Config.ANGEL_URLS.placeOrder,
    params,
  );

  if (response.status) {
    Logger.logSuccess(TAG, `Order Placed - ${response.data.orderid}`);
  } else {
    Logger.logError(response.message);
  }
}

const command = {
  command: commandString,
  describe: 'place an generic order',
  alias: 'op',
  builder: (yargs) => {
    const requiredCommands = [
      'symbol',
      'symbol_token',
      'variety',
      'transaction_type',
      'exchange',
      'order_type',
      'product_type',
      'price',
      'quantity',
    ];
    yargs
      .positional('symbol', {
        describe: 'Trading Symbol of the instrument',
        type: 'string',
        alias: 's',
      })
      .positional('symbol_token', {
        describe: 'Symbol Token is unique identifier.',
        type: 'string',
        alias: 'st',
      })
      .positional('variety', {
        describe: ` ${Variety.AMO}`,
        choices: [
          Variety.NORMAL,
          Variety.STOPLOSS,
          Variety.BRACKET_ORDER,
          Variety.AMO,
        ],
        type: 'string',
        alias: 'v',
      })
      .positional('transaction_type', {
        describe: 'Transaction type',
        choices: [
          TransactionType.BUY,
          TransactionType.SELL,
        ],
        type: 'string',
        alias: 'tt',
      })
      .positional('exchange', {
        describe: 'Exchange',
        choices: [
          Exchange.NSE,
          Exchange.BSE,
          Exchange.NFO,
          Exchange.MCX,
        ],
        type: 'string',
        alias: 'e',
      })
      .positional('order_type', {
        describe: 'Order type',
        choices: [
          OrderType.LIMIT,
          OrderType.MARKET,
          OrderType.STOPLOSS_LIMIT,
          OrderType.STOPLOSS_MARKET,
        ],
        type: 'string',
        alias: 'ot',
      })
      .positional('product_type', {
        describe: 'Product type',
        choices: [
          ProductType.DELIVERY,
          ProductType.INTRADAY,
          ProductType.CARRYFORWARD,
          ProductType.BO,
          ProductType.MARGIN,
        ],
        type: 'string',
        alias: 'pt',
      })
      .positional('price', {
        describe: 'Limit price, or 0 if market order.',
        type: 'number',
        alias: 'p',
      })
      .positional('quantity', {
        describe: 'Quantity',
        type: 'number',
        alias: 'q',
      })
      .positional('trigger_price', {
        describe: 'The price at which an order should be triggered (SL, SL-M)',
        type: 'number',
        alias: 'tp',
      })
      .demandOption(requiredCommands, 'Please provide all the arguments.');
  },
  handler: (argv) => {
    place_order(argv).then();
  },
};

module.exports = {
  command,
  commandString,
  place_order,
};
