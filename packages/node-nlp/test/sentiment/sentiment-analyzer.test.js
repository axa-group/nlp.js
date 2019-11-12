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

const { SentimentAnalyzer } = require('../../src');

describe('Sentiment Analyzer', () => {
  describe('Constructor', () => {
    test('Should create', () => {
      const analyzer = new SentimentAnalyzer();
      expect(analyzer).toBeDefined();
    });
  });

  describe('Get Sentiment', () => {
    test('Get positive sentiment', async () => {
      const analyzer = new SentimentAnalyzer();
      const utterance = 'I love cats, are so cute!';
      const result = await analyzer.getSentiment(utterance);
      expect(result).toBeDefined();
      expect(result.score).toEqual(0.75);
      expect(result.numWords).toEqual(6);
      expect(result.numHits).toEqual(2);
      expect(result.average).toEqual(0.125);
      expect(result.type).toEqual('senticon');
      expect(result.locale).toEqual('en');
    });
    test('Get negative sentiment', async () => {
      const analyzer = new SentimentAnalyzer();
      const utterance = 'I hate cats, are awful!';
      const result = await analyzer.getSentiment(utterance);
      expect(result).toBeDefined();
      expect(result.score).toEqual(-0.75);
      expect(result.numWords).toEqual(5);
      expect(result.numHits).toEqual(1);
      expect(result.average).toEqual(-0.15);
      expect(result.type).toEqual('senticon');
      expect(result.locale).toEqual('en');
    });
  });
});
