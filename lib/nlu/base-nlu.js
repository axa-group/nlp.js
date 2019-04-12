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

const NlpUtil = require('../nlp/nlp-util');

/**
 * Base class for NLU
 */
class BaseNLU {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for this instance
   */
  constructor(settings) {
    this.settings = settings || {};
    this.language = this.settings.language || 'en';
    this.stemmer = this.settings.stemmer || NlpUtil.getStemmer(this.language);
    this.keepStopwords =
      this.settings.keepStopwords === undefined
        ? true
        : this.settings.keepStopwords;
    this.docs = [];
    this.features = {};
  }

  /**
   * Gets the position of a utterance for an intent.
   * @param {Object} utterance Utterance to be found.
   * @param {Object} intent Intent of the utterance.
   * @returns {Number} Position of the utterance, -1 if not found.
   */
  posUtterance(utterance, intent) {
    const tokens = this.tokenizeAndStem(utterance);
    const tokenStr = tokens.join(' ');
    for (let i = 0; i < this.docs.length; i += 1) {
      const doc = this.docs[i];
      if (
        doc.tokens.join(' ') === tokenStr &&
        (!intent || doc.intent === intent)
      ) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Indicates if an utterance already exists, at the given intent or globally.
   * @param {String} utterance Utterance to be checked.
   * @param {String} intent Intent to check, undefined to search globally.
   * @returns {boolean} True if the intent exists, false otherwise.
   */
  existsUtterance(utterance, intent) {
    return this.posUtterance(utterance, intent) !== -1;
  }

  /**
   * Adds a new utterance to an intent.
   * @param {String} utterance Utterance to be added.
   * @param {String} intent Intent for adding the utterance.
   */
  add(utterance, intent) {
    if (typeof utterance !== 'string') {
      throw new Error('Utterance must be an string');
    }
    if (typeof intent !== 'string') {
      throw new Error('Intent must be an string');
    }
    const tokens = this.tokenizeAndStem(utterance);
    if (tokens.length === 0 || this.existsUtterance(tokens)) {
      return;
    }
    const doc = { intent: intent.trim(), utterance, tokens };
    this.docs.push(doc);
    tokens.forEach(token => {
      this.features[token] = (this.features[token] || 0) + 1;
    });
  }

  /**
   * Remove an utterance from the classifier.
   * @param {String} utterance Utterance to be removed.
   * @param {String} intent Intent of the utterance, undefined to search all
   */
  remove(utterance, intent) {
    if (typeof utterance !== 'string') {
      throw new Error('Utterance must be an string');
    }
    const tokens = this.tokenizeAndStem(utterance);
    if (tokens.length === 0) {
      return;
    }
    const pos = this.posUtterance(
      utterance,
      intent ? intent.trim() : undefined
    );
    if (pos !== -1) {
      this.docs.splice(pos, 1);
      tokens.forEach(token => {
        this.features[token] = this.features[token] - 1;
        if (this.features[token] <= 0) {
          delete this.features[token];
        }
      });
    }
  }

  /**
   * Indicates if all the classifications are equal to 0.5
   * @param {Object[]} classifications Array of classifications
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
   * Generate the vector of features.
   * @param {String} utterance Input utterance.
   * @returns {String[]} Vector of features.
   */
  tokenizeAndStem(utterance) {
    return typeof utterance === 'string'
      ? this.stemmer.tokenizeAndStem(utterance, this.keepStopwords)
      : utterance;
  }

  /**
   * Given an utterance, get the label and score of the best classification.
   * @param {String} utterance Utterance to be classified.
   * @returns {Object} Best classification of the observation.
   */
  getBestClassification(utterance) {
    return this.getClassifications(utterance)[0];
  }

  baseToObj() {
    const result = {};
    result.settings = this.settings;
    result.language = this.language;
    result.keepStopwords = this.keepStopwords;
    result.docs = this.docs;
    result.features = this.features;
    return result;
  }

  baseFromObj(obj) {
    this.settings = obj.settings;
    this.language = obj.language;
    this.keepStopwords = obj.language;
    this.stemmer = this.settings.stemmer || NlpUtil.getStemmer(this.language);
    this.docs = obj.docs;
    this.features = obj.features;
  }

  normalizeNeural(classifications) {
    let total = 0;
    for (let i = 0; i < classifications.length; i += 1) {
      total += classifications[i].value ** 2;
    }
    if (total > 0) {
      const result = [];
      for (let i = 0; i < classifications.length; i += 1) {
        result.push({
          label: classifications[i].label,
          value: classifications[i].value ** 2 / total,
        });
      }
      return result;
    }
    return classifications;
  }

  static fromObj(obj) {
    const instance = new BaseNLU.classes[obj.className]();
    instance.fromObj(obj);
    return instance;
  }
}

BaseNLU.classes = {};

module.exports = BaseNLU;
