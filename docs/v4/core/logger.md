# logger

This is a singleton to write logs. In this case due to browser compatibility, it works using console, and is always mounted by default as a plugin in every container.
This logger can be replaced by other plugins, in fact there exists another plugin for a logger using pino that is mounted in the core-loader for backend implementations.
The methods implemented for loggin are:
- trace
- debug
- info
- log
- warn
- error
- fatal

## Example of use

```javascript
const { logger } = require('@nlpjs/core');

logger.log('hello'); // hello
```

## Example of use with container

```javascript
const { Container } = require('@nlpjs/core');

const container = new Container();
const logger = container.get('logger');
logger.log('hello'); // hello
```