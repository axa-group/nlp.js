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

const { EnumNamedEntity, SimilarSearch } = require('../../lib');

describe('Enum Named Entity', () => {
  describe('Constructor', () => {
    test('It should create one instance', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      expect(entity).toBeDefined();
    });
  });
  describe('Get option', () => {
    test('It should create an option for a given language', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      const option = entity.getOption('en', 'option1');
      expect(option).toEqual([]);
      const locale = entity.getLocale('en');
      expect(locale).toEqual({ option1: [] });
    });
    test('If the same option is asked twice return the same one', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      const optionA = entity.getOption('en', 'option1');
      const optionB = entity.getOption('en', 'option1');
      expect(optionA).toBe(optionB);
    });
    test('If create is false, should not create the locale', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      const optionA = entity.getOption('en', 'option1', false);
      expect(optionA).toBeUndefined();
      const locale = entity.getLocale('en', false);
      expect(locale).toBeUndefined();
    });
    test('If create is false and the locale exists, should not create the option', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      entity.getLocale('en');
      const optionA = entity.getOption('en', 'option1', false);
      expect(optionA).toBeUndefined();
      const locale = entity.getLocale('en', false);
      expect(locale).toBeDefined();
    });
  });
  describe('Add Text', () => {
    test('It should add a text to a language', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      entity.addText('option1', 'en', 'option1_1');
      const locale = entity.getLocale('en');
      expect(locale).toEqual({ option1: ['option1_1'] });
    });
    test('It should be able to add a text to several languages', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      entity.addText('option1', ['en', 'es'], 'option1_1');
      const localeEn = entity.getLocale('en');
      const localeEs = entity.getLocale('es');
      expect(localeEn).toEqual({ option1: ['option1_1'] });
      expect(localeEs).toEqual({ option1: ['option1_1'] });
      expect(localeEn).not.toBe(localeEs);
    });
    test('It should be able to add several texts to a language', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      entity.addText('option1', 'en', ['option1_1', 'option1_2']);
      const localeEn = entity.getLocale('en');
      expect(localeEn).toEqual({ option1: ['option1_1', 'option1_2'] });
    });
    test('Several texts can be added to several languages', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      entity.addText('option1', ['en', 'es'], ['option1_1', 'option1_2']);
      const localeEn = entity.getLocale('en');
      const localeEs = entity.getLocale('es');
      expect(localeEn).toEqual({ option1: ['option1_1', 'option1_2'] });
      expect(localeEs).toEqual({ option1: ['option1_1', 'option1_2'] });
    });
    test('Several texts can be added to the option', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      entity.addText('option1', 'en', 'option1_1');
      entity.addText('option1', 'en', 'option1_2');
      const localeEn = entity.getLocale('en');
      expect(localeEn).toEqual({ option1: ['option1_1', 'option1_2'] });
    });
  });
  describe('Remove text', () => {
    test('It should remove an existing text', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      entity.addText('option1', 'en', 'option1_1');
      entity.addText('option1', 'en', 'option1_2');
      entity.removeText('option1', 'en', 'option1_2');
      const option = entity.getOption('en', 'option1');
      expect(option).toEqual(['option1_1']);
    });
    test('It should remove an existing text from several languages', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      entity.addText('option1', ['en', 'es'], ['option1_1', 'option1_2']);
      entity.removeText('option1', ['en', 'es'], 'option1_2');
      const optionEn = entity.getOption('en', 'option1');
      const optionEs = entity.getOption('es', 'option1');
      expect(optionEn).toEqual(['option1_1']);
      expect(optionEs).toEqual(['option1_1']);
    });
    test('It should remove several texts from several languages', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      entity.addText(
        'option1',
        ['en', 'es'],
        ['option1_1', 'option1_2', 'option1_3']
      );
      entity.removeText('option1', ['en', 'es'], ['option1_2', 'option1_3']);
      const optionEn = entity.getOption('en', 'option1');
      const optionEs = entity.getOption('es', 'option1');
      expect(optionEn).toEqual(['option1_1']);
      expect(optionEs).toEqual(['option1_1']);
    });
    test('It should do nothing if the text does not exists', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      entity.addText('option1', 'en', 'option1_1');
      entity.addText('option1', 'en', 'option1_2');
      entity.removeText('option1', 'en', 'option1_3');
      const option = entity.getOption('en', 'option1');
      expect(option).toEqual(['option1_1', 'option1_2']);
    });
    test('It should do nothing if the language does not exists', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      entity.addText('option1', 'en', 'option1_1');
      entity.addText('option1', 'en', 'option1_2');
      entity.removeText('option1', 'es', 'option1_2');
      const option = entity.getOption('en', 'option1');
      expect(option).toEqual(['option1_1', 'option1_2']);
    });
    test('It should do nothing if the option does not exists', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      entity.addText('option1', 'en', 'option1_1');
      entity.addText('option1', 'en', 'option1_2');
      entity.removeText('option2', 'en', 'option1_2');
      const option = entity.getOption('en', 'option1');
      expect(option).toEqual(['option1_1', 'option1_2']);
    });
  });
  describe('Extract', () => {
    test('It should extract edges from an utterance', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      const similar = new SimilarSearch({ normalize: true });
      const text1 = 'I saw spederman eating spaghetti in the city';
      entity.addText('spiderman', 'en', ['Spiderman', 'Spider-man']);
      entity.addText('iron man', 'en', ['iron man', 'iron-man']);
      entity.addText('thor', 'en', ['Thor']);
      const edges = entity.extract(text1, 'en', similar, undefined, 0.8);
      expect(edges).toBeDefined();
      expect(edges).toHaveLength(1);
      expect(edges[0].start).toEqual(6);
      expect(edges[0].end).toEqual(14);
      expect(edges[0].levenshtein).toEqual(1);
      expect(edges[0].accuracy).toEqual(0.8888888888888888);
      expect(edges[0].option).toEqual('spiderman');
      expect(edges[0].sourceText).toEqual('Spiderman');
      expect(edges[0].utteranceText).toEqual('spederman');
    });
    test('If locale does not exists should do fallback', () => {
      const entity = new EnumNamedEntity({ name: 'entity' });
      const similar = new SimilarSearch({ normalize: true });
      const text1 = 'I saw spederman eating spaghetti in the city';
      entity.addText('spiderman', 'en', ['Spiderman', 'Spider-man']);
      entity.addText('iron man', 'en', ['iron man', 'iron-man']);
      entity.addText('thor', 'en', ['Thor']);
      const edges = entity.extract(text1, 'es', similar, undefined, 0.8);
      expect(edges).toBeDefined();
      expect(edges).toHaveLength(1);
      expect(edges[0].start).toEqual(6);
      expect(edges[0].end).toEqual(14);
      expect(edges[0].levenshtein).toEqual(1);
      expect(edges[0].accuracy).toEqual(0.8888888888888888);
      expect(edges[0].option).toEqual('spiderman');
      expect(edges[0].sourceText).toEqual('Spiderman');
      expect(edges[0].utteranceText).toEqual('spederman');
    });
  });
});
