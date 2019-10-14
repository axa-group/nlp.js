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
const { Handlebars } = require('../util');
const NluManager = require('../nlu/nlu-manager');
const NerManager = require('../ner/ner-manager');
const { SentimentManager } = require('../sentiment');
const { ActionManager, NlgManager } = require('../nlg');
const { SlotManager } = require('../slot');
const NlpUtil = require('./nlp-util');
const NlpExcelReader = require('./nlp-excel-reader');

/**
 * Class for the NLP Manager.
 * The NLP manager is the one that is able to manage several classifiers,
 * to have multilanguage, and also is the responsible of the NER (Named Entity
 * Recognition).
 *
 * Understanding NER:
 *
 * You can have several entities defined, each one with multilanguage and
 * several texts for each option. Example
 * Entity   Option           English                  Spanish
 * FOOD     Burguer          Burguer, Hamburguer      Hamburguesa
 * FOOD     Salad            Salad                    Ensalada
 * FOOD     Pizza            Pizza                    Pizza
 *
 */
class NlpManager {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for the NLP Manager.
   */
  constructor(settings) {
    this.settings = settings || {};
    this.nluManager = new NluManager(this.settings.nlu);
    this.nerManager = new NerManager(this.settings.ner);
    this.nlgManager = new NlgManager(this.settings.nlg);
    this.actionManager = new ActionManager(this.settings.action);
    this.sentiment = new SentimentManager(this.settings.sentiment);
    this.slotManager = new SlotManager();
    this.utteranceDict = this.settings.utteranceDict || { '?': 'help' };
    this.defaultThreshold = this.settings.defaultThreshold;
    if (this.settings.defaultThreshold === undefined) {
      this.defaultThreshold = 0.5;
    }
    this.defaultIntent = this.settings.defaultIntent || 'None';
    this.defaultScore = this.settings.defaultScore || 1;
    if (this.settings.languages) {
      this.addLanguage(this.settings.languages);
    }
    this.processTransformer =
      typeof this.settings.processTransformer === 'function'
        ? this.settings.processTransformer
        : _ => _;
  }

  translateUtterance(utterance) {
    return this.utteranceDict[utterance]
      ? this.utteranceDict[utterance]
      : utterance;
  }

  /**
   * Clear this instance
   */
  clear() {
    this.nluManager = new NluManager(this.settings.nlu);
    this.nerManager = new NerManager(this.settings.ner);
    this.nlgManager = new NlgManager(this.settings.nlg);
    this.actionManager = new ActionManager(this.settings.action);
    this.sentiment = new SentimentManager(this.settings.sentiment);
    this.slotManager.clear();
  }

  /**
   * Given a text, try to guess the language, over the languages used for the NLP.
   * @param {String} utterance Text to be guessed.
   * @returns {String} ISO2 locale of the language, or undefined if not found.
   */
  guessLanguage(utterance) {
    return this.nluManager.guessLanguage(utterance);
  }

  /**
   * Add new texts for an option of an entity for the given languages.
   * @param {String} entityName Name of the entity.
   * @param {String} optionName Name of the option.
   * @param {String[]} languages Languages for adding the texts.
   * @param {String[]} texts Texts to be added.
   */
  addNamedEntityText(entityName, optionName, languages, texts) {
    return this.nerManager.addNamedEntityText(
      entityName,
      optionName,
      languages,
      texts
    );
  }

  /**
   * Adds a new regex named entity
   * @param {String} entityName Name of the entity.
   * @param {RegEx} regex Regular expression
   */
  addRegexEntity(entityName, languages, regex) {
    const entity = this.nerManager.addNamedEntity(entityName, 'regex');
    if (typeof regex === 'string') {
      entity.addStrRegex(languages, regex);
    } else {
      entity.addRegex(languages, regex);
    }
    return entity;
  }

  /**
   * Adds a new trim named entity.
   * @param {String} entityName Name of the entity.
   * @returns {Object} New Trim Named Entity instance.
   */
  addTrimEntity(entityName) {
    return this.nerManager.addNamedEntity(entityName, 'trim');
  }

  /**
   * Remove texts from an option of an entity for the given languages.
   * @param {String} entityName Name of the entity.
   * @param {String} optionName Name of the option.
   * @param {String[]} languages Languages for adding the texts.
   * @param {String[]} texts Texts tobe added.
   */
  removeNamedEntityText(entityName, optionName, languages, texts) {
    return this.nerManager.removeNamedEntityText(
      entityName,
      optionName,
      languages,
      texts
    );
  }

  /**
   * Adds a new utterance associated to an intent for the given locale.
   * @param {String} locale Locale of the language.
   * @param {String} utterance Text of the utterance.
   * @param {String} intent Intent name.
   */
  addDocument(locale, srcUtterance, intent) {
    const utterance = this.translateUtterance(srcUtterance);
    const entities = this.nerManager.getEntitiesFromUtterance(utterance);
    this.slotManager.addBatch(intent, entities);
    const optionalUtterance = this.nerManager.generateNamedEntityUtterance(
      utterance,
      locale
    );
    if (optionalUtterance) {
      this.nluManager.addDocument(locale, `${optionalUtterance}`, intent);
      this.nluManager.addDocument(
        locale,
        `${optionalUtterance} ${utterance}`,
        intent
      );
    } else {
      this.nluManager.addDocument(locale, utterance, intent);
    }
  }

  /**
   * Removes an utterance associated to an intent for the given locale.
   * @param {String} locale Locale of the language.
   * @param {String} utterance Text of the utterance.
   * @param {String} intent Intent name.
   */
  removeDocument(locale, utterance, intent) {
    this.nluManager.removeDocument(locale, utterance, intent);
  }

  /**
   * Adds an answer for a locale and intent.
   * @param {String} locale Locale of the intent.
   * @param {String} intent Intent name.
   * @param {String} answer Text of the answer.
   * @param {String} condition Condition to be evaluated.
   * @param {String} media url to be added (link to follow, ...).
   */
  addAnswer(locale, intent, answer, condition) {
    this.nlgManager.addAnswer(locale, intent, answer, condition);
  }

  /**
   * Remove and answer from a locale and intent.
   * @param {String} locale Locale of the intent.
   * @param {String} intent Intent name.
   * @param {String} answer Text of the answer.
   * @param {String} condition Condition to be evaluated.
   * @param {String} media url to be added (link to follow, ...).
   */
  removeAnswer(locale, intent, answer, condition) {
    this.nlgManager.removeAnswer(locale, intent, answer, condition);
  }

  /**
   * Add an action to a given intent.
   * @param {String} intent Name of the intent.
   * @param {String} action Action to be executed
   * @param {String[]} list of parameters Parameters of the action
   */
  addAction(intent, action, parameters) {
    this.actionManager.addAction(intent, action, parameters);
  }

  /**
   * Remove an action.
   * @param {String} intent Name of the intent
   * @param {String} action Name of the action
   * @param {String[]} parameters Parameters of the action.
   */
  removeAction(intent, action, parameters) {
    this.actionManager.removeAction(intent, action, parameters);
  }

  /**
   * Remove all the actions of a given intent.
   * @param {String} intent Name of the intent.
   */
  removeActions(intent) {
    this.actionManager.removeActions(intent);
  }

  /**
   * Assign an intent to a domain.
   * @param {String} locale locale of the intent.
   * @param {String} intent Intent to be assigned.
   * @param {String} domain Domain to include the intent.
   */
  assignDomain(locale, intent, domain) {
    this.nluManager.assignDomain(locale, intent, domain);
  }

  /**
   * Adds a language or several languages to the NLP Manager.
   * @param {String[]} srcLocales Locales to be added.
   */
  addLanguage(locales) {
    this.nluManager.addLanguage(locales);
  }

  /**
   * Get an object with the intents of each domain.
   */
  getDomains() {
    return this.nluManager.getDomains();
  }

  /**
   * Train the classifiers for the provided locales. If no locale is
   * provided, then retrain all the classifiers.
   * @param {String[]} locale List of locales for being retrained.
   */
  async train(languages) {
    return this.nluManager.train(languages);
  }

  /**
   * Given an utterance and a locale, try to classify the utterance into one intent.
   * @param {String} srcLocale Locale of the text. If not provided,
   *                           the locale is guessed.
   * @param {String} srcUtterance Text to be classified
   */
  classify(locale, utterance) {
    return this.nluManager.getClassifications(locale, utterance);
  }

  /**
   * Gets the sentiment of an utterance.
   * @param {String} srcLocale Locale of the text. If not provided, is guessed.
   * @param {Promise.String} srcUtterance Texto to analyze the sentiment.
   */
  getSentiment(srcLocale, srcUtterance) {
    let utterance = srcUtterance;
    let locale = srcLocale;
    if (!utterance) {
      utterance = srcLocale;
      locale = this.guessLanguage(utterance);
    }
    const truncated = NlpUtil.getTruncatedLocale(locale);
    return this.sentiment.process(truncated, utterance);
  }

  /**
   * Returns an answer for the given intent in the given locale using the
   * context.
   * @param {String} locale Locale of the intent.
   * @param {String} intent Input intent.
   * @param {Object} context Context of the conversation.
   */
  getAnswer(locale, intent, context) {
    const answer = this.nlgManager.findAnswer(locale, intent, context);
    if (answer && answer.response) {
      return answer.response;
    }
    return undefined;
  }

  /**
   * Return an array of actions for the intent.
   * @param {String} intent Name of the intent.
   * @returns {Object[]} Actions for this intent.
   */
  getActions(intent) {
    return this.actionManager.findActions(intent);
  }

  /**
   * Returns a processed answer after related with an intent.
   * @param {String} intent Name of the intent.
   * @param {String} original answer.
   * @returns {String} Processed answer.
   */
  processActions(intent, answer) {
    return this.actionManager.processActions(intent, answer);
  }

  /**
   * Process to extract entities from an utterance.
   * @param {string} srcLocale Locale of the utterance, optional.
   * @param {string} srcUtterance Text of the utterance.
   * @param {string[]} whitelist Optional whitelist of entity names.
   * @returns {Object[]} Array of entities.
   */
  async extractEntities(srcLocale, srcUtterance, whitelist) {
    let utterance = srcUtterance;
    let locale = srcLocale;
    if (!utterance) {
      utterance = locale;
      locale = this.guessLanguage(utterance);
    }
    const truncated = NlpUtil.getTruncatedLocale(locale);
    return this.nerManager.findEntities(utterance, truncated, whitelist);
  }

  /**
   * Gives a language name for the locale.
   * @param {String} locale Locale of the language.
   * @param {String} name New name for the language.
   */
  describeLanguage(locale, name) {
    this.nluManager.describeLanguage(locale, name);
  }

  /**
   * Returns the domain of a given intent.
   * @param {String} locale Locale of the intent.
   * @param {String} intent Intent name.
   * @returns {String} Domain of the intent.
   */
  getIntentDomain(locale, intent) {
    return this.nluManager.getIntentDomain(locale, intent);
  }

  /**
   * Process an utterance for full classify and analyze. If the locale is
   * not provided, then it will be guessed.
   * Classify the utterance and extract entities from it, returning an
   * object with all the information available.
   * Also calculates the sentiment of the utterance, if possible.
   * @param {String} srcLocale Language locale of the utterance.
   * @param {String} srcUtterance Text of the utterance.
   * @param {Object} srcContext Context for finding answers.
   * @param {String} domainName Name of the domain, optional.
   */
  async process(locale, srcUtterance, srcContext, domainName) {
    const utterance = this.translateUtterance(srcUtterance);
    let result = this.nluManager.getClassifications(
      locale,
      utterance,
      domainName
    );
    const optionalUtterance = await this.nerManager.generateEntityUtterance(
      result.utterance,
      result.localeIso2
    );
    if (optionalUtterance !== result.utterance) {
      const optional = this.nluManager.getClassifications(
        result.localeIso2,
        optionalUtterance,
        domainName
      );
      if (
        optional &&
        (optional.score > result.score || result.intent === 'None')
      ) {
        optional.utterance = result.utterance;
        result = optional;
      }
    }
    if (
      this.settings.defaultThreshold > 0 &&
      result.score < this.settings.defaultThreshold
    ) {
      result.intent = this.defaultIntent;
      result.score = this.defaultScore;
    }
    const entities = await this.nerManager.findEntitiesFull(
      result.utterance,
      result.localeIso2,
      this.slotManager.getIntentEntityNames(result.intent)
    );
    result.entities = entities.edges;
    result.sourceEntities = entities.source;
    const context = srcContext || {};
    result.entities.forEach(entity => {
      context[entity.entity] = entity.option || entity.utteranceText;
    });
    result.sentiment = await this.getSentiment(
      result.localeIso2,
      result.utterance
    );
    let answer = this.getAnswer(result.localeIso2, result.intent, context);

    result.actions = this.getActions(result.intent);

    answer = await this.processActions(result.intent, answer);

    if (answer) {
      result.srcAnswer = answer;
      result.answer = Handlebars.compile(answer)(context);
    }
    if (this.slotManager.process(result, context)) {
      result.entities.forEach(entity => {
        context[entity.entity] = entity.option || entity.utteranceText;
      });
      if (result.srcAnswer) {
        result.answer = Handlebars.compile(result.srcAnswer)(context);
      }
    }
    context.slotFill = result.slotFill;
    return this.processTransformer(result);
  }

  toObj() {
    const result = {};
    result.settings = this.settings;
    result.nluManager = this.nluManager.toObj();
    result.nerManager = this.nerManager.save();
    result.slotManager = this.slotManager.save();
    result.responses = this.nlgManager.responses;
    result.actions = this.actionManager.actions;
    result.utteranceDict = this.utteranceDict;
    return result;
  }

  fromObj(obj) {
    this.settings = obj.settings;
    this.nluManager.fromObj(obj.nluManager);
    this.nerManager.load(obj.nerManager);
    this.slotManager.load(obj.slotManager);
    this.nlgManager.responses = obj.responses;
    this.actionManager.actions = obj.actions || {};
    this.utteranceDict = obj.utteranceDict || { '?': 'help' };
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
  loadExcel(srcFileName) {
    this.clear();
    const fileName = srcFileName || 'model.xls';
    const reader = new NlpExcelReader(this);
    reader.load(fileName);
  }

  /**
   * Begin Edit Mode.
   * That means clear all, but the NLU Manager, that is put into edit mode.
   */
  beginEdit() {
    this.nluManager.beginEdit();
    this.nerManager = new NerManager(this.settings.ner);
    this.nlgManager = new NlgManager(this.settings.nlg);
    this.actionManager = new ActionManager(this.settings.action);
    this.sentiment = new SentimentManager(this.settings.sentiment);
    this.slotManager.clear();
  }
}

module.exports = NlpManager;
