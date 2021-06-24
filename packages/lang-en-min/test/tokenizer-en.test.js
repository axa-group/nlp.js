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

const { TokenizerEn, NormalizerEn } = require('../src');

const normalizer = new NormalizerEn();
const tokenizer = new TokenizerEn();

describe('Tokenizer', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const instance = new TokenizerEn();
      expect(instance).toBeDefined();
    });
  });

  describe('Tokenize', () => {
    test('Should tokenize "what does your company develop"', () => {
      const input = 'what does your company develop';
      const expected = ['what', 'does', 'your', 'company', 'develop'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "does your company have other products"', () => {
      const input = 'does your company have other products';
      const expected = ['does', 'your', 'company', 'have', 'other', 'products'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "what is your company creating"', () => {
      const input = 'what is your company creating';
      const expected = ['what', 'is', 'your', 'company', 'creating'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "what is creating your enterprise"', () => {
      const input = 'what is creating your enterprise';
      const expected = ['what', 'is', 'creating', 'your', 'enterprise'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "does your enterprise have other apps?"', () => {
      const input = 'does your enterprise have other apps?';
      const expected = ['does', 'your', 'enterprise', 'have', 'other', 'apps'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "what else is developing your enterprise"', () => {
      const input = 'what else is developing your enterprise';
      const expected = [
        'what',
        'else',
        'is',
        'developing',
        'your',
        'enterprise',
      ];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "does your company have some other product?"', () => {
      const input = 'does your company have some other product?';
      const expected = [
        'does',
        'your',
        'company',
        'have',
        'some',
        'other',
        'product',
      ];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "what else have created your company?"', () => {
      const input = 'what else have created your company?';
      const expected = ['what', 'else', 'have', 'created', 'your', 'company'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "does the enterprise have any other app?"', () => {
      const input = 'does the enterprise have any other app?';
      const expected = [
        'does',
        'the',
        'enterprise',
        'have',
        'any',
        'other',
        'app',
      ];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "Other product developed by your company?"', () => {
      const input = 'Other product developed by your company?';
      const expected = [
        'other',
        'product',
        'developed',
        'by',
        'your',
        'company',
      ];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "what\'s the name of your application"', () => {
      const input = "what's the name of your application";
      const expected = [
        'what',
        'is',
        'the',
        'name',
        'of',
        'your',
        'application',
      ];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "how\'s your app called"', () => {
      const input = "how's your app called";
      const expected = ['how', 'is', 'your', 'app', 'called'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "tell me your app name"', () => {
      const input = 'tell me your app name';
      const expected = ['tell', 'me', 'your', 'app', 'name'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "name of the app"', () => {
      const input = 'name of the app';
      const expected = ['name', 'of', 'the', 'app'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "I\'d like to know the name of your app"', () => {
      const input = "I'd like to know the name of your app";
      const expected = [
        'i',
        'had',
        'like',
        'to',
        'know',
        'the',
        'name',
        'of',
        'your',
        'app',
      ];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "name of your apps?"', () => {
      const input = 'name of your apps?';
      const expected = ['name', 'of', 'your', 'apps'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "tell me your applications names"', () => {
      const input = 'tell me your applications names';
      const expected = ['tell', 'me', 'your', 'applications', 'names'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "how do you call your app?"', () => {
      const input = 'how do you call your app?';
      const expected = ['how', 'do', 'you', 'call', 'your', 'app'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "your application name?"', () => {
      const input = 'your application name?';
      const expected = ['your', 'application', 'name'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "name of the app?"', () => {
      const input = 'name of the app?';
      const expected = ['name', 'of', 'the', 'app'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "I cannot wait"', () => {
      const input = 'I cannot wait';
      const expected = ['i', 'can', 'not', 'wait'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
    test('Should tokenize "constructor"', () => {
      const input = 'constructor';
      const expected = ['constructor'];
      const actual = tokenizer.tokenize(normalizer.normalize(input));
      expect(actual).toEqual(expected);
    });
  });
});
