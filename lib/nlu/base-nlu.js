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

const NlpUtil = require('../nlp/nlp-util');
const Classifier = require('../classifiers/classifier');
const { removeEmojis } = require('../util/emoji');
const SpellCheck = require('../util/spell-check');

const status = {
  CREATE: 'create',
  UNTOUCH: 'untouch',
  DELETE: 'delete',
};

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
    this.isEditing = false;
    this.nonefeatureValue =
      this.settings.nonefeatureValue === undefined
        ? 1
        : this.settings.nonefeatureValue;
    this.nonedeltaValue = this.settings.nonedeltaValue;
    this.nonedeltaMultiplier =
      this.settings.nonedeltaMultiplier === undefined
        ? 1.2
        : this.settings.nonedeltaMultiplier;
    if (this.settings.spellCheck) {
      this.spellCheckDistance = 1;
    } else if (this.settings.spellCheckDistance !== undefined) {
      this.spellCheckDistance = this.settings.spellCheckDistance;
    } else {
      this.spellCheckDistance = 0;
    }
  }

  /**
   * Gets the position of a utterance for an intent.
   * @param {Object} utterance Utterance to be found.
   * @param {Object} intent Intent of the utterance.
   * @returns {Number} Position of the utterance, -1 if not found.
   */
  posUtterance(utterance, intent) {
    if (!this.docDict) {
      this.docDict = {};
      for (let i = 0; i < this.docs.length; i += 1) {
        const doc = this.docs[i];
        const key = doc.tokens.join(' ');
        if (!this.docDict[key]) {
          this.docDict[key] = [];
        }
        this.docDict[key].push(i);
      }
    }
    const tokens = this.tokenizeAndStem(utterance);
    const tokenStr = tokens.join(' ');
    const indexs = this.docDict[tokenStr];
    if (indexs === undefined) {
      return -1;
    }
    for (let i = 0; i < indexs.length; i += 1) {
      const doc = this.docs[indexs[i]];
      if (!intent || (doc && doc.intent === intent)) {
        return indexs[i];
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
    if (typeof utterance !== 'string' && !Array.isArray(utterance)) {
      throw new Error('Utterance must be an string');
    }
    if (typeof intent !== 'string') {
      throw new Error('Intent must be an string');
    }
    const tokens = this.tokenizeAndStem(utterance);
    if (tokens.length === 0) {
      return;
    }
    const pos = this.posUtterance(tokens, intent);
    if (pos !== -1) {
      if (!this.isEditing) {
        return;
      }
      if (this.docs[pos].status !== status.CREATE) {
        this.docs[pos].status = status.UNTOUCH;
      }
      return;
    }
    const doc = { intent: intent.trim(), utterance, tokens };
    if (this.isEditing) {
      doc.status = status.CREATE;
    }
    this.docs.push(doc);
    const key = doc.tokens.join(' ');
    if (!this.docDict[key]) {
      this.docDict[key] = [];
    }
    this.docDict[key].push(this.docs.length - 1);
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
    if (typeof utterance !== 'string' && !Array.isArray(utterance)) {
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
      if (this.isEditing) {
        if (this.docs[pos].status === status.CREATE) {
          this.docs.splice(pos, 1);
        } else if (this.docs[pos].status === status.UNTOUCH) {
          this.docs[pos].status = status.DELETE;
        }
      } else {
        this.docs.splice(pos, 1);
        tokens.forEach(token => {
          this.features[token] = this.features[token] - 1;
          if (this.features[token] <= 0) {
            delete this.features[token];
          }
        });
      }
    }
  }

  doSpellCheck(tokens) {
    if (this.spellCheckDistance > 0) {
      if (!this.spellCheck) {
        this.spellCheck = new SpellCheck(this.features);
      }
      return this.spellCheck.check(tokens, this.spellCheckDistance);
    }
    return tokens;
  }

  /**
   * Generate the vector of features.
   * @param {String} utterance Input utterance.
   * @returns {String[]} Vector of features.
   */
  tokenizeAndStem(utterance, isClassification = false) {
    if (typeof utterance !== 'string') {
      if (!isClassification) {
        return utterance;
      }
      return this.doSpellCheck(utterance);
    }
    const tokens = this.stemmer.tokenizeAndStem(
      removeEmojis(utterance),
      this.keepStopwords
    );
    if (isClassification) {
      return this.doSpellCheck(tokens);
    }
    return tokens;
  }

  someSimilar(tokensA, tokensB) {
    for (let i = 0; i < tokensB.length; i += 1) {
      if (tokensA[tokensB[i]]) {
        return true;
      }
    }
    return false;
  }

  getWhitelist(tokens) {
    const result = {};
    for (let i = 0; i < this.docs.length; i += 1) {
      if (this.someSimilar(tokens, this.docs[i].tokens)) {
        result[this.docs[i].intent] = 1;
      }
    }
    return result;
  }

  /**
   * Given an utterance, get the label and score of the best classification.
   * @param {String} utterance Utterance to be classified.
   * @returns {Object} Best classification of the observation.
   */
  getBestClassification(utterance) {
    return this.getClassifications(utterance)[0];
  }

  /**
   * Exports properties to an object
   * @returns {Object} Object properties
   */
  baseToObj() {
    const result = {};
    result.settings = this.settings;
    result.language = this.language;
    result.keepStopwords = this.keepStopwords;
    result.docs = [];
    for (let i = 0; i < this.docs.length; i += 1) {
      result.docs.push({
        intent: this.docs[i].intent,
        tokens: this.docs[i].tokens,
      });
    }
    result.features = this.features;
    result.isEditing = this.isEditing;
    return result;
  }

  /**
   * Import instance properties from an object
   * @param {Object} obj Object properties
   */
  baseFromObj(obj) {
    this.settings = obj.settings;
    this.language = obj.language;
    this.keepStopwords = obj.language;
    this.stemmer = this.settings.stemmer || NlpUtil.getStemmer(this.language);
    this.docs = obj.docs;
    for (let i = 0; i < this.docs.length; i += 1) {
      this.docs[i].utterance = this.docs[i].tokens;
    }
    this.features = obj.features;
    this.isEditing = obj.isEditing;
  }

  /**
   * Normalize the neural network results
   * @param {Object[]} classifications Input classifications
   * @returns {Object[]} Normalized classifications
   */
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

  /**
   * Factory to create instance given an object properties.
   * @param {Object} obj Object properties
   */
  static fromObj(obj) {
    const instance = new BaseNLU.classes[obj.className]();
    instance.fromObj(obj);
    return instance;
  }

  /**
   * Factory to create new class given class name and settings.
   * @param {String} className Class name
   * @param {*} settings Settings for the instance
   */
  static createClass(className, settings) {
    return new BaseNLU.classes[className](settings);
  }

  /**
   * Enter edit mode.
   * - By default, starts marking all docs status as delete
   */
  beginEdit() {
    if (!this.isEditing) {
      this.isEditing = true;
      this.docs.forEach(srcDoc => {
        const doc = srcDoc;
        doc.status = status.DELETE;
      });
    }
  }

  /**
   * Ends edit mode:
   * - Remove docs marked as delete
   * - Calculates if NLU should be retrained
   * - Recalculate features
   * @returns {boolean} True if should be retrained, false otherwise.
   */
  endEdit() {
    let result = false;
    const finalDocs = [];
    this.features = {};
    this.docs.forEach(srcDoc => {
      const doc = srcDoc;
      if (!result && doc.status !== status.UNTOUCH) {
        result = true;
      }
      if (doc.status !== status.DELETE) {
        delete doc.status;
        finalDocs.push(doc);
        doc.tokens.forEach(token => {
          this.features[token] = (this.features[token] || 0) + 1;
        });
      }
    });
    this.docs = finalDocs;
    this.isEditing = false;
    return result;
  }

  /**
   * Given an utterance, tokenize and steam the utterance and convert it
   * to a vector of binary values, where each position is a feature (a word
   * stemmed) and the value means if the utterance has this feature.
   * The input utterance can be an string or an array of tokens.
   * @param {String} utterance Utterance to be converted to features vector.
   * @returns {Number[]} Features vector of the utterance.
   */
  textToFeatures(utterance, isClassification = false) {
    if (!this.numIntents) {
      const intents = {};
      for (let i = 0; i < this.docs.length; i += 1) {
        intents[this.docs[i].intent] = 1;
      }
      this.numIntents = Object.keys(intents).length;
    }
    if (!this.numFeatures) {
      this.numFeatures = Object.keys(this.features).length;
    }
    const result = {};
    if (utterance === 'nonefeature' && this.settings.useNoneFeature) {
      result.nonefeature = this.nonefeatureValue;
    } else {
      const tokens = this.tokenizeAndStem(utterance, isClassification);
      let nonedelta =
        this.nonedeltaValue === undefined
          ? this.numIntents / this.numFeatures
          : this.nonedeltaValue;
      tokens.forEach(key => {
        if (this.features[key] > 0) {
          result[key] = 1;
        } else if (this.settings.useNoneFeature) {
          result.nonefeature = (result.nonefeature || 0) + nonedelta;
          nonedelta *= this.nonedeltaMultiplier;
        }
      });
    }
    return result;
  }

  /**
   * Export as object
   */
  toObj() {
    const result = this.baseToObj();
    result.className = this.constructor.name;
    result.classifier = this.classifier.toObj();
    return result;
  }

  /**
   * Import from object
   * @param {Object} obj Source object
   */
  fromObj(obj) {
    this.baseFromObj(obj);
    this.classifier = Classifier.fromObj(obj.classifier);
  }
}

BaseNLU.classes = {};

module.exports = BaseNLU;
