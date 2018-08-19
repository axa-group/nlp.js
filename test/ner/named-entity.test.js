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

const { NamedEntity } = require('../../lib');

describe('Named Entity', () => {
  describe('Constructor', () => {
    test('Should create an instance', () => {
      const entity = new NamedEntity({ name: 'entity' });
      expect(entity).toBeDefined();
    });
    test('Should initialize properties without settings', () => {
      const entity = new NamedEntity();
      expect(entity.name).toBeUndefined();
      expect(entity.options).toEqual([]);
      expect(entity.regex).toBeUndefined();
      expect(entity.type).toEqual('enum');
    });
    test('Should initialize properties', () => {
      const entity = new NamedEntity({ name: 'entity' });
      expect(entity.name).toEqual('entity');
      expect(entity.options).toEqual([]);
      expect(entity.regex).toBeUndefined();
      expect(entity.type).toEqual('enum');
    });
    test('Should create a regex named entity', () => {
      const regex = /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/ig;
      const entity = new NamedEntity({ name: 'entity', regex });
      expect(entity.name).toEqual('entity');
      expect(entity.options).toBeUndefined();
      expect(entity.regex).toEqual(regex);
      expect(entity.type).toEqual('regex');
    });
  });

  describe('Add Option', () => {
    test('Should add an option', () => {
      const entity = new NamedEntity({ name: 'entity' });
      entity.addOption('option1');
      expect(entity.options).toHaveLength(1);
      expect(entity.options[0].name).toEqual('option1');
    });
    test('If the option already exists, does not add a new one', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const option = entity.addOption('option1');
      const option2 = entity.addOption('option1');
      expect(option2).toBe(option);
      expect(entity.options).toHaveLength(1);
    });
  });

  describe('Get Option position', () => {
    test('Should return the position of an option', () => {
      const entity = new NamedEntity({ name: 'entity' });
      entity.addOption('option1');
      entity.addOption('option2');
      entity.addOption('option3');
      entity.addOption('option4');
      const pos = entity.getOptionPosition('option3');
      expect(pos).toEqual(2);
    });
    test('Should return -1 if the option does not exists', () => {
      const entity = new NamedEntity({ name: 'entity' });
      entity.addOption('option1');
      entity.addOption('option2');
      entity.addOption('option3');
      entity.addOption('option4');
      const pos = entity.getOptionPosition('option5');
      expect(pos).toEqual(-1);
    });
    test('Should return -1 if the entity is not enum', () => {
      const regex = /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/ig;
      const entity = new NamedEntity({ name: 'entity', regex });
      const pos = entity.getOptionPosition('option5');
      expect(pos).toEqual(-1);
    });
  });

  describe('Get Option', () => {
    test('Should return an option', () => {
      const entity = new NamedEntity({ name: 'entity' });
      entity.addOption('option1');
      entity.addOption('option2');
      const option = entity.addOption('option3');
      entity.addOption('option4');
      const option3 = entity.getOption('option3');
      expect(option3).toBe(option);
    });
    test('Should return undefined if the option does not exists', () => {
      const entity = new NamedEntity({ name: 'entity' });
      entity.addOption('option1');
      entity.addOption('option2');
      entity.addOption('option3');
      entity.addOption('option4');
      const option5 = entity.getOption('option5');
      expect(option5).toBeUndefined();
    });
  });

  describe('Remove option', () => {
    test('It should remove the option', () => {
      const entity = new NamedEntity({ name: 'entity' });
      entity.addOption('option1');
      entity.addOption('option2');
      entity.addOption('option3');
      entity.addOption('option4');
      entity.removeOption('option3');
      expect(entity.options).toHaveLength(3);
      let pos = entity.getOptionPosition('option3');
      expect(pos).toEqual(-1);
      pos = entity.getOptionPosition('option4');
      expect(pos).toEqual(2);
    });
    test('It should do nothing if the option does not exists', () => {
      const entity = new NamedEntity({ name: 'entity' });
      entity.addOption('option1');
      entity.addOption('option2');
      entity.addOption('option3');
      entity.addOption('option4');
      entity.removeOption('option5');
      expect(entity.options).toHaveLength(4);
    });
  });

  describe('Add Text', () => {
    test('It should add a text to a language', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const option = entity.addOption('option1');
      entity.addText('option1', 'en', 'option1_1');
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en).toHaveLength(1);
      expect(option.texts.en[0]).toEqual('option1_1');
    });
    test('You can add a text to several languages', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const option = entity.addOption('option1');
      entity.addText('option1', ['en', 'es'], 'option1_1');
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en).toHaveLength(1);
      expect(option.texts.en[0]).toEqual('option1_1');
      expect(option.texts.es).toBeDefined();
      expect(option.texts.es).toHaveLength(1);
      expect(option.texts.es[0]).toEqual('option1_1');
    });
    test('You can add several texts to a language', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const option = entity.addOption('option1');
      entity.addText('option1', 'en', ['option1_1', 'option1_2']);
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en).toHaveLength(2);
      expect(option.texts.en[0]).toEqual('option1_1');
      expect(option.texts.en[1]).toEqual('option1_2');
    });
    test('You can add several texts to several languages', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const option = entity.addOption('option1');
      entity.addText('option1', ['en', 'es'], ['option1_1', 'option1_2']);
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en).toHaveLength(2);
      expect(option.texts.en[0]).toEqual('option1_1');
      expect(option.texts.en[1]).toEqual('option1_2');
      expect(option.texts.es).toBeDefined();
      expect(option.texts.es).toHaveLength(2);
      expect(option.texts.es[0]).toEqual('option1_1');
      expect(option.texts.es[1]).toEqual('option1_2');
    });
    test('It can continue adding texts', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const option = entity.addOption('option1');
      entity.addText('option1', 'en', 'option1_1');
      entity.addText('option1', 'en', 'option1_2');
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en).toHaveLength(2);
      expect(option.texts.en[0]).toEqual('option1_1');
      expect(option.texts.en[1]).toEqual('option1_2');
    });
  });

  describe('Remove Text', () => {
    test('It should remove an existing text', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const option = entity.addOption('option1');
      entity.addText('option1', 'en', 'option1_1');
      entity.addText('option1', 'en', 'option1_2');
      entity.removeText('option1', 'en', 'option1_2');
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en).toHaveLength(1);
    });
    test('It should do nothing if the text does not exists', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const option = entity.addOption('option1');
      entity.addText('option1', 'en', 'option1_1');
      entity.addText('option1', 'en', 'option1_2');
      entity.removeText('option1', 'en', 'option1_3');
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en).toHaveLength(2);
    });
    test('It should do nothing if the language does not exists', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const option = entity.addOption('option1');
      entity.addText('option1', 'en', 'option1_1');
      entity.addText('option1', 'en', 'option1_2');
      entity.removeText('option1', 'es', 'option1_2');
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en).toHaveLength(2);
    });
    test('It should do nothing if the option does not exists', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const option = entity.addOption('option1');
      entity.addText('option1', 'en', 'option1_1');
      entity.addText('option1', 'en', 'option1_2');
      entity.removeText('option2', 'en', 'option1_2');
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en).toHaveLength(2);
    });
  });
});
