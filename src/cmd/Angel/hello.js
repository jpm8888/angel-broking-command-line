const Logger = require('../../common/Logger');

const TAG = 'hello: ';
module.exports = {
  command: 'sayHello',
  describe: 'it says hello | --name [NAME]',
  handler: (argv) => {
    const name = argv.name || 'boomer';
    Logger.logInfo(TAG, `hello ${name}`);
  },
};
