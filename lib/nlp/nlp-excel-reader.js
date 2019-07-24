/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const { XDoc } = require('../xtables');

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
    this.xdoc.getTable('Languages').data.forEach(row => {
      this.manager.addLanguage(row.iso2);
    });
  }

  loadNamedEntities() {
    this.xdoc.getTable('Named Entities').data.forEach(row => {
      const languages = row.language.split(',').map(x => x.trim());
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
      table.data.forEach(row => {
        const languages = row.language.split(',').map(x => x.trim());
        this.manager.addRegexEntity(row.entity, languages, row.regex);
      });
    }
  }

  loadIntents() {
    this.xdoc.getTable('Intents').data.forEach(row => {
      this.manager.addDocument(row.language, row.utterance, row.intent);
    });
  }

  loadResponses() {
    this.xdoc.getTable('Responses').data.forEach(row => {
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
