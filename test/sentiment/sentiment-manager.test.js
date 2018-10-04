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

const { SentimentManager } = require('../../lib');

describe('Sentiment Manager', () => {
  describe('Constructor', () => {
    test('Should create', () => {
      const sentiment = new SentimentManager();
      expect(sentiment).toBeDefined();
    });
  });

  describe('Add language', () => {
    test('It should create a new Sentiment Analyzer instance', () => {
      const sentiment = new SentimentManager();
      const analyzer = sentiment.addLanguage('es');
      expect(analyzer).toBeDefined();
      expect(analyzer.settings.language).toEqual('es');
    });
    test('It should return the same instance if is the same language', () => {
      const sentiment = new SentimentManager();
      const analyzer = sentiment.addLanguage('es');
      expect(analyzer).toBeDefined();
      const analyzer2 = sentiment.addLanguage('es');
      expect(analyzer).toBe(analyzer2);
    });
    test('It should create different instances for different languages', () => {
      const sentiment = new SentimentManager();
      const analyzer = sentiment.addLanguage('es');
      expect(analyzer).toBeDefined();
      const analyzer2 = sentiment.addLanguage('en');
      expect(analyzer2).toBeDefined();
      expect(analyzer).not.toBe(analyzer2);
    });
  });

  describe('Process', () => {
    test('Get positive sentiment', async () => {
      const sentiment = new SentimentManager();
      const utterance = 'I love cats, are so cute!';
      const result = await sentiment.process('en', utterance);
      expect(result).toBeDefined();
      expect(result.score).toEqual(1.032);
      expect(result.numWords).toEqual(6);
      expect(result.numHits).toEqual(2);
      expect(result.comparative).toEqual(0.17200000000000001);
      expect(result.type).toEqual('senticon');
      expect(result.language).toEqual('en');
      expect(result.vote).toEqual('positive');
    });
    test('Get negative sentiment', async () => {
      const sentiment = new SentimentManager();
      const utterance = 'I hate cats, are awful!';
      const result = await sentiment.process('en', utterance);
      expect(result).toBeDefined();
      expect(result.score).toEqual(-1);
      expect(result.numWords).toEqual(5);
      expect(result.numHits).toEqual(1);
      expect(result.comparative).toEqual(-0.2);
      expect(result.type).toEqual('senticon');
      expect(result.language).toEqual('en');
      expect(result.vote).toEqual('negative');
    });
    test('Get positive sentiment deutsch', async () => {
      const sentiment = new SentimentManager();
      const utterance = 'Ich liebe Kätzchen';
      const result = await sentiment.process('de', utterance);
      expect(result).toBeDefined();
      expect(result.score).toBeGreaterThan(0);
      expect(result.numWords).toEqual(3);
      expect(result.numHits).toEqual(1);
      expect(result.type).toEqual('senticon');
      expect(result.language).toEqual('de');
      expect(result.vote).toEqual('positive');
    });
    test('Get negative sentiment deutsch', async () => {
      const sentiment = new SentimentManager();
      const utterance = 'Ich hasse Katzen, ich werde wirklich krank.';
      const result = await sentiment.process('de', utterance);
      expect(result).toBeDefined();
      expect(result.score).toBeLessThan(0);
      expect(result.numWords).toEqual(7);
      expect(result.numHits).toEqual(2);
      expect(result.type).toEqual('senticon');
      expect(result.language).toEqual('de');
      expect(result.vote).toEqual('negative');
    });
  });
});
