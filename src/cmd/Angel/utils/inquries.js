const {
  InstrumentType, Exchange, InstrumentSection, ProductType, OrderType,
} = require('../../../common/Angel');

const whichCode = [
  {
    type: 'input',
    name: 'code',
    message: 'Stock Symbol: ',
    default: '',
    validate(value) {
      return value.trim().toString().length !== 0;
    },
  },
  {
    type: 'list',
    name: 'type',
    message: 'Instrument type',
    choices: [
      {
        name: 'Stocks',
        value: InstrumentSection.STOCKS,
      },
      {
        name: 'Futures',
        value: InstrumentSection.FUTURES,
      },
      {
        name: 'Options',
        value: InstrumentSection.OPTIONS,
      },
    ],
  },
];

const whichFutures = [
  {
    type: 'list',
    name: 'instrument_type',
    message: 'Which futures ? ',
    choices: [
      {
        name: 'Stocks Future',
        value: InstrumentType.FutureStock,
      },
      {
        name: 'Index Futures',
        value: InstrumentType.FutureIndex,
      },
      {
        name: 'Currency Futures',
        value: InstrumentType.FutureCurrency,
      },
    ],
  },
];

const whichOptions = [
  {
    type: 'list',
    name: 'instrument_type',
    message: 'Which Options ? ',
    choices: [
      {
        name: 'Stocks Options',
        value: InstrumentType.OptionStock,
      },
      {
        name: 'Index Options',
        value: InstrumentType.OptionIndex,
      },
      {
        name: 'Currency Options',
        value: InstrumentType.OptionCurrency,
      },
    ],
  },
];

const whichExchange = [
  {
    type: 'list',
    name: 'exchange',
    message: 'Which Exchange ? ',
    choices: [Exchange.NSE, Exchange.BSE, Exchange.MCX],
    default: Exchange.NSE,
  },
];

const whichCNCOrder = [
  {
    type: 'list',
    name: 'productType',
    message: 'Product Type ? ',
    choices: [ProductType.DELIVERY, ProductType.INTRADAY],
    default: ProductType.DELIVERY,
  },
];

const whichOrderType = [
  {
    type: 'list',
    name: 'orderType',
    message: 'Order Type ? ',
    choices: [OrderType.MARKET, OrderType.LIMIT],
    default: OrderType.MARKET,
  },
];

const howManyQuantity = [
  {
    type: 'input',
    name: 'quantity',
    message: 'Quantity ?',
    validate(value) {
      const valid = Number.isInteger(value) && value > 0;
      return valid || 'Please enter a number';
    },
    filter: Number,
  },
];

const whichPrice = [
  {
    type: 'input',
    name: 'price',
    message: 'Price ?',
    validate(value) {
      const valid = value > 0;
      return valid || 'Please enter a number';
    },
    filter: Number,
  },
];

function whichSymbolRow(rows) {
  const choices = rows.map((item) => ({
    name: `${item.symbol} | ${item.name}`,
    value: item,
  }));

  return [
    {
      type: 'list',
      name: 'details',
      message: 'Choose stock',
      choices,
    },
  ];
}

module.exports = {
  whichCode,
  whichFutures,
  whichOptions,
  whichExchange,
  whichSymbolRow,
  whichCNCOrder,
  whichOrderType,
  howManyQuantity,
  whichPrice,
};
