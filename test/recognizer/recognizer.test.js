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

const { Recognizer } = require('../../lib');

describe('Recognizer', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const recognizer = new Recognizer();
      expect(recognizer).toBeDefined();
    });
  });
  describe('The model can be loaded from an excel file', () => {
    test('It should load the excel and train', () => {
      const recognizer = new Recognizer();
      recognizer.loadExcel('./test/nlp/rules.xls');
      expect(recognizer.nlpManager.languages).toEqual(['en', 'es']);
    });
  });
  describe('The model can be loaded from a model.nlp file', () => {
    test('It should load the model', () => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      expect(recognizer.nlpManager.languages).toEqual(['en']);
    });
  });
  describe('Process', () => {
    test('It should process an utterance', () => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      const process = recognizer.process({}, 'en', 'What is your age?');
      expect(process.intent).toEqual('agent.age');
      expect(process.language).toEqual('English');
      expect(process.score).toBeGreaterThan(0.95);
    });
    test('It should autodetect the language if not provided', () => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      const process = recognizer.process({}, undefined, 'What is your age?');
      expect(process.intent).toEqual('agent.age');
      expect(process.language).toEqual('English');
      expect(process.score).toBeGreaterThan(0.95);
    });
    test('It should create a new temporal context if not provided', () => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      const process = recognizer.process(undefined, undefined, 'What is your age?');
      expect(process.intent).toEqual('agent.age');
      expect(process.language).toEqual('English');
      expect(process.score).toBeGreaterThan(0.95);
    });
    test('If the intent is None then the answer should not be calculated', () => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      const process = recognizer.process(undefined, undefined, 'yupi caramelo?');
      expect(process.intent).toEqual('None');
      expect(process.answer).toBeUndefined();
    });
    test('If there are extracted entities, the context will be filled with those and $modified=true', () => {
      const recognizer = new Recognizer();
      recognizer.loadExcel('./test/nlp/rules.xls');
      const context = {};
      recognizer.process(context, undefined, 'Who is spiderman?');
      expect(context).toEqual({ hero: 'spiderman', $modified: true });
    });
  });
  describe('Recognize Utterance', () => {
    test('It should process providing a locale in the model', (done) => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      recognizer.recognizeUtterance('What is your age?', { locale: 'en' }, (error, result) => {
        expect(result.intent).toEqual('agent.age');
        expect(result.language).toEqual('English');
        expect(result.score).toBeGreaterThan(0.95);
        done();
      });
    });
    test('It should process without providing a model', (done) => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      recognizer.recognizeUtterance('What is your age?', undefined, (error, result) => {
        expect(result.intent).toEqual('agent.age');
        expect(result.language).toEqual('English');
        expect(result.score).toBeGreaterThan(0.95);
        done();
      });
    });
  });
  describe('Recognize', () => {
    test('It should recognize the intent from the session', (done) => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      const session = {
        locale: 'en',
        message: {
          text: 'What is your age?',
        },
      };
      recognizer.recognize(session, (err, result) => {
        expect(result.intent).toEqual('agent.age');
        expect(result.language).toEqual('English');
        expect(result.score).toBeGreaterThan(0.95);
        done();
      });
    });
  });
});
