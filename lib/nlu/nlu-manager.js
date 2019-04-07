class NluManager {
  constructor(settings) {
    this.settings = settings || {};
    this.byLanguage = {};
  }
}

module.exports = NluManager;
