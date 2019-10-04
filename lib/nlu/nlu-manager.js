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
const DomainManager = require('./domain-manager');
const { Language } = require('../language');
const NlpUtil = require('../nlp/nlp-util');
const PuncTokenizer = require('../nlp/tokenizers/punct-tokenizer');

/**
 * Class for NLU Manager
 */
class NluManager {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for this instance.
   */
  constructor(settings) {
    this.settings = settings || {};
    this.guesser = new Language();
    this.languages = [];
    this.languageNames = {};
    this.domainManagers = {};
    this.tokenizer = new PuncTokenizer();
    this.wordDictionary = {};
    if (this.settings.languages) {
      this.addLanguage(this.settings.languages);
    }
    this.intentDomains = {};
  }

  describeLanguage(locale, name) {
    this.languageNames[locale] = { locale, name };
  }

  /**
   * Adds a language or several languages to the NLU Manager.
   * @param {String[]} srcLocales Locales to be added.
   */
  addLanguage(locales) {
    (Array.isArray(locales) ? locales : [locales]).forEach(locale => {
      const truncated = NlpUtil.getTruncatedLocale(locale);
      if (!this.languages.includes(truncated)) {
        this.languages.push(truncated);
      }
      if (!this.domainManagers[truncated]) {
        this.domainManagers[truncated] = new DomainManager({
          language: truncated,
          ...this.settings,
        });
      }
    });
  }

  /**
   * Given a text, try to guess the language, over the languages used for the NLP.
   * @param {String} utterance Text to be guessed.
   * @returns {String} ISO2 locale of the language, or undefined if not found.
   */
  guessLanguage(utterance) {
    if (this.languages.length === 1) {
      return this.languages[0];
    }
    const guess = this.guesser.guess(utterance, this.languages, 1);
    return guess && guess.length > 0 ? guess[0].alpha2 : undefined;
  }

  /**
   * Assign an intent to a domain.
   * The same intent can be in different domains, based on locale.
   * @param {String} locale Locale of the intent.
   * @param {String} intent Intent to be assigned.
   * @param {String} domain Domain to include the intent.
   */
  assignDomain(srcLocale, srcIntent, srcDomain) {
    let locale = srcLocale;
    let intent = srcIntent;
    let domain = srcDomain;
    if (!domain) {
      domain = intent;
      intent = locale;
      locale = undefined;
    }
    if (locale) {
      const truncated = NlpUtil.getTruncatedLocale(locale);
      if (!this.intentDomains[truncated]) {
        this.intentDomains[truncated] = {};
      }
      this.intentDomains[truncated][intent] = domain;
    } else {
      this.languages.forEach(truncated => {
        if (!this.intentDomains[truncated]) {
          this.intentDomains[truncated] = {};
        }
        this.intentDomains[truncated][intent] = domain;
      });
    }
  }

  /**
   * Returns the domain of a given intent.
   * @param {String} locale Locale of the intent.
   * @param {String} intent Intent name.
   * @returns {String} Domain of the intent.
   */
  getIntentDomain(locale, intent) {
    const truncated = NlpUtil.getTruncatedLocale(locale);
    if (!this.intentDomains[truncated]) {
      return 'default';
    }
    return this.intentDomains[truncated][intent] || 'default';
  }

  /**
   * Get an object with the intents of each domain.
   */
  getDomains() {
    const result = {};
    Object.keys(this.intentDomains).forEach(locale => {
      result[locale] = {};
      Object.keys(this.intentDomains[locale]).forEach(intent => {
        const domain = this.intentDomains[locale][intent];
        if (!result[locale][domain]) {
          result[locale][domain] = [];
        }
        result[locale][domain].push(intent);
      });
    });
    return result;
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
    const manager = this.domainManagers[locale];
    if (!manager) {
      throw new Error(`Domain Manager not found for locale ${locale}`);
    }
    const domain = this.getIntentDomain(locale, intent);
    this.guesser.addExtraSentence(locale, utterance);
    manager.add(domain, utterance, intent);
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
    const manager = this.domainManagers[locale];
    if (!manager) {
      throw new Error(`Domain Manager not found for locale ${locale}`);
    }
    const domain = this.getIntentDomain(locale, intent);
    manager.remove(domain, utterance, intent);
  }

  /**
   * Begin Edit Mode.
   */
  beginEdit() {
    Object.keys(this.domainManagers).forEach(locale => {
      this.domainManagers[locale].beginEdit();
    });
  }

  /**
   * Train the domains of the locales.
   */
  async train(languages) {
    let locales = languages || this.languages;
    if (!Array.isArray(locales)) {
      locales = [locales];
    }
    const trainPromises = locales
      .filter(locale => this.domainManagers[locale])
      .map(locale => this.domainManagers[locale].train());
    return Promise.all(trainPromises);
  }

  fillLanguage(obj) {
    const result = obj;
    result.languageGuessed = false;
    if (result.locale) {
      result.localeIso2 = NlpUtil.getTruncatedLocale(result.locale);
      result.language = (
        this.languageNames[result.localeIso2] ||
        this.guesser.languagesAlpha2[result.localeIso2] ||
        {}
      ).name;
      return result;
    }
    if (!result.locale) {
      result.locale = this.guessLanguage(result.utterance);
      result.localeIso2 = NlpUtil.getTruncatedLocale(result.locale);
      result.languageGuessed = true;
    }
    if (!this.languages.includes(result.localeIso2)) {
      [result.localeIso2] = this.languages;
    }
    result.language = (
      this.languageNames[result.localeIso2] ||
      this.guesser.languagesAlpha2[result.localeIso2] ||
      {}
    ).name;
    return result;
  }

  /**
   * Indicates if all the classifications are equal to 0.5
   * @param {Object[]} classifications Array of classifications
   */
  isEqualClassification(classifications) {
    if (classifications.length === 1) {
      return false;
    }
    if (classifications.length === 0 || classifications[0].value === 0) {
      return true;
    }
    if (classifications[0].value === classifications[1].value) {
      return true;
    }
    return false;
  }

  /**
   * Get all the labels and score for each label from this utterance.
   * @param {String} srcLocale Locale of the utterance, optional
   * @param {String} utterance Utterance to be classified.
   * @param {String} domainName Name of the domain, optional.
   * @returns {Object[]} Sorted array of classifications, with label and score.
   */
  getClassifications(locale, utterance, domainName) {
    const result = {};
    result.utterance = utterance === undefined ? locale : utterance;
    result.locale = utterance === undefined ? undefined : locale;
    this.fillLanguage(result);
    const domain = this.domainManagers[result.localeIso2];
    if (!domain) {
      result.classifications = [];
      result.domain = undefined;
      result.intent = undefined;
      result.score = undefined;
      return result;
    }
    const classifications = domain.getClassifications(
      result.utterance,
      domainName
    );
    result.domain = classifications.domain;
    result.classifications = classifications.classifications.sort(
      (a, b) => b.value - a.value
    );
    if (
      this.isEqualClassification(result.classifications) ||
      result.classifications.length === 0
    ) {
      result.intent = 'None';
      result.score = 1;
    } else {
      result.intent = result.classifications[0].label;
      result.score = result.classifications[0].value;
    }
    return result;
  }

  toObj() {
    const result = {};
    result.settings = this.settings;
    result.languages = this.languages;
    result.intentDomains = this.intentDomains;
    result.domainManagers = {};
    Object.keys(this.domainManagers).forEach(locale => {
      result.domainManagers[locale] = this.domainManagers[locale].toObj();
    });
    result.extraSentences = this.guesser.extraSentences;
    return result;
  }

  fromObj(obj) {
    this.guesser.extraSentences = obj.extraSentences || [];
    this.guesser.processExtraSentences();
    this.settings = obj.settings;
    this.languages = obj.languages;
    this.intentDomains = obj.intentDomains;
    this.domainManagers = {};
    Object.keys(obj.domainManagers).forEach(locale => {
      this.domainManagers[locale] = new DomainManager({
        language: locale,
        ...this.settings,
      });
      this.domainManagers[locale].fromObj(obj.domainManagers[locale]);
    });
  }
}

module.exports = NluManager;
