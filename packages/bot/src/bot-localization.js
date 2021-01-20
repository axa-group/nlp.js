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

class BotLocalization {
  constructor() {
    this.localizations = {};
  }

  addLocalization(locale, srckey, value) {
    const key = srckey.toLowerCase();
    if (!this.localizations[key]) {
      this.localizations[key] = {};
    }
    this.localizations[key][locale] = value;
  }

  getLocalized(locale, srckey) {
    const key = srckey.toLowerCase();
    if (!this.localizations[key]) {
      return srckey;
    }
    return (
      this.localizations[key][locale] ||
      this.localizations[key][this.fallbackLocale] ||
      srckey
    );
  }

  removeLocale(locale) {
    const keys = Object.keys(this.localizations);
    for (let i = 0; i < keys.length; i += 1) {
      delete this.localizations[keys[i]][locale];
    }
  }

  removeKey(key) {
    delete this.localizations[key];
  }

  addRule(rule) {
    if (Array.isArray(rule)) {
      for (let i = 0; i < rule.length; i += 1) {
        this.addRule(rule[i]);
      }
    } else {
      this.masterLocale = rule.masterLocale || 'en';
      this.fallbackLocale = rule.fallbackLocale || this.masterLocale;
      let key;
      for (let i = 0; i < rule.rules.length; i += 1) {
        const current = rule.rules[i].trim();
        const index = current.indexOf(' ');
        const locale = current.slice(0, index).trim();
        const sentence = current.slice(index).trim();
        if (locale === this.masterLocale) {
          key = sentence;
        }
        this.addLocalization(locale, key, sentence);
      }
    }
  }
}

module.exports = BotLocalization;
