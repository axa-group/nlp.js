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

const ArabicStemmer = require('./stemmers/arabic-stemmer');
const ArmenianStemmer = require('./stemmers/armenian-stemmer');
const BasqueStemmer = require('./stemmers/basque-stemmer');
const CatalanStemmer = require('./stemmers/catalan-stemmer');
const CzechStemmer = require('./stemmers/czech-stemmer');
const DanishStemmer = require('./stemmers/danish-stemmer');
const DutchStemmer = require('./stemmers/dutch-stemmer');
const EnglishStemmer = require('./stemmers/english-stemmer');
const FinnishStemmer = require('./stemmers/finnish-stemmer');
const FrenchStemmer = require('./stemmers/french-stemmer');
const GalicianStemmer = require('./stemmers/galician-stemmer');
const GermanStemmer = require('./stemmers/german-stemmer');
const HungarianStemmer = require('./stemmers/hungarian-stemmer');
const IrishStemmer = require('./stemmers/irish-stemmer');
const ItalianStemmer = require('./stemmers/italian-stemmer');
const NorwegianStemmer = require('./stemmers/norwegian-stemmer');
const PortugueseStemmer = require('./stemmers/portuguese-stemmer');
const PunctTokenizer = require('./tokenizers/punct-tokenizer');
const RomanianStemmer = require('./stemmers/romanian-stemmer');
const RussianStemmer = require('./stemmers/russian-stemmer');
const SloveneStemmer = require('./stemmers/slovene-stemmer');
const SpanishStemmer = require('./stemmers/spanish-stemmer');
const SwedishStemmer = require('./stemmers/swedish-stemmer');
const TagalogStemmer = require('./stemmers/tagalog-stemmer');
const TamilStemmer = require('./stemmers/tamil-stemmer');
const TokenizeStemmer = require('./stemmers/tokenize-stemmer');
const TurkishStemmer = require('./stemmers/turkish-stemmer');
const PorterStemmer = require('./stemmers/natural/porter-stemmer');
const PorterStemmerEs = require('./stemmers/natural/porter-stemmer-es');
const PorterStemmerFa = require('./stemmers/natural/porter-stemmer-fa');
const PorterStemmerFr = require('./stemmers/natural/porter-stemmer-fr');
const PorterStemmerRu = require('./stemmers/natural/porter-stemmer-ru');
const PorterStemmerIt = require('./stemmers/natural/porter-stemmer-it');
const PorterStemmerNo = require('./stemmers/natural/porter-stemmer-no');
const PorterStemmerPt = require('./stemmers/natural/porter-stemmer-pt');
const PorterStemmerSv = require('./stemmers/natural/porter-stemmer-sv');
const PorterStemmerNl = require('./stemmers/natural/porter-stemmer-nl');
const StemmerJa = require('./stemmers/natural/stemmer-ja');
const {
  AggressiveTokenizerEn,
  AggressiveTokenizerFa,
  AggressiveTokenizerFr,
  AggressiveTokenizerRu,
  AggressiveTokenizerEs,
  AggressiveTokenizerGl,
  AggressiveTokenizerId,
  AggressiveTokenizerIt,
  AggressiveTokenizerNl,
  AggressiveTokenizerNo,
  AggressiveTokenizerPt,
  AggressiveTokenizerPl,
  AggressiveTokenizerSv,
  AggressiveTokenizerTl,
  TokenizerJa,
} = require('./tokenizers');

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
        return PorterStemmer;
      case 'fa': // Farsi
        return PorterStemmerFa;
      case 'fr': // French
        if (NlpUtil.useAlternative[locale]) {
          return new FrenchStemmer(NlpUtil.getTokenizer(locale));
        }
        return PorterStemmerFr; // French
      case 'ru': // Russian
        if (NlpUtil.useAlternative[locale]) {
          return new RussianStemmer(NlpUtil.getTokenizer(locale));
        }
        return PorterStemmerRu;
      case 'es': // Spanish
        if (NlpUtil.useAlternative[locale]) {
          return new SpanishStemmer(NlpUtil.getTokenizer(locale));
        }
        return PorterStemmerEs;
      case 'gl': // Galician
        return new GalicianStemmer(NlpUtil.getTokenizer(locale));
      case 'it': // Italian
        if (NlpUtil.useAlternative[locale]) {
          return new ItalianStemmer(NlpUtil.getTokenizer(locale));
        }
        return PorterStemmerIt;
      case 'no': // Norwegian
        if (NlpUtil.useAlternative[locale]) {
          return new NorwegianStemmer(NlpUtil.getTokenizer(locale));
        }
        return PorterStemmerNo;
      case 'pt': // Portuguese
        if (NlpUtil.useAlternative[locale]) {
          return new PortugueseStemmer(NlpUtil.getTokenizer(locale));
        }
        return PorterStemmerPt;
      case 'sv': // Swedish
        if (NlpUtil.useAlternative[locale]) {
          return new SwedishStemmer(NlpUtil.getTokenizer(locale));
        }
        return PorterStemmerSv;
      case 'tl': // Tagalog
        return new TagalogStemmer(NlpUtil.getTokenizer(locale));
      case 'nl': // Dutch
        if (NlpUtil.useAlternative[locale]) {
          return new DutchStemmer(NlpUtil.getTokenizer(locale));
        }
        return PorterStemmerNl;
      case 'ja':
        return new StemmerJa(); // Japanese
      case 'ar':
        return new ArabicStemmer(NlpUtil.getTokenizer(locale)); // Arabic
      case 'hy':
        return new ArmenianStemmer(NlpUtil.getTokenizer(locale)); // Armenian
      case 'eu':
        return new BasqueStemmer(NlpUtil.getTokenizer(locale)); // Basque
      case 'ca':
        return new CatalanStemmer(NlpUtil.getTokenizer(locale)); // Catalan
      case 'cs':
        return new CzechStemmer(NlpUtil.getTokenizer(locale)); // Czech
      case 'da':
        return new DanishStemmer(NlpUtil.getTokenizer(locale)); // Danish
      case 'fi':
        return new FinnishStemmer(NlpUtil.getTokenizer(locale)); // Finnish
      case 'de':
        return new GermanStemmer(NlpUtil.getTokenizer(locale)); // German
      case 'hu':
        return new HungarianStemmer(NlpUtil.getTokenizer(locale)); // Hungarian
      case 'ga':
        return new IrishStemmer(NlpUtil.getTokenizer(locale)); // Irish
      case 'ro':
        return new RomanianStemmer(NlpUtil.getTokenizer(locale)); // Romanian
      case 'sl':
        return new SloveneStemmer(NlpUtil.getTokenizer(locale)); // Slovene
      case 'ta':
        return new TamilStemmer(NlpUtil.getTokenizer(locale)); // Tamil
      case 'tr':
        return new TurkishStemmer(NlpUtil.getTokenizer(locale)); // Turkish

      default:
        return new TokenizeStemmer(NlpUtil.getTokenizer(locale));
    }
  }

  static getTokenizer(locale) {
    switch (locale) {
      case 'en':
        return new AggressiveTokenizerEn(); // English
      case 'fa':
        return new AggressiveTokenizerFa(); // Farsi
      case 'fr':
        return new AggressiveTokenizerFr(); // French
      case 'ru':
        return new AggressiveTokenizerRu(); // Russian
      case 'es':
        return new AggressiveTokenizerEs(); // Spanish
      case 'gl':
        return new AggressiveTokenizerGl(); // Galician
      case 'it':
        return new AggressiveTokenizerIt(); // Italian
      case 'nl':
        return new AggressiveTokenizerNl(); // Dutch
      case 'no':
        return new AggressiveTokenizerNo(); // Norwegian
      case 'pt':
        return new AggressiveTokenizerPt(); // Portuguese
      case 'pl':
        return new AggressiveTokenizerPl(); // Polish
      case 'sv':
        return new AggressiveTokenizerSv(); // Swedish
      case 'tl':
        return new AggressiveTokenizerTl(); // Tagalog
      case 'id':
        return new AggressiveTokenizerId(); // Indonesian
      case 'ja':
        return new TokenizerJa(); // Japanese
      case 'ar':
        return new PunctTokenizer(); // Arabic
      case 'hy':
        return new PunctTokenizer(); // Armenian
      case 'eu':
        return new PunctTokenizer(); // Basque
      case 'ca':
        return new PunctTokenizer(); // Catalan
      case 'cs':
        return new PunctTokenizer(); // Czech
      case 'da':
        return new PunctTokenizer(); // Danish
      case 'fi':
        return new PunctTokenizer(); // Finnish
      case 'de':
        return new PunctTokenizer(); // German
      case 'hu':
        return new PunctTokenizer(); // Hungarian
      case 'ga':
        return new PunctTokenizer(); // Irish
      case 'ro':
        return new PunctTokenizer(); // Romanian
      case 'sl':
        return new PunctTokenizer(); // Slovene
      case 'ta':
        return new PunctTokenizer(); // Tamil
      case 'tr':
        return new PunctTokenizer(); // Turkish

      default:
        return NlpUtil.tokenizers[locale] || new PunctTokenizer();
    }
  }

  static getCulture(locale) {
    switch (locale) {
      case 'en':
        return 'en-us'; // English
      case 'fa':
        return 'fa-ir'; // Farsi
      case 'fr':
        return 'fr-fr'; // French
      case 'ru':
        return 'ru-ru'; // Russian
      case 'es':
        return 'es-es'; // Spanish
      case 'gl':
        return 'gl-es'; // Galician
      case 'it':
        return 'it-it'; // Italian
      case 'nl':
        return 'nl-nl'; // Dutch
      case 'no':
        return 'no-no'; // Norwegian
      case 'pt':
        return 'pt-br'; // Portuguese
      case 'pl':
        return 'pl-pl'; // Polish
      case 'sv':
        return 'sv-se'; // Swedish
      case 'tl':
        return 'tl-ph'; // Tagalog
      case 'id':
        return 'id-id'; // Indonesian
      case 'ja':
        return 'ja-jp'; // Japanese

      case 'ar':
        return 'ar-ae'; // Arabic
      case 'hy':
        return 'hy-am'; // Armenian
      case 'eu':
        return 'eu-es'; // Basque
      case 'ca':
        return 'ca-es'; // Catalan
      case 'cs':
        return 'cs-cz'; // Czech
      case 'da':
        return 'da-dk'; // Danish
      case 'fi':
        return 'fi-fi'; // Finnish
      case 'de':
        return 'de-de'; // German
      case 'hu':
        return 'hu-hu'; // Hungarian
      case 'ga':
        return 'ga-ie'; // Irish
      case 'ro':
        return 'ro-ro'; // Romanian
      case 'sl':
        return 'sl-sl'; // Slovene
      case 'ta':
        return 'ta-in'; // Tamil
      case 'tr':
        return 'tr-tr'; // Turkish

      case 'zh':
        return 'zh-cn'; // Chinese

      default:
        return locale ? `${locale}-${locale}` : 'en-us';
    }
  }
}

NlpUtil.useAlternative = {
  en: true,
  fa: false,
  fr: false,
  ru: false,
  es: false,
  gl: false,
  it: false,
  nl: false,
  no: false,
  pt: false,
  pl: false,
  sv: false,
  tl: false,
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

NlpUtil.useNoneFeature = {
  en: true,
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
  tr: true,
  zh: false,
};

NlpUtil.tokenizers = {};

module.exports = NlpUtil;
