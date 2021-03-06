const ID = require('nanoid');
const MacAddress = require('macaddress');
const { exec } = require('child_process');
const Logger = require('./Logger');

const TAG = 'common/Util: ';

async function uuid() {
  const nanoid = await ID.customAlphabet('abcdef12344', 10);
  return nanoid();
}

function getMacAddress() {
  return new Promise((resolve, reject) => {
    MacAddress.one((error, mac) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(mac);
    });
  });
}

function runShellCommand(cmd) {
  if (cmd.length > 30) Logger.logInfo(TAG, cmd);
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout);
    });
  });
}

module.exports = {
  uuid,
  getMacAddress,
  runShellCommand,
};
