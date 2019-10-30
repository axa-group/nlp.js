const { Clonable } = require('@nlpjs/core');

class NluManager extends Clonable {
  constructor(settings = {}, container) {
    super({ settings: {} }, container);
    this.applySettings(this.settings, settings);
    this.applySettings(this.settings, {
      locale: 'en',
      keepStopwords: true,
      nonefeatureValue: 1,
      nonedeltaMultiplier: 1.2,
      spellcheckDistance: 0,
      filterZeros: true,
    });
  }
}

module.exports = NluManager;
