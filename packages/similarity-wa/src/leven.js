const fs = require('fs');
const path = require('path');

/* eslint-disable */
const memory = new WebAssembly.Memory({ initial: 2 });
/* eslint-enable */

const buffer = new Uint8Array(memory.buffer);
const importObject = {
  js: {
    mem: memory,
  },
  console: {
    log(arg) {
      console.log(arg);
    },
  },
};

/* eslint-disable */
const source = fs.readFileSync(path.resolve(__dirname, './leven.wasm'));
const mod = new WebAssembly.Module(new Uint8Array(source));
const webAssemblyObj = new WebAssembly.Instance(mod, importObject);
/* eslint-enable */

function leven(left, right) {
  let idx = 0;

  for (let i = 0; i < left.length; i += 1) {
    buffer[idx] = left[i].charCodeAt(0);
    idx += 1;
  }

  for (let i = 0; i < right.length; i += 1) {
    buffer[idx] = right[i].charCodeAt(0);
    idx += 1;
  }

  return webAssemblyObj.exports.leven(left.length, right.length);
}

module.exports = leven;
