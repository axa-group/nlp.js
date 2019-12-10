const fs = require('fs');
const request = require('./request');

function isWeb(str) {
  return str.startsWith('https:') || str.startsWith('http:');
}

function readFile(fileName) {
  return new Promise(resolve => {
    if (isWeb(fileName)) {
      request(fileName)
        .then(data => resolve(data))
        .catch(() => resolve(undefined));
    } else {
      fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
          resolve(undefined);
        } else {
          resolve(data);
        }
      });
    }
  });
}

function writeFile(fileName, data, format = 'utf8') {
  return new Promise((resolve, reject) => {
    if (isWeb(fileName)) {
      reject(new Error('File cannot be written in web'));
    } else {
      fs.writeFile(fileName, data, format, err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    }
  });
}

module.exports = {
  readFile,
  writeFile,
};
