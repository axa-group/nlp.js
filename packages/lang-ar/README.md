![NLPjs logo](../../screenshots/nlplogo.gif)

# @nlpjs/lang-ar

[![](https://github.com/axa-group/nlp.js/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/axa-group/nlp.js/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/axa-group/nlp.js/badge.svg?branch=master)](https://coveralls.io/github/axa-group/nlp.js?branch=master)
[![NPM version](https://img.shields.io/npm/v/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp)
[![NPM downloads](https://img.shields.io/npm/dm/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp)

## TABLE OF CONTENTS

<!--ts-->

- [Installation](#installation)
- [Example of use](#example-of-use)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Code of Conduct](#code-of-conduct)
- [Who is behind it](#who-is-behind-it)
- [License](#license.md)
  <!--te-->

## Installation

You can install @nlpjs/lang-ar:

```bash
    npm install @nlpjs/lang-ar
```

## Example of Usage

```javascript
const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangAr } = require('@nlpjs/lang-ar');

(async () => {
  const container = await containerBootstrap();
  container.use(Nlp);
  container.use(LangAr);
  const nlp = container.get('nlp');
  nlp.settings.autoSave = false;
  nlp.addLanguage('ar');
  // Adds the utterances and intents for the NLP
  nlp.addDocument('ar', 'adios por ahora', 'greetings.bye');
  nlp.addDocument('ar', 'adios y ten cuidado', 'greetings.bye');
  nlp.addDocument('ar', 'muy bien nos vemos luego', 'greetings.bye');
  nlp.addDocument('ar', 'debo irme', 'greetings.bye');
  nlp.addDocument('ar', 'hola', 'greetings.hello');
  
  // Train also the NLG
  nlp.addAnswer('ar', 'greetings.bye', 'hasta la proxima');
  nlp.addAnswer('ar', 'greetings.bye', '¡te veo pronto!');
  nlp.addAnswer('ar', 'greetings.hello', '¡hola que tal!');
  nlp.addAnswer('ar', 'greetings.hello', '¡salludos!');
  await nlp.train();
  const response = await nlp.process('ar', 'debo irme');
  console.log(response);
})();
```

## Contributing

You can read the guide of how to contribute at [Contributing](../../CONTRIBUTING.md).

## Contributors

[![Contributors](https://contributors-img.firebaseapp.com/image?repo=axa-group/nlp.js)](https://github.com/axa-group/nlp.js/graphs/contributors)

Made with [contributors-img](https://contributors-img.firebaseapp.com).

## Code of Conduct

You can read the Code of Conduct at [Code of Conduct](../../CODE_OF_CONDUCT.md).

## Who is behind it`?`

This project is developed by AXA Group Operations Spain S.A.

If you need to contact us, you can do it at the email opensource@axa.com

## License

Copyright (c) AXA Group Operations Spain S.A.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
