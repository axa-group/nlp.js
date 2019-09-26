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

const PunctTokenizer = require('../../lib/nlp/tokenizers/punct-tokenizer');
const { NlpUtil } = require('../../lib');
const PorterStemmer = require('../../lib/nlp/stemmers/natural/porter-stemmer');
const PorterStemmerFa = require('../../lib/nlp/stemmers/natural/porter-stemmer-fa');
const PorterStemmerFr = require('../../lib/nlp/stemmers/natural/porter-stemmer-fr');
const PorterStemmerRu = require('../../lib/nlp/stemmers/natural/porter-stemmer-ru');
const PorterStemmerIt = require('../../lib/nlp/stemmers/natural/porter-stemmer-it');
const PorterStemmerNo = require('../../lib/nlp/stemmers/natural/porter-stemmer-no');
const PorterStemmerPt = require('../../lib/nlp/stemmers/natural/porter-stemmer-pt');
const PorterStemmerSv = require('../../lib/nlp/stemmers/natural/porter-stemmer-sv');
const PorterStemmerNl = require('../../lib/nlp/stemmers/natural/porter-stemmer-nl');
const StemmerJa = require('../../lib/nlp/stemmers/natural/stemmer-ja');
const StemmerId = require('../../lib/nlp/stemmers/natural/indonesian/stemmer_id');
const TokenizeStemmer = require('../../lib/nlp/stemmers/tokenize-stemmer');
const AutoStemmer = require('../../lib/nlp/stemmers/auto-stemmer');
const {
  AggressiveTokenizer,
  AggressiveTokenizerFa,
  AggressiveTokenizerFr,
  AggressiveTokenizerRu,
  AggressiveTokenizerEs,
  AggressiveTokenizerIt,
  AggressiveTokenizerNl,
  AggressiveTokenizerNo,
  AggressiveTokenizerPt,
  AggressiveTokenizerPl,
  AggressiveTokenizerSv,
  DefaultTokenizer,
  TokenizerJa,
} = require('../../lib/nlp/tokenizers');

describe('NLP Util', () => {
  describe('Get truncated locale', () => {
    test('Should return undefined if no locale provided', () => {
      expect(NlpUtil.getTruncatedLocale()).toBeUndefined();
      expect(NlpUtil.getTruncatedLocale(null)).toBeUndefined();
      expect(NlpUtil.getTruncatedLocale('')).toBeUndefined();
    });
    test('Should return the first 2 characters lowercase', () => {
      expect(NlpUtil.getTruncatedLocale('e')).toEqual('e');
      expect(NlpUtil.getTruncatedLocale('es')).toEqual('es');
      expect(NlpUtil.getTruncatedLocale('ESP')).toEqual('es');
    });
  });

  describe('Get Stemmer', () => {
    test('Should return correct stemmer for the locale', () => {
      expect(NlpUtil.getStemmer('en').constructor.name).toEqual(
        'EnglishStemmer'
      ); // english
      expect(NlpUtil.getStemmer('fa')).toBe(PorterStemmerFa); // farsi
      expect(NlpUtil.getStemmer('fr')).toBe(PorterStemmerFr); // french
      expect(NlpUtil.getStemmer('ru')).toBe(PorterStemmerRu); // russian
      expect(NlpUtil.getStemmer('it')).toBe(PorterStemmerIt); // italian
      expect(NlpUtil.getStemmer('no')).toBe(PorterStemmerNo); // norwegian
      expect(NlpUtil.getStemmer('pt')).toBe(PorterStemmerPt); // portugese
      expect(NlpUtil.getStemmer('sv')).toBe(PorterStemmerSv); // swedish
      expect(NlpUtil.getStemmer('nl')).toBe(PorterStemmerNl); // Dutch
      expect(NlpUtil.getStemmer('id')).toBe(StemmerId); // Indonesian
      expect(NlpUtil.getStemmer('ja')).toBeInstanceOf(StemmerJa); // Japanese
      expect(NlpUtil.getStemmer('es').constructor.name).toEqual(
        'SpanishStemmer'
      ); // Spanish
      expect(NlpUtil.getStemmer('ar').constructor.name).toEqual(
        'ArabicStemmer'
      ); // Arabic
      expect(NlpUtil.getStemmer('hy').constructor.name).toEqual(
        'ArmenianStemmer'
      ); // Armenian
      expect(NlpUtil.getStemmer('eu').constructor.name).toEqual(
        'BasqueStemmer'
      ); // Basque
      expect(NlpUtil.getStemmer('ca').constructor.name).toEqual(
        'CatalanStemmer'
      ); // Catalan
      expect(NlpUtil.getStemmer('cs').constructor.name).toEqual('CzechStemmer'); // Czech
      expect(NlpUtil.getStemmer('da').constructor.name).toEqual(
        'DanishStemmer'
      ); // Danish
      expect(NlpUtil.getStemmer('fi').constructor.name).toEqual(
        'FinnishStemmer'
      ); // Finnish
      expect(NlpUtil.getStemmer('de').constructor.name).toEqual(
        'GermanStemmer'
      ); // German
      expect(NlpUtil.getStemmer('hu').constructor.name).toEqual(
        'HungarianStemmer'
      ); // Hungarian
      expect(NlpUtil.getStemmer('ga').constructor.name).toEqual('IrishStemmer'); // Irish
      expect(NlpUtil.getStemmer('ro').constructor.name).toEqual(
        'RomanianStemmer'
      ); // Romanian
      expect(NlpUtil.getStemmer('sl').constructor.name).toEqual(
        'SloveneStemmer'
      ); // Slovene
      expect(NlpUtil.getStemmer('ta').constructor.name).toEqual('TamilStemmer'); // Tamil
      expect(NlpUtil.getStemmer('tr').constructor.name).toEqual(
        'TurkishStemmer'
      ); // Turkish
    });
    test('Shoul return a AutoStemmer for unknown locales', () => {
      expect(NlpUtil.getStemmer('aa')).toBeInstanceOf(AutoStemmer);
      expect(NlpUtil.getStemmer('')).toBeInstanceOf(AutoStemmer);
      expect(NlpUtil.getStemmer()).toBeInstanceOf(AutoStemmer);
    });
    test('Shoul return a TokenizeStemmer for unknown locales if AutoStemmer is deactivated', () => {
      NlpUtil.useAutoStemmer = false;
      try {
        expect(NlpUtil.getStemmer('aa')).toBeInstanceOf(TokenizeStemmer);
        expect(NlpUtil.getStemmer('')).toBeInstanceOf(TokenizeStemmer);
        expect(NlpUtil.getStemmer()).toBeInstanceOf(TokenizeStemmer);
      } finally {
        NlpUtil.useAutoStemmer = true;
      }
    });
    test('Alternative stemmers can be used for some languages', () => {
      NlpUtil.useAlternative.en = false;
      NlpUtil.useAlternative.fa = true;
      NlpUtil.useAlternative.fr = true;
      NlpUtil.useAlternative.ru = true;
      NlpUtil.useAlternative.es = true;
      NlpUtil.useAlternative.it = true;
      NlpUtil.useAlternative.nl = true;
      NlpUtil.useAlternative.no = true;
      NlpUtil.useAlternative.pt = true;
      NlpUtil.useAlternative.pl = true;
      NlpUtil.useAlternative.sv = true;
      NlpUtil.useAlternative.id = true;
      NlpUtil.useAlternative.ja = true;
      NlpUtil.useAlternative.da = true;
      NlpUtil.useAlternative.fi = true;
      NlpUtil.useAlternative.de = true;
      NlpUtil.useAlternative.hu = true;
      NlpUtil.useAlternative.ro = true;
      NlpUtil.useAlternative.tr = true;
      expect(NlpUtil.getStemmer('en')).toBe(PorterStemmer); // english
      expect(NlpUtil.getStemmer('fa')).toBe(PorterStemmerFa); // farsi
      expect(NlpUtil.getStemmer('fr').constructor.name).toEqual(
        'FrenchStemmer'
      ); // french
      expect(NlpUtil.getStemmer('ru').constructor.name).toEqual(
        'RussianStemmer'
      ); // russian
      expect(NlpUtil.getStemmer('es').constructor.name).toEqual(
        'SpanishStemmer'
      ); // spanish
      expect(NlpUtil.getStemmer('it').constructor.name).toEqual(
        'ItalianStemmer'
      ); // italian
      expect(NlpUtil.getStemmer('no').constructor.name).toEqual(
        'NorwegianStemmer'
      ); // norwegian
      expect(NlpUtil.getStemmer('pt').constructor.name).toEqual(
        'PortugueseStemmer'
      ); // portugese
      expect(NlpUtil.getStemmer('sv').constructor.name).toEqual(
        'SwedishStemmer'
      ); // swedish
      expect(NlpUtil.getStemmer('nl').constructor.name).toEqual('DutchStemmer'); // Dutch
      expect(NlpUtil.getStemmer('id')).toBe(StemmerId); // Indonesian
      expect(NlpUtil.getStemmer('ja').constructor.name).toEqual(
        'JapaneseStemmer'
      ); // Japanese
      expect(NlpUtil.getStemmer('ar').constructor.name).toEqual(
        'ArabicStemmer'
      ); // Arabic
      expect(NlpUtil.getStemmer('hy').constructor.name).toEqual(
        'ArmenianStemmer'
      ); // Armenian
      expect(NlpUtil.getStemmer('eu').constructor.name).toEqual(
        'BasqueStemmer'
      ); // Basque
      expect(NlpUtil.getStemmer('ca').constructor.name).toEqual(
        'CatalanStemmer'
      ); // Catalan
      expect(NlpUtil.getStemmer('cs').constructor.name).toEqual('CzechStemmer'); // Czech
      expect(NlpUtil.getStemmer('da').constructor.name).toEqual(
        'DanishStemmer'
      ); // Danish
      expect(NlpUtil.getStemmer('fi').constructor.name).toEqual(
        'FinnishStemmer'
      ); // Finnish
      expect(NlpUtil.getStemmer('de').constructor.name).toEqual(
        'GermanStemmer'
      ); // German
      expect(NlpUtil.getStemmer('hu').constructor.name).toEqual(
        'HungarianStemmer'
      ); // Hungarian
      expect(NlpUtil.getStemmer('ga').constructor.name).toEqual('IrishStemmer'); // Irish
      expect(NlpUtil.getStemmer('ro').constructor.name).toEqual(
        'RomanianStemmer'
      ); // Romanian
      expect(NlpUtil.getStemmer('sl').constructor.name).toEqual(
        'SloveneStemmer'
      ); // Slovene
      expect(NlpUtil.getStemmer('ta').constructor.name).toEqual('TamilStemmer'); // Tamil
      expect(NlpUtil.getStemmer('tr').constructor.name).toEqual(
        'TurkishStemmer'
      ); // Turkish
      NlpUtil.useAlternative.en = false;
      NlpUtil.useAlternative.fa = false;
      NlpUtil.useAlternative.fr = false;
      NlpUtil.useAlternative.ru = false;
      NlpUtil.useAlternative.es = false;
      NlpUtil.useAlternative.it = false;
      NlpUtil.useAlternative.nl = false;
      NlpUtil.useAlternative.no = false;
      NlpUtil.useAlternative.pt = false;
      NlpUtil.useAlternative.pl = false;
      NlpUtil.useAlternative.sv = false;
      NlpUtil.useAlternative.id = false;
      NlpUtil.useAlternative.ja = false;
      NlpUtil.useAlternative.da = false;
      NlpUtil.useAlternative.fi = false;
      NlpUtil.useAlternative.de = false;
      NlpUtil.useAlternative.hu = false;
      NlpUtil.useAlternative.ro = false;
      NlpUtil.useAlternative.tr = false;
    });
  });

  describe('Get tokenizer', () => {
    test('Should return correct tokenizer for the locale', () => {
      expect(NlpUtil.getTokenizer('en')).toBeInstanceOf(AggressiveTokenizer); // english
      expect(NlpUtil.getTokenizer('fa')).toBeInstanceOf(AggressiveTokenizerFa); // farsi
      expect(NlpUtil.getTokenizer('fr')).toBeInstanceOf(AggressiveTokenizerFr); // french
      expect(NlpUtil.getTokenizer('ru')).toBeInstanceOf(AggressiveTokenizerRu); // russian
      expect(NlpUtil.getTokenizer('es')).toBeInstanceOf(AggressiveTokenizerEs); // spanish
      expect(NlpUtil.getTokenizer('it')).toBeInstanceOf(AggressiveTokenizerIt); // italian
      expect(NlpUtil.getTokenizer('nl')).toBeInstanceOf(AggressiveTokenizerNl); // dutch
      expect(NlpUtil.getTokenizer('no')).toBeInstanceOf(AggressiveTokenizerNo); // norwegian
      expect(NlpUtil.getTokenizer('pt')).toBeInstanceOf(AggressiveTokenizerPt); // portuguese
      expect(NlpUtil.getTokenizer('pl')).toBeInstanceOf(AggressiveTokenizerPl); // polish
      expect(NlpUtil.getTokenizer('sv')).toBeInstanceOf(AggressiveTokenizerSv); // swedish
      expect(NlpUtil.getTokenizer('id')).toBeDefined(); // indonesian
      expect(NlpUtil.getTokenizer('ja')).toBeInstanceOf(TokenizerJa); // japanese
      expect(NlpUtil.getTokenizer('ar')).toBeInstanceOf(PunctTokenizer); // arabic
      expect(NlpUtil.getTokenizer('hy')).toBeInstanceOf(PunctTokenizer); // armenian
      expect(NlpUtil.getTokenizer('eu')).toBeInstanceOf(PunctTokenizer); // basque
      expect(NlpUtil.getTokenizer('ca')).toBeInstanceOf(PunctTokenizer); // catalan
      expect(NlpUtil.getTokenizer('cs')).toBeInstanceOf(PunctTokenizer); // czech
      expect(NlpUtil.getTokenizer('da')).toBeInstanceOf(PunctTokenizer); // danish
      expect(NlpUtil.getTokenizer('fi')).toBeInstanceOf(PunctTokenizer); // finnish
      expect(NlpUtil.getTokenizer('de')).toBeInstanceOf(PunctTokenizer); // german
      expect(NlpUtil.getTokenizer('hu')).toBeInstanceOf(PunctTokenizer); // hungarian
      expect(NlpUtil.getTokenizer('ga')).toBeInstanceOf(PunctTokenizer); // irish
      expect(NlpUtil.getTokenizer('ro')).toBeInstanceOf(PunctTokenizer); // romanian
      expect(NlpUtil.getTokenizer('sl')).toBeInstanceOf(PunctTokenizer); // slovene
      expect(NlpUtil.getTokenizer('ta')).toBeInstanceOf(PunctTokenizer); // tamil
      expect(NlpUtil.getTokenizer('tr')).toBeInstanceOf(PunctTokenizer); // turkish
    });
    test('Shoul return an Default word Tokenizer for unknown locales', () => {
      expect(NlpUtil.getTokenizer('aa')).toBeInstanceOf(DefaultTokenizer);
      expect(NlpUtil.getTokenizer('')).toBeInstanceOf(DefaultTokenizer);
      expect(NlpUtil.getTokenizer()).toBeInstanceOf(DefaultTokenizer);
    });
  });

  describe('Get culture', () => {
    test('Should return correct culture for the locale', () => {
      expect(NlpUtil.getCulture('en')).toEqual('en-us'); // english
      expect(NlpUtil.getCulture('fa')).toEqual('fa-ir'); // farsi
      expect(NlpUtil.getCulture('fr')).toEqual('fr-fr'); // french
      expect(NlpUtil.getCulture('ru')).toEqual('ru-ru'); // russian
      expect(NlpUtil.getCulture('es')).toEqual('es-es'); // spanish
      expect(NlpUtil.getCulture('it')).toEqual('it-it'); // italian
      expect(NlpUtil.getCulture('nl')).toEqual('nl-nl'); // dutch
      expect(NlpUtil.getCulture('no')).toEqual('no-no'); // norwegian
      expect(NlpUtil.getCulture('pt')).toEqual('pt-br'); // portuguese
      expect(NlpUtil.getCulture('pl')).toEqual('pl-pl'); // polish
      expect(NlpUtil.getCulture('sv')).toEqual('sv-se'); // swedish
      expect(NlpUtil.getCulture('id')).toEqual('id-id'); // indonesian
      expect(NlpUtil.getCulture('ja')).toEqual('ja-jp'); // japanese
      expect(NlpUtil.getCulture('ar')).toEqual('ar-ae'); // arabic
      expect(NlpUtil.getCulture('hy')).toEqual('hy-am'); // armenian
      expect(NlpUtil.getCulture('eu')).toEqual('eu-es'); // basque
      expect(NlpUtil.getCulture('ca')).toEqual('ca-es'); // catalan
      expect(NlpUtil.getCulture('cs')).toEqual('cs-cz'); // czech
      expect(NlpUtil.getCulture('da')).toEqual('da-dk'); // danish
      expect(NlpUtil.getCulture('fi')).toEqual('fi-fi'); // finnish
      expect(NlpUtil.getCulture('de')).toEqual('de-de'); // german
      expect(NlpUtil.getCulture('hu')).toEqual('hu-hu'); // hungarian
      expect(NlpUtil.getCulture('ga')).toEqual('ga-ie'); // irish
      expect(NlpUtil.getCulture('ro')).toEqual('ro-ro'); // romanian
      expect(NlpUtil.getCulture('sl')).toEqual('sl-sl'); // slovene
      expect(NlpUtil.getCulture('ta')).toEqual('ta-in'); // tamil
      expect(NlpUtil.getCulture('th')).toEqual('th-th'); // thai
      expect(NlpUtil.getCulture('tr')).toEqual('tr-tr'); // turkish
      expect(NlpUtil.getCulture('zh')).toEqual('zh-cn'); // Chinese
      expect(NlpUtil.getCulture('gl')).toEqual('gl-es'); // Galician
      expect(NlpUtil.getCulture('tl')).toEqual('tl-ph'); // Tagalog
    });
    test('If the locale is not recognized return default is built from locale', () => {
      expect(NlpUtil.getCulture('aa')).toEqual('aa-aa');
    });
    test('If no locale is provided return en-us', () => {
      expect(NlpUtil.getCulture()).toEqual('en-us'); // english
    });
  });
});
