const fs = require('fs');

function isDir(path) {
  return new Promise((resolve) => {
    fs.access(path, (error) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function mkdir(dirPath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, (err) => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
}

module.exports = {
  isDir,
  mkdir,
};
