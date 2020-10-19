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

const container = require('./bootstrap');
const Nlu = require('../src/nlu');
const srccorpus = require('./corpus50.json');

const corpus = [];
for (let i = 0; i < srccorpus.data.length; i += 1) {
  const { intent, utterances } = srccorpus.data[i];
  for (let j = 0; j < utterances.length; j += 1) {
    corpus.push({ utterance: utterances[j], intent });
  }
}

describe('NLU', () => {
  describe('Constructor', () => {
    test('An instance can be created', () => {
      const nlu = new Nlu();
      expect(nlu).toBeDefined();
    });
    test('Some settings are by default', () => {
      const nlu = new Nlu();
      expect(nlu.settings.locale).toEqual('en');
      expect(nlu.settings.keepStopwords).toBeTruthy();
      expect(nlu.settings.nonefeatureValue).toEqual(1);
      expect(nlu.settings.nonedeltaMultiplier).toEqual(1.2);
      expect(nlu.settings.spellCheckDistance).toEqual(1);
    });
    test('The settings can be provided in constructor', () => {
      const nlu = new Nlu({ locale: 'fr', keepStopwords: false });
      expect(nlu.settings.locale).toEqual('fr');
      expect(nlu.settings.keepStopwords).toBeFalsy();
      expect(nlu.settings.nonefeatureValue).toEqual(1);
      expect(nlu.settings.nonedeltaMultiplier).toEqual(1.2);
      expect(nlu.settings.spellCheckDistance).toEqual(1);
    });
  });

  describe('Prepare', () => {
    test('Prepare will generate an array of tokens', async () => {
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const input = 'Allí hay un ratón';
      const actual = await nlu.prepare(input);
      expect(actual).toEqual({
        alli: 1,
        hay: 1,
        un: 1,
        raton: 1,
      });
    });
    test('Prepare should throw and exception if no text available', async () => {
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const input = 7;
      await expect(nlu.prepare(input)).rejects.toThrow(
        'Error at nlu.prepare: expected a text but received 7'
      );
    });
    test('Prepare should throw and exception if is an object with no text available', async () => {
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const input = { something: 'something' };
      await expect(nlu.prepare(input)).rejects.toThrow(
        'Error at nlu.prepare: expected a text but received [object Object]'
      );
    });
    test('Prepare can process an array of strings', async () => {
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const input = ['Allí hay un ratón', 'y vino el señor doctor'];
      const actual = await nlu.prepare(input);
      expect(actual).toEqual([
        { alli: 1, hay: 1, un: 1, raton: 1 },
        { y: 1, vino: 1, el: 1, senor: 1, doctor: 1 },
      ]);
    });
    test('Prepare can process an object with text', async () => {
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const input = { text: 'Allí hay un ratón', intent: 'mouse' };
      const actual = await nlu.prepare(input);
      expect(actual).toEqual({
        text: 'Allí hay un ratón',
        tokens: { alli: 1, hay: 1, un: 1, raton: 1 },
        intent: 'mouse',
      });
    });
    test('Prepare can process an object with utterance', async () => {
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const input = { utterance: 'Allí hay un ratón', intent: 'mouse' };
      const actual = await nlu.prepare(input);
      expect(actual).toEqual({
        utterance: 'Allí hay un ratón',
        tokens: { alli: 1, hay: 1, un: 1, raton: 1 },
        intent: 'mouse',
      });
    });
    test('Prepare can be called twice', async () => {
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const input = { utterance: 'Allí hay un ratón', intent: 'mouse' };
      let actual = await nlu.prepare(input);
      actual = await nlu.prepare(input);
      expect(actual).toEqual({
        utterance: 'Allí hay un ratón',
        tokens: { alli: 1, hay: 1, un: 1, raton: 1 },
        intent: 'mouse',
      });
    });
    test('Prepare can process an array of objects with text', async () => {
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const input = [
        { text: 'Allí hay un ratón', intent: 'mouse' },
        { text: 'y vino el señor doctor', intent: 'doctor' },
      ];
      const actual = await nlu.prepare(input);
      expect(actual).toEqual([
        {
          text: 'Allí hay un ratón',
          tokens: { alli: 1, hay: 1, un: 1, raton: 1 },
          intent: 'mouse',
        },
        {
          text: 'y vino el señor doctor',
          tokens: { y: 1, vino: 1, el: 1, senor: 1, doctor: 1 },
          intent: 'doctor',
        },
      ]);
    });
    test('Prepare can process an array of objects with utterance', async () => {
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const input = [
        { utterance: 'Allí hay un ratón', intent: 'mouse' },
        { utterance: 'y vino el señor doctor', intent: 'doctor' },
      ];
      const actual = await nlu.prepare(input);
      expect(actual).toEqual([
        {
          utterance: 'Allí hay un ratón',
          tokens: { alli: 1, hay: 1, un: 1, raton: 1 },
          intent: 'mouse',
        },
        {
          utterance: 'y vino el señor doctor',
          tokens: { y: 1, vino: 1, el: 1, senor: 1, doctor: 1 },
          intent: 'doctor',
        },
      ]);
    });
    test('Prepare can process an object with texts array', async () => {
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const input = {
        intent: 'doctor',
        texts: ['Y vino el señor doctor', 'manejando un cuatrimotor'],
      };
      const actual = await nlu.prepare(input);
      expect(actual).toEqual({
        intent: 'doctor',
        texts: ['Y vino el señor doctor', 'manejando un cuatrimotor'],
        tokens: [
          { y: 1, vino: 1, el: 1, senor: 1, doctor: 1 },
          { manejando: 1, un: 1, cuatrimotor: 1 },
        ],
      });
    });
    test('Prepare can process an object with utterances array', async () => {
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const input = {
        intent: 'doctor',
        utterances: ['Y vino el señor doctor', 'manejando un cuatrimotor'],
      };
      const actual = await nlu.prepare(input);
      expect(actual).toEqual({
        intent: 'doctor',
        utterances: ['Y vino el señor doctor', 'manejando un cuatrimotor'],
        tokens: [
          { y: 1, vino: 1, el: 1, senor: 1, doctor: 1 },
          { manejando: 1, un: 1, cuatrimotor: 1 },
        ],
      });
    });
    test('Prepare can process an array of objects with texts array', async () => {
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const input = [
        {
          intent: 'doctor',
          utterances: ['Y vino el señor doctor', 'manejando un cuatrimotor'],
        },
        {
          intent: 'mouse',
          utterances: ['Ahí hay un ratón'],
        },
      ];
      const actual = await nlu.prepare(input);
      expect(actual).toEqual([
        {
          intent: 'doctor',
          utterances: ['Y vino el señor doctor', 'manejando un cuatrimotor'],
          tokens: [
            { y: 1, vino: 1, el: 1, senor: 1, doctor: 1 },
            { manejando: 1, un: 1, cuatrimotor: 1 },
          ],
        },
        {
          intent: 'mouse',
          utterances: ['Ahí hay un ratón'],
          tokens: [{ ahi: 1, hay: 1, un: 1, raton: 1 }],
        },
      ]);
    });
  });

  describe('Prepare corpus', () => {
    test('It should convert strings to word objects', async () => {
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const actual = await nlu.prepareCorpus({
        corpus,
        settings: nlu.settings,
      });
      expect(actual.corpus).toHaveLength(250);
      expect(actual.corpus[0]).toEqual({
        input: { what: 1, does: 1, your: 1, company: 1, develop: 1 },
        output: { 'support.about': 1 },
      });
    });
  });

  describe('Add None Feature', () => {
    test('It should add a nonefeature input labeled as None', () => {
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const actual = nlu.addNoneFeature({ corpus: [] });
      expect(actual.corpus).toHaveLength(1);
      expect(actual.corpus[0]).toEqual({
        input: { nonefeature: 1 },
        output: { None: 1 },
      });
    });
  });

  describe('Some similar', () => {
    test('It should return false if items in array does not exists in dictionary', () => {
      const dict = { this: 1, is: 1, a: 1, cat: 1 };
      const arr = ['not', 'two', 'dogs'];
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const actual = nlu.someSimilar(dict, arr);
      expect(actual).toBeFalsy();
    });
    test('It should return false if at least one item in array exists in dictionary', () => {
      const dict = { this: 1, is: 1, a: 1, cat: 1 };
      const arr = ['not', 'a', 'cat'];
      const nlu = new Nlu({ locale: 'en', keepStopwords: false }, container);
      const actual = nlu.someSimilar(dict, arr);
      expect(actual).toBeTruthy();
    });
  });
});
