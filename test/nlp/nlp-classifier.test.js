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

const {
  NlpClassifier,
  BinaryNeuralNetworkClassifier,
  NlpUtil,
} = require('../../lib');
const corpus = require('./corpus.json');

describe('NLP Classifier', () => {
  describe('constructor', () => {
    test('Should create a new instance', () => {
      const classifier = new NlpClassifier();
      expect(classifier).toBeDefined();
    });
    test('Should initialize the default properties', () => {
      const classifier = new NlpClassifier();
      expect(classifier.settings.language).toEqual('en');
      expect(classifier.settings.stemmer).toBeDefined();
      expect(classifier.docs).toEqual([]);
      expect(classifier.features).toEqual({});
    });
    test('I can provide my own Binary Relevance classifier', () => {
      const binary = new BinaryNeuralNetworkClassifier();
      const classifier = new NlpClassifier({ neuralClassifier: binary });
      expect(classifier.settings.neuralClassifier).toBe(binary);
    });
    test('I can provide my own stemmer', () => {
      const stemmer = NlpUtil.getStemmer('en');
      const classifier = new NlpClassifier({ stemmer });
      expect(classifier.settings.stemmer).toBe(stemmer);
    });
    test('I can decide to not keep the stopwords', () => {
      const classifier = new NlpClassifier({ keepStopWords: false });
      expect(classifier.settings.keepStopWords).toBeFalsy();
    });
  });

  describe('add', () => {
    test('Should add an utterance and intent', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add('Bonjour', 'greet');
      expect(classifier.docs).toHaveLength(1);
      classifier.add('bonne nuit', 'greet');
      expect(classifier.docs).toHaveLength(2);
    });
    test('Should add an utterance and intent even to different intents', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add('Bonjour', 'greet');
      expect(classifier.docs).toHaveLength(1);
      classifier.add('bonne nuit', 'greet');
      expect(classifier.docs).toHaveLength(2);
      classifier.add("J'ai perdu mes clés", 'keys');
      expect(classifier.docs).toHaveLength(3);
      classifier.add('Je ne trouve pas mes clés', 'keys');
      expect(classifier.docs).toHaveLength(4);
    });
    test('Should check that the utterance is an string', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      expect(() => classifier.add(1, 'greet')).toThrow(
        'Utterance must be an string'
      );
      expect(() => classifier.add(undefined, 'greet')).toThrow(
        'Utterance must be an string'
      );
    });
    test('Should check that the intent is an string', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      expect(() => classifier.add('Bonjour', 1)).toThrow(
        'Intent must be an string'
      );
      expect(() => classifier.add('Bonjour', undefined)).toThrow(
        'Intent must be an string'
      );
    });
    test('If the utterance is empty, do not add doc to the classifier', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add(' ', 'greet');
      expect(classifier.docs).toHaveLength(0);
    });
    test('If the utterance was already added, do not add doc to the classifier', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add('Bonjour', 'greet');
      expect(classifier.docs).toHaveLength(1);
      classifier.add('Bonjour', 'greet');
      expect(classifier.docs).toHaveLength(1);
    });
  });

  describe('Pos utterance', () => {
    test('Should return the position of the utterance', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add('Bonjour', 'greet');
      classifier.add('bonne nuit', 'greet');
      expect(classifier.posUtterance('Bonjour')).toEqual(0);
      expect(classifier.posUtterance('Bonne nuit')).toEqual(1);
    });
    test('Should return -1 if the utterance does not exists', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add('Bonjour', 'greet');
      classifier.add('bonne nuit', 'greet');
      expect(classifier.posUtterance('Bonsoir')).toEqual(-1);
    });
    test('Should return position if the utterance stems already exists', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add('Bonjour', 'greet');
      classifier.add('bonne nuit', 'greet');
      expect(classifier.posUtterance('Bonn nuite')).toEqual(1);
    });
  });

  describe('exists utterance', () => {
    test('Should return if the utterance exists', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add('Bonjour', 'greet');
      classifier.add('bonne nuit', 'greet');
      expect(classifier.existsUtterance('Bonjour')).toBeTruthy();
      expect(classifier.existsUtterance('Bonne nuit')).toBeTruthy();
      expect(classifier.existsUtterance('Bonsoir')).toBeFalsy();
    });
  });

  describe('remove utterance', () => {
    test('Should remove the utterance if no intent is given', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add('Bonjour', 'greet');
      classifier.add('bonne nuit', 'greet');
      classifier.remove('bonjour');
      expect(classifier.docs).toHaveLength(1);
    });
    test('Should do nothing if utterance does not exists', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add('Bonjour', 'greet');
      classifier.add('bonne nuit', 'greet');
      classifier.remove('bonsoire');
      expect(classifier.docs).toHaveLength(2);
    });
    test('Should remove the utterance if intent is provided', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add('Bonjour', 'greet');
      classifier.add('bonne nuit', 'greet');
      classifier.remove('bonjour', 'greet');
      expect(classifier.docs).toHaveLength(1);
    });
    test('Should do nothing if utterance does not exists for the intent', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add('Bonjour', 'greet');
      classifier.add('bonne nuit', 'greet');
      classifier.remove('Bonjour', 'meh');
      expect(classifier.docs).toHaveLength(2);
    });
    test('Should do nothing if utterance is empty', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add('Bonjour', 'greet');
      classifier.add('bonne nuit', 'greet');
      classifier.remove('', 'meh');
      expect(classifier.docs).toHaveLength(2);
    });
    test('Should throw an error if the utterance is not a string', () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      expect(() => {
        classifier.remove([], 'meh');
      }).toThrow('Utterance must be an string');
    });
  });

  describe('get classifications', () => {
    test('Should give the classifications for an utterance', async () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add('Bonjour', 'greet');
      classifier.add('bonne nuit', 'greet');
      classifier.add('Bonsoir', 'greet');
      classifier.add("J'ai perdu mes clés", 'keys');
      classifier.add('Je ne trouve pas mes clés', 'keys');
      classifier.add('Je ne me souviens pas où sont mes clés', 'keys');
      await classifier.train();
      const classifications = classifier.getClassifications('où sont mes clés');
      expect(classifications).toHaveLength(2);
      expect(classifications[0].label).toEqual('keys');
      expect(classifications[0].value).toBeGreaterThan(0.7);
    });
    it('Should work even for japanese', async () => {
      const classifier = new NlpClassifier({ language: 'ja' });
      classifier.add('おはようございます', 'greet');
      classifier.add('こんにちは', 'greet');
      classifier.add('おやすみ', 'greet');
      classifier.add('私は私の鍵を紛失した', 'keys');
      classifier.add('私は私の鍵がどこにあるのか覚えていない', 'keys');
      classifier.add('私は私の鍵が見つからない', 'keys');
      await classifier.train();
      const classifications = classifier.getClassifications(
        '私の鍵はどこにありますか'
      );
      expect(classifications).toHaveLength(2);
      expect(classifications[0].label).toEqual('keys');
      expect(classifications[0].value).toBeGreaterThan(0.7);
    });
  });

  describe('Get Best Classification', () => {
    test('Should give the classifications for an utterance', async () => {
      const classifier = new NlpClassifier({ language: 'fr' });
      classifier.add('Bonjour', 'greet');
      classifier.add('bonne nuit', 'greet');
      classifier.add('Bonsoir', 'greet');
      classifier.add("J'ai perdu mes clés", 'keys');
      classifier.add('Je ne trouve pas mes clés', 'keys');
      classifier.add('Je ne me souviens pas où sont mes clés', 'keys');
      await classifier.train();
      const classification = classifier.getBestClassification(
        'où sont mes clés'
      );
      expect(classification.label).toEqual('keys');
      expect(classification.value).toBeGreaterThan(0.7);
    });
    it('Should work even for japanese', async () => {
      const classifier = new NlpClassifier({ language: 'ja' });
      classifier.add('おはようございます', 'greet');
      classifier.add('こんにちは', 'greet');
      classifier.add('おやすみ', 'greet');
      classifier.add('私は私の鍵を紛失した', 'keys');
      classifier.add('私は私の鍵がどこにあるのか覚えていない', 'keys');
      classifier.add('私は私の鍵が見つからない', 'keys');
      await classifier.train();
      const classification = classifier.getBestClassification(
        '私の鍵はどこにありますか'
      );
      expect(classification.label).toEqual('keys');
      expect(classification.value).toBeGreaterThan(0.7);
    });
  });

  describe('Neural classifier', () => {
    test('If should improve accuracy of LRC', async () => {
      const classifier = new NlpClassifier({ language: 'en' });
      for (let i = 0; i < corpus.length; i += 1) {
        classifier.add(corpus[i].text, corpus[i].intent);
      }
      await classifier.train();
      const classifications = classifier.getClassifications(
        'next train from garching'
      );
      expect(classifications[0].label).toEqual('DepartureTime');
    }, 10000);
  });
});
