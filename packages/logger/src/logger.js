const pino = require('pino');

class Logger {
  constructor() {
    this.name = 'logger';
    this.logger = pino({
      prettyPrint: process.env.NODE_ENV !== 'production',
      colorize: process.env.NODE_ENV !== 'production',
    });
  }

  debug(...args) {
    this.logger.debug(...args);
  }

  info(...args) {
    this.logger.info(...args);
  }

  warn(...args) {
    this.logger.warn(...args);
  }

  error(...args) {
    this.logger.error(...args);
  }

  log(...args) {
    this.logger.info(...args);
  }

  trace(...args) {
    this.logger.trace(...args);
  }

  fatal(...args) {
    this.logger.fatal(...args);
  }
}

const logger = new Logger();

module.exports = logger;
