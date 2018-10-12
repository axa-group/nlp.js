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

const LogisticRegressionClassifier = require('../classifiers/logistic-regression-classifier');
const NlpUtil = require('./nlp-util');
const BinaryNeuralNetworkClassifier = require('../classifiers/binary-neural-network-classifier');

/**
 * Class for the NLP Classifier.
 * In the settings you can specify:
 * - classifier (optional): The Machine Learning Classifier Class. If not
 *      provided, then a default Logistic Regression Classifier is used.
 * - stemmer (optional): The language stemmer (also tokenize). If not
 *      provided, you can provide the language and the default stemmer
 *      for this language will be used.
 * - language (optional): If you don't provide a stemmer, then you can
 *      provide a language so a default stemmer for this language will
 *      be used.
 */
class NlpClassifier {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for this instance.
   */
  constructor(settings) {
    this.settings = settings || {};
    if (!this.settings.language) {
      this.settings.language = 'en';
    }
    if (!this.settings.classifier) {
      this.settings.classifier = new LogisticRegressionClassifier();
    }
    if (this.settings.useNeural === undefined) {
      this.settings.useNeural = true;
    }
    if (!this.settings.neuralClassifier) {
      this.settings.neuralClassifier = new BinaryNeuralNetworkClassifier();
    }
    if (!this.settings.stemmer) {
      this.settings.stemmer = NlpUtil.getStemmer(this.settings.language);
    }
    if (this.settings.keepStopWords === undefined) {
      this.settings.keepStopWords = true;
    }
    this.docs = [];
    this.features = {};
  }

  /**
   * Generate the vector of features.
   * @param {String} utterance Input utterance.
   * @returns {String[]} Vector of features.
   */
  tokenizeAndStem(utterance) {
    return typeof utterance === 'string'
      ? this.settings.stemmer.tokenizeAndStem(
          utterance,
          this.settings.keepStopWords
        )
      : utterance;
  }

  /**
   * Gets the position of a utterance for an intent.
   * @param {Object} srcUtterance Utterance to be found.
   * @param {Object} intent Intent of the utterance.
   * @returns {Number} Position of the utterance, -1 if not found.
   */
  posUtterance(srcUtterance, intent) {
    const utterance = this.tokenizeAndStem(srcUtterance);
    const utteranceStr = utterance.join(' ');
    for (let i = 0; i < this.docs.length; i += 1) {
      const doc = this.docs[i];
      if (
        doc.utterance.join(' ') === utteranceStr &&
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
   * @param {String} srcUtterance Utterance to be added.
   * @param {String} srcIntent Intent for adding the utterance.
   */
  add(srcUtterance, srcIntent) {
    if (typeof srcUtterance !== 'string') {
      throw new Error('Utterance must be an string');
    }
    if (typeof srcIntent !== 'string') {
      throw new Error('Intent must be an string');
    }
    const intent = srcIntent.trim();
    const utterance = this.tokenizeAndStem(srcUtterance);
    if (utterance.length === 0 || this.existsUtterance(utterance)) {
      return;
    }
    const doc = { intent, utterance };
    this.docs.push(doc);
    utterance.forEach(token => {
      this.features[token] = (this.features[token] || 0) + 1;
    });
  }

  /**
   * Remove an utterance from the classifier.
   * @param {String} srcUtterance Utterance to be removed.
   * @param {String} srcIntent Intent of the utterance, undefined to search all
   */
  remove(srcUtterance, srcIntent) {
    if (typeof srcUtterance !== 'string') {
      throw new Error('Utterance must be an string');
    }
    const intent = srcIntent ? srcIntent.trim() : undefined;
    const utterance = this.tokenizeAndStem(srcUtterance);
    if (utterance.length === 0) {
      return;
    }
    const pos = this.posUtterance(utterance, intent);
    if (pos !== -1) {
      this.docs.splice(pos, 1);
      utterance.forEach(token => {
        this.features[token] = this.features[token] - 1;
        if (this.features[token] <= 0) {
          delete this.features[token];
        }
      });
    }
  }

  /**
   * Given an utterance, tokenize and steam the utterance and convert it
   * to a vector of binary values, where each position is a feature (a word
   * stemmed) and the value means if the utterance has this feature.
   * The input utterance can be an string or an array of tokens.
   * @param {String} srcUtterance Utterance to be converted to features vector.
   * @returns {Number[]} Features vector of the utterance.
   */
  textToFeatures(srcUtterance) {
    const utterance = Array.isArray(srcUtterance)
      ? srcUtterance
      : this.tokenizeAndStem(srcUtterance);
    const keys = Object.keys(this.features);
    const result = [];
    keys.forEach(key => {
      result.push(utterance.indexOf(key) > -1 ? 1 : 0);
    });
    return result;
  }

  tokensToNeural(tokens) {
    const tokenFeatures = {};
    for (let i = 0; i < tokens.length; i += 1) {
      const value = Number.parseInt(tokens[i], 10);
      if (Number.isNaN(value)) {
        tokenFeatures[tokens[i]] = 1;
      } else {
        tokenFeatures['%number%'] = 1;
      }
    }
    const result = {};
    Object.keys(this.features).forEach(srcToken => {
      const value = Number.parseInt(srcToken, 10);
      const token = Number.isNaN(value) ? srcToken : '%number%';
      result[token] = tokenFeatures[token] ? 1 : 0;
    });
    return result;
  }

  /**
   * Train the classifier with the existing utterances and intents.
   */
  async train() {
    this.settings.classifier.clear();
    const corpus = [];
    this.docs.forEach(doc => {
      const tokens = this.tokenizeAndStem(doc.utterance);
      corpus.push({
        input: this.tokensToNeural(tokens),
        output: doc.intent,
      });
      this.settings.classifier.addObservation(
        this.textToFeatures(tokens),
        doc.intent
      );
    });
    if (this.settings.classifier.observationCount > 0) {
      await this.settings.classifier.train();
      if (this.settings.useNeural) {
        this.settings.neuralClassifier.trainBatch(corpus);
      }
    }
  }

  isEqualClassification(classifications) {
    for (let i = 0; i < classifications.length; i += 1) {
      if (classifications[i].value !== 0.5) {
        return false;
      }
    }
    return true;
  }

  normalizeNeural(classifications) {
    let total = 0;
    for (let i = 0; i < classifications.length; i += 1) {
      total += classifications[i].value;
    }
    if (total > 0) {
      const result = [];
      for (let i = 0; i < classifications.length; i += 1) {
        result.push({
          label: classifications[i].label,
          value: classifications[i].value / total,
        });
      }
      return result;
    }
    return classifications;
  }

  /**
   * Get all the labels and score for each label from this utterance.
   * @param {String} utterance Utterance to be classified.
   * @returns {Object[]} Sorted array of classifications, with label and score.
   */
  getClassifications(utterance) {
    const tokens = this.tokenizeAndStem(utterance);
    const classification = this.settings.classifier.getClassifications(
      this.textToFeatures(tokens)
    );
    if (this.settings.useNeural) {
      if (this.isEqualClassification(classification)) {
        return classification;
      }
      const neuralClassification = this.normalizeNeural(
        this.settings.neuralClassifier.classify(
          this.tokensToNeural(tokens),
          true
        )
      );
      const neuralIntent = neuralClassification[0].label;
      const lrcIntent = classification[0].label;
      if (neuralIntent === lrcIntent) {
        if (neuralClassification[0].value > classification[0].value) {
          return neuralClassification;
        }
        return classification;
      }
      return neuralClassification;
    }
    return classification;
  }

  /**
   * Given an utterance, get the label and score of the best classification.
   * @param {String} utterance Utterance to be classified.
   * @returns {Object} Best classification of the observation.
   */
  getBestClassification(utterance) {
    return this.settings.classifier.getBestClassification(
      this.textToFeatures(utterance)
    );
  }
}

module.exports = NlpClassifier;
