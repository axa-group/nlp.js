# logger

## Introduction
A logger can be registered to log what happen during the execution.

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