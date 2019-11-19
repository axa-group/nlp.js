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
const { SentimentAnalyzer } = require('../src');

describe('Sentiment Analyzer', () => {
  describe('Constructor', () => {
    test('Should create', () => {
      const analyzer = new SentimentAnalyzer({ container });
      expect(analyzer).toBeDefined();
    });
  });

  describe('Get Sentiment', () => {
    test('Get positive sentiment', async () => {
      const analyzer = new SentimentAnalyzer({ container });
      const utterance = 'I love my cat, is so cute!';
      const result = await analyzer.process({ locale: 'en', utterance });
      expect(result.sentiment).toBeDefined();
      expect(result.sentiment.score).toEqual(2.5);
      expect(result.sentiment.numWords).toEqual(7);
      expect(result.sentiment.numHits).toEqual(3);
      expect(result.sentiment.average).toEqual(0.35714285714285715);
      expect(result.sentiment.type).toEqual('afinn');
      expect(result.sentiment.locale).toEqual('en');
    });
    test('Get negative sentiment', async () => {
      const analyzer = new SentimentAnalyzer({ container });
      const utterance = 'I hate this, is not cute!';
      const result = await analyzer.process({ locale: 'en', utterance });
      expect(result.sentiment).toBeDefined();
      expect(result.sentiment.score).toEqual(-2);
      expect(result.sentiment.numWords).toEqual(6);
      expect(result.sentiment.numHits).toEqual(3);
      expect(result.sentiment.average).toEqual(-0.3333333333333333);
      expect(result.sentiment.type).toEqual('afinn');
      expect(result.sentiment.locale).toEqual('en');
    });
  });
});
