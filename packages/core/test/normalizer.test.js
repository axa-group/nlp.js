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

const Normalizer = require('../src/normalizer');
const { defaultContainer } = require('../src/container');
const { Container } = require('../src/container');

class MockNormalizer {
  constructor(container, locale, char) {
    this.container = container;
    this.locale = locale;
    this.char = char;
    this.name = `normalizer-${this.locale}`;
    this.regex = new RegExp(char, 'g');
  }

  normalize(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(this.regex, '*');
  }
}

function getContainer() {
  const container = new Container();
  container.use(new MockNormalizer(container, 'en', 'e'));
  container.use(new MockNormalizer(container, 'es', 'a'));
  return container;
}

describe('Normalizer', () => {
  describe('Constructor', () => {
    test('You can create an instance', () => {
      const normalizer = new Normalizer();
      expect(normalizer).toBeDefined();
    });
    test('The name of the instance should be "normalize" by default', () => {
      const normalizer = new Normalizer();
      expect(normalizer.name).toEqual('normalize');
    });
    test('By default the container is defaultContainer', () => {
      const normalizer = new Normalizer();
      expect(normalizer.container).toBe(defaultContainer);
    });
    test('I can provide a container', () => {
      const container = {};
      const normalizer = new Normalizer(container);
      expect(normalizer.container).toBe(container);
    });
    test('I can provide a container inside a settings object', () => {
      const container = {};
      const normalizer = new Normalizer({ container });
      expect(normalizer.container).toBe(container);
    });
  });

  describe('Normalize', () => {
    test('It can normalize a text', () => {
      const input = 'Ñam aquí, Lérn';
      const expected = 'nam aqui, lern';
      const normalizer = new Normalizer();
      const actual = normalizer.normalize(input);
      expect(actual).toEqual(expected);
    });
  });

  describe('Run', () => {
    test('It can normalize a text', () => {
      const input = { text: 'Ñam aquí, Lérn' };
      const expected = 'nam aqui, lern';
      const normalizer = new Normalizer();
      const actual = normalizer.run(input);
      expect(actual.text).toEqual(expected);
    });

    test('If a normalizer for the input locale exists at the container, then use it', () => {
      const container = getContainer();
      const input = { text: 'Ñam aquí, Lérn', locale: 'es' };
      const expected = 'n*m *qui, lern';
      const normalizer = new Normalizer(container);
      const actual = normalizer.run(input);
      expect(actual.text).toEqual(expected);
    });

    test('If the locale is not set, then default is "en", and if the container haves a normalizer-en use it', () => {
      const container = getContainer();
      const input = { text: 'Ñam aquí, Lérn' };
      const expected = 'nam aqui, l*rn';
      const normalizer = new Normalizer(container);
      const actual = normalizer.run(input);
      expect(actual.text).toEqual(expected);
    });
  });
});
