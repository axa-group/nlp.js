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

const {
  BaseNLU,
  LogisticRegressionNLU,
  LogisticRegressionClassifier,
  NlpUtil,
} = require('../../lib');

describe('Logistic Regression NLU', () => {
  describe('constructor', () => {
    test('Should create a new instance', () => {
      const nlu = new LogisticRegressionNLU();
      expect(nlu).toBeDefined();
    });
    test('Should initialize the default properties', () => {
      const nlu = new LogisticRegressionNLU();
      expect(nlu.language).toEqual('en');
      expect(nlu.stemmer).toBeDefined();
      expect(nlu.docs).toEqual([]);
      expect(nlu.features).toEqual({});
    });
    test('I can provide my own LRC classifier', () => {
      const classifier = new LogisticRegressionClassifier();
      const nlu = new LogisticRegressionNLU({ classifier });
      expect(nlu.classifier).toBe(classifier);
    });
    test('I can provide my own stemmer', () => {
      const stemmer = NlpUtil.getStemmer('en');
      const nlu = new LogisticRegressionNLU({ stemmer });
      expect(nlu.stemmer).toBe(stemmer);
    });
    test('I can decide to not keep the stopwords', () => {
      const nlu = new LogisticRegressionNLU({ keepStopwords: false });
      expect(nlu.keepStopwords).toBeFalsy();
    });
  });

  describe('add', () => {
    test('Should add an utterance and intent', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      expect(nlu.docs).toHaveLength(1);
      nlu.add('bonne nuit', 'greet');
      expect(nlu.docs).toHaveLength(2);
    });
    test('Should add an utterance and intent even to different intents', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      expect(nlu.docs).toHaveLength(1);
      nlu.add('bonne nuit', 'greet');
      expect(nlu.docs).toHaveLength(2);
      nlu.add("J'ai perdu mes clés", 'keys');
      expect(nlu.docs).toHaveLength(3);
      nlu.add('Je ne trouve pas mes clés', 'keys');
      expect(nlu.docs).toHaveLength(4);
    });
    test('Should check that the utterance is an string', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      expect(() => nlu.add(1, 'greet')).toThrow('Utterance must be an string');
      expect(() => nlu.add(undefined, 'greet')).toThrow(
        'Utterance must be an string'
      );
    });
    test('Should check that the intent is an string', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      expect(() => nlu.add('Bonjour', 1)).toThrow('Intent must be an string');
      expect(() => nlu.add('Bonjour', undefined)).toThrow(
        'Intent must be an string'
      );
    });
    test('If the utterance is empty, do not add doc to the classifier', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add(' ', 'greet');
      expect(nlu.docs).toHaveLength(0);
    });
    test('If the utterance was already added, do not add doc to the classifier', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      expect(nlu.docs).toHaveLength(1);
      nlu.add('Bonjour', 'greet');
      expect(nlu.docs).toHaveLength(1);
    });
  });

  describe('Pos utterance', () => {
    test('Should return the position of the utterance', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      expect(nlu.posUtterance('Bonjour')).toEqual(0);
      expect(nlu.posUtterance('Bonne nuit')).toEqual(1);
    });
    test('Should return -1 if the utterance does not exists', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      expect(nlu.posUtterance('Bonsoir')).toEqual(-1);
    });
    test('Should return position if the utterance stems already exists', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      expect(nlu.posUtterance('Bonn nuite')).toEqual(1);
    });
  });

  describe('exists utterance', () => {
    test('Should return if the utterance exists', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      expect(nlu.existsUtterance('Bonjour')).toBeTruthy();
      expect(nlu.existsUtterance('Bonne nuit')).toBeTruthy();
      expect(nlu.existsUtterance('Bonsoir')).toBeFalsy();
    });
  });

  describe('remove utterance', () => {
    test('Should remove the utterance if no intent is given', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.remove('bonjour');
      expect(nlu.docs).toHaveLength(1);
    });
    test('Should do nothing if utterance does not exists', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.remove('bonsoire');
      expect(nlu.docs).toHaveLength(2);
    });
    test('Should remove the utterance if intent is provided', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.remove('bonjour', 'greet');
      expect(nlu.docs).toHaveLength(1);
    });
    test('Should do nothing if utterance does not exists for the intent', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.remove('Bonjour', 'meh');
      expect(nlu.docs).toHaveLength(2);
    });
    test('Should do nothing if utterance is empty', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.remove('', 'meh');
      expect(nlu.docs).toHaveLength(2);
    });
    test('Should throw an error if the utterance is not a string', () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      expect(() => {
        nlu.remove(1, 'meh');
      }).toThrow('Utterance must be an string');
    });
  });

  describe('train', () => {
    test('Even if no observation is provided, train should not fail', async () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      await nlu.train();
    });
    test('If I retrain exactly the same, then should not be trained again', async () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add('Bonsoir', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.add('Je ne me souviens pas où sont mes clés', 'keys');
      await nlu.train();
      nlu.beginEdit();
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add('Bonsoir', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.add('Je ne me souviens pas où sont mes clés', 'keys');
      const actual = await nlu.train();
      expect(actual).toBeFalsy();
    });
    test('If I retrain with a modification, should be trained again', async () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add('Bonsoir', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.add('Je ne me souviens pas où sont mes clés', 'keys');
      await nlu.train();
      nlu.beginEdit();
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.add('Je ne me souviens pas où sont mes clés', 'keys');
      const actual = await nlu.train();
      expect(actual).toBeTruthy();
    });
  });

  describe('get classifications', () => {
    test('Should give the classifications for an utterance', async () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add('Bonsoir', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.add('Je ne me souviens pas où sont mes clés', 'keys');
      await nlu.train();
      const classification = nlu.getClassifications('où sont mes clés');
      expect(classification).toHaveLength(2);
      expect(classification[0].label).toEqual('keys');
      expect(classification[0].value).toBeGreaterThan(0.7);
    });
    it('Should work even for japanese', async () => {
      const nlu = new LogisticRegressionNLU({ language: 'ja' });
      nlu.add('おはようございます', 'greet');
      nlu.add('こんにちは', 'greet');
      nlu.add('おやすみ', 'greet');
      nlu.add('私は私の鍵を紛失した', 'keys');
      nlu.add('私は私の鍵がどこにあるのか覚えていない', 'keys');
      nlu.add('私は私の鍵が見つからない', 'keys');
      await nlu.train();
      const classifications = nlu.getClassifications(
        '私の鍵はどこにありますか'
      );
      expect(classifications).toHaveLength(2);
      expect(classifications[0].label).toEqual('keys');
      expect(classifications[0].value).toBeGreaterThan(0.7);
    });
  });

  describe('Get Best Classification', () => {
    test('Should give the classifications for an utterance', async () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add('Bonsoir', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.add('Je ne me souviens pas où sont mes clés', 'keys');
      await nlu.train();
      const classification = nlu.getBestClassification('où sont mes clés');
      expect(classification.label).toEqual('keys');
      expect(classification.value).toBeGreaterThan(0.7);
    });
    it('Should work even for japanese', async () => {
      const nlu = new LogisticRegressionNLU({ language: 'ja' });
      nlu.add('おはようございます', 'greet');
      nlu.add('こんにちは', 'greet');
      nlu.add('おやすみ', 'greet');
      nlu.add('私は私の鍵を紛失した', 'keys');
      nlu.add('私は私の鍵がどこにあるのか覚えていない', 'keys');
      nlu.add('私は私の鍵が見つからない', 'keys');
      await nlu.train();
      const classification = nlu.getBestClassification(
        '私の鍵はどこにありますか'
      );
      expect(classification.label).toEqual('keys');
      expect(classification.value).toBeGreaterThan(0.7);
    });
  });

  describe('toObj and fromObj', () => {
    test('Should give the classifications after export/import', async () => {
      const nlu = new LogisticRegressionNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add('Bonsoir', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.add('Je ne me souviens pas où sont mes clés', 'keys');
      await nlu.train();
      const clone = BaseNLU.fromObj(nlu.toObj());
      const classification = clone.getClassifications('où sont mes clés');
      expect(classification).toHaveLength(2);
      expect(classification[0].label).toEqual('keys');
      expect(classification[0].value).toBeGreaterThan(0.7);
    });
  });
});
