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
      expect(manager.nluManager.languages).toEqual(['en', 'es']);
    });
    test('It should read excel without regex entities', () => {
      const manager = new NlpManager();
      const reader = new NlpExcelReader(manager);
      reader.load('./test/nlp/rulesnoregex.xls');
      expect(manager.nluManager.languages).toEqual(['en', 'es']);
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
      expect(manager.nluManager.domainManagers.en).toBeDefined();
      expect(manager.nluManager.domainManagers.es).toBeDefined();
    });
    test('The classifiers should contain the intent definition', () => {
      const manager = new NlpManager();
      const reader = new NlpExcelReader(manager);
      reader.load('./test/nlp/rules.xls');
      expect(
        manager.nluManager.domainManagers.en.domains.master_domain.docs
      ).toHaveLength(5);
      expect(
        manager.nluManager.domainManagers.en.domains.master_domain.docs[0].intent
      ).toEqual('whois');
      expect(
        manager.nluManager.domainManagers.en.domains.master_domain.docs[1].intent
      ).toEqual('whereis');
      expect(
        manager.nluManager.domainManagers.en.domains.master_domain.docs[2].intent
      ).toEqual('whereis');
      expect(
        manager.nluManager.domainManagers.en.domains.master_domain.docs[3].intent
      ).toEqual('whereis');
      expect(
        manager.nluManager.domainManagers.en.domains.master_domain.docs[4].intent
      ).toEqual('realname');
      expect(
        manager.nluManager.domainManagers.es.domains.master_domain.docs
      ).toHaveLength(4);
      expect(
        manager.nluManager.domainManagers.es.domains.master_domain.docs[0].intent
      ).toEqual('whois');
      expect(
        manager.nluManager.domainManagers.es.domains.master_domain.docs[1].intent
      ).toEqual('whereis');
      expect(
        manager.nluManager.domainManagers.es.domains.master_domain.docs[2].intent
      ).toEqual('whereis');
      expect(
        manager.nluManager.domainManagers.es.domains.master_domain.docs[3].intent
      ).toEqual('realname');
    });
    test('The classifiers should contain the intent definition when training by domain', () => {
      const manager = new NlpManager({ nlu: { trainByDomain: true }});
      const reader = new NlpExcelReader(manager);
      reader.load('./test/nlp/rules.xls');
      expect(
        manager.nluManager.domainManagers.en.domains.default.docs
      ).toHaveLength(5);
      expect(
        manager.nluManager.domainManagers.en.domains.default.docs[0].intent
      ).toEqual('whois');
      expect(
        manager.nluManager.domainManagers.en.domains.default.docs[1].intent
      ).toEqual('whereis');
      expect(
        manager.nluManager.domainManagers.en.domains.default.docs[2].intent
      ).toEqual('whereis');
      expect(
        manager.nluManager.domainManagers.en.domains.default.docs[3].intent
      ).toEqual('whereis');
      expect(
        manager.nluManager.domainManagers.en.domains.default.docs[4].intent
      ).toEqual('realname');
      expect(
        manager.nluManager.domainManagers.es.domains.default.docs
      ).toHaveLength(4);
      expect(
        manager.nluManager.domainManagers.es.domains.default.docs[0].intent
      ).toEqual('whois');
      expect(
        manager.nluManager.domainManagers.es.domains.default.docs[1].intent
      ).toEqual('whereis');
      expect(
        manager.nluManager.domainManagers.es.domains.default.docs[2].intent
      ).toEqual('whereis');
      expect(
        manager.nluManager.domainManagers.es.domains.default.docs[3].intent
      ).toEqual('realname');
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
