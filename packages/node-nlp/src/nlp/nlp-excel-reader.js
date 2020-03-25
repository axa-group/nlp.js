const { XDoc } = require('@nlpjs/xtables');

class NlpExcelReader {
  constructor(manager) {
    this.manager = manager;
    this.xdoc = new XDoc();
  }

  load(filename) {
    this.xdoc.read(filename);
    this.loadSettings();
    this.loadLanguages();
    this.loadNamedEntities();
    this.loadRegexEntities();
    this.loadIntents();
    this.loadResponses();
  }

  loadSettings() {}

  loadLanguages() {
    this.xdoc.getTable('Languages').data.forEach((row) => {
      this.manager.addLanguage(row.iso2);
    });
  }

  loadNamedEntities() {
    this.xdoc.getTable('Named Entities').data.forEach((row) => {
      const languages = row.language.split(',').map((x) => x.trim());
      this.manager.addNamedEntityText(
        row.entity,
        row.option,
        languages,
        row.text
      );
    });
  }

  loadRegexEntities() {
    const table = this.xdoc.getTable('Regex Entities');
    if (table) {
      table.data.forEach((row) => {
        const languages = row.language.split(',').map((x) => x.trim());
        this.manager.addRegexEntity(row.entity, languages, row.regex);
      });
    }
  }

  loadIntents() {
    this.xdoc.getTable('Intents').data.forEach((row) => {
      this.manager.addDocument(row.language, row.utterance, row.intent);
    });
  }

  loadResponses() {
    this.xdoc.getTable('Responses').data.forEach((row) => {
      this.manager.addAnswer(
        row.language,
        row.intent,
        row.response,
        row.condition,
        row.url
      );
    });
  }
}

module.exports = NlpExcelReader;
