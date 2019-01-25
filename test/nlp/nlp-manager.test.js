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

const { NlpManager } = require('../../lib');

describe('NLP Manager', () => {
  describe('constructor', () => {
    test('Should create a new instance', () => {
      const manager = new NlpManager();
      expect(manager).toBeDefined();
    });
    test('Should initialize the default properties', () => {
      const manager = new NlpManager();
      expect(manager.nerManager).toBeDefined();
      expect(manager.guesser).toBeDefined();
      expect(manager.sentiment).toBeDefined();
      expect(manager.slotManager).toBeDefined();
      expect(manager.languages).toEqual([]);
      expect(manager.classifiers).toEqual({});
      expect(manager.settings.fullSearchWhenGuessed).toBeFalsy();
      expect(manager.settings.useNlg).toBeTruthy();
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
      const transformer = x => x;
      const manager = new NlpManager({ processTransformer: transformer });
      expect(manager.processTransformer).toEqual(transformer);
    });
  });

  describe('Add language', () => {
    test('Should add the language and the classifier', () => {
      const manager = new NlpManager();
      manager.addLanguage('en');
      expect(manager.languages).toHaveLength(1);
      expect(manager.languages).toContain('en');
      expect(manager.classifiers.en).toBeDefined();
    });
    test('Should add several languages', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'es']);
      expect(manager.languages).toHaveLength(2);
      expect(manager.languages).toContain('en');
      expect(manager.languages).toContain('es');
      expect(manager.classifiers.en).toBeDefined();
      expect(manager.classifiers.es).toBeDefined();
    });
    test('Should not add already existing lenguages', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'es']);
      manager.addLanguage(['en', 'en', 'es', 'fr']);
      expect(manager.languages).toHaveLength(3);
      expect(manager.languages).toContain('en');
      expect(manager.languages).toContain('es');
      expect(manager.languages).toContain('fr');
      expect(manager.classifiers.en).toBeDefined();
      expect(manager.classifiers.es).toBeDefined();
      expect(manager.classifiers.fr).toBeDefined();
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
      const manager = new NlpManager();
      manager.addLanguage(['en', 'es']);
      manager.addDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(manager.classifiers.es.docs).toHaveLength(1);
      expect(manager.classifiers.en.docs).toHaveLength(0);
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
      ).toThrow('Classifier not found for locale es');
    });
    test('Should add the document to the classifier', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'es']);
      manager.addDocument('es', 'Dónde están las llaves', 'keys');
      expect(manager.classifiers.es.docs).toHaveLength(1);
    });
    test('Should extract managed named entities', () => {
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
      manager.addDocument('en', 'I saw %hero%', 'sawhero');
      expect(manager.slotManager.intents.sawhero).toBeDefined();
      expect(manager.slotManager.intents.sawhero.hero).toBeDefined();
    });
  });

  describe('Remove named entity text', () => {
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
    manager.addNamedEntityText('food', 'pasta', ['en'], ['Pasta', 'spaghetti']);
    manager.removeNamedEntityText('hero', 'iron man', 'en', 'iron-man');
    const ironman = manager.nerManager.getNamedEntity('hero', false);
    expect(ironman.locales.en['iron man']).toEqual(['iron man']);
  });

  describe('Remove document', () => {
    test('If locale is not defined must be guessed', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'es']);
      manager.addDocument('es', 'Dónde están las llaves', 'keys');
      manager.removeDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(manager.classifiers.es.docs).toHaveLength(0);
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
      ).toThrow('Classifier not found for locale es');
    });
    test('Should remove the document from the classifier', () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'es']);
      manager.addDocument('es', 'Dónde están las llaves', 'keys');
      manager.removeDocument('es', 'Dónde están las llaves', 'keys');
      expect(manager.classifiers.es.docs).toHaveLength(0);
    });
  });

  describe('Classify', () => {
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
      const result = manager.classify('fr', 'où sont mes clés');
      expect(result).toHaveLength(2);
      expect(result[0].label).toEqual('keys');
      expect(result[0].value).toBeGreaterThan(0.7);
    });
    test('Should guess language if not provided', async () => {
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
      let result = manager.classify('où sont mes clés');
      expect(result).toHaveLength(2);
      expect(result[0].label).toEqual('keys');
      expect(result[0].value).toBeGreaterThan(0.7);
      result = manager.classify('私の鍵はどこにありますか');
      expect(result).toHaveLength(2);
      expect(result[0].label).toEqual('keys');
      expect(result[0].value).toBeGreaterThan(0.7);
    });
    test('Should return undefined if there is not classifier for this language', async () => {
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
      const result = manager.classify('en', 'where are my keys?');
      expect(result).toBeUndefined();
    });
  });

  describe('Train', () => {
    test('You can train only a language', async () => {
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
      await manager.train('fr');
      let result = manager.classify('où sont mes clés');
      expect(result).toHaveLength(2);
      expect(result[0].label).toEqual('keys');
      expect(result[0].value).toBeGreaterThan(0.7);
      result = manager.classify('私の鍵はどこにありますか');
      expect(result).toEqual([]);
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
      let result = manager.classify('où sont mes clés');
      expect(result).toHaveLength(2);
      expect(result[0].label).toEqual('keys');
      expect(result[0].value).toBeGreaterThan(0.7);
      result = manager.classify('私の鍵はどこにありますか');
      expect(result).toHaveLength(2);
      expect(result[0].label).toEqual('keys');
      expect(result[0].value).toBeGreaterThan(0.7);
    });
  });

  describe('Is equal classification', () => {
    test('Should return true if all classifications have 0.5 score', () => {
      const manager = new NlpManager();
      const classifications = [];
      classifications.push({ label: 'a', value: 0.5 });
      classifications.push({ label: 'b', value: 0.5 });
      classifications.push({ label: 'c', value: 0.5 });
      classifications.push({ label: 'd', value: 0.5 });
      classifications.push({ label: 'e', value: 0.5 });
      classifications.push({ label: 'f', value: 0.5 });
      const result = manager.isEqualClassification(classifications);
      expect(result).toBeTruthy();
    });
    test('Should return false if at least one classification score is not 0.5', () => {
      const manager = new NlpManager();
      const classifications = [];
      classifications.push({ label: 'a', value: 0.5 });
      classifications.push({ label: 'b', value: 0.5 });
      classifications.push({ label: 'c', value: 0.6 });
      classifications.push({ label: 'd', value: 0.5 });
      classifications.push({ label: 'e', value: 0.5 });
      classifications.push({ label: 'f', value: 0.5 });
      const result = manager.isEqualClassification(classifications);
      expect(result).toBeFalsy();
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
      expect(result).toHaveLength(2);
      expect(result[0].sourceText).toEqual('Spiderman');
      expect(result[1].sourceText).toEqual('spaghetti');
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
      expect(result).toHaveLength(2);
      expect(result[0].sourceText).toEqual('Spiderman');
      expect(result[1].sourceText).toEqual('spaghetti');
    });
    test('If the locale is not one of the nlp manager, then guess language', async () => {
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
        'es',
        'I saw spiderman eating spaghetti today in the city!'
      );
      expect(result).toHaveLength(2);
      expect(result[0].sourceText).toEqual('Spiderman');
      expect(result[1].sourceText).toEqual('spaghetti');
    });
  });

  describe('Process', () => {
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
      expect(result.classification).toBeDefined();
      expect(result.classification).toHaveLength(2);
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
      expect(result.classification).toBeDefined();
      expect(result.classification).toHaveLength(2);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.7);
    });
    test('Languages with ISO code can be identified even without stemmer', async () => {
      const manager = new NlpManager({ languages: ['en', 'ko'] });
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
      expect(result.score).toBeGreaterThan(0.85);
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
      expect(result.score).toBeGreaterThan(0.85);
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
      expect(result.srcAnswer).toMatch(
        new RegExp(
          /(It's nice meeting you, too {{name}})|(Likewise. I'm looking forward to helping you out {{name}})|(Nice meeting you, as well {{name}})|(The pleasure is mine {{name}})/g
        )
      );
      expect(result.answer).toMatch(
        new RegExp(
          /(It's nice meeting you, too John)|(Likewise. I'm looking forward to helping you out John)|(Nice meeting you, as well John)|(The pleasure is mine John)/g
        )
      );
    });

    test('Should process Chinese', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['zh']);
      manager.addDocument('zh', '你好', 'greet');
      manager.addDocument('zh', '早上好', 'greet');
      manager.addDocument('zh', '下午好', 'greet');
      manager.addDocument('zh', '晚上好', 'greet');
      manager.addDocument('zh', '我找不到钥匙', 'keys');
      manager.addDocument('zh', '我丢了钥匙', 'keys');
      manager.addDocument('zh', '有人偷了我的钥匙', 'keys');
      await manager.train();
      const result = await manager.process('zh', '我不知道我的钥匙在哪里');
      expect(result).toBeDefined();
      expect(result.locale).toEqual('zh');
      expect(result.localeIso2).toEqual('zh');
      expect(result.utterance).toEqual('我不知道我的钥匙在哪里');
      expect(result.classification).toBeDefined();
      expect(result.classification).toHaveLength(2);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.8);
    });

    test('Should call transformer function if it is passed', async () => {
      const transformer = jest.fn(_ => _);
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
      const answers = manager.nlgManager.findAllAnswers(
        'en',
        'greetings.bye',
        {}
      );
      expect(answers).toHaveLength(1);
    });
  });

  describe('Import and export', () => {
    test('Should import and export model as JSON string', async () => {
      let manager = new NlpManager({ ner: { builtins: [] } });
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
      manager.addRegexEntity(
        'mail',
        'en',
        /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi
      );
      manager.addDocument('en', 'I saw %hero% eating %food%', 'sawhero');
      manager.addDocument(
        'en',
        'I have seen %hero%, he was eating %food%',
        'sawhero'
      );
      manager.addDocument('en', 'I want to eat %food%', 'wanteat');
      manager.assignDomain('sawhero', 'domain');

      await manager.train();
      // save current model as JSON string
      const model = manager.export();
      manager = new NlpManager();
      // load model from JSON String
      manager.import(model);
      const result = await manager.process(
        'I saw spiderman eating spaghetti today in the city!'
      );
      expect(result.intent).toEqual('sawhero');
      expect(result.domain).toEqual('domain');
      expect(result.score).toBeGreaterThan(0.85);
      expect(result.entities).toHaveLength(2);
      expect(result.entities[0].sourceText).toEqual('Spiderman');
      expect(result.entities[1].sourceText).toEqual('spaghetti');
    });
  });

  describe('Save and load', () => {
    test('Should allow to save, load and all should be working', async () => {
      let manager = new NlpManager({ ner: { builtins: [] } });
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
      manager.addRegexEntity(
        'mail',
        'en',
        /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi
      );
      const trimEntity = manager.addTrimEntity('from');
      trimEntity.addBetweenCondition('en', 'from', 'to');
      trimEntity.addAfterLastCondition('en', 'from');
      manager.addDocument('en', 'I saw %hero% eating %food%', 'sawhero');
      manager.addDocument(
        'en',
        'I have seen %hero%, he was eating %food%',
        'sawhero'
      );
      manager.addDocument('en', 'I want to eat %food%', 'wanteat');
      manager.addDocument(
        'en',
        'I want to travel from %from% to %to%',
        'travel'
      );
      manager.assignDomain('sawhero', 'domain');
      await manager.train();
      manager.save();
      manager = new NlpManager();
      manager.load();
      const result = await manager.process(
        'I saw spiderman eating spaghetti today in the city!'
      );
      expect(result.intent).toEqual('sawhero');
      expect(result.domain).toEqual('domain');
      expect(result.score).toBeGreaterThan(0.85);
      expect(result.entities).toHaveLength(2);
      expect(result.entities[0].sourceText).toEqual('Spiderman');
      expect(result.entities[1].sourceText).toEqual('spaghetti');
      const resultTrim = await manager.process(
        'I want to travel from Barcelona to Madrid'
      );
      expect(resultTrim.entities).toHaveLength(1);
      expect(resultTrim.entities[0].sourceText).toEqual('Barcelona');
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

  describe('Load excel', () => {
    test('It should read languages', () => {
      const manager = new NlpManager();
      manager.loadExcel('./test/nlp/rules.xls');
      expect(manager.languages).toEqual(['en', 'es']);
    });
    test('It should read named entities', () => {
      const manager = new NlpManager();
      manager.loadExcel('./test/nlp/rules.xls');
      expect(manager.nerManager.namedEntities.hero).toBeDefined();
      expect(manager.nerManager.namedEntities.food).toBeDefined();
      const { hero, food } = manager.nerManager.namedEntities;
      expect(hero.type).toEqual('enum');
      expect(food.type).toEqual('enum');
      expect(food.locales.en).toEqual({
        burguer: ['burguer', 'hamburguer'],
        pasta: ['pasta', 'spaghetti'],
        pizza: ['pizza'],
      });
      expect(food.locales.es).toEqual({
        burguer: ['hamburguesa'],
        pasta: ['pasta', 'spaghetti'],
        pizza: ['pizza'],
      });
    });

    test('It should create the classifiers for the languages', () => {
      const manager = new NlpManager();
      manager.loadExcel('./test/nlp/rules.xls');
      expect(manager.classifiers.en).toBeDefined();
      expect(manager.classifiers.es).toBeDefined();
    });
    test('The classifiers should contain the intent definition', () => {
      const manager = new NlpManager();
      manager.loadExcel('./test/nlp/rules.xls');
      expect(manager.classifiers.en.docs).toHaveLength(3);
      expect(manager.classifiers.en.docs[0].intent).toEqual('whois');
      expect(manager.classifiers.en.docs[1].intent).toEqual('whereis');
      expect(manager.classifiers.en.docs[2].intent).toEqual('realname');
      expect(manager.classifiers.es.docs).toHaveLength(4);
      expect(manager.classifiers.es.docs[0].intent).toEqual('whois');
      expect(manager.classifiers.es.docs[1].intent).toEqual('whereis');
      expect(manager.classifiers.es.docs[2].intent).toEqual('whereis');
      expect(manager.classifiers.es.docs[3].intent).toEqual('realname');
    });
    test('The NLG should be filled', () => {
      const manager = new NlpManager();
      manager.loadExcel('./test/nlp/rules.xls');
      expect(manager.nlgManager.responses.en).toBeDefined();
      expect(manager.nlgManager.responses.en.whois).toBeDefined();
      expect(manager.nlgManager.responses.en.whereis).toBeDefined();
      expect(manager.nlgManager.responses.en.realname).toBeDefined();
      expect(manager.nlgManager.responses.es).toBeDefined();
      expect(manager.nlgManager.responses.es.whois).toBeDefined();
      expect(manager.nlgManager.responses.es.whereis).toBeDefined();
      expect(manager.nlgManager.responses.es.realname).toBeDefined();
    });
  });
  describe('Domain', () => {
    test('When adding a new intent, by default is assigned to the default domain', () => {
      const manager = new NlpManager({ languages: ['en'] });
      manager.addDocument('en', 'Good Morning', 'greet');
      manager.addDocument('en', 'Where are my keys', 'keys');
      const expected = 'default';
      let actual = manager.getIntentDomain('greet');
      expect(actual).toEqual(expected);
      actual = manager.getIntentDomain('keys');
      expect(actual).toEqual(expected);
    });
    test('The domain of a non existing intent should be undefined', () => {
      const manager = new NlpManager({ languages: ['en'] });
      manager.addDocument('en', 'Good Morning', 'greet');
      manager.addDocument('en', 'Where are my keys', 'keys');
      const actual = manager.getIntentDomain('nope');
      expect(actual).toBeUndefined();
    });
    test('It should return the domain of the intent when processing', async () => {
      const manager = new NlpManager();
      manager.addLanguage(['en', 'ja']);
      manager.addDocument('en', 'Hello', 'greet');
      manager.addDocument('en', 'Good evening', 'greet');
      manager.addDocument('en', 'Good morning', 'greet');
      manager.addDocument('en', "I've lost my keys", 'keys');
      manager.addDocument('en', "I don't find my keys", 'keys');
      manager.addDocument('en', "I don't know where are my keys", 'keys');
      manager.assignDomain('greet', 'domain');
      manager.assignDomain('keys', 'domain');
      await manager.train();
      const result = await manager.process('where are my keys');
      expect(result.domain).toEqual('domain');
    });
    test('It can provide a list of domains with the intents', () => {
      const manager = new NlpManager({ languages: ['en'] });
      manager.addDocument('en', 'Good Morning', 'greet');
      manager.addDocument('en', 'Where are my keys', 'keys');
      manager.addDocument('en', 'This is another thing', 'another');
      manager.assignDomain('greet', 'domain1');
      manager.assignDomain('keys', 'domain2');
      manager.assignDomain('another', 'domain2');
      const actual = manager.getDomains();
      const expected = { domain1: ['greet'], domain2: ['keys', 'another'] };
      expect(actual).toEqual(expected);
    });
  });
});
