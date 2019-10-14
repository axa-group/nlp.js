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

const NamedEntity = require('./named-entity');

/**
 * Class for the Enumerated Named Entity.
 */
class RegexNamedEntity extends NamedEntity {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for the instance.
   */
  constructor(settings) {
    super(settings);
    this.type = 'regex';
  }

  /**
   * Assign a regular expression for the given languages
   * @param {String[]} srcLanguages Target languages
   * @param {RegExp} regex Regular expression.
   */
  addRegex(srcLanguages, regex) {
    const globalFlag = 'g';
    const languages = Array.isArray(srcLanguages)
      ? srcLanguages
      : [srcLanguages];
    const fixedRegex = regex.flags.includes(globalFlag)
      ? regex
      : new RegExp(regex.source, `${regex.flags}${globalFlag}`);

    languages.forEach(language => {
      const locale = this.getLocale(language);
      locale.regex = fixedRegex;
    });
  }

  /**
   * Adds a regular expression from a string.
   * @param {String[]} srcLanguages Array of languages.
   * @param {String} regex Regular expression as string.
   */
  addStrRegex(srcLanguages, regex) {
    this.addRegex(srcLanguages, RegexNamedEntity.str2regex(regex));
  }

  /**
   * Get the matchs of the regular expression over the utterance.
   * @param {String} utterance Input utterance.
   * @param {RegExp} regex Regular expression.
   * @returns {Object[]} Edges found.
   */
  getMatchs(utterance, regex) {
    const result = [];
    let matchFound;
    do {
      const match = regex.exec(utterance);
      if (match) {
        result.push({
          start: match.index,
          end: regex.lastIndex,
          accuracy: 1,
          sourceText: match[0],
          utteranceText: match[0],
          entity: this.name,
        });
        matchFound = true;
      } else {
        matchFound = false;
      }
    } while (matchFound);
    return result;
  }

  /**
   * Extract edges of an utterance.
   * @param {String} utterance Input utterance.
   * @param {String} language Language of the utterance.
   * @returns {Object[]} Edges extracted.
   */
  extract(utterance, language) {
    const result = [];
    const locale = this.getLocaleRules(language);
    if (!locale) {
      return result;
    }
    return this.getMatchs(utterance, locale.regex);
  }

  /**
   * Transforms a string to a regular expression.
   * @param {String} str String to be converted.
   * @returns {RegExp} Regular expression.
   */
  static str2regex(str) {
    const index = str.lastIndexOf('/');
    return new RegExp(str.slice(1, index), str.slice(index + 1));
  }

  /**
   * Transforms a regular expression to a string.
   * @param {RegExp} regex Regular expression.
   * @returns {String} String representing the regular expression.
   */
  static regex2str(regex) {
    return regex.toString();
  }
}

module.exports = RegexNamedEntity;
