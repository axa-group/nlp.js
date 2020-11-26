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
const { BuiltinDefault } = require('../src');

const container = containerBootstrap();
const builtin = new BuiltinDefault({ container });

function buildExpected(value, start, entityName, typeName) {
  const result = {
    start,
    end: start + value.length - 1,
    len: value.length,
    accuracy: 0.95,
    sourceText: value,
    utteranceText: value,
    entity: entityName,
    resolution: { value },
  };
  if (typeName) {
    result.resolution.type = typeName;
  }
  return result;
}

function buildInput(text, builtins, locale = 'en') {
  const result = {
    text,
    locale,
  };
  if (builtins) {
    result.builtins = Array.isArray(builtins) ? builtins : [builtins];
  }
  return result;
}

describe('Builtin Default', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const instance = new BuiltinDefault({ container });
      expect(instance).toBeDefined();
    });
  });

  describe('Email', () => {
    test('It should extract one email', () => {
      const input = 'My email is something@mail.com';
      const actual = builtin.extract(buildInput(input, 'Email'));
      const expected = {
        edges: [buildExpected('something@mail.com', 12, 'email')],
        locale: 'en',
        text: input,
        builtins: ['Email'],
      };
      expect(actual).toEqual(expected);
    });
    test('It should extract several emails', () => {
      const input = 'My email is something@mail.com but also other@mail.com';
      const actual = builtin.extract(buildInput(input, 'Email'));
      const expected = {
        edges: [
          buildExpected('something@mail.com', 12, 'email'),
          buildExpected('other@mail.com', 40, 'email'),
        ],
        locale: 'en',
        text: input,
        builtins: ['Email'],
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('IpAddress', () => {
    test('It should extract IPv4', () => {
      const input = 'My ip is 8.8.8.8';
      const actual = builtin.extract(buildInput(input, 'IpAddress'));
      const expected = {
        edges: [buildExpected('8.8.8.8', 9, 'ip', 'ipv4')],
        locale: 'en',
        text: input,
        builtins: ['IpAddress'],
      };
      expect(actual).toEqual(expected);
    });
    test('It should extract several IPv4', () => {
      const input = 'My ip is 8.8.8.8 and yours is 192.168.0.1';
      const actual = builtin.extract(buildInput(input, 'IpAddress'));
      const expected = {
        edges: [
          buildExpected('8.8.8.8', 9, 'ip', 'ipv4'),
          buildExpected('192.168.0.1', 30, 'ip', 'ipv4'),
        ],
        locale: 'en',
        text: input,
        builtins: ['IpAddress'],
      };
      expect(actual).toEqual(expected);
    });
    test('It should extract IPv6', () => {
      const input = 'My ip is ABEF:452::FE10';
      const actual = builtin.extract(buildInput(input, 'IpAddress'));
      const expected = {
        edges: [buildExpected('ABEF:452::FE10', 9, 'ip', 'ipv6')],
        locale: 'en',
        text: input,
        builtins: ['IpAddress'],
      };
      expect(actual).toEqual(expected);
    });
    test('It should extract several IPv6', () => {
      const input = 'My ip is ABEF:452::FE10 and other is ABEF:452::AE10';
      const actual = builtin.extract(buildInput(input, 'IpAddress'));
      const expected = {
        edges: [
          buildExpected('ABEF:452::FE10', 9, 'ip', 'ipv6'),
          buildExpected('ABEF:452::AE10', 37, 'ip', 'ipv6'),
        ],
        locale: 'en',
        text: input,
        builtins: ['IpAddress'],
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('URL', () => {
    test('It should extract one URL', () => {
      const input = 'My url is https://www.uri.com';
      const actual = builtin.extract(buildInput(input, 'URL'));
      const expected = {
        edges: [buildExpected('https://www.uri.com', 10, 'url')],
        locale: 'en',
        text: input,
        builtins: ['URL'],
      };
      expect(actual).toEqual(expected);
    });
    test('It should extract several URLs', () => {
      const input =
        'My url is https://www.uri.com but also http://me.com/more/things?a=7&b=test';
      const actual = builtin.extract(buildInput(input, 'URL'));
      const expected = {
        edges: [
          buildExpected('https://www.uri.com', 10, 'url'),
          buildExpected('http://me.com/more/things?a=7&b=test', 39, 'url'),
        ],
        locale: 'en',
        text: input,
        builtins: ['URL'],
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('Phone Number', () => {
    test('It should extract a phone number', () => {
      const input = 'My phone number is +1 541-754-3010';
      const actual = builtin.extract(buildInput(input, 'PhoneNumber'));
      const expected = {
        edges: [buildExpected('541-754-3010', 22, 'phonenumber')],
        locale: 'en',
        text: input,
        builtins: ['PhoneNumber'],
      };
      expect(actual).toEqual(expected);
    });
    test('It should extract several phone numbers', () => {
      const input = 'My phone number is 541-754-3010 but also 555-911-7340';
      const actual = builtin.extract(buildInput(input, 'PhoneNumber'));
      const expected = {
        edges: [
          buildExpected('541-754-3010', 19, 'phonenumber'),
          buildExpected('555-911-7340', 41, 'phonenumber'),
        ],
        locale: 'en',
        text: input,
        builtins: ['PhoneNumber'],
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('Hashtag', () => {
    test('It should extract a hashtag', () => {
      const input = 'Look at #hashtag';
      const actual = builtin.extract(buildInput(input, 'Hashtag'));
      const expected = {
        edges: [buildExpected('#hashtag', 8, 'hashtag')],
        locale: 'en',
        text: input,
        builtins: ['Hashtag'],
      };
      expect(actual).toEqual(expected);
    });
    test('It should extract several hashtags', () => {
      const input = 'Look at #hashtag and #party';
      const actual = builtin.extract(buildInput(input, 'Hashtag'));
      const expected = {
        edges: [
          buildExpected('#hashtag', 8, 'hashtag'),
          buildExpected('#party', 21, 'hashtag'),
        ],
        locale: 'en',
        text: input,
        builtins: ['Hashtag'],
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('Number', () => {
    test('It should be able to extract integers', () => {
      const input = 'A is 12 and B is -7';
      const actual = builtin.extract(buildInput(input, 'Number'));
      const expected = {
        edges: [
          buildExpected('12', 5, 'number', 'integer'),
          buildExpected('-7', 17, 'number', 'integer'),
        ],
        locale: 'en',
        text: input,
        builtins: ['Number'],
      };
      expected.edges[0].resolution.value = 12;
      expected.edges[1].resolution.value = -7;
      expect(actual).toEqual(expected);
    });
    test('It should be able to extract floats', () => {
      const input = 'A is 12.1 and B is -7.2';
      const actual = builtin.extract(buildInput(input, 'Number'));
      const expected = {
        edges: [
          buildExpected('12.1', 5, 'number', 'float'),
          buildExpected('-7.2', 19, 'number', 'float'),
        ],
        locale: 'en',
        text: input,
        builtins: ['Number'],
      };
      expected.edges[0].resolution.value = 12.1;
      expected.edges[1].resolution.value = -7.2;
      expect(actual).toEqual(expected);
    });
  });

  describe('Date', () => {
    test('It should be able to extract a valid date', () => {
      const input = 'date is 29/02/2020';
      const actual = builtin.extract(buildInput(input, 'Date'));
      const expected = {
        edges: [buildExpected('29/02/2020', 8, 'date')],
        locale: 'en',
        text: input,
        builtins: ['Date'],
      };
      expected.edges[0].resolution.value = new Date(2020, 1, 29);
      expect(actual).toEqual(expected);
    });
    test('It should be able to extract a valid date with different format', () => {
      const input = 'date is 2020-02-29';
      const actual = builtin.extract(buildInput(input, 'Date'));
      const expected = {
        edges: [buildExpected('2020-02-29', 8, 'date')],
        locale: 'en',
        text: input,
        builtins: ['Date'],
      };
      expected.edges[0].resolution.value = new Date(2020, 1, 29);
      expect(actual).toEqual(expected);
    });
    test('It should not extract date if is invalid', () => {
      const input = 'date is 2019-02-29';
      const actual = builtin.extract(buildInput(input, 'Date'));
      const expected = {
        edges: [],
        locale: 'en',
        text: input,
        builtins: ['Date'],
      };
      expect(actual).toEqual(expected);
    });
  });
});
