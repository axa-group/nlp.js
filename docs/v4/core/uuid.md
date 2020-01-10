# UUID

Unique Identifier generator that is compatible with browsers, so it does not use the crypto library, and use Math.random instead.

Example of use:

```javascript
const { uuid } = require('@nlpjs/core');
const id = uuid();
console.log(id); // 820a6d53-9e1d-4b9d-711f-f20588aef5aa
```