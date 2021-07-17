const Logger = require('../../common/Logger');

const TAG = 'Hello: ';
Logger.logError(TAG, 'Hello World - Success');
Logger.logError(TAG, 'Hello World - Error');
Logger.logWarning(TAG, 'Hello World - Warning');
Logger.logInfo(TAG, 'Hello World - Info');
