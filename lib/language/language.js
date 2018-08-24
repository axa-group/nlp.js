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

const franc = require('franc');
const languageData = require('./languages.json');

/**
 * Class for managing languages. The main purpose is to guess the language of
 * an utterance, but it also manage a list of languages indexed by both ISOs.
 */
class Language {
  /**
   * Constructor of the class.
   */
  constructor() {
    this.languagesAlpha3 = {};
    this.languagesAlpha2 = {};
    this.buildData();
  }

  /**
   * Given the data of the languages, build the indexes.
   */
  buildData() {
    for (let i = 0; i < languageData.length; i += 1) {
      const language = languageData[i];
      this.languagesAlpha3[language.alpha3] = language;
      this.languagesAlpha2[language.alpha2] = language;
    }
  }

  /**
   * Given a whitelist, iterates each language to transform
   * from iso2 to iso3 each code.
   * @param {String[]} whitelist Array of language codes in iso3 or iso2
   * @returns {String[]} Whitelist forced to iso3.
   */
  transformWhitelist(whitelist) {
    const result = [];
    for (let i = 0; i < whitelist.length; i += 1) {
      if (whitelist[i].length === 3) {
        result.push(whitelist[i]);
      } else {
        const language = this.languagesAlpha2[whitelist[i]];
        if (language) {
          result.push(language.alpha3);
        }
      }
    }
    return result;
  }

  /**
   * Given an utterance, a whitelist of iso codes and the limit of results,
   * build an array of languages scored.
   * The whitelist and the limit are optional.
   * @param {String} utterance Utterance wich we want to guess the language.
   * @param {String[]} whitelist Whitelist of accepted languages.
   * @param {Number} limit Limit of results.
   * @returns {Object[]} Array of guesses.
   */
  guess(utterance, whitelist, limit) {
    const options = {};
    if (utterance.length < 10) {
      options.minLength = utterance.length;
    }
    if (whitelist && whitelist.length && whitelist.length > 0) {
      options.whitelist = this.transformWhitelist(whitelist);
    }
    const scores = franc.all(utterance, options);
    const result = [];
    for (let i = 0; i < scores.length; i += 1) {
      const language = this.languagesAlpha3[scores[i][0]];
      if (language) {
        result.push({
          alpha3: language.alpha3,
          alpha2: language.alpha2,
          language: language.name,
          score: scores[i][1],
        });
        if (limit && result.length >= limit) {
          break;
        }
      }
    }
    return result;
  }

  /**
   * Given an utterance, a whitelist of iso codes and the limit of results,
   * return the language with the best score.
   * The whitelist is optional.
   * @param {String} utterance Utterance wich we want to guess the language.
   * @param {String[]} whitelist Whitelist of accepted languages.
   * @return {Object} Best guess.
   */
  guessBest(utterance, whitelist) {
    return this.guess(utterance, whitelist, 1)[0];
  }
}

module.exports = Language;
