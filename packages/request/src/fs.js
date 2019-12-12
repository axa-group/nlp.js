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
      try {
        const data = fs.readFileSync(fileName, 'utf8');
        resolve(data);
      } catch (err) {
        resolve(undefined);
      }
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

function existsSync(fileName) {
  return fs.existsSync(fileName);
}

function lstatSync(fileName) {
  return fs.lstatSync(fileName);
}

function readFileSync(fileName, encoding = 'utf8') {
  return fs.readFileSync(fileName, encoding);
}

module.exports = {
  readFile,
  writeFile,
  existsSync,
  lstatSync,
  readFileSync,
};
