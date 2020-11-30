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

const { containerBootstrap } = require('@nlpjs/core');
const { BuiltinCompromise } = require('../src');

const container = containerBootstrap();

function getManager() {
  const manager = new BuiltinCompromise({ container });
  return manager;
}

function extract(locale, utterance) {
  const manager = getManager();
  const input = {
    utterance,
    locale,
  };
  return manager.extract(input);
}

describe('Compromise Integration', () => {
  describe('Constructor', () => {
    test('If no locale is provided, return american english', () => {
      const actual = BuiltinCompromise.getCulture();
      const expected = 'en_US';
      expect(actual).toEqual(expected);
    });

    test('From known culture', () => {
      const actual = BuiltinCompromise.getCulture('ja');
      const expected = 'ja_JP';
      expect(actual).toEqual(expected);
    });

    test('If the locale does not exists, return a culture', () => {
      const actual = BuiltinCompromise.getCulture('kl');
      const expected = 'kl_KL';
      expect(actual).toEqual(expected);
    });
  });

  describe('English', () => {
    test('When there is an exception, return empty array', async () => {
      const actual = await extract('en', 'raise exception');
      const expected = [];
      expect(actual.edges).toEqual(expected);
    });
    test('Compromise  English Email', async () => {
      const actual = await extract(
        'en',
        'The email is user@user.com, check it out'
      );
      // console.log(actual)
      const expected = [
        {
          entity: 'email',
          start: 13,
          end: 25,
          len: 13,
          accuracy: 0.95,
          sourceText: 'user@user.com',
          utteranceText: 'user@user.com',
          resolution: {
            value: 'user@user.com',
          },
        },
      ];
      expect(actual.edges).toEqual(expected);
    });

    test('Compromise  English Phone Number', async () => {
      const actual = await extract('en', 'The phone number is (650) 123-4567');
      // console.log(actual)
      const expected = [
        {
          entity: 'phonenumber',
          start: 20,
          end: 33,
          len: 14,
          accuracy: 0.95,
          sourceText: '(650) 123-4567',
          utteranceText: '(650) 123-4567',
          resolution: {
            value: '6501234567',
          },
        },
      ];
      expect(actual.edges).toEqual(expected);
    });

    test('Compromise  English URL', async () => {
      const actual = await extract(
        'en',
        'The url is https://subdomain.domain.com/something'
      );

      const expected = [
        {
          entity: 'url',
          start: 11,
          end: 48,
          len: 38,
          accuracy: 0.95,
          sourceText: 'https://subdomain.domain.com/something',
          utteranceText: 'https://subdomain.domain.com/something',
          resolution: {
            value: 'https://subdomain.domain.com/something',
            domain: 'subdomain.domain.com',
          },
        },
      ];
      expect(actual.edges).toEqual(expected);
    });

    test('Compromise  English Number', async () => {
      const actual = await extract(
        'en',
        'The number is one hundred and twelve'
      );
      // console.log(actual)
      const expected = [
        {
          entity: 'number',
          start: 14,
          end: 35,
          len: 22,
          accuracy: 0.95,
          sourceText: 'one hundred and twelve',
          utteranceText: 'one hundred and twelve',
          resolution: {
            strValue: '112',
            value: 112,
            subtype: 'integer',
          },
        },
      ];
      expect(actual.edges).toEqual(expected);
    });

    test('Compromise  English Ordinal', async () => {
      const actual = await extract(
        'en',
        'The second is the seventh prime number'
      );
      const expected = [
        {
          start: 4,
          end: 9,
          len: 6,
          accuracy: 0.95,
          sourceText: 'second',
          utteranceText: 'second',
          entity: 'ordinal',
          resolution: { strValue: 'second', value: '2nd' },
        },
        {
          start: 18,
          end: 24,
          len: 7,
          accuracy: 0.95,
          sourceText: 'seventh',
          utteranceText: 'seventh',
          entity: 'ordinal',
          resolution: { strValue: 'seventh', value: '7th' },
        },
      ];
      expect(actual.edges).toEqual(expected);
    });

    test('Compromise  English Number Float', async () => {
      const actual = await extract(
        'en',
        'The number is one hundred and twelve point 5'
      );

      const expected = [
        {
          entity: 'number',
          start: 14,
          end: 43,
          len: 30,
          accuracy: 0.95,
          sourceText: 'one hundred and twelve point 5',
          utteranceText: 'one hundred and twelve point 5',
          resolution: {
            strValue: '112.5',
            value: 112.5,
            subtype: 'float',
          },
        },
      ];
      expect(actual.edges).toEqual(expected);
    });

    test('Compromise  English Time', async () => {
      const actual = await extract('en', '12/12/2019 at 9am');

      const expected = [
        {
          entity: 'date',
          start: 0,
          end: 16,
          len: 17,
          accuracy: 0.95,
          sourceText: '12/12/2019 at 9am',
          utteranceText: '12/12/2019 at 9am',
          resolution: {
            value: '2019-12-12T09:00:00.000Z',
          },
        },
      ];
      expect(actual.edges).toEqual(expected);
    });

    test('Compromise  English Date 2', async () => {
      const actual = await extract('en', 'Next Friday');
      expect(actual.edges).toHaveLength(1);
      const edge = actual.edges[0];
      expect(edge.entity).toEqual('date');
      expect(edge.start).toEqual(0);
      expect(edge.end).toEqual(10);
      expect(edge.len).toEqual(11);
      expect(edge.sourceText).toEqual('Next Friday');
      expect(edge.resolution.value).toBeDefined();
      const date = new Date(edge.resolution.value);
      expect(date.getDay()).toEqual(5);
    });

    test('Compromise  Various', async () => {
      const actual = await extract(
        'en',
        'Its amazing #checkitout  I am moving to California to work at Google with Joe Jimson'
      );

      const expected = [
        {
          start: 12,
          end: 22,
          len: 11,
          accuracy: 0.95,
          sourceText: '#checkitout',
          utteranceText: '#checkitout',
          entity: 'hashtag',
          resolution: { value: '#checkitout' },
        },
        {
          start: 74,
          end: 83,
          len: 10,
          accuracy: 0.95,
          sourceText: 'Joe Jimson',
          utteranceText: 'Joe Jimson',
          entity: 'person',
          resolution: { value: 'Joe Jimson' },
        },
        {
          start: 40,
          end: 49,
          len: 10,
          accuracy: 0.95,
          sourceText: 'California',
          utteranceText: 'California',
          entity: 'place',
          resolution: { value: 'California' },
        },
        {
          start: 62,
          end: 67,
          len: 6,
          accuracy: 0.95,
          sourceText: 'Google',
          utteranceText: 'Google',
          entity: 'organization',
          resolution: { value: 'Google' },
        },
      ];
      expect(actual.edges).toEqual(expected);
    });
  });
});
