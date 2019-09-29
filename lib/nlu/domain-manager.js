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

const BaseNLU = require('./base-nlu');
require('./brain-nlu');
const NlpUtil = require('../nlp/nlp-util');

/**
 * Manager for several domains, using the same language.
 */
class DomainManager {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for this instance.
   */
  constructor(settings) {
    this.settings = settings || {};
    this.language = this.settings.language || 'en';
    this.nluClassName = this.settings.nluClassName || 'BrainNLU';
    this.useMasterDomain =
      this.settings.useMasterDomain === undefined
        ? true
        : this.settings.useMasterDomain;
    this.trainByDomain =
      this.settings.trainByDomain === undefined
        ? false
        : this.settings.trainByDomain;
    this.stemmer = this.settings.stemmer || NlpUtil.getStemmer(this.language);
    this.keepStopwords =
      this.settings.keepStopwords === undefined
        ? true
        : this.settings.keepStopwords;
    this.domains = {};
    this.addDomain('master_domain');
    this.stemDict = {};
    this.intentDict = {};
    this.useStemDict =
      this.settings.useStemDict === undefined
        ? true
        : this.settings.useStemDict;
    this.sentences = [];
  }

  /**
   * Generate the vector of features.
   * @param {String} utterance Input utterance.
   * @returns {String[]} Vector of features.
   */
  tokenizeAndStem(utterance) {
    const master = this.addDomain('master_domain');
    return master.tokenizeAndStem(utterance);
  }

  /**
   * Generates an string representing the stems
   * @param {String[]} utterance Stemmed utterance.
   */
  generateStemKey(utterance) {
    return utterance
      .slice()
      .sort()
      .join();
  }

  /**
   * Adds a domain
   * @param {String} name Name of the domain.
   * @param {Object} nlu NLU instance or undefined to create a new one.
   * @returns {Object} Domain created or the existing one.
   */
  addDomain(name, nlu) {
    if (!this.domains[name]) {
      if (nlu) {
        this.domains[name] = nlu;
      } else {
        this.domains[name] = BaseNLU.createClass(
          this.nluClassName,
          this.settings
        );
      }
    }
    return this.domains[name];
  }

  /**
   * Remove a domain by name.
   * @param {String} name Name of the domain.
   */
  removeDomain(name) {
    delete this.domains[name];
  }

  /**
   * Adds a new utterance to an intent.
   * @param {String} domain Domain of the intent.
   * @param {String} utterance Utterance to be added.
   * @param {String} intent Intent for adding the utterance.
   */
  add(domain, utterance, intent, force = false) {
    if (this.stemmer.constructor.name === 'AutoStemmer' && !force) {
      this.sentences.push({ domain, utterance, intent });
    } else {
      const stems = this.tokenizeAndStem(utterance);
      const stemKey = this.generateStemKey(stems);
      if (this.stemDict[stemKey]) {
        const key = this.stemDict[stemKey];
        this.remove(key.domain, stems, key.intent);
      }
      this.stemDict[stemKey] = { domain, intent };
      if (this.trainByDomain) {
        const nlu = this.addDomain(domain);
        nlu.add(stems, intent);
        const master = this.addDomain('master_domain');
        master.add(stems, domain);
      } else {
        const nlu = this.addDomain('master_domain');
        nlu.add(stems, intent);
      }
      this.intentDict[intent] = domain;
    }
  }

  /**
   * Remove an utterance from the nlu.
   * @Param {String} domain Domain of the intent
   * @param {String} utterance Utterance to be removed.
   * @param {String} intent Intent of the utterance, undefined to search all
   */
  remove(domain, utterance, intent) {
    const stems = this.tokenizeAndStem(utterance);
    const stemKey = this.generateStemKey(stems);
    delete this.stemDict[stemKey];
    if (this.trainByDomain) {
      const nlu = this.addDomain(domain);
      nlu.remove(stems, intent);
      const master = this.addDomain('master_domain');
      master.remove(stems, domain);
    } else {
      const nlu = this.addDomain('master_domain');
      nlu.remove(stems, intent);
    }
  }

  /**
   * Train the NLUs
   */
  async train() {
    if (this.stemmer.constructor.name === 'AutoStemmer') {
      for (let i = 0; i < this.sentences.length; i += 1) {
        const s = this.sentences[i];
        this.stemmer.addDocument(s.utterance, s.intent);
      }
      this.stemmer.learn();
      for (let i = 0; i < this.sentences.length; i += 1) {
        const s = this.sentences[i];
        this.add(s.domain, s.utterance, s.intent, true);
      }
    }
    if (this.trainByDomain) {
      const domainNames = Object.keys(this.domains).filter(
        x => x !== 'master_domain'
      );
      if (domainNames.length > 0) {
        if (domainNames.length > 1) {
          const promises = Object.values(this.domains).map(dom => dom.train());
          return Promise.all(promises);
        }
        return this.domains[domainNames[0]].train();
      }
      return true;
    }
    return this.domains.master_domain.train();
  }

  /**
   * Get all the labels and score for each label from this utterance.
   * @param {String} utterance Utterance to be classified.
   * @param {String} domainName Name of the domain, optional.
   * @returns {Object[]} Sorted array of classifications, with label and score.
   */
  getClassifications(utterance, domainName) {
    const stems = this.tokenizeAndStem(utterance);
    if (this.useStemDict) {
      const stemKey = this.generateStemKey(stems);
      const resolvedIntent = this.stemDict[stemKey];
      if (
        resolvedIntent &&
        (!domainName || resolvedIntent.domain === domainName)
      ) {
        const classifications = [];
        classifications.push({
          label: resolvedIntent.intent,
          value: 1,
        });
        Object.keys(this.intentDict).forEach(intent => {
          if (intent !== resolvedIntent.intent) {
            if (
              !this.trainByDomain ||
              resolvedIntent.domain === this.intentDict[intent]
            ) {
              classifications.push({ label: intent, value: 0 });
            }
          }
        });
        return { domain: resolvedIntent.domain, classifications };
      }
    }
    if (domainName) {
      const currentDomain = this.domains[domainName];
      if (!currentDomain) {
        return {
          domain: 'default',
          classifications: [{ label: 'None', value: 1 }],
        };
      }
      const classifications = currentDomain.getClassifications(stems);
      const finalDomain =
        domainName === 'master_domain'
          ? this.intentDict[classifications[0].label]
          : domainName;
      return { domain: finalDomain, classifications };
    }
    if (this.trainByDomain) {
      let domain;
      if (Object.keys(this.domains).length > 2) {
        const master = this.domains.master_domain;
        const domainClassifications = master.getClassifications(stems);
        domain = domainClassifications[0].label;
      } else {
        [domain] = Object.keys(this.domains).filter(x => x !== 'master_domain');
      }
      if (domain) {
        return this.getClassifications(stems, domain);
      }
      return { domain, classifications: [] };
    }
    return this.getClassifications(stems, 'master_domain');
  }

  /**
   * Exports object properties.
   * @returns {Object} Object properties.
   */
  toObj() {
    const result = {};
    result.settings = this.settings;
    result.language = this.language;
    result.nluClassName = this.nluClassName;
    result.useMasterDomain = this.useMasterDomain;
    result.trainByDomain = this.trainByDomain;
    result.keepStopwords = this.keepStopwords;
    result.stemDict = this.stemDict;
    result.intentDict = this.intentDict;
    result.useStemDict = this.useStemDict;
    result.domains = {};
    Object.keys(this.domains).forEach(domain => {
      result.domains[domain] = this.domains[domain].toObj();
    });
    return result;
  }

  /**
   * Import from object properties.
   * @param {Object} obj Object properties.
   */
  fromObj(obj) {
    this.settings = obj.settings;
    this.language = obj.language;
    this.nluClassName = obj.nluClassName;
    this.useMasterDomain = obj.useMasterDomain;
    this.trainByDomain = obj.trainByDomain;
    this.keepStopwords = obj.keepStopwords;
    this.stemDict = obj.stemDict;
    this.intentDict = obj.intentDict;
    this.domains = {};
    Object.keys(obj.domains).forEach(domain => {
      this.domains[domain] = BaseNLU.fromObj(obj.domains[domain]);
    });
  }

  /**
   * Begin edit in all NLUs
   */
  beginEdit() {
    Object.values(this.domains).forEach(domain => domain.beginEdit());
  }
}

module.exports = DomainManager;
