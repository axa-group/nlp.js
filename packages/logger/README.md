![NLPjs logo](../../screenshots/nlplogo.gif)

# @nlpjs/logger

[![Build Status](https://travis-ci.com/axa-group/nlp.js.svg?branch=master)](https://travis-ci.com/axa-group/nlp.js)
[![Coverage Status](https://coveralls.io/repos/github/axa-group/nlp.js/badge.svg?branch=master)](https://coveralls.io/github/axa-group/nlp.js?branch=master)
[![NPM version](https://img.shields.io/npm/v/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp)
[![NPM downloads](https://img.shields.io/npm/dm/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp) [![Greenkeeper badge](https://badges.greenkeeper.io/axa-group/nlp.js.svg)](https://greenkeeper.io/)

## TABLE OF CONTENTS

<!--ts-->

- [Installation](#installation)
- [Example of use](#example-of-use)
- [Default logger in @nlpjs/core](#default-logger-in-nlpjscore)
- [Default logger in @nlpjs/basic](#default-logger-in-nlpjsbasic)
- [Adding your own logger to the container](#adding-your-own-logger-to-the-container)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Code of Conduct](#code-of-conduct)
- [Who is behind it](#who-is-behind-it)
- [License](#license.md)
  <!--te-->

## Installation

You can install @nlpjs/logger:

```bash
    npm install @nlpjs/logger
```

## Example of Usage

```javascript
const { Logger } = require('@nlpjs/logger');

const logger = new Logger();

logger.info('Hello world!!!')
```

## Default logger in @nlpjs/core
By default, a logger based on console is added to the NLP.js container

```javascript
const { defaultContainer } = require('@nlpjs/core');

const logger = defaultContainer.get('logger');
logger.info('This is an info message');
// This is an info message
```

## Default logger in @nlpjs/basic
When using the basic package of NLP.js, a logger based on pino is added.

```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
  const dock = await dockStart({ use: ['Basic']});
  const logger = dock.get('logger');
  logger.info('This is an info message');
  logger.log('This is a log message');
  logger.warn('This is a warn message');
  logger.error('This is an error message');
})();
```

## Adding your own logger to the container
You can register your own logger to the container:

```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
  const dock = await dockStart({ use: ['Basic']});
  const container = dock.getContainer();
  const loggerInstance = {
    trace: msg => console.trace(`[TRACE] ${msg}`),
    debug: msg => console.debug(`[DEBUG] ${msg}`),
    info: msg => console.info(`[INFO] ${msg}`),
    log: msg => console.log(`[LOG] ${msg}`),
    warn: msg => console.warn(`[WARN] ${msg}`),
    error: msg => console.error(`[ERROR] ${msg}`),
    fatal: msg => console.error(`[FATAL] ${msg}`),
  }
  container.register('logger', loggerInstance);
  const logger = dock.get('logger');
  logger.info('This is an info message');
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
