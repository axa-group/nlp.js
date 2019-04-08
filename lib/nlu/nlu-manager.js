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
const DomainManager = require('./domain-manager');
const { Language } = require('../language');
const { NlpUtil } = require('../nlp');
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
    this.domainManagers = {};
    this.tokenizer = new PuncTokenizer();
    this.wordDictionary = {};
    if (this.settings.languages) {
      this.addLanguage(this.settings.languages);
    }
    this.intentDomains = {};
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
        this.domainManagers[truncated] = new DomainManager(
          Object.assign({ language: truncated }, this.settings)
        );
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
  assignDomain(locale, intent, domain) {
    const truncated = NlpUtil.getTruncatedLocale(locale);
    if (!this.intentDomains[truncated]) {
      this.intentDomains[truncated] = {};
    }
    this.intentDomains[truncated][intent] = domain;
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
}

module.exports = NluManager;
