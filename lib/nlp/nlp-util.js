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

const Natural = require('natural');
const AggressiveTokenizerId = require('natural/lib/natural/tokenizers/aggressive_tokenizer_id');
const ArabicStemmer = require('./stemmers/arabic-stemmer');
const BasqueStemmer = require('./stemmers/basque-stemmer');
const CatalanStemmer = require('./stemmers/catalan-stemmer');
const ChineseStemmer = require('./stemmers/chinese-stemmer');
const ChineseTokenizer = require('./tokenizers/chinese-tokenizer');
const DanishStemmer = require('./stemmers/danish-stemmer');
const DutchStemmer = require('./stemmers/dutch-stemmer');
const EnglishStemmer = require('./stemmers/english-stemmer');
const FinnishStemmer = require('./stemmers/finnish-stemmer');
const FrenchStemmer = require('./stemmers/french-stemmer');
const GermanStemmer = require('./stemmers/german-stemmer');
const HungarianStemmer = require('./stemmers/hungarian-stemmer');
const IrishStemmer = require('./stemmers/irish-stemmer');
const ItalianStemmer = require('./stemmers/italian-stemmer');
const NorwegianStemmer = require('./stemmers/norwegian-stemmer');
const PortugueseStemmer = require('./stemmers/portuguese-stemmer');
const PunctTokenizer = require('./tokenizers/punct-tokenizer');
const RomanianStemmer = require('./stemmers/romanian-stemmer');
const RussianStemmer = require('./stemmers/russian-stemmer');
const SpanishStemmer = require('./stemmers/spanish-stemmer');
const SwedishStemmer = require('./stemmers/swedish-stemmer');
const TurkishStemmer = require('./stemmers/turkish-stemmer');

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
    switch (locale) {
      case 'en': // English
        if (NlpUtil.useAlternative[locale]) {
          return new EnglishStemmer(NlpUtil.getTokenizer(locale));
        }
        return Natural.PorterStemmer;
      case 'fa': // Farsi
        return Natural.PorterStemmerFa;
      case 'fr': // French
        if (NlpUtil.useAlternative[locale]) {
          return new FrenchStemmer(NlpUtil.getTokenizer(locale));
        }
        return Natural.PorterStemmerFr; // French
      case 'ru': // Russian
        if (NlpUtil.useAlternative[locale]) {
          return new RussianStemmer(NlpUtil.getTokenizer(locale));
        }
        return Natural.PorterStemmerRu;
      case 'es': // Spanish
        if (NlpUtil.useAlternative[locale]) {
          return new SpanishStemmer(NlpUtil.getTokenizer(locale));
        }
        return Natural.PorterStemmerEs;
      case 'it': // Italian
        if (NlpUtil.useAlternative[locale]) {
          return new ItalianStemmer(NlpUtil.getTokenizer(locale));
        }
        return Natural.PorterStemmerIt;
      case 'no': // Norwegian
        if (NlpUtil.useAlternative[locale]) {
          return new NorwegianStemmer(NlpUtil.getTokenizer(locale));
        }
        return Natural.PorterStemmerNo;
      case 'pt': // Portuguese
        if (NlpUtil.useAlternative[locale]) {
          return new PortugueseStemmer(NlpUtil.getTokenizer(locale));
        }
        return Natural.PorterStemmerPt;
      case 'sv': // Swedish
        if (NlpUtil.useAlternative[locale]) {
          return new SwedishStemmer(NlpUtil.getTokenizer(locale));
        }
        return Natural.PorterStemmerSv;
      case 'nl': // Dutch
        if (NlpUtil.useAlternative[locale]) {
          return new DutchStemmer(NlpUtil.getTokenizer(locale));
        }
        return Natural.PorterStemmerNl;
      case 'id': return Natural.StemmerId; // Indonesian
      case 'ja': return new Natural.StemmerJa(); // Japanese
      case 'ar': return new ArabicStemmer(NlpUtil.getTokenizer(locale)); // Arabic
      case 'eu': return new BasqueStemmer(NlpUtil.getTokenizer(locale)); // Basque
      case 'ca': return new CatalanStemmer(NlpUtil.getTokenizer(locale)); // Catalan
      case 'da': return new DanishStemmer(NlpUtil.getTokenizer(locale)); // Danish
      case 'fi': return new FinnishStemmer(NlpUtil.getTokenizer(locale)); // Finnish
      case 'de': return new GermanStemmer(NlpUtil.getTokenizer(locale)); // German
      case 'hu': return new HungarianStemmer(NlpUtil.getTokenizer(locale)); // Hungarian
      case 'ga': return new IrishStemmer(NlpUtil.getTokenizer(locale)); // Irish
      case 'ro': return new RomanianStemmer(NlpUtil.getTokenizer(locale)); // Romanian
      case 'tr': return new TurkishStemmer(NlpUtil.getTokenizer(locale)); // Turkish
      case 'zh': return new ChineseStemmer(); // Chinese

      default: return Natural.PorterStemmer;
    }
  }

  static getTokenizer(locale) {
    switch (locale) {
      case 'en': return new Natural.AggressiveTokenizer(); // English
      case 'fa': return new Natural.AggressiveTokenizerFa(); // Farsi
      case 'fr': return new Natural.AggressiveTokenizerFr(); // French
      case 'ru': return new Natural.AggressiveTokenizerRu(); // Russian
      case 'es': return new Natural.AggressiveTokenizerEs(); // Spanish
      case 'it': return new Natural.AggressiveTokenizerIt(); // Italian
      case 'nl': return new Natural.AggressiveTokenizerNl(); // Dutch
      case 'no': return new Natural.AggressiveTokenizerNo(); // Norwegian
      case 'pt': return new Natural.AggressiveTokenizerPt(); // Portuguese
      case 'pl': return new Natural.AggressiveTokenizerPl(); // Polish
      case 'sv': return new Natural.AggressiveTokenizerSv(); // Swedish
      case 'id': return new AggressiveTokenizerId(); // Indonesian
      case 'ja': return new Natural.TokenizerJa(); // Japanese

      case 'ar': return new PunctTokenizer(); // Arabic
      case 'eu': return new PunctTokenizer(); // Basque
      case 'ca': return new PunctTokenizer(); // Catalan
      case 'da': return new PunctTokenizer(); // Danish
      case 'fi': return new PunctTokenizer(); // Finnish
      case 'de': return new PunctTokenizer(); // German
      case 'hu': return new PunctTokenizer(); // Hungarian
      case 'ga': return new PunctTokenizer(); // Irish
      case 'ro': return new PunctTokenizer(); // Romanian
      case 'tr': return new PunctTokenizer(); // Turkish
      case 'zh': return new ChineseTokenizer(); // Chinese

      default: return new PunctTokenizer();
    }
  }

  static getCulture(locale) {
    switch (locale) {
      case 'en': return 'en-us'; // English
      case 'fa': return 'fa-ir'; // Farsi
      case 'fr': return 'fr-fr'; // French
      case 'ru': return 'ru-ru'; // Russian
      case 'es': return 'es-es'; // Spanish
      case 'it': return 'it-it'; // Italian
      case 'nl': return 'nl-nl'; // Dutch
      case 'no': return 'no-no'; // Norwegian
      case 'pt': return 'pt-br'; // Portuguese
      case 'pl': return 'pl-pl'; // Polish
      case 'sv': return 'sv-se'; // Swedish
      case 'id': return 'id-id'; // Indonesian
      case 'ja': return 'ja-jp'; // Japanese

      case 'ar': return 'ar-ae'; // Arabic
      case 'eu': return 'eu-es'; // Basque
      case 'ca': return 'ca-es'; // Catalan
      case 'da': return 'da-dk'; // Danish
      case 'fi': return 'fi-fi'; // Finnish
      case 'de': return 'de-de'; // German
      case 'hu': return 'hu-hu'; // Hungarian
      case 'ga': return 'ga-ie'; // Irish
      case 'ro': return 'ro-ro'; // Romanian
      case 'tr': return 'tr-tr'; // Turkish

      case 'zh': return 'zh-cn'; // Chinese

      default: return 'en-us';
    }
  }
}

NlpUtil.useAlternative = {
  en: false,
  fa: false,
  fr: false,
  ru: false,
  es: false,
  it: false,
  nl: false,
  no: false,
  pt: false,
  pl: false,
  sv: false,
  id: false,
  ja: false,
  ca: false,
  da: false,
  fi: false,
  de: false,
  hu: false,
  ro: false,
  tr: false,
};

module.exports = NlpUtil;
