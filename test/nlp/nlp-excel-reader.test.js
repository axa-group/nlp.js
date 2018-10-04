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

const { NlpManager, NlpExcelReader } = require('../../lib');

describe('NLP Excel Reader', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const manager = new NlpManager();
      const reader = new NlpExcelReader(manager);
      expect(reader).toBeDefined();
    });
  });

  describe('Load excel', () => {
    test('It should read languages', () => {
      const manager = new NlpManager();
      const reader = new NlpExcelReader(manager);
      reader.load('./test/nlp/rules.xls');
      expect(manager.languages).toEqual(['en', 'es']);
    });
    test('It should read named entities', () => {
      const manager = new NlpManager();
      const reader = new NlpExcelReader(manager);
      reader.load('./test/nlp/rules.xls');
      expect(manager.nerManager.namedEntities.hero).toBeDefined();
      expect(manager.nerManager.namedEntities.food).toBeDefined();
      const { hero, food } = manager.nerManager.namedEntities;
      expect(hero.type).toEqual('enum');
      expect(food.type).toEqual('enum');
      expect(hero.locales.en).toBeDefined();
      expect(hero.locales.es).toBeDefined();
    });
    test('It should create the classifiers for the languages', () => {
      const manager = new NlpManager();
      const reader = new NlpExcelReader(manager);
      reader.load('./test/nlp/rules.xls');
      expect(manager.classifiers.en).toBeDefined();
      expect(manager.classifiers.es).toBeDefined();
    });
    test('The classifiers should contain the intent definition', () => {
      const manager = new NlpManager();
      const reader = new NlpExcelReader(manager);
      reader.load('./test/nlp/rules.xls');
      expect(manager.classifiers.en.docs).toHaveLength(3);
      expect(manager.classifiers.en.docs[0].intent).toEqual('whois');
      expect(manager.classifiers.en.docs[1].intent).toEqual('whereis');
      expect(manager.classifiers.en.docs[2].intent).toEqual('realname');
      expect(manager.classifiers.es.docs).toHaveLength(4);
      expect(manager.classifiers.es.docs[0].intent).toEqual('whois');
      expect(manager.classifiers.es.docs[1].intent).toEqual('whereis');
      expect(manager.classifiers.es.docs[2].intent).toEqual('whereis');
      expect(manager.classifiers.es.docs[3].intent).toEqual('realname');
    });
    test('The NLG should be filled', () => {
      const manager = new NlpManager();
      const reader = new NlpExcelReader(manager);
      reader.load('./test/nlp/rules.xls');
      expect(manager.nlgManager.responses.en).toBeDefined();
      expect(manager.nlgManager.responses.en.whois).toBeDefined();
      expect(manager.nlgManager.responses.en.whereis).toBeDefined();
      expect(manager.nlgManager.responses.en.realname).toBeDefined();
      expect(manager.nlgManager.responses.es).toBeDefined();
      expect(manager.nlgManager.responses.es.whois).toBeDefined();
      expect(manager.nlgManager.responses.es.whereis).toBeDefined();
      expect(manager.nlgManager.responses.es.realname).toBeDefined();
    });
  });
});
