# Timer

Timer is a simple timing class to measure time consumed by processes. As it should be compatible with web, is based on Date class.

Example of use:

```javascript
const { Timer } = require('@nlpjs/core');

function processStr(input) {
  let s = '';
  for (let i = 0; i < input.times; i += 1) {
    s = `${s}${input.name}`;
  }
  input.name = s;
}

const timer = new Timer();
const input = { name: 'Something', times: 100000 };
timer.start(input);
processStr(input);
timer.stop(input);
console.log(input.elapsed); // 11
```