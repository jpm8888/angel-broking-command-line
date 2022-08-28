const inquirer = require('inquirer');
const { confirmation } = require('../utils/inquries');
const { Confirmation } = require('../../../common/Angel');
const { runShellCommand } = require('../../../common/Util');
const Logger = require('../../../common/Logger');
const Config = require('../../../common/Config');

const TAG = 'reset';

async function reset() {
  const command = `rm -rf $HOME/${Config.APP_DIR}/${Config.DB_NAME}`;
  console.log(command);
  const { confirm } = await inquirer.prompt(confirmation('Are you sure', Confirmation.YES));
  if (confirm === Confirmation.YES) {
    const output = await runShellCommand(command);
    Logger.logSuccess(output);
    Logger.logSuccess('cleaned everything...');
  } else {
    Logger.logSuccess(TAG, 'nothing was changed.');
  }
}

const command = {
  command: 'reset',
  describe: 'reset all configurations.',
  handler: () => {
    reset().then();
  },
};

module.exports = {
  command,
};
