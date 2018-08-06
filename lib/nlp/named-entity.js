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

/**
 * Class for a Named Entity that can be Enumerated or Regular Expression.
 */
class NamedEntity {
  /**
   * Constructor of the class.
   * @param {Object} settings - Settings for the instance.
   */
  constructor(settings) {
    this.settings = settings || {};
    this.name = this.settings.name;
    if (this.settings.regex) {
      this.type = 'regex';
      this.regex = this.settings.regex;
    } else {
      this.type = this.settings.type || 'enum';
    }
    if (this.type === 'enum') {
      this.options = [];
    }
  }

  /**
   * Given an option name, returns the position of the option.
   * @param {String} optionName Name of the option.
   * @return {Object} Position of the option, -1 if not found.
   */
  getOptionPosition(name) {
    if (this.options) {
      for (let i = 0; i < this.options.length; i += 1) {
        if (this.options[i].name === name) {
          return i;
        }
      }
    }
    return -1;
  }

  /**
   * Given an option name, returns the option instance from the entity.
   * If force is true, then it forces the creation.
   * @param {String} optionName Name of the option.
   * @param {boolean} force Flag to force creation.
   * @returns {Object} Option if found, undefined otherwise.
   */
  getOption(name, force = false) {
    const index = this.getOptionPosition(name);
    if (index === -1 && force === true) {
      return this.addOption(name);
    }
    return index > -1 ? this.options[index] : undefined;
  }

  /**
   * Add an option to the entity.
   * @param {String} name Name of the option.
   * @returns {Object} Option created or found.
   */
  addOption(name) {
    let option = this.getOption(name);
    if (!option) {
      option = { name, texts: {} };
      this.options.push(option);
    }
    return option;
  }

  /**
   * Remove an option from the entity.
   * @param {String} name Name of the option.
   */
  removeOption(name) {
    const index = this.getOptionPosition(name);
    if (index !== -1) {
      this.options.splice(index, 1);
    }
  }

  /**
   * Add texts to the given languages of an option.
   * @param {String} optionName Name of the option.
   * @param {String[]} srcLanguages Language or languages for adding the texts.
   * @param {String[]} srcTexts Text or texts to be added.
   */
  addText(optionName, srcLanguages, srcTexts) {
    const option = this.getOption(optionName, true);
    const languages = Array.isArray(srcLanguages) ? srcLanguages : [srcLanguages];
    const texts = Array.isArray(srcTexts) ? srcTexts : [srcTexts];
    languages.forEach((language) => {
      const optionTexts = option.texts[language];
      if (!optionTexts) {
        option.texts[language] = texts.slice();
      } else {
        texts.forEach((text) => {
          optionTexts.push(text);
        });
      }
    });
  }

  /**
   * Remove texts for the given languages of the option.
   * @param {String} optionName Name of the option.
   * @param {String[]} srcLanguages Languages affected.
   * @param {String[]} srcTexts Texts to be removed.
   */
  removeText(optionName, srcLanguages, srcTexts) {
    const option = this.getOption(optionName);
    if (!option) {
      return;
    }
    const languages = Array.isArray(srcLanguages) ? srcLanguages : [srcLanguages];
    const texts = Array.isArray(srcTexts) ? srcTexts : [srcTexts];
    languages.forEach((language) => {
      const optionTexts = option.texts[language];
      if (optionTexts) {
        texts.forEach((text) => {
          const index = optionTexts.indexOf(text);
          if (index !== -1) {
            optionTexts.splice(index, 1);
          }
        });
      }
    });
  }

  getMatchs(utterance) {
    const result = [];
    let matchFound;
    do {
      const match = this.regex.exec(utterance);
      if (match) {
        result.push({
          start: match.index,
          end: this.regex.lastIndex,
          accuracy: 1,
          sourceText: match[0],
          utteranceText: match[0],
        });
        matchFound = true;
      } else {
        matchFound = false;
      }
    } while (matchFound);
    return result;
  }
}

module.exports = NamedEntity;
