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

const Evaluator = require('../util/evaluator');

/**
 * Natural Language Generator Manager
 */
class NlgManager {
  /**
   * Constructor of the class
   */
  constructor() {
    this.evaluator = new Evaluator();
    this.responses = {};
  }

  /**
   * Evaluate the condition using the context, and return true
   * if the condition is passed, false otherwise.
   * @param {String} condition Condition to be evaluated.
   * @param {Object} context Context to use to validate the condition.
   * @returns {boolean} True if the condition is passed, false otherwise.
   */
  isValid(condition, context) {
    return (
      !condition ||
      condition === '' ||
      this.evaluator.evaluate(condition, context) === true
    );
  }

  /**
   * Find all valid answers for the given locale and intent.
   * @param {String} locale Locale of the intent.
   * @param {String} intent Intent name.
   * @param {Object} context Context to evaluate conditions.
   */
  findAllAnswers(locale, intent, context) {
    if (!this.responses[locale]) {
      return [];
    }
    const answers = this.responses[locale][intent];
    if (!answers || answers.length === 0) {
      return [];
    }
    return answers.filter(answer => this.isValid(answer.condition, context));
  }

  /**
   * Find one valid answers for the given locale and intent. If there are
   * more than one valid answer, then return one of them at random.
   * @param {String} locale Locale of the intent.
   * @param {String} intent Intent name.
   * @param {Object} context Context to evaluate conditions.
   */
  findAnswer(locale, intent, context) {
    const result = this.findAllAnswers(locale, intent, context);
    if (result.length === 0) {
      return undefined;
    }
    if (result.length === 1) {
      return result[0];
    }
    return result[Math.floor(Math.random() * result.length)];
  }

  /**
   * Finds the index of an answer.
   * @param {String} locale Locale of the answer.
   * @param {String} intent Intent of the answer.
   * @param {String} answer Text of the answer.
   * @param {String} condition Condition of the answer.
   * @returns {number} Index of the answer, -1 if not found.
   */
  indexOfAnswer(locale, intent, answer, condition) {
    if (!this.responses[locale]) {
      return -1;
    }
    if (!this.responses[locale][intent]) {
      return -1;
    }
    for (let i = 0; i < this.responses[locale][intent].length; i += 1) {
      const response = this.responses[locale][intent][i];
      if (response.response === answer && response.condition === condition) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Adds an answer for a locale and intent.
   * @param {String} locale Locale of the intent.
   * @param {String} intent Intent name.
   * @param {String} answer Text of the answer.
   * @param {String} condition Condition to be evaluated.
   * @param {String} media url to use.
   */
  addAnswer(locale, intent, answer, condition, url) {
    if (this.indexOfAnswer(locale, intent, answer, condition) !== -1) {
      return;
    }
    if (!this.responses[locale]) {
      this.responses[locale] = {};
    }
    if (!this.responses[locale][intent]) {
      this.responses[locale][intent] = [];
    }
    this.responses[locale][intent].push({
      condition,
      response: answer,
      media: url,
    });
  }

  /**
   * Remove and answer from a locale and intent.
   * @param {String} locale Locale of the intent.
   * @param {String} intent Intent name.
   * @param {String} answer Text of the answer.
   * @param {String} condition Condition to be evaluated.
   * @param {String} media url to use.
   */
  removeAnswer(locale, intent, answer, condition, url) {
    const index = this.indexOfAnswer(locale, intent, answer, condition, url);
    if (index !== -1) {
      this.responses[locale][intent].splice(index, 1);
    }
  }
}

module.exports = NlgManager;
