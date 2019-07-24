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

const { BrainNLU, DomainManager } = require('../../lib');

function addFoodDomain(manager) {
  manager.add('food', 'what do I have in my basket', 'order.check');
  manager.add('food', 'check my cart', 'order.check');
  manager.add('food', "show me what I've ordered", 'order.check');
  manager.add('food', "what's in my basket", 'order.check');
  manager.add('food', 'check my order', 'order.check');
  manager.add('food', 'check what I have ordered', 'order.check');
  manager.add('food', 'show my order', 'order.check');
  manager.add('food', 'check my basket', 'order.check');
  manager.add('food', 'how soon will it be delivered', 'order.check_status');
  manager.add('food', 'check the status of my delivery', 'order.check_status');
  manager.add('food', 'when should I expect delivery', 'order.check_status');
  manager.add(
    'food',
    'what is the status of my delivery',
    'order.check_status'
  );
  manager.add('food', 'check my order status', 'order.check_status');
  manager.add('food', 'where is my order', 'order.check_status');
  manager.add('food', 'where is my delivery', 'order.check_status');
  manager.add('food', 'status of my order', 'order.check_status');
}

function addPersonalityDomain(manager) {
  manager.add('personality', 'say about you', 'agent.acquaintance');
  manager.add('personality', 'why are you here', 'agent.acquaintance');
  manager.add('personality', 'what is your personality', 'agent.acquaintance');
  manager.add('personality', 'describe yourself', 'agent.acquaintance');
  manager.add('personality', 'tell me about yourself', 'agent.acquaintance');
  manager.add('personality', 'tell me about you', 'agent.acquaintance');
  manager.add('personality', 'what are you', 'agent.acquaintance');
  manager.add('personality', 'who are you', 'agent.acquaintance');
  manager.add('personality', 'talk about yourself', 'agent.acquaintance');
  manager.add('personality', 'your age', 'agent.age');
  manager.add('personality', 'how old is your platform', 'agent.age');
  manager.add('personality', 'how old are you', 'agent.age');
  manager.add('personality', "what's your age", 'agent.age');
  manager.add('personality', "I'd like to know your age", 'agent.age');
  manager.add('personality', 'tell me your age', 'agent.age');
  manager.add('personality', "you're annoying me", 'agent.annoying');
  manager.add('personality', 'you are such annoying', 'agent.annoying');
  manager.add('personality', 'you annoy me', 'agent.annoying');
  manager.add('personality', 'you are annoying', 'agent.annoying');
  manager.add('personality', 'you are irritating', 'agent.annoying');
  manager.add('personality', 'you are annoying me so much', 'agent.annoying');
  manager.add('personality', "you're bad", 'agent.bad');
  manager.add('personality', "you're horrible", 'agent.bad');
  manager.add('personality', "you're useless", 'agent.bad');
  manager.add('personality', "you're waste", 'agent.bad');
  manager.add('personality', "you're the worst", 'agent.bad');
  manager.add('personality', 'you are a lame', 'agent.bad');
  manager.add('personality', 'I hate you', 'agent.bad');
  manager.add('personality', 'be more clever', 'agent.beclever');
  manager.add('personality', 'can you get smarter', 'agent.beclever');
  manager.add('personality', 'you must learn', 'agent.beclever');
  manager.add('personality', 'you must study', 'agent.beclever');
  manager.add('personality', 'be clever', 'agent.beclever');
  manager.add('personality', 'be smart', 'agent.beclever');
  manager.add('personality', 'be smarter', 'agent.beclever');
  manager.add('personality', 'you are looking awesome', 'agent.beautiful');
  manager.add('personality', "you're looking good", 'agent.beautiful');
  manager.add('personality', "you're looking fantastic", 'agent.beautiful');
  manager.add('personality', 'you look greet today', 'agent.beautiful');
  manager.add('personality', "I think you're beautiful", 'agent.beautiful');
  manager.add('personality', 'you look amazing today', 'agent.beautiful');
  manager.add('personality', "you're so beautiful today", 'agent.beautiful');
  manager.add('personality', 'you look very pretty', 'agent.beautiful');
  manager.add('personality', 'you look pretty good', 'agent.beautiful');
  manager.add('personality', 'when is your birthday', 'agent.birthday');
  manager.add('personality', 'when were you born', 'agent.birthday');
  manager.add('personality', 'when do you have birthday', 'agent.birthday');
  manager.add('personality', 'date of your birthday', 'agent.birthday');
}

describe('Domain Manager', () => {
  describe('constructor', () => {
    test('Should create a new instance', () => {
      const manager = new DomainManager();
      expect(manager).toBeDefined();
    });
    test('Should initialize the default properties', () => {
      const manager = new DomainManager();
      expect(manager.language).toEqual('en');
      expect(manager.stemmer).toBeDefined();
      expect(manager.nluClassName).toEqual('BrainNLU');
      expect(manager.useMasterDomain).toBeTruthy();
      expect(manager.trainByDomain).toBeFalsy();
      expect(manager.keepStopwords).toBeTruthy();
      expect(manager.domains).toBeDefined();
    });
    test('I can decide to not use master domain', () => {
      const manager = new DomainManager({ useMasterDomain: false });
      expect(manager.useMasterDomain).toBeFalsy();
    });
    test('I can decide to not use train by domain', () => {
      const manager = new DomainManager({ trainByDomain: false });
      expect(manager.trainByDomain).toBeFalsy();
    });
    test('I can decide to not keep stopwords', () => {
      const manager = new DomainManager({ keepStopwords: false });
      expect(manager.keepStopwords).toBeFalsy();
    });
    test('I can decide to not use stem dictionary', () => {
      const manager = new DomainManager({ useStemDict: false });
      expect(manager.useStemDict).toBeFalsy();
    });
  });

  describe('Add Domain', () => {
    test('I can add domains', () => {
      const manager = new DomainManager();
      manager.addDomain('domain1');
      manager.addDomain('domain2');
      expect(manager.domains.domain1).toBeDefined();
      expect(manager.domains.domain2).toBeDefined();
    });
    test('I can provide the NLU', () => {
      const manager = new DomainManager();
      const nlu = new BrainNLU();
      manager.addDomain('domain1', nlu);
      expect(manager.domains.domain1).toBe(nlu);
    });
    test('When same domain is added, is not modified', () => {
      const manager = new DomainManager();
      const expected = manager.addDomain('domain1');
      const actual = manager.addDomain('domain1');
      expect(actual).toBe(expected);
    });
  });

  describe('Remove Domain', () => {
    test('I can remove domains', () => {
      const manager = new DomainManager();
      manager.addDomain('domain1');
      manager.removeDomain('domain1');
      expect(manager.domains.domain1).toBeUndefined();
    });
    test('If the domain does not exists do not crash', () => {
      const manager = new DomainManager();
      manager.removeDomain('domain1');
      expect(manager.domains.domain1).toBeUndefined();
    });
  });

  describe('Add', () => {
    test('I can add an utterance', () => {
      const manager = new DomainManager();
      manager.add('personality', 'who are you?', 'agent.acquaintance');
      expect(manager.domains.master_domain).toBeDefined();
      expect(manager.domains.master_domain.docs).toHaveLength(1);
    });
    test('I can add an utterance with train by domain', () => {
      const manager = new DomainManager({ trainByDomain: true });
      manager.add('personality', 'who are you?', 'agent.acquaintance');
      expect(manager.domains.personality).toBeDefined();
      expect(manager.domains.personality.docs).toHaveLength(1);
    });
    test('If I add the same utterance to different domain it changes', () => {
      const manager = new DomainManager({ trainByDomain: true });
      manager.add('personality1', 'who are you?', 'agent.acquaintance');
      manager.add('personality2', 'who are you?', 'agent.acquaintance');
      expect(manager.domains.personality1).toBeDefined();
      expect(manager.domains.personality1.docs).toHaveLength(0);
      expect(manager.domains.personality2).toBeDefined();
      expect(manager.domains.personality2.docs).toHaveLength(1);
    });
    test('If not training by domain, the domain should be the master', () => {
      const manager = new DomainManager({ trainByDomain: false });
      manager.add('personality', 'who are you?', 'agent.acquaintance');
      expect(manager.domains.personality).toBeUndefined();
      expect(manager.domains.master_domain).toBeDefined();
      expect(manager.domains.master_domain.docs).toHaveLength(1);
    });
  });

  describe('Remove', () => {
    test('Utterances can be removed when training by domain', () => {
      const manager = new DomainManager({ trainByDomain: true });
      manager.add('personality', 'who are you?', 'agent.acquaintance');
      manager.remove('personality', 'who are you', 'agent.acquaintance');
      expect(manager.domains.personality).toBeDefined();
      expect(manager.domains.personality.docs).toHaveLength(0);
    });
    test('Utterances can be removed when not training by domain', () => {
      const manager = new DomainManager();
      manager.add('personality', 'who are you?', 'agent.acquaintance');
      manager.remove('personality', 'who are you?', 'agent.acquaintance');
      expect(manager.domains.personality).toBeUndefined();
      expect(manager.domains.master_domain).toBeDefined();
      expect(manager.domains.master_domain.docs).toHaveLength(0);
    });
  });

  describe('Train', () => {
    test('One domain can be trained', async () => {
      const manager = new DomainManager();
      addFoodDomain(manager);
      await manager.train();
    });
    test('One domain can be trained if not training by domain', async () => {
      const manager = new DomainManager({ trainByDomain: false });
      addFoodDomain(manager);
      await manager.train();
    });
  });

  describe('Get Classifications', () => {
    test('It can classify using one domain', async () => {
      const manager = new DomainManager();
      addFoodDomain(manager);
      await manager.train();
      const actual = manager.getClassifications('tell me what is in my basket');
      expect(actual.domain).toEqual('food');
      expect(actual.classifications[0].label).toEqual('order.check');
      expect(actual.classifications[0].value).toBeGreaterThan(0.8);
    });
    test('If equal stem is provided, return 1 as value', async () => {
      const manager = new DomainManager();
      addFoodDomain(manager);
      await manager.train();
      const actual = manager.getClassifications('order my check');
      expect(actual.domain).toEqual('food');
      expect(actual.classifications[0].label).toEqual('order.check');
      expect(actual.classifications[0].value).toEqual(1);
    });
    test('If equal stem is provided, return 1 as value when more than 1 domain is trained', async () => {
      const manager = new DomainManager();
      addFoodDomain(manager);
      addPersonalityDomain(manager);
      await manager.train();
      const actual = manager.getClassifications('order my check');
      expect(actual.domain).toEqual('food');
      expect(actual.classifications[0].label).toEqual('order.check');
      expect(actual.classifications[0].value).toEqual(1);
    });
    test('If equal stem is provided, and no use stem dict, then value will be lower than 1', async () => {
      const manager = new DomainManager({ useStemDict: false });
      addFoodDomain(manager);
      await manager.train();
      const actual = manager.getClassifications('order my check');
      expect(actual.domain).toEqual('food');
      expect(actual.classifications[0].label).toEqual('order.check');
      expect(actual.classifications[0].value).toBeLessThan(1);
    });
    test('It can classify using more than one domain', async () => {
      const manager = new DomainManager();
      addFoodDomain(manager);
      addPersonalityDomain(manager);
      await manager.train();
      const actual = manager.getClassifications('tell me what is in my basket');
      expect(actual.domain).toEqual('food');
      expect(actual.classifications[0].label).toEqual('order.check');
      expect(actual.classifications[0].value).toBeGreaterThan(0.8);
    });
    test('It can classify using more than one domain when not training by domain', async () => {
      const manager = new DomainManager({ trainByDomain: false });
      addFoodDomain(manager);
      addPersonalityDomain(manager);
      await manager.train();
      const actual = manager.getClassifications('tell me what is in my basket');
      expect(actual.domain).toEqual('food');
      expect(actual.classifications[0].label).toEqual('order.check');
      expect(actual.classifications[0].value).toBeGreaterThan(0.8);
    });
    test('Domain name can be provided to classify', async () => {
      const manager = new DomainManager({ trainByDomain: true });
      addFoodDomain(manager);
      addPersonalityDomain(manager);
      await manager.train();
      const actual = manager.getClassifications(
        'tell me what is in my basket',
        'food'
      );
      expect(actual.domain).toEqual('food');
      expect(actual.classifications[0].label).toEqual('order.check');
      expect(actual.classifications[0].value).toBeGreaterThan(0.8);
    });
  });

  describe('fromObj and toObj', () => {
    test('It can be exported and imported', async () => {
      const manager = new DomainManager();
      addFoodDomain(manager);
      addPersonalityDomain(manager);
      await manager.train();
      const clone = new DomainManager();
      clone.fromObj(manager.toObj());
      const actual = clone.getClassifications('tell me what is in my basket');
      expect(actual.domain).toEqual('food');
      expect(actual.classifications[0].label).toEqual('order.check');
      expect(actual.classifications[0].value).toBeGreaterThan(0.8);
    });
  });

  describe('Begin Edit', () => {
    test('When edit mode begans, all domains pass to edit mode', () => {
      const manager = new DomainManager();
      manager.addDomain('domain1');
      manager.addDomain('domain2');
      expect(manager.domains.domain1.isEditing).toBeFalsy();
      expect(manager.domains.domain2.isEditing).toBeFalsy();
      manager.beginEdit();
      expect(manager.domains.domain1.isEditing).toBeTruthy();
      expect(manager.domains.domain2.isEditing).toBeTruthy();
    });
  });
});
