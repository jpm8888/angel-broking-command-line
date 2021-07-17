const chalk = require('chalk');

const logError = (TAG, message) => {
  // eslint-disable-next-line no-console
  console.log(chalk.bold.red(TAG, message));
};
const logSuccess = (TAG, message) => {
  // eslint-disable-next-line no-console
  console.log(chalk.bold.green(TAG, message));
};
const logWarning = (TAG, message) => {
  // eslint-disable-next-line no-console
  console.log(chalk.bold.yellow(TAG, message));
};
const logInfo = (TAG, message) => {
  // eslint-disable-next-line no-console
  console.log(chalk.bold.blueBright(TAG, message));
};

module.exports = {
  logError,
  logSuccess,
  logWarning,
  logInfo,
};
