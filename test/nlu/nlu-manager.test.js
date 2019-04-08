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

const { NluManager } = require('../../lib');

describe('NLU Manager', () => {
  describe('constructor', () => {
    test('Should create a new instance', () => {
      const manager = new NluManager();
      expect(manager).toBeDefined();
    });
    test('Languages can be provided', () => {
      const manager = new NluManager({ languages: ['en', 'es'] });
      expect(manager.languages).toEqual(['en', 'es']);
      expect(Object.keys(manager.domainManagers)).toEqual(['en', 'es']);
    });
  });

  describe('Add language', () => {
    test('A language can be added', () => {
      const manager = new NluManager();
      manager.addLanguage('en');
      expect(manager.languages).toEqual(['en']);
      expect(Object.keys(manager.domainManagers)).toEqual(['en']);
    });
    test('If the language is added 2 times, second time does not change manager', () => {
      const manager = new NluManager();
      manager.addLanguage('en');
      manager.addLanguage('en');
      expect(manager.languages).toEqual(['en']);
      expect(Object.keys(manager.domainManagers)).toEqual(['en']);
    });
  });

  describe('Guess language', () => {
    test('If there is only one language, then return this one', () => {
      const manager = new NluManager();
      manager.addLanguage(['en']);
      const language = manager.guessLanguage('what is?');
      expect(language).toEqual('en');
    });
    test('Should guess the language of an utterance', () => {
      const manager = new NluManager();
      manager.addLanguage(['en', 'es']);
      let language = manager.guessLanguage('what is?');
      expect(language).toEqual('en');
      language = manager.guessLanguage('¿Qué es?');
      expect(language).toEqual('es');
    });
    test('Should return undefined if cannot be guessed', () => {
      const manager = new NluManager();
      manager.addLanguage(['en', 'es']);
      const language = manager.guessLanguage('');
      expect(language).toBeUndefined();
    });
  });

  describe('Assign Domain', () => {
    test('Domains can be assigned to intents', () => {
      const manager = new NluManager({ languages: ['en', 'es'] });
      manager.assignDomain('en', 'a', 'domain1');
      manager.assignDomain('en', 'b', 'domain1');
      manager.assignDomain('en', 'c', 'domain2');
      manager.assignDomain('en', 'd', 'domain2');
      manager.assignDomain('es', 'a', 'domain1');
      manager.assignDomain('es', 'b', 'domain1');
      manager.assignDomain('es', 'c', 'domain2');
      manager.assignDomain('es', 'd', 'domain3');
      expect(manager.intentDomains.en.a).toEqual('domain1');
      expect(manager.intentDomains.en.b).toEqual('domain1');
      expect(manager.intentDomains.en.c).toEqual('domain2');
      expect(manager.intentDomains.en.d).toEqual('domain2');
      expect(manager.intentDomains.es.a).toEqual('domain1');
      expect(manager.intentDomains.es.b).toEqual('domain1');
      expect(manager.intentDomains.es.c).toEqual('domain2');
      expect(manager.intentDomains.es.d).toEqual('domain3');
    });
  });

  describe('Get Intent Domain', () => {
    test('I can get the domain of an intent in a given language', () => {
      const manager = new NluManager({ languages: ['en', 'es'] });
      manager.assignDomain('en', 'a', 'domain1');
      manager.assignDomain('en', 'b', 'domain1');
      manager.assignDomain('en', 'c', 'domain2');
      manager.assignDomain('en', 'd', 'domain2');
      manager.assignDomain('es', 'a', 'domain1');
      manager.assignDomain('es', 'b', 'domain1');
      manager.assignDomain('es', 'c', 'domain2');
      manager.assignDomain('es', 'd', 'domain3');
      expect(manager.getIntentDomain('en', 'a')).toEqual('domain1');
      expect(manager.getIntentDomain('en', 'b')).toEqual('domain1');
      expect(manager.getIntentDomain('en', 'c')).toEqual('domain2');
      expect(manager.getIntentDomain('en', 'd')).toEqual('domain2');
      expect(manager.getIntentDomain('es', 'a')).toEqual('domain1');
      expect(manager.getIntentDomain('es', 'b')).toEqual('domain1');
      expect(manager.getIntentDomain('es', 'c')).toEqual('domain2');
      expect(manager.getIntentDomain('es', 'd')).toEqual('domain3');
    });
    test('If the intent has not domain assigned return default', () => {
      const manager = new NluManager({ languages: ['en', 'es'] });
      manager.assignDomain('en', 'a', 'domain1');
      manager.assignDomain('en', 'b', 'domain1');
      manager.assignDomain('en', 'c', 'domain2');
      manager.assignDomain('en', 'd', 'domain2');
      manager.assignDomain('es', 'a', 'domain1');
      manager.assignDomain('es', 'b', 'domain1');
      manager.assignDomain('es', 'c', 'domain2');
      manager.assignDomain('es', 'd', 'domain3');
      expect(manager.getIntentDomain('en', 'e')).toEqual('default');
    });
    test('If the locale does not exists return default', () => {
      const manager = new NluManager({ languages: ['en', 'es'] });
      manager.assignDomain('en', 'a', 'domain1');
      manager.assignDomain('en', 'b', 'domain1');
      manager.assignDomain('en', 'c', 'domain2');
      manager.assignDomain('en', 'd', 'domain2');
      manager.assignDomain('es', 'a', 'domain1');
      manager.assignDomain('es', 'b', 'domain1');
      manager.assignDomain('es', 'c', 'domain2');
      manager.assignDomain('es', 'd', 'domain3');
      expect(manager.getIntentDomain('fr', 'a')).toEqual('default');
    });
  });

  describe('Get Domains', () => {
    test('It should return a tree of languages, domains an intents', () => {
      const manager = new NluManager({ languages: ['en', 'es'] });
      manager.assignDomain('en', 'a', 'domain1');
      manager.assignDomain('en', 'b', 'domain1');
      manager.assignDomain('en', 'c', 'domain2');
      manager.assignDomain('en', 'd', 'domain2');
      manager.assignDomain('es', 'a', 'domain1');
      manager.assignDomain('es', 'b', 'domain1');
      manager.assignDomain('es', 'c', 'domain2');
      manager.assignDomain('es', 'd', 'domain3');
      const expected = {
        en: {
          domain1: ['a', 'b'],
          domain2: ['c', 'd'],
        },
        es: {
          domain1: ['a', 'b'],
          domain2: ['c'],
          domain3: ['d'],
        },
      };
      const actual = manager.getDomains();
      expect(actual).toEqual(expected);
    });
  });

  describe('Add Document', () => {
    test('A document can be added', () => {
      const manager = new NluManager();
      manager.addLanguage(['en', 'es']);
      manager.addDocument('es', 'Dónde están las llaves', 'keys');
      expect(manager.domainManagers.es.domains.default.docs).toHaveLength(1);
    });
    test('If locale is not defined, then guess it', () => {
      const manager = new NluManager();
      manager.addLanguage(['en', 'es']);
      manager.addDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(manager.domainManagers.es.domains.default.docs).toHaveLength(1);
    });
    test('If locale is not defined and cannot be guessed, throw an error', () => {
      const manager = new NluManager();
      manager.addLanguage(['en', 'es']);
      expect(() => manager.addDocument(undefined, '', 'keys')).toThrow(
        'Locale must be defined'
      );
    });
    test('If there is not domain for the given language, throw an error', () => {
      const manager = new NluManager();
      manager.addLanguage(['en', 'es']);
      expect(() => manager.addDocument('fr', 'Bonjour', 'greet')).toThrow(
        'Domain Manager not found for locale fr'
      );
    });
  });

  describe('Remove Document', () => {
    test('A document can be removed', () => {
      const manager = new NluManager();
      manager.addLanguage(['en', 'es']);
      manager.addDocument('es', 'Dónde están las llaves', 'keys');
      manager.removeDocument('es', 'Dónde están las llaves', 'keys');
      expect(manager.domainManagers.es.domains.default.docs).toHaveLength(0);
    });
    test('If locale is not defined then guess it', () => {
      const manager = new NluManager();
      manager.addLanguage(['en', 'es']);
      manager.addDocument('es', 'Dónde están las llaves', 'keys');
      manager.removeDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(manager.domainManagers.es.domains.default.docs).toHaveLength(0);
    });
    test('If locale cannot be guessed then throw an error', () => {
      const manager = new NluManager();
      manager.addLanguage(['en', 'es']);
      expect(() => manager.removeDocument(undefined, '', 'keys')).toThrow(
        'Locale must be defined'
      );
    });
    test('If there is not domain for the given language, throw an error', () => {
      const manager = new NluManager();
      manager.addLanguage(['en', 'es']);
      expect(() => manager.removeDocument('fr', 'Bonjour', 'greet')).toThrow(
        'Domain Manager not found for locale fr'
      );
    });
  });
});
