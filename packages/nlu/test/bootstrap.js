const { containerBootstrap } = require('@nlpjs/core');
const { NluNeural } = require('../src');

class OtherNlu extends NluNeural {
  registerDefault() {
    super.registerDefault();
    this.container.register('OtherNlu', OtherNlu, false);
  }
}

const container = containerBootstrap();
container.use(NluNeural);
container.use(OtherNlu);

module.exports = container;
