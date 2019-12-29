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

const { Nlp } = require('../src');

describe('NLP', () => {
  describe('Constructor', () => {
    test('Constructor', () => {
      const nlp = new Nlp();
      expect(nlp).toBeDefined();
    });
  });

  describe('Guess language', () => {
    test('Should guess the language of an utterance', () => {
      const manager = new Nlp();
      manager.addLanguage(['en', 'es']);
      let language = manager.guessLanguage('what is?');
      expect(language).toEqual('en');
      language = manager.guessLanguage('¿Qué es?');
      expect(language).toEqual('es');
    });
    test('Should return undefined if cannot be guessed', () => {
      const manager = new Nlp();
      manager.addLanguage(['en', 'es']);
      const language = manager.guessLanguage('');
      expect(language).toBeUndefined();
    });
  });

  describe('Add Document', () => {
    test('A document can be added', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('A document can be added training by domain', () => {
      const nlp = new Nlp({ nlu: { trainByDomain: true } });
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('If locale is not defined, then guess it', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('If locale is not defined, then guess it training by domain', () => {
      const nlp = new Nlp({ trainByDomain: true });
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('If locale is not defined and cannot be guessed, throw an error', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      expect(() => nlp.addDocument(undefined, '', 'keys')).toThrow(
        'Locale must be defined'
      );
    });
    test('If there is not domain for the given language, throw an error', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      expect(() => nlp.addDocument('fr', 'Bonjour', 'greet')).toThrow(
        'Domain Manager not found for locale fr'
      );
    });
  });

  describe('Remove Document', () => {
    test('A document can be removed', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      nlp.removeDocument('es', 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('A document can be removed training by domain', () => {
      const nlp = new Nlp({ trainByDomain: true });
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      nlp.removeDocument('es', 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('If locale is not defined then guess it', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      nlp.removeDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('If locale is not defined then guess it training by domain', () => {
      const nlp = new Nlp({ trainByDomain: true });
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      nlp.removeDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('If locale cannot be guessed then throw an error', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      expect(() => nlp.removeDocument(undefined, '', 'keys')).toThrow(
        'Locale must be defined'
      );
    });
    test('If there is not domain for the given language, throw an error', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      expect(() => nlp.removeDocument('fr', 'Bonjour', 'greet')).toThrow(
        'Domain Manager not found for locale fr'
      );
    });
  });

  describe('Add NER Rule', () => {
    test('Rules can be added by locale, name and type', () => {
      const nlp = new Nlp();
      nlp.addNerRule('en', 'A1', 'regex', /t/gi);
      expect(nlp.ner.rules).toBeDefined();
      expect(nlp.ner.rules.en).toBeDefined();
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi],
      });
    });
    test('If locale is not defined, will be wildcard by default', () => {
      const nlp = new Nlp();
      nlp.addNerRule(undefined, 'A1', 'regex', /t/gi);
      expect(nlp.ner.rules).toBeDefined();
      expect(nlp.ner.rules['*']).toBeDefined();
      expect(nlp.ner.rules['*'].A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi],
      });
    });
    test('Rules can be added to same locale and mane', () => {
      const nlp = new Nlp();
      nlp.addNerRule('en', 'A1', 'regex', /t/gi);
      nlp.addNerRule('en', 'A1', 'regex', /b/gi);
      expect(nlp.ner.rules).toBeDefined();
      expect(nlp.ner.rules.en).toBeDefined();
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi, /b/gi],
      });
    });
  });

  describe('Remove NER Rule', () => {
    test('Rules can be added by locale, name and type', () => {
      const nlp = new Nlp();
      nlp.addNerRule('en', 'A1', 'regex', /t/gi);
      nlp.addNerRule('en', 'A1', 'regex', /b/gi);
      nlp.removeNerRule('en', 'A1', /t/gi);
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/b/gi],
      });
    });
    test('If no locale defined use wildcard', () => {
      const nlp = new Nlp();
      nlp.addNerRule(undefined, 'A1', 'regex', /t/gi);
      nlp.addNerRule(undefined, 'A1', 'regex', /b/gi);
      nlp.removeNerRule(undefined, 'A1', /t/gi);
      expect(nlp.ner.rules['*'].A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/b/gi],
      });
    });
    test('If locale does not exists do not crash', () => {
      const nlp = new Nlp();
      nlp.addNerRule('en', 'A1', 'regex', /t/gi);
      nlp.addNerRule('en', 'A1', 'regex', /b/gi);
      nlp.removeNerRule('es', 'A1', /t/gi);
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi, /b/gi],
      });
    });
    test('If name does not exists do not crash', () => {
      const nlp = new Nlp();
      nlp.addNerRule('en', 'A1', 'regex', /t/gi);
      nlp.addNerRule('en', 'A1', 'regex', /b/gi);
      nlp.removeNerRule('en', 'A2', /t/gi);
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi, /b/gi],
      });
    });
    test('If rule does not exists do not crash', () => {
      const nlp = new Nlp();
      nlp.addNerRule('en', 'A1', 'regex', /t/gi);
      nlp.addNerRule('en', 'A1', 'regex', /b/gi);
      nlp.removeNerRule('en', 'A1', /c/gi);
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi, /b/gi],
      });
    });
    test('If only locale and name are provided, remove the rule by name', () => {
      const nlp = new Nlp();
      nlp.addNerRule('en', 'A1', 'regex', /t/gi);
      nlp.addNerRule('en', 'A1', 'regex', /b/gi);
      nlp.addNerRule('en', 'A2', 'regex', /b/gi);
      nlp.removeNerRule('en', 'A1');
      expect(nlp.ner.rules.en.A1).toBeUndefined();
    });
  });

  describe('Add NER rule option texts', () => {
    test('A text can be added to an option of a rule for a locale', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', 'text1');
      expect(nlp.ner.rules.en.A1).toEqual({
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
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts(['en', 'es'], 'A1', 'opt1', 'text1');
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1'],
          },
        ],
      });
      expect(nlp.ner.rules.es.A1).toEqual({
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
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', ['text1', 'text2']);
      expect(nlp.ner.rules.en.A1).toEqual({
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
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', ['text1', 'text2']);
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', ['text3', 'text4']);
      expect(nlp.ner.rules.en.A1).toEqual({
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
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1');
      expect(nlp.ner.rules.en.A1).toEqual({
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

  describe('Remove NER rule option texts', () => {
    test('A text can be removed', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      nlp.removeNerRuleOptionTexts('en', 'A1', 'opt1', 'text2');
      expect(nlp.ner.rules.en.A1).toEqual({
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
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      nlp.removeNerRuleOptionTexts('es', 'A1', 'opt1', 'text2');
      expect(nlp.ner.rules.es).toBeUndefined();
      expect(nlp.ner.rules.en.A1).toEqual({
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
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      nlp.removeNerRuleOptionTexts('en', 'A2', 'opt1', 'text2');
      expect(nlp.ner.rules.en.A2).toBeUndefined();
      expect(nlp.ner.rules.en.A1).toEqual({
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
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      nlp.removeNerRuleOptionTexts('en', 'A1', 'opt2', 'text2');
      expect(nlp.ner.rules.en.A1).toEqual({
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
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      nlp.removeNerRuleOptionTexts('en', 'A1', 'opt1', ['text2', 'text3']);
      expect(nlp.ner.rules.en.A1).toEqual({
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
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'opt1',
        'text4',
      ]);
      nlp.removeNerRuleOptionTexts('en', 'A1', 'opt1');
      expect(nlp.ner.rules.en.A1).toEqual({
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
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts(['en', 'es'], 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      nlp.removeNerRuleOptionTexts(['en', 'es'], 'A1', 'opt1', 'text2');
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text3', 'text4'],
          },
        ],
      });
      expect(nlp.ner.rules.es.A1).toEqual({
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
});
