function readFile() {
  return new Promise(resolve => {
    resolve(undefined);
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
