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

const {
  BaseStemmer,
  Tokenizer,
  defaultContainer,
  containerBootstrap,
} = require('@nlpjs/core-loader');
const LangAll = require('@nlpjs/lang-all');

const cultures = {
  ar: 'ar-ae', // Arabic
  bn: 'bn-bd', // Bengali
  ca: 'ca-es', // Catalan
  cs: 'cs-cz', // Czech
  da: 'da-dk', // Danish
  el: 'el-gr', // Greek
  en: 'en-us', // English
  eu: 'eu-es', // Basque
  fa: 'fa-ir', // Farsi
  ga: 'ga-ie', // Irish
  gl: 'gl-es', // Galician
  hi: 'hi-in', // Hindi
  hy: 'hy-am', // Armenian
  ja: 'ja-jp', // Japanese
  ko: 'ko-kr', // Korean
  pl: 'pl-pl', // Polish
  lt: 'lt-lt', // Lithuanian
  ne: 'ne-ne', // Nepali
  pt: 'pt-br', // Portuguese
  sr: 'sr-rs', // Serbian
  sv: 'sv-se', // Swedish
  ta: 'ta-in', // Tamil
  tl: 'tl-ph', // Tagalog
  uk: 'uk-ua', // Ukraine
  zh: 'zh-cn', // Chinese
  id: 'id-id', // Indonesian,
  ms: 'id-id', // Malay
};

class NlpUtil {
  /**
   * Given a locale, get the 2 character one.
   * @param {String} locale Locale of the language.
   * @returns {String} Locale in 2 character length.
   */
  static getTruncatedLocale(locale) {
    return locale ? locale.substr(0, 2).toLowerCase() : undefined;
  }

  static getStemmer(locale) {
    if (!locale) {
      return new BaseStemmer();
    }
    const name = `Stemmer${locale.slice(0, 1).toUpperCase()}${locale.slice(1)}`;
    const Stemmer = LangAll[name];
    return Stemmer ? new Stemmer() : new BaseStemmer();
  }

  static getTokenizer(locale) {
    if (!locale) {
      return new Tokenizer();
    }
    const name = `Tokenizer${locale.slice(0, 1).toUpperCase()}${locale.slice(
      1
    )}`;
    const TokenizerClass = LangAll[name];
    return TokenizerClass
      ? new TokenizerClass(undefined, true)
      : new Tokenizer(undefined, true);
  }

  static getCulture(locale) {
    if (!locale) {
      return 'en-us';
    }
    return cultures[locale] || `${locale}-${locale}`;
  }
}

NlpUtil.useAutoStemmer = true;
NlpUtil.autoStemmers = {};

NlpUtil.useAlternative = {};

NlpUtil.useNoneFeature = {
  bn: false,
  el: true,
  en: true,
  hi: false,
  fa: false,
  fr: true,
  ru: true,
  es: true,
  gl: true,
  it: true,
  nl: true,
  no: true,
  pt: true,
  pl: true,
  sv: true,
  tl: true,
  id: true,
  ja: false,
  ar: false,
  hy: false,
  eu: true,
  ca: true,
  cs: true,
  da: true,
  fi: true,
  de: true,
  hu: true,
  ga: true,
  ro: true,
  sl: true,
  ta: false,
  th: false,
  tr: true,
  zh: false,
};

NlpUtil.tokenizers = {};

containerBootstrap({}, true, defaultContainer);
defaultContainer.use(LangAll.LangAll);

module.exports = NlpUtil;
