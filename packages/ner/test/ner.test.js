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

const { containerBootstrap } = require('@nlpjs/core');
const { Ner } = require('../src');

const container = containerBootstrap();

describe('NER', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const instance = new Ner({ container });
      expect(instance).toBeDefined();
    });
  });

  describe('Add Rule', () => {
    test('Rules can be added by locale, name and type', () => {
      const instance = new Ner({ container });
      instance.addRule('en', 'A1', 'regex', /t/gi);
      expect(instance.rules).toBeDefined();
      expect(instance.rules.en).toBeDefined();
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi],
      });
    });
    test('If locale is not defined, will be wildcard by default', () => {
      const instance = new Ner({ container });
      instance.addRule(undefined, 'A1', 'regex', /t/gi);
      expect(instance.rules).toBeDefined();
      expect(instance.rules['*']).toBeDefined();
      expect(instance.rules['*'].A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi],
      });
    });
    test('Rules can be added to same locale and mane', () => {
      const instance = new Ner({ container });
      instance.addRule('en', 'A1', 'regex', /t/gi);
      instance.addRule('en', 'A1', 'regex', /b/gi);
      expect(instance.rules).toBeDefined();
      expect(instance.rules.en).toBeDefined();
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi, /b/gi],
      });
    });
  });

  describe('Remove Rule', () => {
    test('Rules can be added by locale, name and type', () => {
      const instance = new Ner({ container });
      instance.addRule('en', 'A1', 'regex', /t/gi);
      instance.addRule('en', 'A1', 'regex', /b/gi);
      instance.removeRule('en', 'A1', /t/gi);
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/b/gi],
      });
    });
    test('If no locale defined use wildcard', () => {
      const instance = new Ner({ container });
      instance.addRule(undefined, 'A1', 'regex', /t/gi);
      instance.addRule(undefined, 'A1', 'regex', /b/gi);
      instance.removeRule(undefined, 'A1', /t/gi);
      expect(instance.rules['*'].A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/b/gi],
      });
    });
    test('If locale does not exists do not crash', () => {
      const instance = new Ner({ container });
      instance.addRule('en', 'A1', 'regex', /t/gi);
      instance.addRule('en', 'A1', 'regex', /b/gi);
      instance.removeRule('es', 'A1', /t/gi);
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi, /b/gi],
      });
    });
    test('If name does not exists do not crash', () => {
      const instance = new Ner({ container });
      instance.addRule('en', 'A1', 'regex', /t/gi);
      instance.addRule('en', 'A1', 'regex', /b/gi);
      instance.removeRule('en', 'A2', /t/gi);
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi, /b/gi],
      });
    });
    test('If rule does not exists do not crash', () => {
      const instance = new Ner({ container });
      instance.addRule('en', 'A1', 'regex', /t/gi);
      instance.addRule('en', 'A1', 'regex', /b/gi);
      instance.removeRule('en', 'A1', /c/gi);
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi, /b/gi],
      });
    });
    test('If only locale and name are provided, remove the rule by name', () => {
      const instance = new Ner({ container });
      instance.addRule('en', 'A1', 'regex', /t/gi);
      instance.addRule('en', 'A1', 'regex', /b/gi);
      instance.addRule('en', 'A2', 'regex', /b/gi);
      instance.removeRule('en', 'A1');
      expect(instance.rules.en.A1).toBeUndefined();
    });
  });

  describe('Add rule option texts', () => {
    test('A text can be added to an option of a rule for a locale', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts('en', 'A1', 'opt1', 'text1');
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1'],
          },
        ],
      });
    });
    test('A text can be added to an option of a rule for several locales', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts(['en', 'es'], 'A1', 'opt1', 'text1');
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1'],
          },
        ],
      });
      expect(instance.rules.es.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1'],
          },
        ],
      });
    });
    test('Several texts can be added to an option of a rule for a locale', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts('en', 'A1', 'opt1', ['text1', 'text2']);
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text2'],
          },
        ],
      });
    });
    test('Several texts can be added to an option of a rule for a locale at different moments', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts('en', 'A1', 'opt1', ['text1', 'text2']);
      instance.addRuleOptionTexts('en', 'A1', 'opt1', ['text3', 'text4']);
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text2', 'text3', 'text4'],
          },
        ],
      });
    });
    test('If no text is provided use the option name', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts('en', 'A1', 'opt1');
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['opt1'],
          },
        ],
      });
    });
  });

  describe('Remove rule option texts', () => {
    test('A text can be removed', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      instance.removeRuleOptionTexts('en', 'A1', 'opt1', 'text2');
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text3', 'text4'],
          },
        ],
      });
    });
    test('If the locale does not exists do not crash', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      instance.removeRuleOptionTexts('es', 'A1', 'opt1', 'text2');
      expect(instance.rules.es).toBeUndefined();
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text2', 'text3', 'text4'],
          },
        ],
      });
    });
    test('If the rule name does not exists do not crash', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      instance.removeRuleOptionTexts('en', 'A2', 'opt1', 'text2');
      expect(instance.rules.en.A2).toBeUndefined();
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text2', 'text3', 'text4'],
          },
        ],
      });
    });
    test('If the option does not exists do not crash', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      instance.removeRuleOptionTexts('en', 'A1', 'opt2', 'text2');
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text2', 'text3', 'text4'],
          },
        ],
      });
    });
    test('The texts can be a list', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      instance.removeRuleOptionTexts('en', 'A1', 'opt1', ['text2', 'text3']);
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text4'],
          },
        ],
      });
    });
    test('If no text is defined use the option name', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'opt1',
        'text4',
      ]);
      instance.removeRuleOptionTexts('en', 'A1', 'opt1');
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text2', 'text4'],
          },
        ],
      });
    });
    test('The locale can be a list', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts(['en', 'es'], 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      instance.removeRuleOptionTexts(['en', 'es'], 'A1', 'opt1', 'text2');
      expect(instance.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text3', 'text4'],
          },
        ],
      });
      expect(instance.rules.es.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text3', 'text4'],
          },
        ],
      });
    });
  });
  describe('Get rules', () => {
    test('It can get all the rules of a locale', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
      ]);
      instance.addRuleOptionTexts('en', 'A1', 'opt2', [
        'text4',
        'text5',
        'text6',
      ]);
      const actual = instance.getRules('en');
      expect(actual).toEqual([
        {
          name: 'A1',
          type: 'enum',
          rules: [
            {
              option: 'opt1',
              texts: ['text1', 'text2', 'text3'],
            },
            {
              option: 'opt2',
              texts: ['text4', 'text5', 'text6'],
            },
          ],
        },
      ]);
    });
    test('It should add the wildcard rules', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
      ]);
      instance.addRuleOptionTexts(undefined, 'A1', 'opt2', [
        'text4',
        'text5',
        'text6',
      ]);
      const actual = instance.getRules('en');
      expect(actual).toEqual([
        {
          name: 'A1',
          type: 'enum',
          rules: [
            {
              option: 'opt1',
              texts: ['text1', 'text2', 'text3'],
            },
          ],
        },
        {
          name: 'A1',
          type: 'enum',
          rules: [
            {
              option: 'opt2',
              texts: ['text4', 'text5', 'text6'],
            },
          ],
        },
      ]);
    });
    test('If the locale does not exists return the wildcard', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts(undefined, 'A1', 'opt2', [
        'text4',
        'text5',
        'text6',
      ]);
      const actual = instance.getRules('en');
      expect(actual).toEqual([
        {
          name: 'A1',
          type: 'enum',
          rules: [
            {
              option: 'opt2',
              texts: ['text4', 'text5', 'text6'],
            },
          ],
        },
      ]);
    });
    test('If no locale is provided uses the wildcard', () => {
      const instance = new Ner({ container });
      instance.addRuleOptionTexts(undefined, 'A1', 'opt2', [
        'text4',
        'text5',
        'text6',
      ]);
      const actual = instance.getRules();
      expect(actual).toEqual([
        {
          name: 'A1',
          type: 'enum',
          rules: [
            {
              option: 'opt2',
              texts: ['text4', 'text5', 'text6'],
            },
          ],
        },
      ]);
    });
  });
});
