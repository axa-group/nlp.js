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

const { Ner, ExtractorRegex } = require('../src');

describe('Extractor Regex', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const instance = new ExtractorRegex();
      expect(instance).toBeDefined();
    });
  });

  describe('Extract', () => {
    test('It should extract by regex from an utterance', async () => {
      const ner = new Ner();
      ner.addRegexRule(
        'en',
        'mail',
        /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi
      );
      const input = {
        text: 'My email is jseijas@gmail.com and your is not',
        locale: 'en',
      };
      const actual = await ner.process(input);
      expect(actual.entities).toEqual([
        {
          start: 12,
          end: 28,
          accuracy: 1,
          sourceText: 'jseijas@gmail.com',
          entity: 'mail',
          type: 'regex',
          utteranceText: 'jseijas@gmail.com',
          len: 17,
        },
      ]);
    });
    test('It can extract several occurences of the regex', async () => {
      const ner = new Ner();
      ner.addRegexRule(
        'en',
        'mail',
        /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi
      );
      const input = {
        text: 'My email is jseijas@gmail.com and yours is other@other.com',
        locale: 'en',
      };
      const actual = await ner.process(input);
      expect(actual.entities).toEqual([
        {
          start: 12,
          end: 28,
          accuracy: 1,
          sourceText: 'jseijas@gmail.com',
          entity: 'mail',
          type: 'regex',
          utteranceText: 'jseijas@gmail.com',
          len: 17,
        },
        {
          start: 43,
          end: 57,
          accuracy: 1,
          sourceText: 'other@other.com',
          entity: 'mail',
          type: 'regex',
          utteranceText: 'other@other.com',
          len: 15,
        },
      ]);
    });

    test('It can extract first catching group', async () => {
      const ner = new Ner();
      ner.addRegexRule('en', 'somenumbers', /test (\d{3}) catch/gi);
      const input = {
        text: "Testing if 123 won't catch and if test 456 catch will... catch.",
        locale: 'en',
      };
      const actual = await ner.process(input);
      expect(actual.entities).toEqual([
        {
          start: 39,
          end: 41,
          accuracy: 1,
          sourceText: '456',
          entity: 'somenumbers',
          type: 'regex',
          utteranceText: '456',
          len: 3,
        },
      ]);
    });
  });
});
