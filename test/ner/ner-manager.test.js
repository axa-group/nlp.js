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

const { SimilarSearch, NerManager } = require('../../lib');

describe('NER Manager', () => {
  describe('Constructor', () => {
    test('Should create an instance', () => {
      const manager = new NerManager();
      expect(manager).toBeDefined();
    });
    test('Should initialize properties', () => {
      const manager = new NerManager();
      expect(manager.threshold).toEqual(0.8);
      expect(manager.namedEntities).toBeDefined();
      expect(manager.similar).toBeInstanceOf(SimilarSearch);
    });
    test('Should initialize threshold if provided', () => {
      const manager = new NerManager({ threshold: 0.6 });
      expect(manager.threshold).toEqual(0.6);
    });
  });

  describe('Add named entity', () => {
    test('Should add a new named entity', () => {
      const manager = new NerManager();
      const entity = manager.addNamedEntity('entity1');
      expect(entity).toBeDefined();
      expect(entity.name).toEqual('entity1');
      expect(entity.locales).toEqual({});
    });
    test('Should return the same entity if already exists', () => {
      const manager = new NerManager();
      const entity1 = manager.addNamedEntity('entity1');
      const entity2 = manager.addNamedEntity('entity1');
      expect(entity1).toBe(entity2);
    });
    test('Should be able to add several entities', () => {
      const manager = new NerManager();
      const entity1 = manager.addNamedEntity('entity1');
      const entity2 = manager.addNamedEntity('entity2');
      expect(entity1.name).toEqual('entity1');
      expect(entity1.locales).toEqual({});
      expect(entity2.name).toEqual('entity2');
      expect(entity2.locales).toEqual({});
    });
  });

  describe('Get named entity', () => {
    test('Should get existing entity', () => {
      const manager = new NerManager();
      const entity1 = manager.addNamedEntity('entity1');
      const result = manager.getNamedEntity('entity1');
      expect(result).toBe(entity1);
    });
    test('Should return undefined if entity does not exists', () => {
      const manager = new NerManager();
      manager.addNamedEntity('entity1');
      const result = manager.getNamedEntity('entity2');
      expect(result).toBeUndefined();
    });
    test('Should create a new entity if forced and not exists', () => {
      const manager = new NerManager();
      manager.addNamedEntity('entity1');
      const result = manager.getNamedEntity('entity2', true);
      expect(result.name).toEqual('entity2');
      expect(result.locales).toEqual({});
    });
  });

  describe('Remove named entity', () => {
    test('Should remove an existing entity', () => {
      const manager = new NerManager();
      manager.addNamedEntity('entity1');
      manager.removeNamedEntity('entity1');
      const result = manager.getNamedEntity('entiy1');
      expect(result).toBeUndefined();
    });
    test('Should do nothing if entity does not exists', () => {
      const manager = new NerManager();
      manager.addNamedEntity('entity1');
      manager.removeNamedEntity('entity2');
      const result = manager.getNamedEntity('entity1');
      expect(result).toBeDefined();
    });
  });

  describe('Add named entity text', () => {
    test('Should add text for a given language', () => {
      const manager = new NerManager();
      manager.addNamedEntityText('entity1', 'option1', 'en', 'Something');
      const entity = manager.getNamedEntity('entity1', false);
      expect(entity.locales.en).toEqual({ option1: ['Something'] });
    });
    test('Should add several text for a given language', () => {
      const manager = new NerManager();
      manager.addNamedEntityText('entity1', 'option1', 'en', [
        'Something',
        'Anything',
      ]);
      const entity = manager.getNamedEntity('entity1', false);
      expect(entity.locales.en).toEqual({ option1: ['Something', 'Anything'] });
    });
    test('Should add several text for several languages', () => {
      const manager = new NerManager();
      manager.addNamedEntityText(
        'entity1',
        'option1',
        ['en', 'es'],
        ['Something', 'Anything']
      );
      const entity = manager.getNamedEntity('entity1', false);
      expect(entity.locales.en).toEqual({ option1: ['Something', 'Anything'] });
      expect(entity.locales.es).toEqual({ option1: ['Something', 'Anything'] });
    });
  });

  describe('Remove named entity text', () => {
    test('Should remove text for a given language', () => {
      const manager = new NerManager();
      manager.addNamedEntityText(
        'entity1',
        'option1',
        ['en', 'es'],
        ['Something', 'Anything']
      );
      manager.removeNamedEntityText('entity1', 'option1', 'es', 'Something');
      const entity = manager.getNamedEntity('entity1', false);
      expect(entity.locales.en).toEqual({ option1: ['Something', 'Anything'] });
      expect(entity.locales.es).toEqual({ option1: ['Anything'] });
    });
    test('Should remove texts for a given language', () => {
      const manager = new NerManager();
      manager.addNamedEntityText(
        'entity1',
        'option1',
        ['en', 'es'],
        ['Something', 'Anything']
      );
      manager.removeNamedEntityText('entity1', 'option1', 'es', [
        'Something',
        'Anything',
      ]);
      const entity = manager.getNamedEntity('entity1', false);
      expect(entity.locales.en).toEqual({ option1: ['Something', 'Anything'] });
      expect(entity.locales.es).toEqual({ option1: [] });
    });
    test('Should remove text for several languages', () => {
      const manager = new NerManager();
      manager.addNamedEntityText(
        'entity1',
        'option1',
        ['en', 'es'],
        ['Something', 'Anything']
      );
      manager.removeNamedEntityText(
        'entity1',
        'option1',
        ['en', 'es'],
        'Something'
      );
      const entity = manager.getNamedEntity('entity1', false);
      expect(entity.locales.en).toEqual({ option1: ['Anything'] });
      expect(entity.locales.es).toEqual({ option1: ['Anything'] });
    });
    test('Should do nothing if the entity does not exists', () => {
      const manager = new NerManager();
      manager.addNamedEntityText(
        'entity1',
        'option1',
        ['en', 'es'],
        ['Something', 'Anything']
      );
      manager.removeNamedEntityText(
        'entity2',
        'option1',
        ['en', 'es'],
        'Something'
      );
      const entity = manager.getNamedEntity('entity1', false);
      expect(entity.locales.en).toEqual({ option1: ['Something', 'Anything'] });
      expect(entity.locales.es).toEqual({ option1: ['Something', 'Anything'] });
    });
  });

  describe('Get entities from utterance', () => {
    test('Should find template entities inside utterance', () => {
      const manager = new NerManager();
      manager.addNamedEntity('entity1');
      manager.addNamedEntity('entity2');
      manager.addNamedEntity('entity3');
      const entities = manager.getEntitiesFromUtterance(
        'This is %entity1% from %entity3% yeah'
      );
      expect(entities).toEqual(['entity1', 'entity3']);
    });
    test('If some template is not entity should not be included', () => {
      const manager = new NerManager();
      manager.addNamedEntity('entity1');
      manager.addNamedEntity('entity2');
      manager.addNamedEntity('entity3');
      const entities = manager.getEntitiesFromUtterance(
        'This is %entity1% with %entity4% from %entity3% yeah'
      );
      expect(entities).toEqual(['entity1', 'entity3']);
    });
    test('Should find numerated entities inside utterance', () => {
      const manager = new NerManager();
      manager.addNamedEntity('hero');
      manager.addNamedEntity('food');
      const entities = manager.getEntitiesFromUtterance(
        'Those are %hero_1% and %hero_3%, with some %food% and %food_6%'
      );
      expect(entities).toEqual(['hero_1', 'hero_3', 'food', 'food_6']);
    });
  });

  describe('Find entities', () => {
    test('Should find an entity inside an utterance', async () => {
      const manager = new NerManager();
      manager.addNamedEntityText(
        'hero',
        'spiderman',
        ['en'],
        ['Spiderman', 'Spider-man']
      );
      manager.addNamedEntityText(
        'hero',
        'iron man',
        ['en'],
        ['iron man', 'iron-man']
      );
      manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
      const entities = await manager.findEntities(
        'I saw spiderman in the city',
        'en'
      );
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(1);
      expect(entities[0].start).toEqual(6);
      expect(entities[0].end).toEqual(14);
      expect(entities[0].levenshtein).toEqual(0);
      expect(entities[0].accuracy).toEqual(1);
      expect(entities[0].option).toEqual('spiderman');
      expect(entities[0].sourceText).toEqual('Spiderman');
      expect(entities[0].entity).toEqual('hero');
      expect(entities[0].utteranceText).toEqual('spiderman');
    });
    test('Should find chinese entities', async () => {
      const manager = new NerManager();
      manager.addNamedEntityText('place', '餐廳', ['zh'], ['餐廳']);
      const entities = await manager.findEntities('找餐廳', 'zh');
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(1);
      expect(entities[0].start).toEqual(1);
      expect(entities[0].end).toEqual(2);
      expect(entities[0].levenshtein).toEqual(0);
      expect(entities[0].accuracy).toEqual(1);
      expect(entities[0].option).toEqual('餐廳');
      expect(entities[0].sourceText).toEqual('餐廳');
      expect(entities[0].entity).toEqual('place');
      expect(entities[0].utteranceText).toEqual('餐廳');
    });
    test('Should find an entity if levenshtein greater than threshold', async () => {
      const manager = new NerManager({ threshold: 0.8 });
      manager.addNamedEntityText(
        'hero',
        'spiderman',
        ['en'],
        ['Spiderman', 'Spider-man']
      );
      manager.addNamedEntityText(
        'hero',
        'iron man',
        ['en'],
        ['iron man', 'iron-man']
      );
      manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
      const entities = await manager.findEntities(
        'I saw spederman in the city',
        'en'
      );
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(1);
      expect(entities[0].start).toEqual(6);
      expect(entities[0].end).toEqual(14);
      expect(entities[0].levenshtein).toEqual(1);
      expect(entities[0].accuracy).toEqual(0.8888888888888888);
      expect(entities[0].option).toEqual('spiderman');
      expect(entities[0].sourceText).toEqual('Spiderman');
      expect(entities[0].entity).toEqual('hero');
      expect(entities[0].utteranceText).toEqual('spederman');
    });
    test('Should not find an entity if levenshtein less than threshold', async () => {
      const manager = new NerManager({ threshold: 0.8 });
      manager.addNamedEntityText(
        'hero',
        'spiderman',
        ['en'],
        ['Spiderman', 'Spider-man']
      );
      manager.addNamedEntityText(
        'hero',
        'iron man',
        ['en'],
        ['iron man', 'iron-man']
      );
      manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
      const entities = await manager.findEntities(
        'I saw spererman in the city',
        'en'
      );
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(0);
    });
    test('Should find several entities inside an utterance', async () => {
      const manager = new NerManager();
      manager.addNamedEntityText(
        'hero',
        'spiderman',
        ['en'],
        ['Spiderman', 'Spider-man']
      );
      manager.addNamedEntityText(
        'hero',
        'iron man',
        ['en'],
        ['iron man', 'iron-man']
      );
      manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
      manager.addNamedEntityText(
        'food',
        'burguer',
        ['en'],
        ['Burguer', 'Hamburguer']
      );
      manager.addNamedEntityText('food', 'pizza', ['en'], ['pizza']);
      manager.addNamedEntityText(
        'food',
        'pasta',
        ['en'],
        ['Pasta', 'spaghetti']
      );
      const entities = await manager.findEntities(
        'I saw spiderman eating spaghetti in the city',
        'en'
      );
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(2);
      expect(entities[0].option).toEqual('spiderman');
      expect(entities[0].sourceText).toEqual('Spiderman');
      expect(entities[0].entity).toEqual('hero');
      expect(entities[0].utteranceText).toEqual('spiderman');
      expect(entities[1].option).toEqual('pasta');
      expect(entities[1].sourceText).toEqual('spaghetti');
      expect(entities[1].entity).toEqual('food');
      expect(entities[1].utteranceText).toEqual('spaghetti');
    });
    test('Should return an empty array if the utterance is empty', async () => {
      const manager = new NerManager();
      manager.addNamedEntityText(
        'hero',
        'spiderman',
        ['en'],
        ['Spiderman', 'Spider-man']
      );
      manager.addNamedEntityText(
        'hero',
        'iron man',
        ['en'],
        ['iron man', 'iron-man']
      );
      manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
      manager.addNamedEntityText(
        'food',
        'burguer',
        ['en'],
        ['Burguer', 'Hamburguer']
      );
      manager.addNamedEntityText('food', 'pizza', ['en'], ['pizza']);
      manager.addNamedEntityText(
        'food',
        'pasta',
        ['en'],
        ['Pasta', 'spaghetti']
      );
      const entities = await manager.findEntities('', 'en');
      expect(entities).toBeDefined();
      expect(entities).toEqual([]);
    });
  });
  describe('Find entities by Regex', () => {
    test('Should find an entity by regex inside an utterance', async () => {
      const manager = new NerManager();
      const entity = manager.addNamedEntity('mail', 'regex');
      entity.addRegex('en', /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi);
      const entities = await manager.findEntities(
        'My email is jseijas@gmail.com and yours is not',
        'en'
      );
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(1);
      expect(entities[0].start).toEqual(12);
      expect(entities[0].end).toEqual(29);
      expect(entities[0].accuracy).toEqual(1);
      expect(entities[0].sourceText).toEqual('jseijas@gmail.com');
      expect(entities[0].entity).toEqual('mail');
      expect(entities[0].utteranceText).toEqual('jseijas@gmail.com');
    });
  });
  describe('Find entities by Trim', () => {
    test('Should find entities by trim', async () => {
      const manager = new NerManager();
      const fromEntity = manager.addNamedEntity('fromLocation', 'trim');
      fromEntity.addBetweenCondition('en', 'from', 'to');
      fromEntity.addAfterLastCondition('en', 'from');
      const toEntity = manager.addNamedEntity('toLocation', 'trim');
      toEntity.addBetweenCondition('en', 'to', 'from');
      toEntity.addAfterLastCondition('en', 'to');
      const entities = await manager.findEntities(
        'I want to travel from Barcelona to Madrid',
        'en'
      );
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(3);
      expect(entities[0]).toEqual({
        accuracy: 1,
        end: 15,
        len: 6,
        entity: 'toLocation',
        sourceText: 'travel',
        start: 10,
        type: 'between',
        utteranceText: 'travel',
      });
      expect(entities[1]).toEqual({
        accuracy: 1,
        end: 30,
        len: 9,
        entity: 'fromLocation',
        sourceText: 'Barcelona',
        start: 22,
        type: 'between',
        utteranceText: 'Barcelona',
      });
      expect(entities[2]).toEqual({
        accuracy: 0.99,
        end: 40,
        len: 6,
        entity: 'toLocation',
        sourceText: 'Madrid',
        start: 35,
        type: 'afterLast',
        utteranceText: 'Madrid',
      });
    });
    test('A skip word list can be provided', async () => {
      const manager = new NerManager();
      const fromEntity = manager.addNamedEntity('fromLocation', 'trim');
      fromEntity.addBetweenCondition('en', 'from', 'to');
      fromEntity.addAfterLastCondition('en', 'from');
      const toEntity = manager.addNamedEntity('toLocation', 'trim');
      toEntity.addBetweenCondition('en', 'to', 'from', { skip: ['travel'] });
      toEntity.addAfterLastCondition('en', 'to');
      const entities = await manager.findEntities(
        'I want to travel from Barcelona to Madrid',
        'en'
      );
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(2);
      expect(entities[0]).toEqual({
        accuracy: 1,
        end: 30,
        len: 9,
        entity: 'fromLocation',
        sourceText: 'Barcelona',
        start: 22,
        type: 'between',
        utteranceText: 'Barcelona',
      });
      expect(entities[1]).toEqual({
        accuracy: 0.99,
        end: 40,
        len: 6,
        entity: 'toLocation',
        sourceText: 'Madrid',
        start: 35,
        type: 'afterLast',
        utteranceText: 'Madrid',
      });
    });
    test('Trim entities can be splitted to fit with other entities', async () => {
      const manager = new NerManager();
      const fromEntity = manager.addNamedEntity('fromLocation', 'trim');
      fromEntity.addBetweenCondition('en', 'from', 'to');
      fromEntity.addAfterLastCondition('en', 'from');
      const toEntity = manager.addNamedEntity('toLocation', 'trim');
      toEntity.addBetweenCondition('en', 'to', 'from', { skip: ['travel'] });
      toEntity.addAfterLastCondition('en', 'to');
      const entities = await manager.findEntities(
        'I want to travel from Barcelona to Madrid tomorrow',
        'en'
      );
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(3);
      expect(entities[0]).toEqual({
        accuracy: 1,
        end: 30,
        len: 9,
        entity: 'fromLocation',
        sourceText: 'Barcelona',
        start: 22,
        type: 'between',
        utteranceText: 'Barcelona',
      });
      expect(entities[1]).toEqual({
        accuracy: 0.99,
        end: 40,
        len: 6,
        entity: 'toLocation',
        sourceText: 'Madrid',
        start: 35,
        type: 'afterLast',
        utteranceText: 'Madrid',
      });
      expect(entities[2].utteranceText).toEqual('tomorrow');
      expect(entities[2].entity).toEqual('date');
    });
  });

  describe('Find numbered entities', () => {
    async function findEntities(utterance, whitelist) {
      const manager = new NerManager();
      manager.addNamedEntityText('hero', 'ironman', ['en'], ['iron man']);
      manager.addNamedEntityText('hero', 'spiderman', ['en'], ['Spider-man']);
      manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
      manager.addNamedEntityText('food', 'pizza', ['en'], ['pizza']);
      manager.addNamedEntityText('food', 'pasta', ['en'], ['spaghetti']);
      return manager.findEntities(utterance, 'en', whitelist);
    }
    test('Should find numbered entities', async () => {
      const entities = await findEntities(
        'I saw spiderman eating spaghetti and ironman eating pizza',
        ['hero_1', 'hero_2', 'food_1', 'food_2']
      );
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(4);
      expect(entities[0].option).toEqual('spiderman');
      expect(entities[0].sourceText).toEqual('Spider-man');
      expect(entities[0].entity).toEqual('hero_1');
      expect(entities[0].utteranceText).toEqual('spiderman');
      expect(entities[1].option).toEqual('pasta');
      expect(entities[1].sourceText).toEqual('spaghetti');
      expect(entities[1].entity).toEqual('food_1');
      expect(entities[1].utteranceText).toEqual('spaghetti');
      expect(entities[2].option).toEqual('ironman');
      expect(entities[2].sourceText).toEqual('iron man');
      expect(entities[2].entity).toEqual('hero_2');
      expect(entities[2].utteranceText).toEqual('ironman');
      expect(entities[3].option).toEqual('pizza');
      expect(entities[3].sourceText).toEqual('pizza');
      expect(entities[3].entity).toEqual('food_2');
      expect(entities[3].utteranceText).toEqual('pizza');
    });
    test('Should find numbered and non-numbered entities', async () => {
      const entities = await findEntities(
        'I saw spiderman together with ironman, they where eating spaghetti',
        ['hero_1', 'hero_2', 'food']
      );
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(3);
      expect(entities[0].option).toEqual('spiderman');
      expect(entities[0].sourceText).toEqual('Spider-man');
      expect(entities[0].entity).toEqual('hero_1');
      expect(entities[0].utteranceText).toEqual('spiderman');
      expect(entities[1].option).toEqual('ironman');
      expect(entities[1].sourceText).toEqual('iron man');
      expect(entities[1].entity).toEqual('hero_2');
      expect(entities[1].utteranceText).toEqual('ironman');
      expect(entities[2].option).toEqual('pasta');
      expect(entities[2].sourceText).toEqual('spaghetti');
      expect(entities[2].entity).toEqual('food');
      expect(entities[2].utteranceText).toEqual('spaghetti');
    });
    test('Should assign the whitelist names to the entities', async () => {
      const entities = await findEntities(
        'I saw spiderman together with ironman, they where eating spaghetti',
        ['hero', 'hero_2', 'food_6']
      );
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(3);
      expect(entities[0].option).toEqual('spiderman');
      expect(entities[0].sourceText).toEqual('Spider-man');
      expect(entities[0].entity).toEqual('hero');
      expect(entities[0].utteranceText).toEqual('spiderman');
      expect(entities[1].option).toEqual('ironman');
      expect(entities[1].sourceText).toEqual('iron man');
      expect(entities[1].entity).toEqual('hero_2');
      expect(entities[1].utteranceText).toEqual('ironman');
      expect(entities[2].option).toEqual('pasta');
      expect(entities[2].sourceText).toEqual('spaghetti');
      expect(entities[2].entity).toEqual('food_6');
      expect(entities[2].utteranceText).toEqual('spaghetti');
    });
    test('Should assign names to found entities in whitelist order', async () => {
      const entities = await findEntities(
        'I saw spiderman together with ironman, they where eating spaghetti',
        ['hero_1', 'hero_2', 'hero_3', 'food_1', 'food_2']
      );
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(3);
      expect(entities[0].option).toEqual('spiderman');
      expect(entities[0].sourceText).toEqual('Spider-man');
      expect(entities[0].entity).toEqual('hero_1');
      expect(entities[0].utteranceText).toEqual('spiderman');
      expect(entities[1].option).toEqual('ironman');
      expect(entities[1].sourceText).toEqual('iron man');
      expect(entities[1].entity).toEqual('hero_2');
      expect(entities[1].utteranceText).toEqual('ironman');
      expect(entities[2].option).toEqual('pasta');
      expect(entities[2].sourceText).toEqual('spaghetti');
      expect(entities[2].entity).toEqual('food_1');
      expect(entities[2].utteranceText).toEqual('spaghetti');
    });
    test('Should use numbered names only once', async () => {
      const entities = await findEntities(
        'I saw spiderman eating spaghetti and ironman eating pizza',
        ['hero_2', 'food_2']
      );
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(4);
      expect(entities[0].option).toEqual('spiderman');
      expect(entities[0].sourceText).toEqual('Spider-man');
      expect(entities[0].entity).toEqual('hero_2');
      expect(entities[0].utteranceText).toEqual('spiderman');
      expect(entities[1].option).toEqual('pasta');
      expect(entities[1].sourceText).toEqual('spaghetti');
      expect(entities[1].entity).toEqual('food_2');
      expect(entities[1].utteranceText).toEqual('spaghetti');
      expect(entities[2].option).toEqual('ironman');
      expect(entities[2].sourceText).toEqual('iron man');
      expect(entities[2].entity).toEqual('hero');
      expect(entities[2].utteranceText).toEqual('ironman');
      expect(entities[3].option).toEqual('pizza');
      expect(entities[3].sourceText).toEqual('pizza');
      expect(entities[3].entity).toEqual('food');
      expect(entities[3].utteranceText).toEqual('pizza');
    });
  });

  describe('Generate entity utterance', () => {
    test('Should replace entities by their names', async () => {
      const manager = new NerManager();
      manager.addNamedEntityText('hero', 'ironman', ['en'], ['ironman']);
      manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
      manager.addNamedEntityText('food', 'pizza', ['en'], ['pizza']);
      const utterance = 'I saw thor and ironman, they where eating pizza';
      const result = await manager.generateEntityUtterance(utterance, 'en');
      expect(result).toEqual(
        'I saw %hero% and %hero%, they where eating %food%'
      );
    });
    test('Should replace nothing if no entities', async () => {
      const manager = new NerManager();
      const utterance = 'I saw thor and ironman, they where eating pizza';
      const result = await manager.generateEntityUtterance(utterance, 'en');
      expect(result).toEqual('I saw thor and ironman, they where eating pizza');
    });
  });
});
