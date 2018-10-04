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
 * Class for a Sentiment Analyzer.
 * Sentiment analysis can use 3 different type of files:
 * - AFINN
 * - Senticon
 * - Pattern
 */
class SentimentAnalyzer {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings to initialize the instance.
   */
  constructor(settings) {
    this.settings = settings || {};
    if (!this.settings.language) {
      this.settings.language = 'en';
    }
    if (!this.settings.tokenizer) {
      this.settings.tokenizer = NlpUtil.getTokenizer(this.settings.language);
    }
    if (!this.settings.type) {
      switch (this.settings.language) {
        case 'en':
          this.settings.type = 'senticon';
          break;
        case 'es':
          this.settings.type = 'senticon';
          break;
        case 'it':
          this.settings.type = 'pattern';
          break;
        case 'fr':
          this.settings.type = 'pattern';
          break;
        case 'nl':
          this.settings.type = 'pattern';
          break;
        case 'de':
          this.settings.type = 'senticon';
          break;
        default:
          this.settings.type = 'senticon';
      }
    }
    if (!SentimentAnalyzer.loadedFiles) {
      SentimentAnalyzer.loadedFiles = {};
    }
    this.loadVocabulary();
  }

  /**
   * Load the vocabulary and negation files based on the type of files and language.
   */
  loadVocabulary() {
    this.vocabularyFileName = `./languages/${this.settings.language}/${
      this.settings.type
    }_${this.settings.language}.json`;
    this.negationFileName = `./languages/${this.settings.language}/negations_${
      this.settings.language
    }.json`;
    try {
      // eslint-disable-next-line
      this.vocabulary = require(this.vocabularyFileName);
    } catch (ex) {
      this.vocabulary = undefined;
    }
    if (
      this.vocabulary &&
      !SentimentAnalyzer.loadedFiles[this.vocabularyFileName]
    ) {
      SentimentAnalyzer.loadedFiles[this.vocabularyFileName] = true;
      if (
        this.settings.type === 'senticon' ||
        this.settings.type === 'pattern'
      ) {
        const propertyName =
          this.settings.type === 'senticon' ? 'pol' : 'polarity';
        Object.keys(this.vocabulary).forEach(word => {
          this.vocabulary[word] = Number.parseFloat(
            this.vocabulary[word][propertyName]
          );
        });
      }
    }
    try {
      // eslint-disable-next-line
      this.negations = require(this.negationFileName).words || [];
    } catch (ex) {
      this.negations = [];
    }
  }

  /**
   * Given an utterance, return the sentiment analysis of the utterance.
   * @param {String} utterance Utterance to be analyzed.
   */
  getSentiment(utterance) {
    const words = Array.isArray(utterance)
      ? utterance
      : this.settings.tokenizer.tokenize(utterance);
    if (!this.vocabulary) {
      return {
        score: 0,
        numWords: words.length,
        numHits: 0,
        comparative: 0,
        type: this.settings.type,
        language: this.settings.language,
      };
    }
    let score = 0;
    let negator = 1;
    let nrHits = 0;
    words.forEach(token => {
      const lowerCased = token.toLowerCase();
      if (this.negations.indexOf(lowerCased) !== -1) {
        negator = -1;
        nrHits += 1;
      } else if (this.vocabulary[lowerCased] !== undefined) {
        score += negator * this.vocabulary[lowerCased];
        nrHits += 1;
      }
    });
    return {
      score,
      numWords: words.length,
      numHits: nrHits,
      comparative: score / words.length,
      type: this.settings.type,
      language: this.settings.language,
    };
  }
}

module.exports = SentimentAnalyzer;
