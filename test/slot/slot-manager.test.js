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

const { SlotManager } = require('../../lib');

describe('Slot Manager', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const manager = new SlotManager();
      expect(manager).toBeDefined();
    });
    test('It should initialize properties', () => {
      const manager = new SlotManager();
      expect(manager.intents).toEqual({});
    });
  });

  describe('Add slot', () => {
    test('I can add a new slot', () => {
      const manager = new SlotManager();
      const slot = manager.addSlot('intent', 'entity');
      expect(slot).toEqual({
        intent: 'intent',
        entity: 'entity',
        mandatory: false,
        locales: {},
      });
    });
    test('I can set the slot to be mandatory', () => {
      const manager = new SlotManager();
      const slot = manager.addSlot('intent', 'entity', true);
      expect(slot).toEqual({
        intent: 'intent',
        entity: 'entity',
        mandatory: true,
        locales: {},
      });
    });
    test('I can set questions by language to the slot', () => {
      const manager = new SlotManager();
      const questions = {
        en: 'Enter the entity',
        es: 'Dime la entidad',
      };
      const slot = manager.addSlot('intent', 'entity', true, questions);
      expect(slot).toEqual({
        intent: 'intent',
        entity: 'entity',
        mandatory: true,
        locales: {
          en: 'Enter the entity',
          es: 'Dime la entidad',
        },
      });
    });
  });
  describe('Get Slot', () => {
    test('I can get an slot', () => {
      const manager = new SlotManager();
      const questions = {
        en: 'Enter the entity',
        es: 'Dime la entidad',
      };
      manager.addSlot('intent', 'entity', true, questions);
      const slot = manager.getSlot('intent', 'entity');
      expect(slot).toEqual({
        intent: 'intent',
        entity: 'entity',
        mandatory: true,
        locales: {
          en: 'Enter the entity',
          es: 'Dime la entidad',
        },
      });
    });
    test('If the entity does not exists should return undefined', () => {
      const manager = new SlotManager();
      manager.addSlot('intent', 'entity');
      const slot = manager.getSlot('intent', 'entit');
      expect(slot).toBeUndefined();
    });
    test('If the intent does not exists should return undefined', () => {
      const manager = new SlotManager();
      manager.addSlot('intent', 'entity');
      const slot = manager.getSlot('inten', 'entity');
      expect(slot).toBeUndefined();
    });
  });

  describe('Exists Slot', () => {
    test('Should return true if the slot exists', () => {
      const manager = new SlotManager();
      manager.addSlot('intent', 'entity');
      const actual = manager.existsSlot('intent', 'entity');
      expect(actual).toBeTruthy();
    });
    test('If the entity does not exists should return false', () => {
      const manager = new SlotManager();
      manager.addSlot('intent', 'entity');
      const actual = manager.existsSlot('intent', 'entit');
      expect(actual).toBeFalsy();
    });
    test('If the intent does not exists should return false', () => {
      const manager = new SlotManager();
      manager.addSlot('intent', 'entity');
      const actual = manager.existsSlot('inten', 'entity');
      expect(actual).toBeFalsy();
    });
  });

  describe('Remove Slot', () => {
    test('Should remove a slot', () => {
      const manager = new SlotManager();
      manager.addSlot('intent', 'entity');
      manager.removeSlot('intent', 'entity');
      const actual = manager.existsSlot('intent', 'entity');
      expect(actual).toBeFalsy();
    });
    test('Should do nothing if the entity does not exists', () => {
      const manager = new SlotManager();
      manager.addSlot('intent', 'entity');
      manager.removeSlot('intent', 'entit');
      const actual = manager.existsSlot('intent', 'entity');
      expect(actual).toBeTruthy();
    });
    test('Should do nothing if the intent does not exists', () => {
      const manager = new SlotManager();
      manager.addSlot('intent', 'entity');
      manager.removeSlot('inten', 'entity');
      const actual = manager.existsSlot('intent', 'entity');
      expect(actual).toBeTruthy();
    });
  });

  describe('Add Batch', () => {
    test('Should add several entities to an intent', () => {
      const manager = new SlotManager();
      manager.addBatch('intent', ['entity1', 'entity2']);
      const actual1 = manager.existsSlot('intent', 'entity1');
      expect(actual1).toBeTruthy();
      const actual2 = manager.existsSlot('intent', 'entity2');
      expect(actual2).toBeTruthy();
    });
    test('If no entity is provided do nothing', () => {
      const manager = new SlotManager();
      manager.addBatch('intent', []);
      const actual = manager.existsSlot('intent', 'entity1');
      expect(actual).toBeFalsy();
    });
    test('If entity is undefined do nothing', () => {
      const manager = new SlotManager();
      manager.addBatch('intent');
      const actual = manager.existsSlot('intent', 'entity1');
      expect(actual).toBeFalsy();
    });
    test('If an entity already exists don\'t replace it', () => {
      const manager = new SlotManager();
      const questions = {
        en: 'Enter the entity',
        es: 'Dime la entidad',
      };
      manager.addSlot('intent', 'entity2', true, questions);
      manager.addBatch('intent', ['entity1', 'entity2']);
      const slot = manager.getSlot('intent', 'entity2');
      expect(slot).toEqual({
        intent: 'intent',
        entity: 'entity2',
        mandatory: true,
        locales: {
          en: 'Enter the entity',
          es: 'Dime la entidad',
        },
      });
      const actual = manager.existsSlot('intent', 'entity1');
      expect(actual).toBeTruthy();
    });
  });
  describe('Get intent entity names', () => {
    test('It should return a list with the name of the entities', () => {
      const manager = new SlotManager();
      manager.addBatch('intent', ['entity1', 'entity2']);
      const actual = manager.getIntentEntityNames('intent');
      expect(actual).toEqual(['entity1', 'entity2']);
    });
    test('If the intent does not exists return undefined', () => {
      const manager = new SlotManager();
      const actual = manager.getIntentEntityNames('intent');
      expect(actual).toBeUndefined();
    });
  });
  describe('Clear', () => {
    test('It should empty the intents property', () => {
      const manager = new SlotManager();
      manager.addBatch('intent', ['entity1', 'entity2']);
      manager.clear();
      expect(manager.intents).toEqual({});
    });
  });
  describe('Load', () => {
    test('It should load', () => {
      const manager = new SlotManager();
      const src = {
        intent: 'intent',
        entity: 'entity2',
        mandatory: true,
        locales: {
          en: 'Enter the entity',
          es: 'Dime la entidad',
        },
      };
      manager.load({
        intents: {
          intent: {
            entity: src,
          },
        },
      });
      const slot = manager.getSlot('intent', 'entity');
      expect(slot).toEqual(src);
    });
    test('It should clear if undefined is provided', () => {
      const manager = new SlotManager();
      manager.addBatch('intent', ['entity1', 'entity2']);
      manager.load();
      expect(manager.intents).toEqual({});
    });
  });
});


// load(src) {
//   this.intents = src ? src.intents || {} : {};
// }

// save() {
//   return this.intents;
// }