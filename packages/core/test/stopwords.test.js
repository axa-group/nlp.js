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

const Stopwords = require('../src/stopwords');
const { containerBootstrap } = require('../src');
const { defaultContainer } = require('../src/container');
const { Container } = require('../src/container');

class MockedStopwords extends Stopwords {
  constructor(container, locale, words) {
    super(container);
    this.name = `stopwords-${locale}`;
    this.dictionary = {};
    this.build(words);
  }
}

function getContainer() {
  const container = containerBootstrap();
  container.use(new MockedStopwords(container, 'en', ['remove', 'this']));
  container.use(new MockedStopwords(container, 'es', ['quitar', 'esto']));
  return container;
}

describe('Stopwords', () => {
  describe('Constructor', () => {
    test('You can create an instance', () => {
      const stopwords = new Stopwords();
      expect(stopwords).toBeDefined();
    });
    test('The name of the instance should be "removeStopwords" by default', () => {
      const stopwords = new Stopwords();
      expect(stopwords.name).toEqual('removeStopwords');
    });
    test('By default the container is defaultContainer', () => {
      const stopwords = new Stopwords();
      expect(stopwords.container).toBe(defaultContainer);
    });
    test('I can provide a container', () => {
      const container = new Container();
      const stopwords = new Stopwords(container);
      expect(stopwords.container).toBe(container);
    });
    test('I can provide a container inside a settings object', () => {
      const container = new Container();
      const stopwords = new Stopwords({ container });
      expect(stopwords.container).toBe(container);
    });
  });

  describe('Build', () => {
    test('It should build a dictionary of words', () => {
      const stopwords = new Stopwords();
      stopwords.build(['remove', 'this']);
      expect(stopwords.dictionary).toBeDefined();
      expect(stopwords.dictionary.remove).toBeTruthy();
      expect(stopwords.dictionary.this).toBeTruthy();
    });
  });

  describe('Is not stopword', () => {
    test('It should return true if the word is not stopword', () => {
      const stopwords = new Stopwords();
      stopwords.build(['remove', 'this']);
      expect(stopwords.isNotStopword('remove')).toBeFalsy();
      expect(stopwords.isNotStopword('something')).toBeTruthy();
    });
  });

  describe('Is stopword', () => {
    test('It should return true if the word is stopword', () => {
      const stopwords = new Stopwords();
      stopwords.build(['remove', 'this']);
      expect(stopwords.isStopword('something')).toBeFalsy();
      expect(stopwords.isStopword('remove')).toBeTruthy();
    });
  });

  describe('remove stopwords', () => {
    test('It should remove stopwords from an array of tokens', () => {
      const stopwords = new Stopwords();
      stopwords.build(['remove', 'this']);
      const actual = stopwords.removeStopwords([
        'this',
        'should',
        'remove',
        'remove',
        'and',
        'this',
      ]);
      const expected = ['should', 'and'];
      expect(actual).toEqual(expected);
    });
  });

  describe('Run', () => {
    test('A locale can be set', () => {
      const container = getContainer();
      const stopwords = container.get('removeStopwords');
      const input = {
        settings: { keepStopwords: false },
        tokens: ['esto', 'debe', 'quitar', 'esto', 'y', 'esto'],
        locale: 'es',
      };
      const actual = stopwords.run(input);
      expect(actual.tokens).toEqual(['debe', 'y']);
    });
    test('If no locale is defined then use locale "en"', () => {
      const container = getContainer();
      const stopwords = container.get('removeStopwords');
      const input = {
        settings: { keepStopwords: false },
        tokens: ['this', 'should', 'remove', 'this', 'and', 'this'],
      };
      const actual = stopwords.run(input);
      expect(actual.tokens).toEqual(['should', 'and']);
    });
  });
});
