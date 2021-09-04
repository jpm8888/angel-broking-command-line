const Variety = {
  NORMAL: 'NORMAL',
  STOPLOSS: 'STOPLOSS',
  AMO: 'AMO',
  BRACKET_ORDER: 'ROBO',
};

const TransactionType = {
  BUY: 'BUY',
  SELL: 'SELL',
};

const OrderType = {
  MARKET: 'MARKET',
  LIMIT: 'LIMIT',
  STOPLOSS_LIMIT: 'STOPLOSS_LIMIT',
  STOPLOSS_MARKET: 'STOPLOSS_MARKET',
};

const ProductType = {
  DELIVERY: 'DELIVERY',
  CARRYFORWARD: 'CARRYFORWARD',
  MARGIN: 'MARGIN',
  INTRADAY: 'INTRADAY',
  BO: 'BO',
};

const Duration = {
  DAY: 'DAY',
  IOC: 'IOC',
};

const Exchange = {
  BSE: 'BSE',
  NSE: 'NSE',
  NFO: 'NFO',
  MCX: 'MCX',
};

const InstrumentType = {
  FutureCurrency: 'FUTCUR',
  FutureIndex: 'FUTIDX',
  FutureStock: 'FUTSTK',

  OptionCurrency: 'OPTCUR',
  OptionIndex: 'OPTIDX',
  OptionStock: 'OPTSTK',
};

const InstrumentSection = {
  STOCKS: 'stocks',
  FUTURES: 'futures',
  OPTIONS: 'options',
};

const Interval = {
  ONE_MINUTE: 'ONE_MINUTE',
  THREE_MINUTE: 'THREE_MINUTE',
  FIVE_MINUTE: 'FIVE_MINUTE',
  TEN_MINUTE: 'TEN_MINUTE',
  FIFTEEN_MINUTE: 'FIFTEEN_MINUTE',
  THIRTY_MINUTE: 'THIRTY_MINUTE',
  ONE_HOUR: 'ONE_HOUR',
  ONE_DAY: 'ONE_DAY',
};

module.exports = {
  Variety,
  TransactionType,
  OrderType,
  ProductType,
  Duration,
  Exchange,
  Interval,
  InstrumentType,
  InstrumentSection,
};
