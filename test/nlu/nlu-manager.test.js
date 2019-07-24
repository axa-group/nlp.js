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

const { NluManager } = require('../../lib');

function addFoodDomainEn(manager) {
  manager.assignDomain('en', 'order.check', 'food');
  manager.addDocument('en', 'what do I have in my basket', 'order.check');
  manager.addDocument('en', 'check my cart', 'order.check');
  manager.addDocument('en', "show me what I've ordered", 'order.check');
  manager.addDocument('en', "what's in my basket", 'order.check');
  manager.addDocument('en', 'check my order', 'order.check');
  manager.addDocument('en', 'check what I have ordered', 'order.check');
  manager.addDocument('en', 'show my order', 'order.check');
  manager.addDocument('en', 'check my basket', 'order.check');

  manager.assignDomain('en', 'order.check_status', 'food');
  manager.addDocument(
    'en',
    'how soon will it be delivered',
    'order.check_status'
  );
  manager.addDocument(
    'en',
    'check the status of my delivery',
    'order.check_status'
  );
  manager.addDocument(
    'en',
    'when should I expect delivery',
    'order.check_status'
  );
  manager.addDocument('en', 'check my order status', 'order.check_status');
  manager.addDocument('en', 'where is my order', 'order.check_status');
  manager.addDocument('en', 'where is my delivery', 'order.check_status');
  manager.addDocument('en', 'status of my order', 'order.check_status');
}

function addFoodDomainEs(manager) {
  manager.assignDomain('es', 'order.check', 'food');
  manager.addDocument('es', 'qué tengo en mi cesta', 'order.check');
  manager.addDocument('es', 'comprueba mi carrito', 'order.check');
  manager.addDocument('es', 'enséñame qué he pedido', 'order.check');
  manager.addDocument('es', 'qué hay en mi carrito?', 'order.check');
  manager.addDocument('es', 'comprueba mi compra', 'order.check');
  manager.addDocument('es', 'comprueba qué he comprado', 'order.check');
  manager.addDocument('es', 'muéstrame mi compra', 'order.check');

  manager.assignDomain('es', 'order.check_status', 'food');
  manager.addDocument('es', 'cuándo me lo van a traer?', 'order.check_status');
  manager.addDocument('es', 'cómo va la entrega?', 'order.check_status');
  manager.addDocument(
    'es',
    'cuándo me traerán mi pedido?',
    'order.check_status'
  );
  manager.addDocument(
    'es',
    'en qué estado está mi pedido?',
    'order.check_status'
  );
  manager.addDocument('es', 'dónde está mi compra?', 'order.check_status');
  manager.addDocument('es', 'dónde está mi pedido?', 'order.check_status');
  manager.addDocument('es', 'estado de mi compra', 'order.check_status');
}

function addPersonalityDomainEn(manager) {
  manager.assignDomain('en', 'agent.acquaintance', 'personality');
  manager.addDocument('en', 'say about you', 'agent.acquaintance');
  manager.addDocument('en', 'why are you here', 'agent.acquaintance');
  manager.addDocument('en', 'what is your personality', 'agent.acquaintance');
  manager.addDocument('en', 'describe yourself', 'agent.acquaintance');
  manager.addDocument('en', 'tell me about yourself', 'agent.acquaintance');
  manager.addDocument('en', 'tell me about you', 'agent.acquaintance');
  manager.addDocument('en', 'what are you', 'agent.acquaintance');
  manager.addDocument('en', 'who are you', 'agent.acquaintance');
  manager.addDocument('en', 'talk about yourself', 'agent.acquaintance');

  manager.assignDomain('en', 'agent.age', 'personality');
  manager.addDocument('en', 'your age', 'agent.age');
  manager.addDocument('en', 'how old is your platform', 'agent.age');
  manager.addDocument('en', 'how old are you', 'agent.age');
  manager.addDocument('en', "what's your age", 'agent.age');
  manager.addDocument('en', "I'd like to know your age", 'agent.age');
  manager.addDocument('en', 'tell me your age', 'agent.age');
}

function addPersonalityDomainEs(manager) {
  manager.assignDomain('es', 'agent.acquaintance', 'personality');
  manager.addDocument('es', 'cuéntame sobre ti', 'agent.acquaintance');
  manager.addDocument('es', 'qué haces aquí?', 'agent.acquaintance');
  manager.addDocument('es', 'cómo es tu personalidad?', 'agent.acquaintance');
  manager.addDocument('es', 'descríbete', 'agent.acquaintance');
  manager.addDocument('es', 'quién eres?', 'agent.acquaintance');
  manager.addDocument('es', 'qué eres?', 'agent.acquaintance');
  manager.addDocument('es', 'háblame de ti', 'agent.acquaintance');

  manager.assignDomain('es', 'agent.age', 'personality');
  manager.addDocument('es', 'qué edad tienes?', 'agent.age');
  manager.addDocument('es', 'cuántos años tienes?', 'agent.age');
  manager.addDocument('es', 'cuál es tu edad?', 'agent.age');
  manager.addDocument('es', 'quiero saber tu edad', 'agent.age');
  manager.addDocument('es', 'dime tu edad', 'agent.age');
}

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
      expect(manager.domainManagers.es.domains.master_domain.docs).toHaveLength(1);
    });
    test('A document can be added training by domain', () => {
      const manager = new NluManager({ trainByDomain: true });
      manager.addLanguage(['en', 'es']);
      manager.addDocument('es', 'Dónde están las llaves', 'keys');
      expect(manager.domainManagers.es.domains.default.docs).toHaveLength(1);
    });
    test('If locale is not defined, then guess it', () => {
      const manager = new NluManager();
      manager.addLanguage(['en', 'es']);
      manager.addDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(manager.domainManagers.es.domains.master_domain.docs).toHaveLength(1);
    });
    test('If locale is not defined, then guess it training by domain', () => {
      const manager = new NluManager({ trainByDomain: true });
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
      expect(manager.domainManagers.es.domains.master_domain.docs).toHaveLength(0);
    });
    test('A document can be removed training by domain', () => {
      const manager = new NluManager({ trainByDomain: true });
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
      expect(manager.domainManagers.es.domains.master_domain.docs).toHaveLength(0);
    });
    test('If locale is not defined then guess it training by domain', () => {
      const manager = new NluManager({ trainByDomain: true });
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

  describe('Edit Mode', () => {
    test('When edit mode begans, all domains pass to edit mode', () => {
      const manager = new NluManager({ languages: ['en', 'es'], trainByDomain: true });
      manager.assignDomain('en', 'a', 'domain1');
      manager.assignDomain('en', 'b', 'domain1');
      manager.assignDomain('en', 'c', 'domain2');
      manager.assignDomain('en', 'd', 'domain2');
      manager.assignDomain('es', 'a', 'domain1');
      manager.assignDomain('es', 'b', 'domain1');
      manager.assignDomain('es', 'c', 'domain2');
      manager.assignDomain('es', 'd', 'domain3');
      manager.addDocument('en', 'utterance a', 'a');
      manager.addDocument('en', 'utterance b', 'b');
      manager.addDocument('en', 'utterance c', 'c');
      manager.addDocument('en', 'utterance d', 'd');
      manager.addDocument('es', 'utterance a', 'a');
      manager.addDocument('es', 'utterance b', 'b');
      manager.addDocument('es', 'utterance c', 'c');
      manager.addDocument('es', 'utterance d', 'd');
      manager.beginEdit();
      expect(manager.domainManagers.en.domains.domain1.isEditing).toBeTruthy();
      expect(manager.domainManagers.en.domains.domain2.isEditing).toBeTruthy();
      expect(manager.domainManagers.es.domains.domain1.isEditing).toBeTruthy();
      expect(manager.domainManagers.es.domains.domain2.isEditing).toBeTruthy();
      expect(manager.domainManagers.es.domains.domain3.isEditing).toBeTruthy();
    });
  });

  describe('Train', () => {
    test('Can train several domains', async () => {
      const manager = new NluManager({ languages: ['en', 'es'] });
      addFoodDomainEn(manager);
      addPersonalityDomainEn(manager);
      addFoodDomainEs(manager);
      addPersonalityDomainEs(manager);
      await manager.train();
    });
  });

  describe('Fill Language', () => {
    test('If not data is provided, then guess undefined', () => {
      const manager = new NluManager();
      const actual = manager.fillLanguage({ utterance: '' });
      expect(actual.language).toBeUndefined();
      expect(actual.locale).toBeUndefined();
      expect(actual.localeIso2).toBeUndefined();
    });
    test('If has language but not data is provided, then guess as unique existing language', () => {
      const manager = new NluManager({ languages: ['en'] });
      const actual = manager.fillLanguage({ utterance: '' });
      expect(actual.language).toEqual('English');
      expect(actual.locale).toEqual('en');
      expect(actual.localeIso2).toEqual('en');
    });
    test('If has language the provided is not in the list, return the source one', () => {
      const manager = new NluManager({ languages: ['en'] });
      const actual = manager.fillLanguage({
        locale: 'es',
        utterance: 'la lluvia en sevilla es pura maravilla',
      });
      expect(actual.language).toEqual('Spanish');
      expect(actual.locale).toEqual('es');
      expect(actual.localeIso2).toEqual('es');
    });
  });

  describe('Get Classifications', () => {
    test('Can classify if I provide locale without using None Feature', async () => {
      const manager = new NluManager({ languages: ['en', 'es'], useNoneFeature: false, trainByDomain: true });
      addFoodDomainEn(manager);
      addPersonalityDomainEn(manager);
      addFoodDomainEs(manager);
      addPersonalityDomainEs(manager);
      await manager.train();
      const actual = manager.getClassifications('es', 'dime quién eres tú');
      expect(actual.domain).toEqual('personality');
      expect(actual.language).toEqual('Spanish');
      expect(actual.locale).toEqual('es');
      expect(actual.localeGuessed).toBeFalsy();
      expect(actual.localeIso2).toEqual('es');
      expect(actual.utterance).toEqual('dime quién eres tú');
      expect(actual.classifications).toHaveLength(2);
      expect(actual.classifications[0].label).toEqual('agent.acquaintance');
      expect(actual.classifications[0].value).toBeGreaterThan(0.8);
    });
    test('Can classify if I provide locale', async () => {
      const manager = new NluManager({ languages: ['en', 'es'], trainByDomain: true });
      addFoodDomainEn(manager);
      addPersonalityDomainEn(manager);
      addFoodDomainEs(manager);
      addPersonalityDomainEs(manager);
      await manager.train();
      const actual = manager.getClassifications('es', 'dime quién eres tú');
      expect(actual.domain).toEqual('personality');
      expect(actual.language).toEqual('Spanish');
      expect(actual.locale).toEqual('es');
      expect(actual.localeGuessed).toBeFalsy();
      expect(actual.localeIso2).toEqual('es');
      expect(actual.utterance).toEqual('dime quién eres tú');
      expect(actual.classifications).toHaveLength(3);
      expect(actual.classifications[0].label).toEqual('agent.acquaintance');
      expect(actual.classifications[0].value).toBeGreaterThan(0.8);
    });
  });

  describe('toObj and fromObj', () => {
    test('Can export and import without using None Feature', async () => {
      const manager = new NluManager({ languages: ['en', 'es'], useNoneFeature: false, trainByDomain: true });
      addFoodDomainEn(manager);
      addPersonalityDomainEn(manager);
      addFoodDomainEs(manager);
      addPersonalityDomainEs(manager);
      await manager.train();
      const clone = new NluManager();
      clone.fromObj(manager.toObj());
      const actual = clone.getClassifications('es', 'dime quién eres tú');
      expect(actual.domain).toEqual('personality');
      expect(actual.language).toEqual('Spanish');
      expect(actual.locale).toEqual('es');
      expect(actual.localeGuessed).toBeFalsy();
      expect(actual.localeIso2).toEqual('es');
      expect(actual.utterance).toEqual('dime quién eres tú');
      expect(actual.classifications).toHaveLength(2);
      expect(actual.classifications[0].label).toEqual('agent.acquaintance');
      expect(actual.classifications[0].value).toBeGreaterThan(0.8);
    });
    test('Can export and import', async () => {
      const manager = new NluManager({ languages: ['en', 'es'], trainByDomain: true });
      addFoodDomainEn(manager);
      addPersonalityDomainEn(manager);
      addFoodDomainEs(manager);
      addPersonalityDomainEs(manager);
      await manager.train();
      const clone = new NluManager();
      clone.fromObj(manager.toObj());
      const actual = clone.getClassifications('es', 'dime quién eres tú');
      expect(actual.domain).toEqual('personality');
      expect(actual.language).toEqual('Spanish');
      expect(actual.locale).toEqual('es');
      expect(actual.localeGuessed).toBeFalsy();
      expect(actual.localeIso2).toEqual('es');
      expect(actual.utterance).toEqual('dime quién eres tú');
      expect(actual.classifications).toHaveLength(3);
      expect(actual.classifications[0].label).toEqual('agent.acquaintance');
      expect(actual.classifications[0].value).toBeGreaterThan(0.8);
    });
  });

  describe('Is equal classification', () => {
    test('Should return true if the two frist classifications have the same score', () => {
      const manager = new NluManager();
      const classifications = [];
      classifications.push({ label: 'a', value: 0.6 });
      classifications.push({ label: 'b', value: 0.6 });
      classifications.push({ label: 'c', value: 0.5 });
      classifications.push({ label: 'd', value: 0.5 });
      classifications.push({ label: 'e', value: 0.5 });
      classifications.push({ label: 'f', value: 0.5 });
      const result = manager.isEqualClassification(classifications);
      expect(result).toBeTruthy();
    });
    test('Should return false if first score is different than second score', () => {
      const manager = new NluManager();
      const classifications = [];
      classifications.push({ label: 'a', value: 0.7 });
      classifications.push({ label: 'b', value: 0.6 });
      classifications.push({ label: 'c', value: 0.6 });
      classifications.push({ label: 'd', value: 0.5 });
      classifications.push({ label: 'e', value: 0.5 });
      classifications.push({ label: 'f', value: 0.5 });
      const result = manager.isEqualClassification(classifications);
      expect(result).toBeFalsy();
    });
  });
});
