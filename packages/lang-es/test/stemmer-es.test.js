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

const { NormalizerEs, TokenizerEs, StemmerEs } = require('../src');

const normalizer = new NormalizerEs();
const tokenizer = new TokenizerEs();
const stemmer = new StemmerEs();

describe('Stemmer', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const instance = new StemmerEs();
      expect(instance).toBeDefined();
    });
  });

  describe('Stem', () => {
    test('Should stem "qué desarrolla tu compañía?"', () => {
      const input = 'qué desarrolla tu compañía?';
      const expected = ['que', 'desarroll', 'tu', 'compan'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "¿tu compañía tiene otros productos?"', () => {
      const input = '¿tu compañía tiene otros productos?';
      const expected = ['tu', 'compan', 'ten', 'otro', 'product'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "¿qué está creando tu compañía?"', () => {
      const input = '¿qué está creando tu compañía?';
      const expected = ['que', 'esta', 'cre', 'tu', 'compan'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "¿Qué está creando tu empresa?"', () => {
      const input = '¿Qué está creando tu empresa?';
      const expected = ['que', 'esta', 'cre', 'tu', 'empres'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "¿Tiene tu empresa otras aplicaciones?"', () => {
      const input = '¿Tiene tu empresa otras aplicaciones?';
      const expected = ['ten', 'tu', 'empres', 'otra', 'aplicacion'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "¿qué más está desarrollando tu empresa?"', () => {
      const input = '¿qué más está desarrollando tu empresa?';
      const expected = ['que', 'mas', 'esta', 'desarroll', 'tu', 'empres'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "realizarnos realizar realizando realizado"', () => {
      const input = 'realizarnos realizar realizando realizado';
      const expected = ['realic', 'realic', 'realic', 'realic'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "covid-19 covid19"', () => {
      const input = 'covid-19 covid19';
      const expected = ['covid-19', 'covid19'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
  });
});
