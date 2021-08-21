const Logger = require('../../common/Logger');
const Utils = require('../../common/Util');

const TAG = 'hello: ';

function printMacAddress() {
  Utils.getMacAddress().then((mac) => {
    Logger.logInfo(TAG, `mac_address: ${mac}`);
  });
}

function runCommand() {
  Utils.runShellCommand('echo $HOME').then((output) => {
    Logger.logInfo(TAG, `home_dir: ${output}`);
  });
}

module.exports = {
  command: 'sayHello',
  describe: 'it says hello | --name [NAME]',
  handler: (argv) => {
    const name = argv.name || 'boomer';
    Logger.logInfo(TAG, `hello ${name}`);
    printMacAddress();
    runCommand();
  },
};
