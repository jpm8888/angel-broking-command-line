/* eslint-disable */
const chalk = require('chalk');


const logError = (TAG, message) =>{
    console.log(chalk.bold.red(TAG, message));
}
const logSuccess = (TAG, message) =>{
    console.log(chalk.bold.green(TAG, message));
}
const logWarning = (TAG, message) =>{
    console.log(chalk.bold.yellow(TAG, message));
}
const logInfo = (TAG, message) =>{
    console.log(chalk.bold.blueBright(TAG, message));
}

module.exports = {
    logError, logSuccess,
    logWarning, logInfo
};




