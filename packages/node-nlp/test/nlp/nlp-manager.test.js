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

const { NlpManager } = require('../../src');

describe('NLP Manager', () => {
  describe('constructor', () => {
    test('Should create a new instance', () => {
      const manager = new NlpManager();
      expect(manager).toBeDefined();
    });
    test('Can create a new instance without neural', () => {
      const manager = new NlpManager({ useNeural: false });
      expect(manager.useNeural).toBeFalsy();
    });
    test('Can create a new instance without LRC', () => {
      const manager = new NlpManager({ useLRC: false });
      expect(manager.useLRC).toBeFalsy();
    });
    test('You can set options when creating', () => {
      const manager = new NlpManager({
        fullSearchWhenGuessed: true,
        useNlg: false,
      });
      expect(manager.settings.fullSearchWhenGuessed).toBeTruthy();
      expect(manager.settings.useNlg).toBeFalsy();
    });

    test('You can pass transformer function with options', () => {
      const transformer = (x) => x;
      const manager = new NlpManager({ processTransformer: transformer });
      expect(manager.settings.processTransformer).toEqual(transformer);
    });
  });

  describe('Add language', () => {
    test('Should add the language and the classifier', () => {
      const manager = new NlpManager();
      manager.addLanguage('en');
      expect(manager.nlp.nluManager.locales).toHaveLength(1);
      expect(manager.nlp.nluManager.locales).toContain('en');
      expect(manager.nlp.nluManager.domainManagers.en).toBeDefined();
    });
    test('Should add several languages', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'es']);
      expect(manager.nlp.nluManager.locales).toHaveLength(2);
      expect(manager.nlp.nluManager.locales).toContain('en');
      expect(manager.nlp.nluManager.locales).toContain('es');
      expect(manager.nlp.nluManager.domainManagers.en).toBeDefined();
      expect(manager.nlp.nluManager.domainManagers.es).toBeDefined();
    });
    test('Should not add already existing lenguages', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'es']);
      manager.addLanguage(['en', 'en', 'es', 'fr']);
      expect(manager.nlp.nluManager.locales).toHaveLength(3);
      expect(manager.nlp.nluManager.locales).toContain('en');
      expect(manager.nlp.nluManager.locales).toContain('es');
      expect(manager.nlp.nluManager.locales).toContain('fr');
      expect(manager.nlp.nluManager.domainManagers.en).toBeDefined();
      expect(manager.nlp.nluManager.domainManagers.es).toBeDefined();
      expect(manager.nlp.nluManager.domainManagers.fr).toBeDefined();
    });
  });

  describe('Remove language', () => {
    test('Should remove languages', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'es', 'it', 'fr']);
      expect(manager.nlp.nluManager.locales).toHaveLength(4);
      expect(manager.nlp.nluManager.locales).toContain('en');
      expect(manager.nlp.nluManager.locales).toContain('es');
      expect(manager.nlp.nluManager.locales).toContain('it');
      expect(manager.nlp.nluManager.locales).toContain('fr');
      expect(manager.nlp.nluManager.domainManagers.en).toBeDefined();
      expect(manager.nlp.nluManager.domainManagers.es).toBeDefined();
      expect(manager.nlp.nluManager.domainManagers.it).toBeDefined();
      expect(manager.nlp.nluManager.domainManagers.fr).toBeDefined();
      manager.removeLanguage(['en', 'fr']);
      expect(manager.nlp.nluManager.locales).toHaveLength(2);
      expect(manager.nlp.nluManager.locales).not.toContain('en');
      expect(manager.nlp.nluManager.locales).toContain('es');
      expect(manager.nlp.nluManager.locales).toContain('it');
      expect(manager.nlp.nluManager.locales).not.toContain('fr');
      expect(manager.nlp.nluManager.domainManagers.en).not.toBeDefined();
      expect(manager.nlp.nluManager.domainManagers.es).toBeDefined();
      expect(manager.nlp.nluManager.domainManagers.it).toBeDefined();
      expect(manager.nlp.nluManager.domainManagers.fr).not.toBeDefined();
    });
  });

  describe('Guess language', () => {
    test('Should guess the language of an utterance', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'es']);
      let language = manager.guessLanguage('what is?');
      expect(language).toEqual('en');
      language = manager.guessLanguage('¿Qué es?');
      expect(language).toEqual('es');
    });
    test('Should return undefined if cannot be guessed', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'es']);
      const language = manager.guessLanguage('');
      expect(language).toBeUndefined();
    });
  });

  describe('Add document', () => {
    test('If locale is not defined, then guess it', () => {
      const manager = new NlpManager({ nlu: { trainByDomain: true } });
      manager.addLanguage(['en', 'es']);
      manager.addDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(manager.nlp.nluManager.domainManagers.es.sentences).toHaveLength(
        1
      );
      expect(manager.nlp.nluManager.domainManagers.en.sentences).toHaveLength(
        0
      );
    });
    test('If locale is not defined and cannot be guessed, throw an error', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'es']);
      expect(() => manager.addDocument(undefined, '', 'keys')).toThrow(
        'Locale must be defined'
      );
    });
    test('Should check that there is a classifier for the locale', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en']);
      expect(() =>
        manager.addDocument('es', 'Dónde están las llaves', 'keys')
      ).toThrow('Domain Manager not found for locale es');
    });
    test('Should add the document to the classifier', () => {
      const manager = new NlpManager({ nlu: { trainByDomain: true } });
      manager.addLanguage(['en', 'es']);
      manager.addDocument('es', 'Dónde están las llaves', 'keys');
      expect(manager.nlp.nluManager.domainManagers.es.sentences).toHaveLength(
        1
      );
    });
    //   test('Should extract managed named entities', () => {
    //     const manager = new NlpManager();
    //     manager.addLanguage(['en', 'es']);
    //     manager.addNamedEntityText(
    //       'hero',
    //       'spiderman',
    //       ['en'],
    //       ['Spiderman', 'Spider-man']
    //     );
    //     manager.addNamedEntityText(
    //       'hero',
    //       'iron man',
    //       ['en'],
    //       ['iron man', 'iron-man']
    //     );
    //     manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
    //     manager.addNamedEntityText(
    //       'food',
    //       'burguer',
    //       ['en'],
    //       ['Burguer', 'Hamburguer']
    //     );
    //     manager.addNamedEntityText('food', 'pizza', ['en'], ['pizza']);
    //     manager.addNamedEntityText(
    //       'food',
    //       'pasta',
    //       ['en'],
    //       ['Pasta', 'spaghetti']
    //     );
    //     manager.addDocument('en', 'I saw %hero%', 'sawhero');
    //     expect(manager.slotManager.intents.sawhero).toBeDefined();
    //     expect(manager.slotManager.intents.sawhero.hero).toBeDefined();
    //   });
  });

  describe('Remove named entity text', () => {
    test('Should remove texts of named entity', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'es']);
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
      manager.removeNamedEntityText('hero', 'iron man', 'en', 'iron-man');
      const ironman = manager.nlp.getRulesByName('en', 'hero');
      expect(ironman.rules[1].texts).toEqual(['iron man']);
    });
  });

  describe('Remove document', () => {
    test('If locale is not defined must be guessed', () => {
      const manager = new NlpManager({ nlu: { trainByDomain: true } });
      manager.addLanguage(['en', 'es']);
      manager.addDocument('es', 'Dónde están las llaves', 'keys');
      manager.removeDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(manager.nlp.nluManager.domainManagers.es.sentences).toHaveLength(
        0
      );
    });
    test('If locale is not defined and cannot be guessed, throw an error', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'es']);
      expect(() => manager.removeDocument(undefined, '', 'keys')).toThrow(
        'Locale must be defined'
      );
    });
    test('Should check that there is a classifier for the locale', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en']);
      expect(() =>
        manager.removeDocument('es', 'Dónde están las llaves', 'keys')
      ).toThrow('Domain Manager not found for locale es');
    });
    test('Should remove the document from the classifier', () => {
      const manager = new NlpManager({ nlu: { trainByDomain: true } });
      manager.addLanguage(['en', 'es']);
      manager.addDocument('es', 'Dónde están las llaves', 'keys');
      manager.removeDocument('es', 'Dónde están las llaves', 'keys');
      expect(manager.nlp.nluManager.domainManagers.es.sentences).toHaveLength(
        0
      );
    });
  });

  describe('Classify', () => {
    test('Should classify an utterance without None feature', async () => {
      const manager = new NlpManager({ nlu: { useNoneFeature: false } });
      manager.addLanguage(['fr', 'jp']);
      manager.addDocument('fr', 'Bonjour', 'greet');
      manager.addDocument('fr', 'bonne nuit', 'greet');
      manager.addDocument('fr', 'Bonsoir', 'greet');
      manager.addDocument('fr', "J'ai perdu mes clés", 'keys');
      manager.addDocument('fr', 'Je ne trouve pas mes clés', 'keys');
      manager.addDocument(
        'fr',
        'Je ne me souviens pas où sont mes clés',
        'keys'
      );
      await manager.train();
      const result = await manager.classify('fr', 'où sont mes clés');
      expect(result.classifications).toHaveLength(2);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.7);
    });
    test('Should classify an utterance', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['fr', 'jp']);
      manager.addDocument('fr', 'Bonjour', 'greet');
      manager.addDocument('fr', 'bonne nuit', 'greet');
      manager.addDocument('fr', 'Bonsoir', 'greet');
      manager.addDocument('fr', "J'ai perdu mes clés", 'keys');
      manager.addDocument('fr', 'Je ne trouve pas mes clés', 'keys');
      manager.addDocument(
        'fr',
        'Je ne me souviens pas où sont mes clés',
        'keys'
      );
      await manager.train();
      const result = await manager.classify('fr', 'où sont mes clés');
      expect(result.classifications).toHaveLength(3);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.7);
    });
    test('Should return a empty classifications if there is not classifier for this language', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['fr', 'ja']);
      manager.addDocument('fr', 'Bonjour', 'greet');
      manager.addDocument('fr', 'bonne nuit', 'greet');
      manager.addDocument('fr', 'Bonsoir', 'greet');
      manager.addDocument('fr', "J'ai perdu mes clés", 'keys');
      manager.addDocument('fr', 'Je ne trouve pas mes clés', 'keys');
      manager.addDocument(
        'fr',
        'Je ne me souviens pas où sont mes clés',
        'keys'
      );
      manager.addDocument('ja', 'おはようございます', 'greet');
      manager.addDocument('ja', 'こんにちは', 'greet');
      manager.addDocument('ja', 'おやすみ', 'greet');
      manager.addDocument('ja', '私は私の鍵を紛失した', 'keys');
      manager.addDocument(
        'ja',
        '私は私の鍵がどこにあるのか覚えていない',
        'keys'
      );
      manager.addDocument('ja', '私は私の鍵が見つからない', 'keys');
      await manager.train();
      const result = await manager.process('en', 'where are my keys?');
      const expected = {
        utterance: 'where are my keys?',
        locale: 'en',
        languageGuessed: false,
        localeIso2: 'en',
        language: 'English',
        classifications: [],
        domain: undefined,
        intent: 'None',
        score: 1,
        answer: undefined,
        answers: [],
        entities: [],
        sourceEntities: [],
        actions: [],
        sentiment: {
          average: 0.0625,
          locale: 'en',
          numHits: 1,
          numWords: 4,
          score: 0.25,
          type: 'senticon',
          vote: 'positive',
        },
      };
      expect(result).toEqual(expected);
    });
  });

  describe('Train', () => {
    test('You can train only a language', async () => {
      const manager = new NlpManager({ nlu: { trainByDomain: true } });
      manager.addLanguage(['fr', 'ja']);
      manager.addDocument('fr', 'Bonjour', 'greet');
      manager.addDocument('fr', 'bonne nuit', 'greet');
      manager.addDocument('fr', 'Bonsoir', 'greet');
      manager.addDocument('fr', "J'ai perdu mes clés", 'keys');
      manager.addDocument('fr', 'Je ne trouve pas mes clés', 'keys');
      manager.addDocument(
        'fr',
        'Je ne me souviens pas où sont mes clés',
        'keys'
      );
      manager.addDocument('ja', 'おはようございます', 'greet');
      manager.addDocument('ja', 'こんにちは', 'greet');
      manager.addDocument('ja', 'おやすみ', 'greet');
      manager.addDocument('ja', '私は私の鍵を紛失した', 'keys');
      manager.addDocument(
        'ja',
        '私は私の鍵がどこにあるのか覚えていない',
        'keys'
      );
      manager.addDocument('ja', '私は私の鍵が見つからない', 'keys');
      await manager.train('fr');
      let result = await manager.classify('où sont mes clés');
      expect(result.classifications).toHaveLength(3);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.7);
      result = await manager.classify('私の鍵はどこにありますか');
      expect(result.classifications).toHaveLength(2);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.7);
    });
    test('You can train a set of languages', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['fr', 'ja']);
      manager.addDocument('fr', 'Bonjour', 'greet');
      manager.addDocument('fr', 'bonne nuit', 'greet');
      manager.addDocument('fr', 'Bonsoir', 'greet');
      manager.addDocument('fr', "J'ai perdu mes clés", 'keys');
      manager.addDocument('fr', 'Je ne trouve pas mes clés', 'keys');
      manager.addDocument(
        'fr',
        'Je ne me souviens pas où sont mes clés',
        'keys'
      );
      manager.addDocument('ja', 'おはようございます', 'greet');
      manager.addDocument('ja', 'こんにちは', 'greet');
      manager.addDocument('ja', 'おやすみ', 'greet');
      manager.addDocument('ja', '私は私の鍵を紛失した', 'keys');
      manager.addDocument(
        'ja',
        '私は私の鍵がどこにあるのか覚えていない',
        'keys'
      );
      manager.addDocument('ja', '私は私の鍵が見つからない', 'keys');
      await manager.train(['fr', 'ja', 'es']);
      let result = await manager.classify('où sont mes clés');
      expect(result.classifications).toHaveLength(3);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.7);
      result = await manager.classify('私の鍵はどこにありますか');
      expect(result.classifications).toHaveLength(2);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.7);
    });
  });

  describe('Extract Entities', () => {
    test('Should search for entities', async () => {
      const manager = new NlpManager({ ner: { builtins: [] } });
      manager.addLanguage(['en']);
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
      manager.addDocument('en', 'I saw %hero% eating %food%', 'sawhero');
      manager.addDocument(
        'en',
        'I have seen %hero%, he was eating %food%',
        'sawhero'
      );
      manager.addDocument('en', 'I want to eat %food%', 'wanteat');
      const result = await manager.extractEntities(
        'I saw spiderman eating spaghetti today in the city!'
      );
      expect(result.entities).toHaveLength(2);
      expect(result.entities[0].sourceText).toEqual('Spiderman');
      expect(result.entities[1].sourceText).toEqual('spaghetti');
    });
    test('Should search for entities if the language is specified', async () => {
      const manager = new NlpManager({ ner: { builtins: [] } });
      manager.addLanguage(['en']);
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
      manager.addDocument('en', 'I saw %hero% eating %food%', 'sawhero');
      manager.addDocument(
        'en',
        'I have seen %hero%, he was eating %food%',
        'sawhero'
      );
      manager.addDocument('en', 'I want to eat %food%', 'wanteat');
      const result = await manager.extractEntities(
        'en',
        'I saw spiderman eating spaghetti today in the city!'
      );
      expect(result.entities).toHaveLength(2);
      expect(result.entities[0].sourceText).toEqual('Spiderman');
      expect(result.entities[1].sourceText).toEqual('spaghetti');
    });
    test('If the locale is not provided, then guess language', async () => {
      const manager = new NlpManager({ ner: { builtins: [] } });
      manager.addLanguage(['en']);
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
      manager.addDocument('en', 'I saw %hero% eating %food%', 'sawhero');
      manager.addDocument(
        'en',
        'I have seen %hero%, he was eating %food%',
        'sawhero'
      );
      manager.addDocument('en', 'I want to eat %food%', 'wanteat');
      const result = await manager.extractEntities(
        'I saw spiderman eating spaghetti today in the city!'
      );
      expect(result.entities).toHaveLength(2);
      expect(result.entities[0].sourceText).toEqual('Spiderman');
      expect(result.entities[1].sourceText).toEqual('spaghetti');
    });
  });

  describe('Process', () => {
    test('Should classify an utterance without None feature', async () => {
      const manager = new NlpManager({ nlu: { useNoneFeature: false } });
      manager.addLanguage(['en', 'ja']);
      manager.addDocument('en', 'Hello', 'greet');
      manager.addDocument('en', 'Good evening', 'greet');
      manager.addDocument('en', 'Good morning', 'greet');
      manager.addDocument('en', "I've lost my keys", 'keys');
      manager.addDocument('en', "I don't find my keys", 'keys');
      manager.addDocument('en', "I don't know where are my keys", 'keys');
      await manager.train();
      const result = await manager.process('Where are my keys');
      expect(result).toBeDefined();
      expect(result.locale).toEqual('en');
      expect(result.localeIso2).toEqual('en');
      expect(result.utterance).toEqual('Where are my keys');
      expect(result.classifications).toBeDefined();
      expect(result.classifications).toHaveLength(2);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.7);
    });
    test('Should classify an utterance', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'ja']);
      manager.addDocument('en', 'Hello', 'greet');
      manager.addDocument('en', 'Good evening', 'greet');
      manager.addDocument('en', 'Good morning', 'greet');
      manager.addDocument('en', "I've lost my keys", 'keys');
      manager.addDocument('en', "I don't find my keys", 'keys');
      manager.addDocument('en', "I don't know where are my keys", 'keys');
      await manager.train();
      const result = await manager.process('Where are my keys');
      expect(result).toBeDefined();
      expect(result.locale).toEqual('en');
      expect(result.localeIso2).toEqual('en');
      expect(result.utterance).toEqual('Where are my keys');
      expect(result.classifications).toBeDefined();
      expect(result.classifications).toHaveLength(3);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.7);
    });
    test('Language can be specified', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'ja']);
      manager.addDocument('en', 'Hello', 'greet');
      manager.addDocument('en', 'Good evening', 'greet');
      manager.addDocument('en', 'Good morning', 'greet');
      manager.addDocument('en', "I've lost my keys", 'keys');
      manager.addDocument('en', "I don't find my keys", 'keys');
      manager.addDocument('en', "I don't know where are my keys", 'keys');
      await manager.train();
      const result = await manager.process('en', 'where are my keys');
      expect(result).toBeDefined();
      expect(result.locale).toEqual('en');
      expect(result.localeIso2).toEqual('en');
      expect(result.utterance).toEqual('where are my keys');
      expect(result.classifications).toBeDefined();
      expect(result.classifications).toHaveLength(3);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.7);
    });
    test('If a language not in the manager is passed, then return None classification', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'ja']);
      manager.addDocument('en', 'Hello', 'greet');
      manager.addDocument('en', 'Good evening', 'greet');
      manager.addDocument('en', 'Good morning', 'greet');
      manager.addDocument('en', "I've lost my keys", 'keys');
      manager.addDocument('en', "I don't find my keys", 'keys');
      manager.addDocument('en', "I don't know where are my keys", 'keys');
      await manager.train();
      const result = await manager.process('es', 'andestán mis llaves');
      expect(result).toBeDefined();
      expect(result.locale).toEqual('es');
      expect(result.localeIso2).toEqual('es');
      expect(result.language).toEqual('Spanish');
      expect(result.utterance).toEqual('andestán mis llaves');
      expect(result.classifications).toBeDefined();
      expect(result.classifications).toHaveLength(0);
      expect(result.intent).toEqual('None');
      expect(result.score).toEqual(1);
    });
    test('Languages with ISO code can be identified even without stemmer', async () => {
      const manager = new NlpManager({
        languages: ['en', 'ko'],
        fullSearchWhenGuessed: true,
      });
      manager.addDocument('en', 'goodbye for now', 'greetings.bye');
      manager.addDocument('en', 'bye bye take care', 'greetings.bye');
      manager.addDocument('en', 'okay see you later', 'greetings.bye');
      manager.addDocument('en', 'bye for now', 'greetings.bye');
      manager.addDocument('en', 'i must go', 'greetings.bye');
      manager.addDocument('en', 'hello', 'greetings.hello');
      manager.addDocument('en', 'hi', 'greetings.hello');
      manager.addDocument('en', 'howdy', 'greetings.hello');
      manager.addDocument('ko', '여보세요', 'greetings.hello');
      manager.addDocument('ko', '안녕하세요!', 'greetings.hello');
      manager.addDocument('ko', '여보!', 'greetings.hello');
      manager.addDocument('ko', '어이!', 'greetings.hello');
      manager.addDocument('ko', '좋은 아침', 'greetings.hello');
      manager.addDocument('ko', '안녕히 주무세요', 'greetings.hello');
      manager.addDocument('ko', '안녕', 'greetings.bye');
      manager.addDocument('ko', '친 공이 타자', 'greetings.bye');
      manager.addDocument('ko', '상대가 없어 남는 사람', 'greetings.bye');
      manager.addDocument('ko', '지엽적인 것', 'greetings.bye');
      await manager.train();
      const result = await manager.process('상대가 없어 남는 편');
      expect(result.language).toEqual('Korean');
      expect(result.intent).toEqual('greetings.bye');
      expect(result.score).toBeGreaterThan(0.9);
    });
    test('Should work with fantasy languages', async () => {
      const manager = new NlpManager({ languages: ['en', 'kl'] });
      manager.addDocument('en', 'goodbye for now', 'greetings.bye');
      manager.addDocument('en', 'bye bye take care', 'greetings.bye');
      manager.addDocument('en', 'okay see you later', 'greetings.bye');
      manager.addDocument('en', 'bye for now', 'greetings.bye');
      manager.addDocument('en', 'i must go', 'greetings.bye');
      manager.addDocument('en', 'hello', 'greetings.hello');
      manager.addDocument('en', 'hi', 'greetings.hello');
      manager.addDocument('en', 'howdy', 'greetings.hello');
      manager.describeLanguage('kl', 'Klingon');
      manager.addDocument('kl', 'nuqneH', 'hello');
      manager.addDocument('kl', 'maj po', 'hello');
      manager.addDocument('kl', 'maj choS', 'hello');
      manager.addDocument('kl', 'maj ram', 'hello');
      manager.addDocument('kl', `nuqDaq ghaH ngaQHa'moHwI'mey?`, 'keys');
      manager.addDocument('kl', `ngaQHa'moHwI'mey lujta' jIH`, 'keys');
      await manager.train();
      const result = await manager.process(`ngaQHa'moHwI'mey nIH vay'`);
      expect(result.language).toEqual('Klingon');
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.9);
    });
    test('Should even guess the fantasy language', async () => {
      const manager = new NlpManager({ languages: ['en', 'kl'] });
      manager.describeLanguage('kl', 'Klingon');
      manager.addDocument('kl', 'nuqneH', 'hello');
      manager.addDocument('kl', 'maj po', 'hello');
      manager.addDocument('kl', 'maj choS', 'hello');
      manager.addDocument('kl', 'maj ram', 'hello');
      manager.addDocument('kl', `nuqDaq ghaH ngaQHa'moHwI'mey?`, 'keys');
      manager.addDocument('kl', `ngaQHa'moHwI'mey lujta' jIH`, 'keys');
      await manager.train();
      const result = await manager.process('kl', `ngaQHa'moHwI'mey nIH vay'`);
      expect(result.language).toEqual('Klingon');
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.9);
    });
    test('Should search for entities', async () => {
      const manager = new NlpManager({ ner: { builtins: [] } });
      manager.addLanguage(['en']);
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
      manager.addDocument('en', 'I saw %hero% eating %food%', 'sawhero');
      manager.addDocument(
        'en',
        'I have seen %hero%, he was eating %food%',
        'sawhero'
      );
      manager.addDocument('en', 'I want to eat %food%', 'wanteat');
      await manager.train();
      const result = await manager.process(
        'I saw spiderman eating spaghetti today in the city!'
      );
      expect(result.intent).toEqual('sawhero');
      expect(result.score).toBeGreaterThan(0.5);
      expect(result.entities).toHaveLength(2);
      expect(result.entities[0].sourceText).toEqual('Spiderman');
      expect(result.entities[1].sourceText).toEqual('spaghetti');
    });
    test('Should search for entities if the language is specified', async () => {
      const manager = new NlpManager({ ner: { builtins: [] } });
      manager.addLanguage(['en']);
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
      manager.addDocument('en', 'I saw %hero% eating %food%', 'sawhero');
      manager.addDocument(
        'en',
        'I have seen %hero%, he was eating %food%',
        'sawhero'
      );
      manager.addDocument('en', 'I want to eat %food%', 'wanteat');
      await manager.train();
      const result = await manager.process(
        'en',
        'I saw spiderman eating spaghetti today in the city!'
      );
      expect(result.intent).toEqual('sawhero');
      expect(result.score).toBeGreaterThan(0.5);
      expect(result.entities).toHaveLength(2);
      expect(result.entities[0].sourceText).toEqual('Spiderman');
      expect(result.entities[1].sourceText).toEqual('spaghetti');
    });
    test('Should give the sentiment even if NLP not trained', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['en']);
      const result = await manager.process('I love cats');
      expect(result.sentiment).toBeDefined();
      expect(result.sentiment.vote).toEqual('positive');
    });
    test('Should return None with score 1 if the utterance cannot be classified', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['en']);
      manager.addDocument('en', 'Hello', 'greet');
      manager.addDocument('en', 'Good morning', 'greet');
      manager.addDocument('en', 'Good evening', 'greet');
      manager.addDocument('en', 'Where are my keys?', 'keys');
      manager.addDocument('en', "I don't know where my keys are", 'keys');
      manager.addDocument('en', "I've lost my keys", 'keys');
      await manager.train();
      const result = await manager.process('This should return none');
      expect(result.intent).toEqual('None');
      expect(result.score).toEqual(1);
    });
    test('If the NLG is trained, then return the answer', async () => {
      const manager = new NlpManager({ languages: ['en'] });
      manager.addDocument('en', 'goodbye for now', 'greetings.bye');
      manager.addDocument('en', 'bye bye take care', 'greetings.bye');
      manager.addDocument('en', 'okay see you later', 'greetings.bye');
      manager.addDocument('en', 'bye for now', 'greetings.bye');
      manager.addDocument('en', 'i must go', 'greetings.bye');
      manager.addDocument('en', 'hello', 'greetings.hello');
      manager.addDocument('en', 'hi', 'greetings.hello');
      manager.addDocument('en', 'howdy', 'greetings.hello');
      manager.addDocument('en', 'how is your day', 'greetings.howareyou');
      manager.addDocument('en', 'how is your day going', 'greetings.howareyou');
      manager.addDocument('en', 'how are you', 'greetings.howareyou');
      manager.addDocument('en', 'how are you doing', 'greetings.howareyou');
      manager.addDocument('en', 'what about your day', 'greetings.howareyou');
      manager.addDocument('en', 'are you alright', 'greetings.howareyou');
      manager.addDocument('en', 'nice to meet you', 'greetings.nicetomeetyou');
      manager.addDocument(
        'en',
        'pleased to meet you',
        'greetings.nicetomeetyou'
      );
      manager.addDocument(
        'en',
        'it was very nice to meet you',
        'greetings.nicetomeetyou'
      );
      manager.addDocument('en', 'glad to meet you', 'greetings.nicetomeetyou');
      manager.addDocument('en', 'nice meeting you', 'greetings.nicetomeetyou');
      manager.addDocument('en', 'nice to see you', 'greetings.nicetoseeyou');
      manager.addDocument('en', 'good to see you', 'greetings.nicetoseeyou');
      manager.addDocument('en', 'great to see you', 'greetings.nicetoseeyou');
      manager.addDocument('en', 'lovely to see you', 'greetings.nicetoseeyou');
      manager.addDocument(
        'en',
        'nice to talk to you',
        'greetings.nicetotalktoyou'
      );
      manager.addDocument(
        'en',
        "it's nice to talk to you",
        'greetings.nicetotalktoyou'
      );
      manager.addDocument(
        'en',
        'nice talking to you',
        'greetings.nicetotalktoyou'
      );
      manager.addDocument(
        'en',
        "it's been nice talking to you",
        'greetings.nicetotalktoyou'
      );
      manager.addAnswer('en', 'greetings.bye', 'Till next time');
      manager.addAnswer('en', 'greetings.bye', 'See you soon!');
      manager.addAnswer('en', 'greetings.hello', 'Hey there!');
      manager.addAnswer('en', 'greetings.hello', 'Greetings!');
      manager.addAnswer('en', 'greetings.howareyou', 'Feeling wonderful!');
      manager.addAnswer(
        'en',
        'greetings.howareyou',
        'Wonderful! Thanks for asking'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        "It's nice meeting you, too"
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        "Likewise. I'm looking forward to helping you out"
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        'Nice meeting you, as well'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        'The pleasure is mine'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetoseeyou',
        'Same here. I was starting to miss you'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetoseeyou',
        'So glad we meet again'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetotalktoyou',
        'It sure was. We can chat again anytime'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetotalktoyou',
        'I enjoy talking to you, too'
      );
      await manager.train();
      let result = await manager.process('goodbye');
      expect(result.answer).toMatch(
        new RegExp(/(Till next time)|(See you soon!)/g)
      );
      result = await manager.process('It was nice to meet you');
      expect(result.answer).toMatch(
        new RegExp(
          /(It's nice meeting you, too)|(Likewise. I'm looking forward to helping you out)|(Nice meeting you, as well)|(The pleasure is mine)/g
        )
      );
    });
    test('If the intent has actions, then return also the actions', async () => {
      const manager = new NlpManager({
        languages: ['en'],
        action: {
          cleanSession: () => 'cleaned',
          beginDialog: () => 'started',
        },
      });
      manager.addDocument('en', 'goodbye for now', 'greetings.bye');
      manager.addDocument('en', 'bye bye take care', 'greetings.bye');
      manager.addDocument('en', 'okay see you later', 'greetings.bye');
      manager.addDocument('en', 'bye for now', 'greetings.bye');
      manager.addDocument('en', 'i must go', 'greetings.bye');
      manager.addDocument('en', 'hello', 'greetings.hello');
      manager.addDocument('en', 'hi', 'greetings.hello');
      manager.addDocument('en', 'howdy', 'greetings.hello');
      manager.addDocument('en', 'how is your day', 'greetings.howareyou');
      manager.addDocument('en', 'how is your day going', 'greetings.howareyou');
      manager.addDocument('en', 'how are you', 'greetings.howareyou');
      manager.addDocument('en', 'how are you doing', 'greetings.howareyou');
      manager.addDocument('en', 'what about your day', 'greetings.howareyou');
      manager.addDocument('en', 'are you alright', 'greetings.howareyou');
      manager.addDocument('en', 'nice to meet you', 'greetings.nicetomeetyou');
      manager.addDocument(
        'en',
        'pleased to meet you',
        'greetings.nicetomeetyou'
      );
      manager.addDocument(
        'en',
        'it was very nice to meet you',
        'greetings.nicetomeetyou'
      );
      manager.addDocument('en', 'glad to meet you', 'greetings.nicetomeetyou');
      manager.addDocument('en', 'nice meeting you', 'greetings.nicetomeetyou');
      manager.addDocument('en', 'nice to see you', 'greetings.nicetoseeyou');
      manager.addDocument('en', 'good to see you', 'greetings.nicetoseeyou');
      manager.addDocument('en', 'great to see you', 'greetings.nicetoseeyou');
      manager.addDocument('en', 'lovely to see you', 'greetings.nicetoseeyou');
      manager.addDocument(
        'en',
        'nice to talk to you',
        'greetings.nicetotalktoyou'
      );
      manager.addDocument(
        'en',
        "it's nice to talk to you",
        'greetings.nicetotalktoyou'
      );
      manager.addDocument(
        'en',
        'nice talking to you',
        'greetings.nicetotalktoyou'
      );
      manager.addDocument(
        'en',
        "it's been nice talking to you",
        'greetings.nicetotalktoyou'
      );
      manager.addAction('greetings.bye', 'cleanSession', ['true']);
      manager.addAction('greetings.bye', 'beginDialog', ['"/"']);
      manager.addAnswer('en', 'greetings.bye', 'Till next time');
      manager.addAnswer('en', 'greetings.bye', 'See you soon!');
      manager.addAnswer('en', 'greetings.hello', 'Hey there!');
      manager.addAnswer('en', 'greetings.hello', 'Greetings!');
      manager.addAnswer('en', 'greetings.howareyou', 'Feeling wonderful!');
      manager.addAnswer(
        'en',
        'greetings.howareyou',
        'Wonderful! Thanks for asking'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        "It's nice meeting you, too"
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        "Likewise. I'm looking forward to helping you out"
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        'Nice meeting you, as well'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        'The pleasure is mine'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetoseeyou',
        'Same here. I was starting to miss you'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetoseeyou',
        'So glad we meet again'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetotalktoyou',
        'It sure was. We can chat again anytime'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetotalktoyou',
        'I enjoy talking to you, too'
      );
      await manager.train();
      let result = await manager.process('goodbye');
      expect(result.actions).toHaveLength(2);
      expect(result.actions[0].action).toEqual('cleanSession');
      expect(result.actions[0].parameters).toEqual(['true']);
      expect(result.actions[1].action).toEqual('beginDialog');
      expect(result.actions[1].parameters).toEqual(['"/"']);
      result = await manager.process('It was nice to meet you');
      expect(result.answer).toMatch(
        new RegExp(
          /(It's nice meeting you, too)|(Likewise. I'm looking forward to helping you out)|(Nice meeting you, as well)|(The pleasure is mine)/g
        )
      );
    });
    test('If the intent has actions, then apply the actions to the answer', async () => {
      const manager = new NlpManager({
        languages: ['en'],
        action: {
          action1: (input, ...parameters) => {
            return `(${input.answer}#${parameters.join(',')})`;
          },
          action2: (input, ...parameters) => {
            return `[${input.answer}#${parameters.join(',')}]`;
          },
        },
      });
      manager.addDocument('en', 'goodbye for now', 'greetings.bye');
      manager.addDocument('en', 'bye bye take care', 'greetings.bye');
      manager.addDocument('en', 'hello', 'greetings.hello');
      manager.addDocument('en', 'hi', 'greetings.hello');
      manager.addAction('greetings.bye', 'action1', ['a', 'b']);
      manager.addAction('greetings.bye', 'action2', ['c', 'd']);
      manager.addAnswer('en', 'greetings.bye', 'See you soon!');
      manager.addAnswer('en', 'greetings.hello', 'Hey there!');
      await manager.train();
      const result = await manager.process('goodbye');
      expect(result.answer).toEqual('[(See you soon!#a,b)#c,d]');
    });

    test('If the NLG is trained, and the answer contains a template, replace with context variables', async () => {
      const manager = new NlpManager({ languages: ['en'] });
      manager.addDocument('en', 'goodbye for now', 'greetings.bye');
      manager.addDocument('en', 'bye bye take care', 'greetings.bye');
      manager.addDocument('en', 'okay see you later', 'greetings.bye');
      manager.addDocument('en', 'bye for now', 'greetings.bye');
      manager.addDocument('en', 'i must go', 'greetings.bye');
      manager.addDocument('en', 'hello', 'greetings.hello');
      manager.addDocument('en', 'hi', 'greetings.hello');
      manager.addDocument('en', 'howdy', 'greetings.hello');
      manager.addDocument('en', 'how is your day', 'greetings.howareyou');
      manager.addDocument('en', 'how is your day going', 'greetings.howareyou');
      manager.addDocument('en', 'how are you', 'greetings.howareyou');
      manager.addDocument('en', 'how are you doing', 'greetings.howareyou');
      manager.addDocument('en', 'what about your day', 'greetings.howareyou');
      manager.addDocument('en', 'are you alright', 'greetings.howareyou');
      manager.addDocument('en', 'nice to meet you', 'greetings.nicetomeetyou');
      manager.addDocument(
        'en',
        'pleased to meet you',
        'greetings.nicetomeetyou'
      );
      manager.addDocument(
        'en',
        'it was very nice to meet you',
        'greetings.nicetomeetyou'
      );
      manager.addDocument('en', 'glad to meet you', 'greetings.nicetomeetyou');
      manager.addDocument('en', 'nice meeting you', 'greetings.nicetomeetyou');
      manager.addDocument('en', 'nice to see you', 'greetings.nicetoseeyou');
      manager.addDocument('en', 'good to see you', 'greetings.nicetoseeyou');
      manager.addDocument('en', 'great to see you', 'greetings.nicetoseeyou');
      manager.addDocument('en', 'lovely to see you', 'greetings.nicetoseeyou');
      manager.addDocument(
        'en',
        'nice to talk to you',
        'greetings.nicetotalktoyou'
      );
      manager.addDocument(
        'en',
        "it's nice to talk to you",
        'greetings.nicetotalktoyou'
      );
      manager.addDocument(
        'en',
        'nice talking to you',
        'greetings.nicetotalktoyou'
      );
      manager.addDocument(
        'en',
        "it's been nice talking to you",
        'greetings.nicetotalktoyou'
      );
      manager.addAnswer('en', 'greetings.bye', 'Till next time');
      manager.addAnswer('en', 'greetings.bye', 'See you soon!');
      manager.addAnswer('en', 'greetings.hello', 'Hey there!');
      manager.addAnswer('en', 'greetings.hello', 'Greetings!');
      manager.addAnswer('en', 'greetings.howareyou', 'Feeling wonderful!');
      manager.addAnswer(
        'en',
        'greetings.howareyou',
        'Wonderful! Thanks for asking'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        "It's nice meeting you, too {{name}}"
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        "Likewise. I'm looking forward to helping you out {{name}}"
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        'Nice meeting you, as well {{name}}'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        'The pleasure is mine {{name}}'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetoseeyou',
        'Same here. I was starting to miss you'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetoseeyou',
        'So glad we meet again'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetotalktoyou',
        'It sure was. We can chat again anytime'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetotalktoyou',
        'I enjoy talking to you, too'
      );
      await manager.train();
      const result = await manager.process('en', 'It was nice to meet you', {
        name: 'John',
      });
      expect(result.answer).toMatch(
        new RegExp(
          /(It's nice meeting you, too John)|(Likewise. I'm looking forward to helping you out John)|(Nice meeting you, as well John)|(The pleasure is mine John)/g
        )
      );
    });

    test('Should process Thai', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['th']);
      manager.addDocument('th', 'สวัสดี', 'greet');
      manager.addDocument('th', 'สวัสดีตอนเช้าค่ะ', 'greet');
      manager.addDocument('th', 'ราตรีสวัสดิ์', 'greet');
      manager.addDocument('th', 'สวัสดีตอนเย็น', 'greet');
      manager.addDocument('th', 'ฉันทำกุญแจของฉันหาย', 'keys');
      manager.addDocument('th', 'กุญแจของฉันอยู่ที่ไหน', 'keys');
      manager.addDocument('th', 'ฉันไม่พบกุญแจของฉัน', 'keys');
      await manager.train();
      const result = await manager.process('th', 'ฉันไม่รู้ว่ากุญแจอยู่ที่ไหน');
      expect(result).toBeDefined();
      expect(result.locale).toEqual('th');
      expect(result.localeIso2).toEqual('th');
      expect(result.utterance).toEqual('ฉันไม่รู้ว่ากุญแจอยู่ที่ไหน');
      expect(result.classifications).toBeDefined();
      expect(result.classifications).toHaveLength(2);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.8);
    });

    test('Should process Hindi', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['hi']);
      manager.addDocument('hi', 'नमस्ते', 'greet');
      manager.addDocument('hi', 'सुसंध्या', 'greet');
      manager.addDocument('hi', 'शुभ प्रभात', 'greet');
      manager.addDocument('hi', 'मैंने अपनी चाबी खो दी है', 'keys');
      manager.addDocument('hi', 'मुझे अपनी चाबी नहीं मिली', 'keys');
      manager.addDocument(
        'hi',
        'मुझे नहीं पता कि मेरी चाबियां कहां हैं',
        'keys'
      );
      await manager.train();
      const result = await manager.process('hi', 'मेरी चाबियाँ कहाँ हैं');
      expect(result).toBeDefined();
      expect(result.locale).toEqual('hi');
      expect(result.localeIso2).toEqual('hi');
      expect(result.utterance).toEqual('मेरी चाबियाँ कहाँ हैं');
      expect(result.classifications).toBeDefined();
      expect(result.classifications).toHaveLength(2);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.8);
    });

    test('Should process Bengali', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['bn']);
      manager.addDocument('bn', 'হ্যালো', 'greet');
      manager.addDocument('bn', 'শুভ সন্ধ্যা', 'greet');
      manager.addDocument('bn', 'সুপ্রভাত', 'greet');
      manager.addDocument('bn', 'আমি আমার চাবি হারিয়েছি', 'keys');
      manager.addDocument('bn', 'আমি আমার চাবিগুলি পাই না', 'keys');
      manager.addDocument('bn', 'আমি জানি না আমার চাবিগুলি কোথায়?', 'keys');
      await manager.train();
      const result = await manager.process('bn', 'যেখানে আমার কি হয়');
      expect(result).toBeDefined();
      expect(result.locale).toEqual('bn');
      expect(result.localeIso2).toEqual('bn');
      expect(result.utterance).toEqual('যেখানে আমার কি হয়');
      expect(result.classifications).toBeDefined();
      expect(result.classifications).toHaveLength(2);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.8);
    });

    test('Should call transformer function if it is passed', async () => {
      const transformer = jest.fn((_) => _);
      const manager = new NlpManager({
        processTransformer: transformer,
      });
      manager.addLanguage(['en', 'ja']);
      manager.addDocument('en', 'Hello', 'greet');
      manager.addDocument('en', 'Good evening', 'greet');
      manager.addDocument('en', 'Good morning', 'greet');
      manager.addDocument('en', "I've lost my keys", 'keys');
      manager.addDocument('en', "I don't find my keys", 'keys');
      manager.addDocument('en', "I don't know where are my keys", 'keys');
      await manager.train();

      expect(transformer).not.toHaveBeenCalled();

      await manager.process('where are my keys');

      expect(transformer).toHaveBeenCalled();
      expect(transformer.mock.calls[0][0]).toMatchObject({
        locale: 'en',
        localeIso2: 'en',
        utterance: 'where are my keys',
      });
    });

    test('Should return transformer function result if it is passed', async () => {
      const transformedValue = {
        transformed: 'VALUE',
      };
      const transformer = jest.fn().mockReturnValue(transformedValue);
      const manager = new NlpManager({
        processTransformer: transformer,
      });
      manager.addLanguage(['en', 'ja']);
      manager.addDocument('en', 'Hello', 'greet');
      await manager.train();

      const result = await manager.process('where are my keys');

      expect(result).toEqual(transformedValue);
    });

    test('Should return async transformer function result if it is passed', async () => {
      const transformedValue = {
        transformed: 'VALUE',
      };
      const transformer = jest
        .fn()
        .mockReturnValue(Promise.resolve(transformedValue));
      const manager = new NlpManager({
        processTransformer: transformer,
      });
      manager.addLanguage(['en', 'ja']);
      manager.addDocument('en', 'Hello', 'greet');
      await manager.train();

      const result = await manager.process('where are my keys');

      expect(result).toEqual(transformedValue);
    });
  });

  describe('Remove answer', () => {
    test('It should remove an answer from the NLG', () => {
      const manager = new NlpManager({ languages: ['en'] });
      manager.addAnswer('en', 'greetings.bye', 'Till next time');
      manager.addAnswer('en', 'greetings.bye', 'See you soon!');
      manager.removeAnswer('en', 'greetings.bye', 'See you soon!');
      const answers = manager.findAllAnswers('en', 'greetings.bye', {});
      expect(answers).toHaveLength(1);
    });
  });

  describe('Add action', () => {
    test('It should add an action for the given intent', () => {
      const manager = new NlpManager({
        languages: ['en'],
        action: {
          cleanSession: () => 'cleaned',
        },
      });
      manager.addAction('greetings.bye', 'cleanSession', ['true']);
      const actions = manager.getActions('greetings.bye');

      expect(actions).toHaveLength(1);
      expect(actions[0].action).toEqual('cleanSession');
      expect(actions[0].parameters).toEqual(['true']);
    });
  });

  describe('Remove action', () => {
    test('It should remove an action', () => {
      const manager = new NlpManager({ languages: ['en'] });
      manager.addAction('greetings.bye', 'cleanSession', ['true']);
      manager.removeAction('greetings.bye', 'cleanSession', ['true']);
      const actions = manager.getActions('greetings.bye');
      expect(actions).toHaveLength(0);
    });
  });

  describe('Remove actions', () => {
    test('It should remove all actions of an intent', () => {
      const manager = new NlpManager({ languages: ['en'] });
      manager.addAction('greetings.bye', 'cleanSession', ['true']);
      manager.removeActions('greetings.bye');
      const actions = manager.getActions('greetings.bye');
      expect(actions).toHaveLength(0);
    });
  });

  describe('Get Sentiment', () => {
    test('It should return the sentiment of an utterance', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['en']);
      const sentiment = await manager.getSentiment('en', 'I love kitties');
      expect(sentiment.vote).toEqual('positive');
    });
    test('If the locale is not given, then guess it', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['en']);
      const sentiment = await manager.getSentiment('I love kitties');
      expect(sentiment.vote).toEqual('positive');
    });
  });

  describe('Domain', () => {
    test('When adding a new intent, by default is assigned to the default domain', () => {
      const manager = new NlpManager({ languages: ['en'] });
      manager.addDocument('en', 'Good Morning', 'greet');
      manager.addDocument('en', 'Where are my keys', 'keys');
      const expected = 'default';
      let actual = manager.getIntentDomain('en', 'greet');
      expect(actual).toEqual(expected);
      actual = manager.getIntentDomain('en', 'keys');
      expect(actual).toEqual(expected);
    });
    test('The domain of a non existing intent should be default', () => {
      const manager = new NlpManager({ languages: ['en'] });
      manager.addDocument('en', 'Good Morning', 'greet');
      manager.addDocument('en', 'Where are my keys', 'keys');
      const actual = manager.getIntentDomain('en', 'nope');
      const expected = 'default';
      expect(actual).toEqual(expected);
    });
    test('It should return the domain of the intent when processing', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'ja']);
      manager.assignDomain('greet', 'domain');
      manager.assignDomain('keys', 'domain');
      manager.addDocument('en', 'Hello', 'greet');
      manager.addDocument('en', 'Good evening', 'greet');
      manager.addDocument('en', 'Good morning', 'greet');
      manager.addDocument('en', "I've lost my keys", 'keys');
      manager.addDocument('en', "I don't find my keys", 'keys');
      manager.addDocument('en', "I don't know where are my keys", 'keys');
      await manager.train();
      const result = await manager.process('where are my keys');
      expect(result.domain).toEqual('domain');
    });
    test('It can provide a list of domains with the intents', () => {
      const manager = new NlpManager({ languages: ['en'] });
      manager.assignDomain('greet', 'domain1');
      manager.assignDomain('keys', 'domain2');
      manager.assignDomain('another', 'domain2');
      manager.addDocument('en', 'Good Morning', 'greet');
      manager.addDocument('en', 'Where are my keys', 'keys');
      manager.addDocument('en', 'This is another thing', 'another');
      const actual = manager.getDomains();
      const expected = {
        en: {
          domain1: ['greet'],
          domain2: ['keys', 'another'],
        },
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('Spell Checking', () => {
    test('If spell checking is provided, can fix words', async () => {
      const manager = new NlpManager({
        languages: ['fr'],
        nlu: { spellCheck: true },
        ner: { builtins: [] },
      });
      manager.addDocument('fr', 'Bonjour!', 'greetings');
      manager.addDocument('fr', 'bonjour', 'greetings');
      manager.addDocument('fr', 'salut', 'greetings');
      manager.addDocument('fr', 'au revoire', 'bye');
      await manager.train();
      const result1 = await manager.process('fr', 'Bonjou');
      expect(result1.intent).toEqual('greetings');
      const result2 = await manager.process('fr', 'Bonjourd');
      expect(result2.intent).toEqual('greetings');
    });
  });

  describe('Load excel', () => {
    test('It should read languages', () => {
      const manager = new NlpManager();
      manager.loadExcel('./packages/node-nlp/test/nlp/rules.xls');
      expect(manager.nlp.nluManager.locales).toEqual(['en', 'es']);
    });
    test('It should read excel without regex entities', () => {
      const manager = new NlpManager();
      manager.loadExcel('./packages/node-nlp/test/nlp/rulesnoregex.xls');
      expect(manager.nlp.nluManager.locales).toEqual(['en', 'es']);
    });
    test('It should read named entities', () => {
      const manager = new NlpManager();
      manager.loadExcel('./packages/node-nlp/test/nlp/rules.xls');
      expect(manager.nlp.ner.rules.en).toBeDefined();
      expect(manager.nlp.ner.rules.es).toBeDefined();
      expect(manager.nlp.ner.rules.en.hero).toBeDefined();
      expect(manager.nlp.ner.rules.en.food).toBeDefined();
      expect(manager.nlp.ner.rules.es.hero).toBeDefined();
      expect(manager.nlp.ner.rules.es.food).toBeDefined();
    });
    test('It should create the classifiers for the languages', () => {
      const manager = new NlpManager();
      manager.loadExcel('./packages/node-nlp/test/nlp/rules.xls');
      expect(manager.nlp.nluManager.domainManagers.en).toBeDefined();
      expect(manager.nlp.nluManager.domainManagers.es).toBeDefined();
    });
    test('The classifiers should contain the intent definition', () => {
      const manager = new NlpManager();
      manager.loadExcel('./packages/node-nlp/test/nlp/rules.xls');
      expect(manager.nlp.nluManager.domainManagers.en.sentences).toHaveLength(
        5
      );
      expect(
        manager.nlp.nluManager.domainManagers.en.sentences[0].intent
      ).toEqual('whois');
      expect(
        manager.nlp.nluManager.domainManagers.en.sentences[1].intent
      ).toEqual('whereis');
      expect(
        manager.nlp.nluManager.domainManagers.en.sentences[2].intent
      ).toEqual('whereis');
      expect(
        manager.nlp.nluManager.domainManagers.en.sentences[3].intent
      ).toEqual('whereis');
      expect(
        manager.nlp.nluManager.domainManagers.en.sentences[4].intent
      ).toEqual('realname');
      expect(manager.nlp.nluManager.domainManagers.es.sentences).toHaveLength(
        4
      );
      expect(
        manager.nlp.nluManager.domainManagers.es.sentences[0].intent
      ).toEqual('whois');
      expect(
        manager.nlp.nluManager.domainManagers.es.sentences[1].intent
      ).toEqual('whereis');
      expect(
        manager.nlp.nluManager.domainManagers.es.sentences[2].intent
      ).toEqual('whereis');
      expect(
        manager.nlp.nluManager.domainManagers.es.sentences[3].intent
      ).toEqual('realname');
    });
    test('The NLG should be filled', () => {
      const manager = new NlpManager();
      manager.loadExcel('./packages/node-nlp/test/nlp/rules.xls');
      expect(manager.nlp.nlgManager.responses.en).toBeDefined();
      expect(manager.nlp.nlgManager.responses.en.whois).toBeDefined();
      expect(manager.nlp.nlgManager.responses.en.whereis).toBeDefined();
      expect(manager.nlp.nlgManager.responses.en.realname).toBeDefined();
      expect(manager.nlp.nlgManager.responses.es).toBeDefined();
      expect(manager.nlp.nlgManager.responses.es.whois).toBeDefined();
      expect(manager.nlp.nlgManager.responses.es.whereis).toBeDefined();
      expect(manager.nlp.nlgManager.responses.es.realname).toBeDefined();
    });
  });

  describe('addBetweenCondition', () => {
    test('It should extract a between rule', async () => {
      const nlp = new NlpManager({ forceNER: true });
      nlp.addBetweenCondition('en', 'entity', 'from', 'to');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid to Barcelona',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          start: 18,
          end: 23,
          accuracy: 1,
          sourceText: 'Madrid',
          entity: 'entity',
          type: 'trim',
          subtype: 'between',
          utteranceText: 'Madrid',
          len: 6,
        },
      ]);
    });
  });

  describe('addBeforeCondition', () => {
    test('It should extract a before rule', async () => {
      const nlp = new NlpManager({ forceNER: true });
      nlp.addBeforeCondition('en', 'entity', 'from');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid from Barcelona',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'before',
          start: 0,
          end: 11,
          len: 12,
          accuracy: 0.99,
          sourceText: 'I have to go',
          utteranceText: 'I have to go',
          entity: 'entity',
          alias: 'entity_0',
        },
        {
          type: 'trim',
          subtype: 'before',
          start: 18,
          end: 23,
          len: 6,
          accuracy: 0.99,
          sourceText: 'Madrid',
          utteranceText: 'Madrid',
          entity: 'entity',
          alias: 'entity_1',
        },
      ]);
    });
  });

  describe('addBeforeLastCondition', () => {
    test('It should extract a before last rule', async () => {
      const nlp = new NlpManager({ forceNER: true });
      nlp.addBeforeLastCondition('en', 'entity', 'from');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid from Barcelona',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'beforeLast',
          start: 0,
          end: 23,
          len: 24,
          accuracy: 0.99,
          sourceText: 'I have to go from Madrid',
          utteranceText: 'I have to go from Madrid',
          entity: 'entity',
        },
      ]);
    });
  });

  describe('addBeforeFirstCondition', () => {
    test('It should extract a before first rule', async () => {
      const nlp = new NlpManager({ forceNER: true });
      nlp.addBeforeFirstCondition('en', 'entity', 'from');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid from Barcelona',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'beforeFirst',
          start: 0,
          end: 11,
          len: 12,
          accuracy: 0.99,
          sourceText: 'I have to go',
          utteranceText: 'I have to go',
          entity: 'entity',
        },
      ]);
    });
  });

  describe('addAfterCondition', () => {
    test('It should extract a get after rule', async () => {
      const nlp = new NlpManager({ forceNER: true });
      nlp.addAfterCondition('en', 'entity', 'from');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid from Barcelona',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'after',
          start: 18,
          end: 23,
          len: 6,
          accuracy: 0.99,
          sourceText: 'Madrid',
          utteranceText: 'Madrid',
          entity: 'entity',
          alias: 'entity_0',
        },
        {
          type: 'trim',
          subtype: 'after',
          start: 30,
          end: 38,
          len: 9,
          accuracy: 0.99,
          sourceText: 'Barcelona',
          utteranceText: 'Barcelona',
          entity: 'entity',
          alias: 'entity_1',
        },
      ]);
    });
  });

  describe('addAfterFirstCondition', () => {
    test('It should extract a get after first rule', async () => {
      const nlp = new NlpManager({ forceNER: true });
      nlp.addAfterFirstCondition('en', 'entity', 'from');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid from Barcelona',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'afterFirst',
          start: 18,
          end: 38,
          len: 21,
          accuracy: 0.99,
          sourceText: 'Madrid from Barcelona',
          utteranceText: 'Madrid from Barcelona',
          entity: 'entity',
        },
      ]);
    });
  });

  describe('addAfterLastCondition', () => {
    test('It should extract a get after last rule', async () => {
      const nlp = new NlpManager({ forceNER: true });
      nlp.addAfterLastCondition('en', 'entity', 'from');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid from Barcelona',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'afterLast',
          start: 30,
          end: 38,
          len: 9,
          accuracy: 0.99,
          sourceText: 'Barcelona',
          utteranceText: 'Barcelona',
          entity: 'entity',
        },
      ]);
    });
  });
});
