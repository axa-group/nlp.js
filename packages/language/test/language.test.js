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

const { Language } = require('../src');
const fixtures = require('./fixtures.json');

describe('Language', () => {
  describe('constructor', () => {
    it('Should create an instance', () => {
      const language = new Language();
      expect(language).toBeDefined();
    });
  });

  describe('Transform allowlist', () => {
    test('It should translate ISO2 to ISO3', () => {
      const language = new Language();
      const list = ['en', 'es'];
      const result = language.transformAllowList(list);
      expect(result).toEqual(['eng', 'spa']);
    });
    test('It should not transform entries already in ISO3', () => {
      const language = new Language();
      const list = ['en', 'spa'];
      const result = language.transformAllowList(list);
      expect(result).toEqual(['eng', 'spa']);
    });
    test('It should not add invalid languages', () => {
      const language = new Language();
      const list = ['en', 'es', 'me'];
      const result = language.transformAllowList(list);
      expect(result).toEqual(['eng', 'spa']);
    });
  });

  describe('guess', () => {
    it('Should return so much scores', () => {
      const language = new Language();
      const guess = language.guess('I want to eat something');
      expect(guess.length).toBeGreaterThan(10);
    });
    it('Should identify the language of an utterance', () => {
      const language = new Language();
      let guess = language.guess(
        'When the night has come And the land is dark And the moon is the only light we see'
      );
      expect(guess[0].alpha3).toEqual('eng');
      expect(guess[0].alpha2).toEqual('en');
      expect(guess[0].language).toEqual('English');
      expect(guess[0].score).toEqual(1);
      guess = language.guess(
        'Cuando ha llegado la noche Y la tierra está oscura Y la luna es la única luz que vemos'
      );
      expect(guess[0].alpha3).toEqual('spa');
      expect(guess[0].alpha2).toEqual('es');
      expect(guess[0].language).toEqual('Spanish');
      expect(guess[0].score).toEqual(1);
      guess = language.guess(
        "Quan ha arribat la nit, la terra és fosca i la lluna és l'única llum que veiem"
      );
      expect(guess[0].alpha3).toEqual('cat');
      expect(guess[0].alpha2).toEqual('ca');
      expect(guess[0].language).toEqual('Catalan');
      expect(guess[0].score).toEqual(1);
    });
    it('Should allow to indicate a limit of responses', () => {
      const language = new Language();
      let guess = language.guess(
        'When the night has come And the land is dark And the moon is the only light we see',
        null,
        3
      );
      expect(guess).toHaveLength(3);
      expect(guess[0].alpha3).toEqual('eng');
      expect(guess[0].alpha2).toEqual('en');
      expect(guess[0].language).toEqual('English');
      expect(guess[0].score).toEqual(1);
      guess = language.guess(
        'Cuando ha llegado la noche Y la tierra está oscura Y la luna es la única luz que vemos',
        null,
        2
      );
      expect(guess).toHaveLength(2);
      expect(guess[0].alpha3).toEqual('spa');
      expect(guess[0].alpha2).toEqual('es');
      expect(guess[0].language).toEqual('Spanish');
      expect(guess[0].score).toEqual(1);
      guess = language.guess(
        "Quan ha arribat la nit, la terra és fosca i la lluna és l'única llum que veiem",
        null,
        1
      );
      expect(guess).toHaveLength(1);
      expect(guess[0].alpha3).toEqual('cat');
      expect(guess[0].alpha2).toEqual('ca');
      expect(guess[0].language).toEqual('Catalan');
      expect(guess[0].score).toEqual(1);
    });
    it('Should allow to pass a allow list of languages', () => {
      const language = new Language();
      const keys = Object.keys(language.languagesAlpha2);
      keys.splice(keys.indexOf('en'), 1);
      const guess = language.guess(
        'When the night has come And the land is dark And the moon is the only light we see',
        keys
      );
      expect(guess[0].alpha3).toEqual('deu');
      expect(guess[0].alpha2).toEqual('de');
      expect(guess[0].language).toEqual('German');
      expect(guess[0].score).toEqual(1);
    });
  });

  describe('guess best', () => {
    it('Should identify the language of an utterance', () => {
      const language = new Language();
      let guess = language.guessBest(
        'When the night has come And the land is dark And the moon is the only light we see'
      );
      expect(guess.alpha3).toEqual('eng');
      expect(guess.alpha2).toEqual('en');
      expect(guess.language).toEqual('English');
      expect(guess.score).toEqual(1);
      guess = language.guessBest(
        'Cuando ha llegado la noche Y la tierra está oscura Y la luna es la única luz que vemos'
      );
      expect(guess.alpha3).toEqual('spa');
      expect(guess.alpha2).toEqual('es');
      expect(guess.language).toEqual('Spanish');
      expect(guess.score).toEqual(1);
      guess = language.guessBest(
        "Quan ha arribat la nit, la terra és fosca i la lluna és l'única llum que veiem"
      );
      expect(guess.alpha3).toEqual('cat');
      expect(guess.alpha2).toEqual('ca');
      expect(guess.language).toEqual('Catalan');
      expect(guess.score).toEqual(1);
    });
    Object.keys(fixtures).forEach((code) => {
      const text = fixtures[code].fixture;
      const expected = fixtures[code].iso6393;
      it(`Should guess ${expected} for text ${text.substr(0, 50)}`, () => {
        const language = new Language();
        const actual = language.guessBest(text);
        expect(actual.alpha3).toEqual(expected);
      });
    });
    it('Should allow to pass a allow list of languages', () => {
      const language = new Language();
      const keys = Object.keys(language.languagesAlpha2);
      keys.splice(keys.indexOf('en'), 1);
      const guess = language.guessBest(
        'When the night has come And the land is dark And the moon is the only light we see',
        keys
      );
      expect(guess.alpha3).toEqual('deu');
      expect(guess.alpha2).toEqual('de');
      expect(guess.language).toEqual('German');
      expect(guess.score).toEqual(1);
    });
  });

  describe('Get trigrams', () => {
    it('Should return the trigrams of a sentence', () => {
      const text = 'Hola que tal';
      const expected = [
        ' ho',
        'hol',
        'ola',
        'la ',
        'a q',
        ' qu',
        'que',
        'ue ',
        'e t',
        ' ta',
        'tal',
        'al ',
      ];
      const actual = Language.getTrigrams(text);
      expect(actual).toEqual(expected);
    });
    it('Should return an empty array if string is empty', () => {
      const text = '';
      const actual = Language.getTrigrams(text);
      expect(actual).toEqual([]);
    });
    it('Should return an empty array if string is not defined', () => {
      const actual = Language.getTrigrams();
      expect(actual).toEqual([]);
    });
  });

  describe('Detect All', () => {
    it('Should return und if no text is provided', () => {
      const actual = Language.detectAll();
      expect(actual[0][0]).toEqual('und');
    });
    it('Chinese must be identified if its on the allow list', () => {
      const actual = Language.detectAll(
        '鉴于对人类家庭所有成员的固有尊严及其平等的和不移的权利的承认,乃是世界自由、正义与和平的基础,\n鉴于对人权的无视和侮蔑已发展为野蛮暴行,这些暴行玷污了人类的良心,而一',
        { allowList: ['eng', 'cmn'] }
      );
      expect(actual[0][0]).toEqual('cmn');
    });
    it('Japanes must be identified if its on the allow list and only kanjis detected', () => {
      const actual = Language.detectAll('人類社会構成員固有尊厳', {
        allowList: ['eng', 'jpn'],
      });
      expect(actual[0][0]).toEqual('jpn');
    });
  });

  describe('Add trigrams', () => {
    it('Should be able to add trigrams from sentences, with weight 1', () => {
      const language = new Language();
      language.addTrigrams('kl0', 'nuqneH');
      language.addTrigrams('kl0', 'maj po');
      language.addTrigrams('kl0', 'maj choS');
      language.addTrigrams('kl0', 'maj ram choS');
      language.addTrigrams('kl0', `nuqDaq ghaH ngaQHa'moHwI'mey?`);
      language.addTrigrams('kl0', `ngaQHa'moHwI'mey lujta' jIH`);
      const actual = Language.detectAll(`ngaQHa'moHwI'mey nIH vay`);
      expect(actual[0][0]).toEqual('kl0');
    });
  });

  describe('Add extra sentences', () => {
    it('Should be able to add extra sentences', () => {
      const language = new Language();
      language.addExtraSentence('kl0', 'nuqneH');
      language.addExtraSentence('kl0', 'maj po');
      language.addExtraSentence('kl0', 'maj choS');
      language.addExtraSentence('kl0', 'maj ram choS');
      language.addExtraSentence('kl0', `nuqDaq ghaH ngaQHa'moHwI'mey?`);
      language.addExtraSentence('kl0', `ngaQHa'moHwI'mey lujta' jIH`);
      expect(language.extraSentences).toHaveLength(6);
      const actual = Language.detectAll(`ngaQHa'moHwI'mey nIH vay`);
      expect(actual[0][0]).toEqual('kl0');
    });
  });

  describe('Process extra sentences', () => {
    it('If it contains an array of extra sentences, can be processed', () => {
      const language = new Language();
      language.extraSentences = [
        ['kl0', 'nuqneH'],
        ['kl0', 'maj po'],
        ['kl0', 'maj choS'],
        ['kl0', 'maj ram choS'],
        ['kl0', `nuqDaq ghaH ngaQHa'moHwI'mey?`],
        ['kl0', `ngaQHa'moHwI'mey lujta' jIH`],
      ];
      language.processExtraSentences();
      const actual = Language.detectAll(`ngaQHa'moHwI'mey nIH vay`);
      expect(actual[0][0]).toEqual('kl0');
    });
  });
});
