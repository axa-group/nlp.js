/*
 * Copyright (c) AXA Shared Services Spain S.A.
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
const Handlebars = require('handlebars');
const { Language } = require('../language');
const NerManager = require('./ner-manager');
const NamedEntity = require('./named-entity');
const { SentimentManager } = require('../sentiment');
const NlpUtil = require('./nlp-util');
const NlpClassifier = require('./nlp-classifier');
const NlgManager = require('../nlg/nlg-manager');
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
    this.guesser = new Language();
    this.nerManager = new NerManager(this.settings.ner);
    this.sentiment = new SentimentManager();
    this.languages = [];
    this.classifiers = {};
    this.intentEntities = {};
    if (this.settings.languages) {
      this.addLanguage(this.settings.languages);
    }
    if (this.settings.fullSearchWhenGuessed === undefined) {
      this.settings.fullSearchWhenGuessed = true;
    }
    if (this.settings.useNlg === undefined) {
      this.settings.useNlg = true;
    }
    this.nlgManager = new NlgManager();
  }

  /**
   * Adds a language or several languages to the NLP Manager.
   * @param {String[]} srcLocales Locales to be added.
   */
  addLanguage(srcLocales) {
    const locales = Array.isArray(srcLocales) ? srcLocales : [srcLocales];
    locales.forEach((locale) => {
      const truncated = NlpUtil.getTruncatedLocale(locale);
      if (!this.languages.includes(truncated)) {
        this.languages.push(truncated);
      }
      if (!this.classifiers[truncated]) {
        this.classifiers[truncated] = new NlpClassifier({ language: truncated });
      }
    });
  }

  /**
   * Given a text, try to guess the language, over the languages used for the NLP.
   * @param {String} utterance Text to be guessed.
   * @returns {String} ISO2 locale of the language, or undefined if not found.
   */
  guessLanguage(utterance) {
    const guess = this.guesser.guess(utterance, this.languages, 1);
    return guess && guess.length > 0 ? guess[0].alpha2 : undefined;
  }

  /**
   * Add new texts for an option of an entity for the given languages.
   * @param {String} entityName Name of the entity.
   * @param {String} optionName Name of the option.
   * @param {String[]} languages Languages for adding the texts.
   * @param {String[]} texts Texts to be added.
   */
  addNamedEntityText(entityName, optionName, languages, texts) {
    return this.nerManager.addNamedEntityText(entityName, optionName, languages, texts);
  }

  /**
   * Adds a new regex named entity
   * @param {String} entityName Name of the entity.
   * @param {RegEx} regex Regular expression
   */
  addRegexEntity(entityName, regex) {
    return this.nerManager.addNamedEntity(entityName, regex);
  }

  /**
   * Remove texts from an option of an entity for the given languages.
   * @param {String} entityName Name of the entity.
   * @param {String} optionName Name of the option.
   * @param {String[]} languages Languages for adding the texts.
   * @param {String[]} texts Texts tobe added.
   */
  removeNamedEntityText(entityName, optionName, languages, texts) {
    return this.nerManager.removeNamedEntityText(entityName, optionName, languages, texts);
  }

  /**
   * Adds a new utterance associated to an intent for the given locale.
   * @param {String} srcLocale Locale of the language.
   * @param {String} utterance Text of the utterance.
   * @param {String} intent Intent name.
   */
  addDocument(srcLocale, utterance, intent) {
    let locale = NlpUtil.getTruncatedLocale(srcLocale);
    if (!locale) {
      locale = this.guessLanguage(utterance);
    }
    if (!locale) {
      throw new Error('Locale must be defined');
    }
    const classifier = this.classifiers[locale];
    if (!classifier) {
      throw new Error(`Classifier not found for locale ${locale}`);
    }
    classifier.add(utterance, intent);
    const entities = this.nerManager.getEntitiesFromUtterance(utterance);
    if (entities && entities.length > 0) {
      let intentEntity = this.intentEntities[intent];
      if (!intentEntity) {
        this.intentEntities[intent] = [];
        intentEntity = this.intentEntities[intent];
      }
      entities.forEach((entity) => {
        if (intentEntity.indexOf(entity) === -1) {
          intentEntity.push(entity);
        }
      });
    }
  }

  /**
   * Removes an utterance associated to an intent for the given locale.
   * @param {String} srcLocale Locale of the language.
   * @param {String} utterance Text of the utterance.
   * @param {String} intent Intent name.
   */
  removeDocument(srcLocale, utterance, intent) {
    let locale = NlpUtil.getTruncatedLocale(srcLocale);
    if (!locale) {
      locale = this.guessLanguage(utterance);
    }
    if (!locale) {
      throw new Error('Locale must be defined');
    }
    const classifier = this.classifiers[locale];
    if (!classifier) {
      throw new Error(`Classifier not found for locale ${locale}`);
    }
    classifier.remove(utterance, intent);
  }

  /**
   * Adds an answer for a locale and intent.
   * @param {String} locale Locale of the intent.
   * @param {String} intent Intent name.
   * @param {String} answer Text of the answer.
   * @param {String} condition Condition to be evaluated.
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
   */
  removeAnswer(locale, intent, answer, condition) {
    this.nlgManager.removeAnswer(locale, intent, answer, condition);
  }

  /**
   * Train the classifiers for the provided locales. If no locale is
   * provided, then retrain all the classifiers.
   * @param {String[]} locale List of locales for being retrained.
   */
  train(locale) {
    let languages;
    if (locale) {
      languages = Array.isArray(locale) ? locale : [locale];
    } else {
      ({ languages } = this);
    }
    languages.forEach((language) => {
      const truncated = NlpUtil.getTruncatedLocale(language);
      const classifier = this.classifiers[truncated];
      if (classifier) {
        classifier.train();
      }
    });
  }

  /**
   * Given an utterance and a locale, try to classify the utterance into one intent.
   * @param {String} srcLocale Locale of the text. If not provided,
   *                           the locale is guessed.
   * @param {String} srcUtterance Text to be classified
   */
  classify(srcLocale, srcUtterance) {
    let utterance = srcUtterance;
    let locale = srcLocale;
    if (!utterance) {
      utterance = srcLocale;
      locale = this.guessLanguage(utterance);
    }
    const truncated = NlpUtil.getTruncatedLocale(locale);
    const classifier = this.classifiers[truncated];
    if (!classifier) {
      return undefined;
    }
    return classifier.getClassifications(utterance);
  }

  /**
   * Gets the sentiment of an utterance.
   * @param {String} srcLocale Locale of the text. If not provided, is guessed.
   * @param {String} srcUtterance Texto to analyze the sentiment.
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

  getAnswer(locale, intent, context) {
    const answer = this.nlgManager.findAnswer(locale, intent, context);
    if (answer && answer.response) {
      return answer.response;
    }
    return undefined;
  }

  /**
   * Indicates if all the classifications has exactly 0.5 score.
   * @param {Object[]} classifications Array of classifications.
   * @returns {boolean} True if all classifications score is 0.5.
   */
  isEqualClassification(classifications) {
    for (let i = 0; i < classifications.length; i += 1) {
      if (classifications[i].value !== 0.5) {
        return false;
      }
    }
    return true;
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
   */
  process(srcLocale, srcUtterance, srcContext) {
    let utterance = srcUtterance;
    let locale = srcLocale;
    let languageGuessed = false;
    if (!utterance) {
      utterance = locale;
      locale = this.guessLanguage(utterance);
      languageGuessed = true;
    }
    const truncated = NlpUtil.getTruncatedLocale(locale);
    const result = {};
    result.locale = locale;
    result.localeIso2 = truncated;
    result.language = (this.guesser.languagesAlpha2[result.localeIso2] || {}).name;
    result.utterance = utterance;
    if (languageGuessed && this.settings.fullSearchWhenGuessed) {
      let bestScore;
      let bestClassification;
      this.languages.forEach((language) => {
        const classification = this.classify(language, utterance);
        if (classification && classification.length > 0) {
          if (bestScore === undefined || classification[0].value > bestScore) {
            bestScore = classification[0].value;
            bestClassification = classification;
          }
        }
      });
      const optionalUtterance = this.nerManager.generateEntityUtterance(utterance, truncated);
      this.languages.forEach((language) => {
        const classification = this.classify(language, optionalUtterance);
        if (classification && classification.length > 0) {
          if (bestScore === undefined || classification[0].value > bestScore) {
            bestScore = classification[0].value;
            bestClassification = classification;
          }
        }
      });
      result.classification = bestClassification;
    } else {
      result.classification = this.classify(truncated, utterance);
      const optionalUtterance = this.nerManager.generateEntityUtterance(utterance, truncated);
      if (optionalUtterance !== utterance) {
        const optionalClassification = this.classify(truncated, optionalUtterance);
        if (optionalClassification && optionalClassification.length > 0
          && optionalClassification[0].value > result.classification[0].value) {
          result.classification = optionalClassification;
        }
      }
    }
    if (!result.classification || result.classification.length === 0 ||
      this.isEqualClassification(result.classification)) {
      result.intent = 'None';
      result.score = 1;
    } else {
      result.intent = result.classification[0].label;
      result.score = result.classification[0].value;
    }
    result.entities = this.nerManager.findEntities(
      utterance,
      truncated,
      result.intent ? this.intentEntities[result.intent] : undefined,
    );
    const context = srcContext || {};
    result.entities.forEach((entity) => {
      context[entity.entity] = entity.option;
    });
    result.sentiment = this.getSentiment(truncated, utterance);
    const answer = this.getAnswer(truncated, result.intent, context);
    if (answer) {
      result.srcAnswer = answer;
      result.answer = Handlebars.compile(answer)(context);
    }
    return result;
  }

  clear() {
    this.nerManager = new NerManager(this.settings.ner);
    this.languages = [];
    this.classifiers = {};
    this.intentEntities = {};
    this.nlgManager = new NlgManager();
  }

  /**
   * Save the NLP manager information into a file.
   * @param {String} srcFileName Filename for saving the NLP manager.
   */
  save(srcFileName) {
    const fileName = srcFileName || 'model.nlp';
    const clone = {};
    clone.settings = this.settings;
    clone.languages = this.languages;
    clone.intentEntities = this.intentEntities;
    clone.ner = {};
    clone.ner.namedEntities = this.nerManager.namedEntities;
    clone.ner.threshold = this.nerManager.threshold;
    clone.classifiers = [];
    clone.responses = this.nlgManager.responses;
    if (this.languages && this.languages.length > 0) {
      this.languages.forEach((language) => {
        const classifier = this.classifiers[language];
        const classifierClone = {};
        classifierClone.language = classifier.settings.language;
        classifierClone.docs = classifier.docs;
        classifierClone.features = classifier.features;
        classifierClone.logistic = {};
        const { logistic } = classifierClone;
        const lrc = classifier.settings.classifier;
        logistic.observations = lrc.observations;
        logistic.labels = lrc.labels;
        logistic.classifications = lrc.classifications;
        logistic.observationCount = lrc.observationCount;
        logistic.theta = lrc.theta;
        clone.classifiers.push(classifierClone);
      });
    }
    fs.writeFileSync(fileName, JSON.stringify(clone, null, 2), 'utf8');
  }

  /**
   * Load the NLP manager information from a file.
   * @param {String} srcFilename Filename for loading the NLP manager.
   */
  load(srcFileName) {
    const fileName = srcFileName || 'model.nlp';
    const data = fs.readFileSync(fileName, 'utf8');
    const clone = JSON.parse(data);
    this.settings = clone.settings;
    this.languages = clone.languages;
    const keys = Object.keys(clone.ner.namedEntities);
    this.nerManager.namedEntities = {};
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const srcNamedEntity = clone.ner.namedEntities[key];
      let namedEntity;
      if (srcNamedEntity.regex) {
        namedEntity = new NamedEntity(key, srcNamedEntity.regex);
      } else {
        namedEntity = new NamedEntity(key);
        namedEntity.options = srcNamedEntity.options;
      }
      namedEntity.settings = srcNamedEntity.settings;
      this.nerManager.namedEntities[key] = namedEntity;
    }

    this.nerManager.threshold = clone.ner.threshold;
    this.intentEntities = clone.intentEntities;
    this.nlgManager.responses = clone.responses;
    for (let i = 0, l = clone.classifiers.length; i < l; i += 1) {
      const classifierClone = clone.classifiers[i];
      this.addLanguage(classifierClone.language);
      const classifier = this.classifiers[classifierClone.language];

      classifier.docs = classifierClone.docs;
      classifier.features = classifierClone.features;
      const lrc = classifier.settings.classifier;
      const { logistic } = classifierClone;
      lrc.observations = logistic.observations;
      lrc.labels = logistic.labels;
      lrc.classifications = logistic.classifications;
      lrc.observationCount = logistic.observationCount;
      lrc.theta = logistic.theta;
    }
  }

  loadExcel(srcFileName) {
    this.clear();
    const fileName = srcFileName || 'model.xls';
    const reader = new NlpExcelReader(this);
    reader.load(fileName);
  }
}

module.exports = NlpManager;
