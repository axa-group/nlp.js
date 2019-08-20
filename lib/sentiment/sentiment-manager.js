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

const SentimentAnalyzer = require('./sentiment-analyzer');

/**
 * Class for the sentiment anlysis manager, able to manage
 * several different languages at the same time.
 */
class SentimentManager {
  /**
   * Constructor of the class.
   */
  constructor(settings) {
    this.settings = settings || {};
    this.languages = {};
  }

  /**
   * Adds a new analyzer by locale. If the locale analyzer already exists,
   * then return the existing one.
   * @param {String} locale Locale for the analyzer.
   * @returns {SentimentAnalyzer} Analyzer for the locale.
   */
  addLanguage(locale, settings) {
    let result = this.languages[locale];
    if (!result) {
      result = new SentimentAnalyzer({ language: locale, ...settings });
      this.languages[locale] = result;
    }
    return result;
  }

  /**
   * Process a phrase of a given locale, calculating the sentiment analysis.
   * @param {String} locale Locale of the phrase.
   * @param {String} phrase Phrase to calculate the sentiment.
   * @returns {Promise.Object} Promise sentiment analysis of the phrase.
   */
  async process(locale, phrase) {
    const analyzer = this.addLanguage(locale, this.settings);
    const sentiment = await analyzer.getSentiment(phrase);
    let vote;
    if (sentiment.score > 0) {
      vote = 'positive';
    } else if (sentiment.score < 0) {
      vote = 'negative';
    } else {
      vote = 'neutral';
    }
    return {
      score: sentiment.score,
      comparative: sentiment.comparative,
      vote,
      numWords: sentiment.numWords,
      numHits: sentiment.numHits,
      type: sentiment.type,
      language: sentiment.language,
    };
  }
}

module.exports = SentimentManager;
