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
      resolve(undefined);
    }
  });
}

function writeFile() {
  return new Promise((resolve, reject) => {
    reject(new Error('File cannot be written in web'));
  });
}

function existsSync() {
  return false;
}

function lstatSync() {
  return undefined;
}

function readFileSync() {
  return undefined;
}

module.exports = {
  readFile,
  writeFile,
  existsSync,
  lstatSync,
  readFileSync,
};
