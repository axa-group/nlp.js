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

const fs = require('fs');
const { BuiltinMicrosoft } = require('@nlpjs/builtin-microsoft');
const { BuiltinDuckling } = require('@nlpjs/builtin-duckling');
const { containerBootstrap } = require('@nlpjs/core-loader');
const { Language } = require('@nlpjs/language');
const { LangAll } = require('@nlpjs/lang-all');
const { Nlp } = require('@nlpjs/nlp');
const { Evaluator, Template } = require('@nlpjs/evaluator');
const { fs: requestfs } = require('@nlpjs/request');
const { SentimentManager } = require('../sentiment');
const NlpExcelReader = require('./nlp-excel-reader');

class NlpManager {
  constructor(settings = {}) {
    this.settings = settings;
    if (!this.settings.container) {
      this.settings.container = containerBootstrap();
    }
    this.container = this.settings.container;
    this.container.registerConfiguration('ner', {
      entityPreffix: '%',
      entitySuffix: '%',
    });
    this.container.register('fs', requestfs);
    this.container.register('Language', Language, false);
    this.container.use(LangAll);
    this.container.use(Evaluator);
    this.container.use(Template);
    this.nlp = new Nlp(this.settings);
    this.sentimentManager = new SentimentManager();
    if (this.settings.ner) {
      if (this.settings.ner.ducklingUrl || this.settings.ner.useDuckling) {
        const builtin = new BuiltinDuckling(this.settings.ner);
        this.container.register('extract-builtin-??', builtin, true);
      } else {
        const builtin = new BuiltinMicrosoft(this.settings.ner);
        this.container.register('extract-builtin-??', builtin, true);
      }
    } else {
      const builtin = new BuiltinMicrosoft(this.settings.ner);
      this.container.register('extract-builtin-??', builtin, true);
    }
  }

  addDocument(locale, utterance, intent) {
    return this.nlp.addDocument(locale, utterance, intent);
  }

  removeDocument(locale, utterance, intent) {
    return this.nlp.removeDocument(locale, utterance, intent);
  }

  addLanguage(locale) {
    return this.nlp.addLanguage(locale);
  }

  removeLanguage(locale) {
    return this.nlp.removeLanguage(locale);
  }

  assignDomain(locale, intent, domain) {
    return this.nlp.assignDomain(locale, intent, domain);
  }

  getIntentDomain(locale, intent) {
    return this.nlp.getIntentDomain(locale, intent);
  }

  getDomains() {
    return this.nlp.getDomains();
  }

  guessLanguage(text) {
    return this.nlp.guessLanguage(text);
  }

  addAction(intent, action, parameters, fn) {
    if (!fn) {
      fn = this.settings.action ? this.settings.action[action] : undefined;
    }
    return this.nlp.addAction(intent, action, parameters, fn);
  }

  getActions(intent) {
    return this.nlp.getActions(intent);
  }

  removeAction(intent, action, parameters) {
    return this.nlp.removeAction(intent, action, parameters);
  }

  removeActions(intent) {
    return this.nlp.removeActions(intent);
  }

  addAnswer(locale, intent, answer, opts) {
    return this.nlp.addAnswer(locale, intent, answer, opts);
  }

  removeAnswer(locale, intent, answer, opts) {
    return this.nlp.removeAnswer(locale, intent, answer, opts);
  }

  findAllAnswers(locale, intent) {
    return this.nlp.findAllAnswers(locale, intent);
  }

  async getSentiment(locale, utterance) {
    const sentiment = await this.nlp.getSentiment(locale, utterance);
    return this.sentimentManager.translate(sentiment.sentiment);
  }

  addNamedEntityText(entityName, optionName, languages, texts) {
    return this.nlp.addNerRuleOptionTexts(
      languages,
      entityName,
      optionName,
      texts
    );
  }

  removeNamedEntityText(entityName, optionName, languages, texts) {
    return this.nlp.removeNerRuleOptionTexts(
      languages,
      entityName,
      optionName,
      texts
    );
  }

  addRegexEntity(entityName, languages, regex) {
    return this.nlp.addNerRegexRule(languages, entityName, regex);
  }

  addBetweenCondition(locale, name, left, right, opts) {
    return this.nlp.addNerBetweenCondition(locale, name, left, right, opts);
  }

  addPositionCondition(locale, name, position, words, opts) {
    return this.nlp.addNerPositionCondition(
      locale,
      name,
      position,
      words,
      opts
    );
  }

  addAfterCondition(locale, name, words, opts) {
    return this.nlp.addNerAfterCondition(locale, name, words, opts);
  }

  addAfterFirstCondition(locale, name, words, opts) {
    return this.nlp.addNerAfterFirstCondition(locale, name, words, opts);
  }

  addAfterLastCondition(locale, name, words, opts) {
    return this.nlp.addNerAfterLastCondition(locale, name, words, opts);
  }

  addBeforeCondition(locale, name, words, opts) {
    return this.nlp.addNerBeforeCondition(locale, name, words, opts);
  }

  addBeforeFirstCondition(locale, name, words, opts) {
    return this.nlp.addNerBeforeFirstCondition(locale, name, words, opts);
  }

  addBeforeLastCondition(locale, name, words, opts) {
    return this.nlp.addNerBeforeLastCondition(locale, name, words, opts);
  }

  describeLanguage(locale, name) {
    return this.nlp.describeLanguage(locale, name);
  }

  beginEdit() {}

  train() {
    return this.nlp.train();
  }

  classify(locale, utterance, settings) {
    return this.nlp.classify(locale, utterance, settings);
  }

  async process(locale, utterance, context, settings) {
    const result = await this.nlp.process(locale, utterance, context, settings);
    if (this.settings.processTransformer) {
      return this.settings.processTransformer(result);
    }
    return result;
  }

  extractEntities(locale, utterance, context, settings) {
    return this.nlp.extractEntities(locale, utterance, context, settings);
  }

  toObj() {
    return this.nlp.toJSON();
  }

  fromObj(obj) {
    return this.nlp.fromJSON(obj);
  }

  /**
   * Export NLP manager information as a string.
   * @param {Boolean} minified If true, the returned JSON will have no spacing or indentation.
   * @returns {String} NLP manager information as a JSON string.
   */
  export(minified = false) {
    const clone = this.toObj();
    return minified ? JSON.stringify(clone) : JSON.stringify(clone, null, 2);
  }

  /**
   * Load NLP manager information from a string.
   * @param {String|Object} data JSON string or object to load NLP manager information from.
   */
  import(data) {
    const clone = typeof data === 'string' ? JSON.parse(data) : data;
    this.fromObj(clone);
  }

  /**
   * Save the NLP manager information into a file.
   * @param {String} srcFileName Filename for saving the NLP manager.
   */
  save(srcFileName, minified = false) {
    const fileName = srcFileName || 'model.nlp';
    fs.writeFileSync(fileName, this.export(minified), 'utf8');
  }

  /**
   * Load the NLP manager information from a file.
   * @param {String} srcFilename Filename for loading the NLP manager.
   */
  load(srcFileName) {
    const fileName = srcFileName || 'model.nlp';
    const data = fs.readFileSync(fileName, 'utf8');
    this.import(data);
  }

  /**
   * Load the NLP manager information from an excel file.
   * @param {Sting} srcFileName File name of the excel.
   */
  loadExcel(fileName = 'model.xls') {
    const reader = new NlpExcelReader(this);
    reader.load(fileName);
  }

  async testCorpus(corpus) {
    const { data } = corpus;
    const result = {
      total: 0,
      good: 0,
      bad: 0,
    };
    const promises = [];
    const intents = [];
    for (let i = 0; i < data.length; i += 1) {
      const intentData = data[i];
      const { tests } = intentData;
      for (let j = 0; j < tests.length; j += 1) {
        promises.push(this.process(corpus.locale.slice(0, 2), tests[j]));
        intents.push(intentData.intent);
      }
    }
    result.total += promises.length;
    const results = await Promise.all(promises);
    for (let i = 0; i < results.length; i += 1) {
      const current = results[i];
      if (current.intent === intents[i]) {
        result.good += 1;
      } else {
        result.bad += 1;
      }
    }
    return result;
  }

  addCorpora(corpora) {
    this.nlp.addCorpora(corpora);
  }

  addCorpus(corpus) {
    this.nlp.addCorpus(corpus);
  }

  async trainAndEvaluate(fileName) {
    let corpus = fileName;
    if (typeof fileName === 'string') {
      const nlpfs = this.container.get('fs');
      const fileData = await nlpfs.readFile(fileName);
      if (!fileData) {
        throw new Error(`Corpus not found "${fileName}"`);
      }
      corpus = typeof fileData === 'string' ? JSON.parse(fileData) : fileData;
    }
    this.nlp.addCorpus(corpus);
    await this.train();
    return this.testCorpus(corpus);
  }
}

module.exports = NlpManager;
