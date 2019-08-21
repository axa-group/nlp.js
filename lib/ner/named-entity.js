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
    this.type = 'unknown';
    this.name = this.settings.name;
    this.locales = {};
    this.localeFallback = {
      '*': 'en',
      ...this.settings.localeFallback,
    };
  }

  /**
   * Given a locale, return the rules for this locale with locale fallback.
   * @param {string} locale Locale to retrieve the rules.
   * @returns {Object} Rules for this locale.
   */
  getLocaleRules(locale) {
    let result = this.locales[locale];
    if (!result && this.localeFallback[locale]) {
      result = this.locales[this.localeFallback[locale]];
    }
    if (!result) {
      result = this.locales[this.localeFallback['*']];
    }
    return result;
  }

  /**
   * Get or create a locale.
   * @param {string} locale Locale of the language.
   * @param {boolean} create Flag indicating if should create if not exists.
   * @returns {Object} Locale object.
   */
  getLocale(locale, create = true) {
    if (!this.locales[locale] && create) {
      this.locales[locale] = {};
    }
    return this.locales[locale];
  }

  /**
   * Given an utterance extract Named entity occurances from this utterance.
   */
  extract() {
    throw new Error('Not implemented');
  }
}

module.exports = NamedEntity;
