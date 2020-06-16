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

let webAssemblyObj;
const source = fs.readFileSync(path.resolve(__dirname, './leven.wasm'));
const typedArray = new Uint8Array(source);

/* eslint-disable */
WebAssembly.instantiate(typedArray, importObject).then((obj) => {
  webAssemblyObj = obj;
  console.log(`webassembly obj initialized ${webAssemblyObj}`);
});
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

  return webAssemblyObj.instance.exports.levenshtein(left.length, right.length);
}

module.exports = leven;
