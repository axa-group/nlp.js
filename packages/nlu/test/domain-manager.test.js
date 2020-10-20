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

const { DomainManager } = require('../src');
const container = require('./bootstrap');
const { addFoodDomain, addPersonalityDomain } = require('./domains');

describe('Domain Manager', () => {
  describe('Constructor', () => {
    test('It should create a new instance without settings', () => {
      const manager = new DomainManager();
      expect(manager).toBeDefined();
    });
    test('It should create a new instance', () => {
      const manager = new DomainManager({ container });
      expect(manager).toBeDefined();
    });
    test('A locale can be provided', () => {
      const manager = new DomainManager({ container, locale: 'es' });
      expect(manager.settings.locale).toEqual('es');
    });
    test('If the locale is not provided, will be en by default', () => {
      const manager = new DomainManager({ container });
      expect(manager.settings.locale).toEqual('en');
    });
    test('A tag can be provided', () => {
      const manager = new DomainManager({ container, tag: 'different-tag' });
      expect(manager.settings.tag).toEqual('different-tag');
    });
    test('If a tag is not provided, creates a default one based on locale', () => {
      const manager = new DomainManager({ container, locale: 'es' });
      expect(manager.settings.tag).toEqual('domain-manager-es');
    });
    test('A default domain should be added', () => {
      const manager = new DomainManager({ container });
      expect(manager.domains).toBeDefined();
      expect(manager.domains.master_domain).toBeDefined();
    });
    test('The stem dictionary should be created', () => {
      const manager = new DomainManager({ container });
      expect(manager.stemDict).toEqual({});
    });
    test('The intent dictionary should be created', () => {
      const manager = new DomainManager({ container });
      expect(manager.intentDict).toEqual({});
    });
  });

  describe('Get Domain instance', () => {
    test('By default, the instances are NeuralNlu', () => {
      const manager = new DomainManager({ container });
      const instance = manager.getDomainInstance('domain');
      expect(instance).toBeDefined();
      expect(instance.constructor.name).toEqual('NeuralNlu');
    });
    test('Different classes can be registered by domain', () => {
      const manager = new DomainManager({ container });
      manager.settings.nluByDomain.domain2 = {
        className: 'OtherNlu',
        settings: {},
      };
      const instance = manager.getDomainInstance('domain');
      expect(instance.constructor.name).toEqual('NeuralNlu');
      const instance2 = manager.getDomainInstance('domain2');
      expect(instance2.constructor.name).toEqual('OtherNlu');
    });
    test('If className is undefined, NeuralNlu is used', () => {
      const manager = new DomainManager({ container });
      manager.settings.nluByDomain.domain2 = {
        className: undefined,
        settings: undefined,
      };
      const instance = manager.getDomainInstance('domain');
      expect(instance.constructor.name).toEqual('NeuralNlu');
      const instance2 = manager.getDomainInstance('domain2');
      expect(instance2.constructor.name).toEqual('NeuralNlu');
    });
  });

  describe('Add domain', () => {
    test('A domain can be added', () => {
      const manager = new DomainManager({ container });
      const instance = manager.addDomain('domain');
      expect(instance).toBeDefined();
    });
    test('If the same domain is added twice, second time returns the same instance', () => {
      const manager = new DomainManager({ container });
      const instance = manager.addDomain('domain');
      expect(instance).toBeDefined();
      const instance2 = manager.addDomain('domain');
      expect(instance2).toBe(instance);
    });
  });

  describe('Remove domain', () => {
    test('A domain can be removed', () => {
      const manager = new DomainManager({ container });
      const instance = manager.addDomain('domain');
      expect(instance).toBeDefined();
      manager.removeDomain('domain');
      const instance2 = manager.addDomain('domain');
      expect(instance2).toBeDefined();
      expect(instance2).not.toBe(instance);
    });
  });

  describe('Prepare', () => {
    test('it can prepare an string', async () => {
      const manager = new DomainManager({ container });
      const tokens = await manager.prepare('There is a developer');
      expect(tokens).toEqual({ a: 1, developer: 1, is: 1, there: 1 });
    });
  });

  describe('Generate stem key', () => {
    test('An stem key can be generated for a utterance', async () => {
      const manager = new DomainManager({ container });
      const key = await manager.generateStemKey('There is a developer');
      expect(key).toEqual('a,developer,is,there');
    });
    test('An stem key can be generated for an array os stems', async () => {
      const manager = new DomainManager({ container });
      const key = await manager.generateStemKey([
        'there',
        'is',
        'a',
        'developer',
      ]);
      expect(key).toEqual('a,developer,is,there');
    });
  });

  describe('Add', () => {
    test('A sentence can be added', () => {
      const manager = new DomainManager({ container });
      manager.add('domain', 'something utterance', 'intent1');
      expect(manager.sentences).toHaveLength(1);
      expect(manager.sentences[0].intent).toEqual('intent1');
      expect(manager.sentences[0].utterance).toEqual('something utterance');
      expect(manager.sentences[0].domain).toEqual('domain');
    });
    test('Domain can be skipped', () => {
      const manager = new DomainManager({ container });
      manager.add('something utterance', 'intent1');
      expect(manager.sentences).toHaveLength(1);
      expect(manager.sentences[0].intent).toEqual('intent1');
      expect(manager.sentences[0].utterance).toEqual('something utterance');
      expect(manager.sentences[0].domain).toEqual('master_domain');
    });
  });

  describe('remove', () => {
    test('A sentence can be removed', () => {
      const manager = new DomainManager({ container });
      manager.add('domain', 'something utterance', 'intent1');
      expect(manager.sentences).toHaveLength(1);
      manager.remove('domain', 'something utterance', 'intent1');
      expect(manager.sentences).toHaveLength(0);
    });
    test('A sentence can be removed with domain skipped', () => {
      const manager = new DomainManager({ container });
      manager.add('something utterance', 'intent1');
      expect(manager.sentences).toHaveLength(1);
      manager.remove('something utterance', 'intent1');
      expect(manager.sentences).toHaveLength(0);
    });
    test('If the sentence does not exists, then do nothing', () => {
      const manager = new DomainManager({ container });
      manager.add('domain', 'something utterance', 'intent1');
      expect(manager.sentences).toHaveLength(1);
      manager.remove('domain', 'something utterance', 'intent2');
      expect(manager.sentences).toHaveLength(1);
    });
  });

  describe('Generate Corpus', () => {
    test('A domain can be generated', async () => {
      const manager = new DomainManager({ container });
      addFoodDomain(manager);
      const input = {};
      const output = await manager.generateCorpus(input);
      expect(output.corpus).toBeDefined();
      expect(output.corpus.master_domain).toBeDefined();
      expect(output.corpus.master_domain).toHaveLength(16);
      expect(output.corpus.master_domain[0].intent).toEqual('order.check');
    });
    test('Several domains can be generated', async () => {
      const manager = new DomainManager({ container });
      addFoodDomain(manager);
      addPersonalityDomain(manager);
      const input = {};
      const output = await manager.generateCorpus(input);
      expect(output.corpus).toBeDefined();
      expect(output.corpus.master_domain).toBeDefined();
      expect(output.corpus.master_domain).toHaveLength(64);
    });
    test('If train by domain the corpus will be by domain', async () => {
      const manager = new DomainManager({ container, trainByDomain: true });
      addFoodDomain(manager);
      const input = {};
      const output = await manager.generateCorpus(input);
      expect(output.corpus).toBeDefined();
      expect(output.corpus.master_domain).toBeDefined();
      expect(output.corpus.master_domain).toHaveLength(16);
      expect(output.corpus.food).toBeDefined();
      expect(output.corpus.food).toHaveLength(16);
      expect(output.corpus.master_domain[0].intent).toEqual('food');
    });
  });

  describe('Train and process', () => {
    test('Can be trained all together', async () => {
      const manager = new DomainManager({ container });
      addFoodDomain(manager);
      addPersonalityDomain(manager);
      await manager.train();
      const actual = await manager.process('tell me what is in my basket');
      expect(actual.domain).toEqual('food');
      expect(actual.classifications[0].intent).toEqual('order.check');
      expect(actual.classifications[0].score).toBeGreaterThan(0.5);
    });
    test('Can be trained twice', async () => {
      const manager = new DomainManager({ container });
      addFoodDomain(manager);
      addPersonalityDomain(manager);
      await manager.train();
      await manager.train();
      const actual = await manager.process('tell me what is in my basket');
      expect(actual.domain).toEqual('food');
      expect(actual.classifications[0].intent).toEqual('order.check');
      expect(actual.classifications[0].score).toBeGreaterThan(0.5);
    });
    test('Can be trained by domain', async () => {
      const manager = new DomainManager({ container, trainByDomain: true });
      addFoodDomain(manager);
      addPersonalityDomain(manager);
      await manager.train();
      const actual = await manager.process('tell me what is in my basket');
      expect(actual.domain).toEqual('food');
      expect(actual.classifications[0].intent).toEqual('order.check');
      expect(actual.classifications[0].score).toBeGreaterThan(0.5);
    });
    test('Will have score 1 if stems are in stem dict', async () => {
      const manager = new DomainManager({ container, trainByDomain: true });
      addFoodDomain(manager);
      addPersonalityDomain(manager);
      await manager.train();
      const actual = await manager.process('check my cart');
      expect(actual.domain).toEqual('food');
      expect(actual.classifications[0].intent).toEqual('order.check');
      expect(actual.classifications[0].score).toEqual(1);
    });
  });
});
