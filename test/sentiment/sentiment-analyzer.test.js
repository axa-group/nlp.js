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

const { SentimentAnalyzer } = require('../../lib');

describe('Sentiment Analyzer', () => {
  describe('Constructor', () => {
    test('Should create', () => {
      const analyzer = new SentimentAnalyzer();
      expect(analyzer).toBeDefined();
    });
    test('By default should load english senticon', () => {
      const analyzer = new SentimentAnalyzer();
      expect(analyzer.settings.language).toEqual('en');
      expect(analyzer.settings.tokenizer).toBeDefined();
      expect(analyzer.settings.type).toEqual('senticon');
      expect(analyzer.vocabulary).toBeDefined();
      expect(analyzer.negations).toEqual(['not', 'no', 'never', 'neither']);
    });
    test('If I provide a language that not exists, should not throw error', () => {
      const analyzer = new SentimentAnalyzer({ language: 'hu' });
      expect(analyzer.settings.language).toEqual('hu');
      expect(analyzer.settings.tokenizer).toBeDefined();
      expect(analyzer.settings.type).toEqual('senticon');
      expect(analyzer.vocabulary).toBeUndefined();
      expect(analyzer.negations).toEqual([]);
    });
    test('It should be able to load languages', () => {
      ['en', 'es', 'it', 'fr', 'nl', 'de', 'eu', 'gl', 'ca'].forEach(
        language => {
          const analyzer = new SentimentAnalyzer({ language });
          expect(analyzer.settings.language).toEqual(language);
          expect(analyzer.settings.tokenizer).toBeDefined();
          if (['en', 'es', 'de', 'eu', 'gl', 'ca'].includes(language)) {
            expect(analyzer.settings.type).toEqual('senticon');
          } else {
            expect(analyzer.settings.type).toEqual('pattern');
          }
          expect(analyzer.vocabulary).toBeDefined();
          expect(analyzer.negations).toBeDefined();
        }
      );
      ['da', 'fi', 'ru', 'pt', 'bn'].forEach(language => {
        const analyzer = new SentimentAnalyzer({ language });
        expect(analyzer.settings.language).toEqual(language);
        expect(analyzer.settings.tokenizer).toBeDefined();
        expect(analyzer.settings.type).toEqual('afinn');
        expect(analyzer.vocabulary).toBeDefined();
        expect(analyzer.negations).toBeDefined();
      });
    });
    test('When loaded, senticon and pattern should be normalized', () => {
      let analyzer = new SentimentAnalyzer({ language: 'en', type: 'pattern' });
      let keys = Object.keys(analyzer.vocabulary);
      keys.forEach(key => {
        expect(typeof analyzer.vocabulary[key]).toEqual('number');
      });
      analyzer = new SentimentAnalyzer({ language: 'en', type: 'senticon' });
      keys = Object.keys(analyzer.vocabulary);
      keys.forEach(key => {
        expect(typeof analyzer.vocabulary[key]).toEqual('number');
      });
    });
  });

  describe('Get Sentiment', () => {
    test('Get positive sentiment', async () => {
      const analyzer = new SentimentAnalyzer({ useStemmer: false });
      const utterance = 'I love cats, are so cute!';
      const result = await analyzer.getSentiment(utterance);
      expect(result).toBeDefined();
      expect(result.score).toEqual(1.032);
      expect(result.numWords).toEqual(6);
      expect(result.numHits).toEqual(2);
      expect(result.comparative).toEqual(0.17200000000000001);
      expect(result.type).toEqual('senticon');
      expect(result.language).toEqual('en');
    });
    test('Get negative sentiment', async () => {
      const analyzer = new SentimentAnalyzer({ useStemmer: false });
      const utterance = 'I hate cats, are awful!';
      const result = await analyzer.getSentiment(utterance);
      expect(result).toBeDefined();
      expect(result.score).toEqual(-1);
      expect(result.numWords).toEqual(5);
      expect(result.numHits).toEqual(1);
      expect(result.comparative).toEqual(-0.2);
      expect(result.type).toEqual('senticon');
      expect(result.language).toEqual('en');
    });
  });
});
