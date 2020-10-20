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

const { BrainNLU } = require('../../src');

describe('Brain NLU', () => {
  describe('constructor', () => {
    test('Should create a new instance', () => {
      const nlu = new BrainNLU();
      expect(nlu).toBeDefined();
    });
  });

  describe('add', () => {
    test('Should add an utterance and intent', () => {
      const nlu = new BrainNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      expect(nlu.corpus).toHaveLength(1);
      nlu.add('bonne nuit', 'greet');
      expect(nlu.corpus).toHaveLength(2);
    });
    test('Should add an utterance and intent even to different intents', () => {
      const nlu = new BrainNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      expect(nlu.corpus).toHaveLength(1);
      nlu.add('bonne nuit', 'greet');
      expect(nlu.corpus).toHaveLength(2);
      nlu.add("J'ai perdu mes clés", 'keys');
      expect(nlu.corpus).toHaveLength(3);
      nlu.add('Je ne trouve pas mes clés', 'keys');
      expect(nlu.corpus).toHaveLength(4);
    });
    test('Should check that the utterance is an string', () => {
      const nlu = new BrainNLU({ language: 'fr' });
      expect(() => nlu.add(1, 'greet')).toThrow('Utterance must be an string');
      expect(() => nlu.add(undefined, 'greet')).toThrow(
        'Utterance must be an string'
      );
    });
    test('Should check that the intent is an string', () => {
      const nlu = new BrainNLU({ language: 'fr' });
      expect(() => nlu.add('Bonjour', 1)).toThrow('Intent must be an string');
      expect(() => nlu.add('Bonjour', undefined)).toThrow(
        'Intent must be an string'
      );
    });
  });

  describe('train', () => {
    test('Even if no observation is provided, train should not fail', async () => {
      const nlu = new BrainNLU({ language: 'fr' });
      await nlu.train();
    });
  });

  describe('get classifications', () => {
    test('Should give the classifications for an utterance', async () => {
      const nlu = new BrainNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add('Bonsoir', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.add('Je ne me souviens pas où sont mes clés', 'keys');
      await nlu.train();
      const classification = await nlu.getClassifications('où sont mes clés');
      expect(classification).toHaveLength(3);
      expect(classification[0].intent).toEqual('keys');
      expect(classification[0].score).toBeGreaterThan(0.7);
    });
    it('Should work even for japanese', async () => {
      const nlu = new BrainNLU({ language: 'ja' });
      nlu.add('おはようございます', 'greet');
      nlu.add('こんにちは', 'greet');
      nlu.add('おやすみ', 'greet');
      nlu.add('私は私の鍵を紛失した', 'keys');
      nlu.add('私は私の鍵がどこにあるのか覚えていない', 'keys');
      nlu.add('私は私の鍵が見つからない', 'keys');
      await nlu.train();
      const classifications = await nlu.getClassifications(
        '私の鍵はどこにありますか'
      );
      expect(classifications).toHaveLength(2);
      expect(classifications[0].intent).toEqual('keys');
      expect(classifications[0].score).toBeGreaterThan(0.7);
    });
  });

  describe('Get Best Classification', () => {
    test('Should give the classifications for an utterance', async () => {
      const nlu = new BrainNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add('Bonsoir', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.add('Je ne me souviens pas où sont mes clés', 'keys');
      await nlu.train();
      const classification = await nlu.getBestClassification(
        'où sont mes clés'
      );
      expect(classification.intent).toEqual('keys');
      expect(classification.score).toBeGreaterThan(0.7);
    });
    it('Should work even for japanese', async () => {
      const nlu = new BrainNLU({ language: 'ja' });
      nlu.add('おはようございます', 'greet');
      nlu.add('こんにちは', 'greet');
      nlu.add('おやすみ', 'greet');
      nlu.add('私は私の鍵を紛失した', 'keys');
      nlu.add('私は私の鍵がどこにあるのか覚えていない', 'keys');
      nlu.add('私は私の鍵が見つからない', 'keys');
      await nlu.train();
      const classification = await nlu.getBestClassification(
        '私の鍵はどこにありますか'
      );
      expect(classification.intent).toEqual('keys');
      expect(classification.score).toBeGreaterThan(0.7);
    });
  });

  // describe('toObj and fromObj', () => {
  //   test('Should give the classifications after export/import without using None Feature', async () => {
  //     const nlu = new BrainNLU({ language: 'fr', useNoneFeature: false });
  //     nlu.add('Bonjour', 'greet');
  //     nlu.add('bonne nuit', 'greet');
  //     nlu.add('Bonsoir', 'greet');
  //     nlu.add("J'ai perdu mes clés", 'keys');
  //     nlu.add('Je ne trouve pas mes clés', 'keys');
  //     nlu.add('Je ne me souviens pas où sont mes clés', 'keys');
  //     await nlu.train();
  //     const clone = BaseNLU.fromObj(nlu.toObj());
  //     const classification = clone.getClassifications('où sont mes clés');
  //     expect(classification).toHaveLength(2);
  //     expect(classification[0].label).toEqual('keys');
  //     expect(classification[0].value).toBeGreaterThan(0.7);
  //   });
  //   test('Should give the classifications after export/import', async () => {
  //     const nlu = new BrainNLU({ language: 'fr' });
  //     nlu.add('Bonjour', 'greet');
  //     nlu.add('bonne nuit', 'greet');
  //     nlu.add('Bonsoir', 'greet');
  //     nlu.add("J'ai perdu mes clés", 'keys');
  //     nlu.add('Je ne trouve pas mes clés', 'keys');
  //     nlu.add('Je ne me souviens pas où sont mes clés', 'keys');
  //     await nlu.train();
  //     const clone = BaseNLU.fromObj(nlu.toObj());
  //     const classification = clone.getClassifications('où sont mes clés');
  //     expect(classification).toHaveLength(3);
  //     expect(classification[0].label).toEqual('keys');
  //     expect(classification[0].value).toBeGreaterThan(0.7);
  //   });
  // });
});
