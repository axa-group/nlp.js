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

const BaseNLU = require('./base-nlu');
const BrainClassifier = require('../classifiers/brain-classifier');
const NlpUtil = require('../nlp/nlp-util');

/**
 * Class for the Logistic Regression NLU
 */
class BrainNLU extends BaseNLU {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for this instance.
   */
  constructor(settings) {
    super(settings);
    if (this.settings.useNoneFeature === undefined) {
      this.settings.useNoneFeature =
        NlpUtil.useNoneFeature[this.settings.language] || false;
    }
    this.classifier = this.settings.classifier || new BrainClassifier(settings);
  }

  /**
   * Train the classifier
   */
  async train(createNetwork = true) {
    const mustTrain = this.isEditing ? this.endEdit() : true;
    if (!mustTrain) {
      return false;
    }
    this.classifier.clear();
    const input = [];
    this.docs.forEach(doc => {
      input.push({
        input: this.textToFeatures(doc.tokens),
        output: doc.intent,
      });
    });
    if (this.settings.useNoneFeature) {
      input.push({
        input: this.textToFeatures('nonefeature'),
        output: 'None',
      });
    }
    if (input.length > 0) {
      await this.classifier.trainBatch(input, createNetwork);
      return true;
    }
    return false;
  }

  /**
   * Get all the labels and score for each label from this utterance.
   * @param {String} utterance Utterance to be classified.
   * @returns {Object[]} Sorted array of classifications, with label and score.
   */
  getClassifications(utterance) {
    const tokens = this.textToFeatures(utterance);
    const whitelist = this.getWhitelist(tokens);
    if (!whitelist.includes.None) {
      whitelist.push('None');
    }
    const classifications = this.classifier.getClassifications(tokens);
    for (let i = 0; i < classifications.length; i += 1) {
      const classification = classifications[i];
      if (!whitelist.includes(classification.label)) {
        classification.value = 0;
      }
    }
    return this.normalizeNeural(classifications);
  }
}

BaseNLU.classes.BrainNLU = BrainNLU;

module.exports = BrainNLU;
