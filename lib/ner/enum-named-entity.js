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
class EnumNamedEntity extends NamedEntity {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for the instance.
   */
  constructor(settings) {
    super(settings);
    this.type = 'enum';
  }

  /**
   * Get or create an option inside a locale
   * @param {string} language Locale of the language.
   * @param {string} optionName Name of the option.
   * @param {boolean} create Flag indicating if should create if not exists.
   * @returns {Object} Option object.
   */
  getOption(language, optionName, create = true) {
    const locale = this.getLocale(language, create);
    if (!locale) {
      return undefined;
    }
    if (!locale[optionName] && create) {
      locale[optionName] = [];
    }
    return locale[optionName];
  }

  /**
   * Add texts to the given languages of an option.
   * @param {String} optionName Name of the option.
   * @param {String[]} srcLanguages Language or languages for adding the texts.
   * @param {String[]} srcTexts Text or texts to be added.
   */
  addText(optionName, srcLanguages, srcTexts) {
    const languages = Array.isArray(srcLanguages)
      ? srcLanguages
      : [srcLanguages];
    const texts = Array.isArray(srcTexts) ? srcTexts : [srcTexts];
    languages.forEach(language => {
      const option = this.getOption(language, optionName);
      texts.forEach(text => {
        option.push(text);
      });
    });
  }

  /**
   * Remove texts for the given languages of the option.
   * @param {String} optionName Name of the option.
   * @param {String[]} srcLanguages Languages affected.
   * @param {String[]} srcTexts Texts to be removed.
   */
  removeText(optionName, srcLanguages, srcTexts) {
    const languages = Array.isArray(srcLanguages)
      ? srcLanguages
      : [srcLanguages];
    const texts = Array.isArray(srcTexts) ? srcTexts : [srcTexts];
    languages.forEach(language => {
      const option = this.getOption(language, optionName, false);
      if (option) {
        texts.forEach(text => {
          const index = option.indexOf(text);
          if (index !== -1) {
            option.splice(index, 1);
          }
        });
      }
    });
  }

  /**
   * Given an utterance and language, extract the different occurances of this
   * named entity in the utterance.
   * @param {String} utterance Source utterance to extract information.
   * @param {String} language Locale of the language.
   * @param {Object} similar Instance of SimilarSearch.
   * @param {Object[]} wordPositions Optional array of word positions.
   * @param {number} threshold Threshold of accuracy.
   * @return {Object[]} Edges found.
   */
  extract(utterance, language, similar, wordPositions, threshold) {
    return similar.getEdgesFromEntity(
      utterance,
      this,
      language,
      this.name,
      threshold,
      wordPositions
    );
  }
}

module.exports = EnumNamedEntity;
