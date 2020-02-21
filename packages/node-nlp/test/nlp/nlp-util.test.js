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

const { NlpUtil } = require('../../src/nlp');

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
      expect(NlpUtil.getStemmer('en').constructor.name).toEqual('StemmerEn'); // english
      expect(NlpUtil.getStemmer('fa').constructor.name).toEqual('StemmerFa'); // farsi
      expect(NlpUtil.getStemmer('fr').constructor.name).toEqual('StemmerFr'); // french
      expect(NlpUtil.getStemmer('ru').constructor.name).toEqual('StemmerRu'); // russian
      expect(NlpUtil.getStemmer('it').constructor.name).toEqual('StemmerIt'); // italian
      expect(NlpUtil.getStemmer('no').constructor.name).toEqual('StemmerNo'); // norwegian
      expect(NlpUtil.getStemmer('pt').constructor.name).toEqual('StemmerPt'); // portugese
      expect(NlpUtil.getStemmer('sv').constructor.name).toEqual('StemmerSv'); // swedish
      expect(NlpUtil.getStemmer('nl').constructor.name).toEqual('StemmerNl'); // Dutch
      expect(NlpUtil.getStemmer('id').constructor.name).toEqual('StemmerId'); // Indonesian
      expect(NlpUtil.getStemmer('ms').constructor.name).toEqual('StemmerMs'); // Malay
      expect(NlpUtil.getStemmer('ja').constructor.name).toEqual('StemmerJa'); // Japanese
      expect(NlpUtil.getStemmer('es').constructor.name).toEqual('StemmerEs'); // Spanish
      expect(NlpUtil.getStemmer('ar').constructor.name).toEqual('StemmerAr'); // Arabic
      expect(NlpUtil.getStemmer('hy').constructor.name).toEqual('StemmerHy'); // Armenian
      expect(NlpUtil.getStemmer('eu').constructor.name).toEqual('StemmerEu'); // Basque
      expect(NlpUtil.getStemmer('cs').constructor.name).toEqual('StemmerCs'); // Czech
      expect(NlpUtil.getStemmer('da').constructor.name).toEqual('StemmerDa'); // Danish
      expect(NlpUtil.getStemmer('fi').constructor.name).toEqual('StemmerFi'); // Finnish
      expect(NlpUtil.getStemmer('de').constructor.name).toEqual('StemmerDe'); // German
      expect(NlpUtil.getStemmer('hu').constructor.name).toEqual('StemmerHu'); // Hungarian
      expect(NlpUtil.getStemmer('ga').constructor.name).toEqual('StemmerGa'); // Irish
      expect(NlpUtil.getStemmer('ro').constructor.name).toEqual('StemmerRo'); // Romanian
      expect(NlpUtil.getStemmer('sl').constructor.name).toEqual('StemmerSl'); // Slovene
      expect(NlpUtil.getStemmer('ta').constructor.name).toEqual('StemmerTa'); // Tamil
      expect(NlpUtil.getStemmer('tr').constructor.name).toEqual('StemmerTr'); // Turkish
    });
    test('Should return a TokenizeStemmer for unknown locales if AutoStemmer is deactivated', () => {
      NlpUtil.useAutoStemmer = false;
      try {
        expect(NlpUtil.getStemmer('aa').constructor.name).toEqual(
          'BaseStemmer'
        );
        expect(NlpUtil.getStemmer('').constructor.name).toEqual('BaseStemmer');
        expect(NlpUtil.getStemmer().constructor.name).toEqual('BaseStemmer');
      } finally {
        NlpUtil.useAutoStemmer = true;
      }
    });
  });

  describe('Get tokenizer', () => {
    test('Should return correct tokenizer for the locale', () => {
      const tk = 'Tokenizer';
      expect(NlpUtil.getTokenizer('en').constructor.name).toEqual(`${tk}En`); // english
      expect(NlpUtil.getTokenizer('fa').constructor.name).toEqual(`${tk}Fa`); // farsi
      expect(NlpUtil.getTokenizer('fr').constructor.name).toEqual(`${tk}Fr`); // french
      expect(NlpUtil.getTokenizer('ru').constructor.name).toEqual(`${tk}Ru`); // russian
      expect(NlpUtil.getTokenizer('es').constructor.name).toEqual(`${tk}Es`); // spansih
      expect(NlpUtil.getTokenizer('it').constructor.name).toEqual(`${tk}It`); // italian
      expect(NlpUtil.getTokenizer('nl').constructor.name).toEqual(`${tk}Nl`); // dutch
      expect(NlpUtil.getTokenizer('no').constructor.name).toEqual(`${tk}No`); // norwegian
      expect(NlpUtil.getTokenizer('pt').constructor.name).toEqual(`${tk}Pt`); // portuguese
      expect(NlpUtil.getTokenizer('sv').constructor.name).toEqual(`${tk}Sv`); // swedish
      expect(NlpUtil.getTokenizer('id').constructor.name).toEqual(`${tk}Id`); // indonesian
      expect(NlpUtil.getTokenizer('ms').constructor.name).toEqual(`${tk}Ms`); // indonesian
      expect(NlpUtil.getTokenizer('ja').constructor.name).toEqual(`${tk}Ja`); // japanese
      expect(NlpUtil.getTokenizer('ar').constructor.name).toEqual(`${tk}Ar`); // arabic
      expect(NlpUtil.getTokenizer('hy').constructor.name).toEqual(`${tk}Hy`); // armenian
      expect(NlpUtil.getTokenizer('eu').constructor.name).toEqual(`${tk}Eu`); // basque
      expect(NlpUtil.getTokenizer('cs').constructor.name).toEqual(`${tk}Cs`); // czech
      expect(NlpUtil.getTokenizer('da').constructor.name).toEqual(`${tk}Da`); // danish
      expect(NlpUtil.getTokenizer('fi').constructor.name).toEqual(`${tk}Fi`); // finish
      expect(NlpUtil.getTokenizer('de').constructor.name).toEqual(`${tk}De`); // german
      expect(NlpUtil.getTokenizer('hu').constructor.name).toEqual(`${tk}Hu`); // hungarian
      expect(NlpUtil.getTokenizer('ga').constructor.name).toEqual(`${tk}Ga`); // irish
      expect(NlpUtil.getTokenizer('ro').constructor.name).toEqual(`${tk}Ro`); // romanian
      expect(NlpUtil.getTokenizer('sl').constructor.name).toEqual(`${tk}Sl`); // slovene
      expect(NlpUtil.getTokenizer('ta').constructor.name).toEqual(`${tk}Ta`); // tamil
      expect(NlpUtil.getTokenizer('tr').constructor.name).toEqual(`${tk}Tr`); // turkish
    });
    test('Shoul return an Default word Tokenizer for unknown locales', () => {
      expect(NlpUtil.getTokenizer('aa').constructor.name).toEqual('Tokenizer');
      expect(NlpUtil.getTokenizer('').constructor.name).toEqual('Tokenizer');
      expect(NlpUtil.getTokenizer().constructor.name).toEqual('Tokenizer');
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
      expect(NlpUtil.getCulture('ms')).toEqual('id-id'); // malay
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
