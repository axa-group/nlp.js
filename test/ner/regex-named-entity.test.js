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

const { RegexNamedEntity } = require('../../lib');

describe('Regex Named Entity', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const entity = new RegexNamedEntity();
      expect(entity).toBeDefined();
    });
  });
  describe('Add Regex', () => {
    test('It should add a regex to a language', () => {
      const entity = new RegexNamedEntity({ name: 'mail' });
      entity.addRegex('en', /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi);
      expect(entity).toBeDefined();
      expect(entity.locales.en).toEqual({
        regex: /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi,
      });
    });
    test('It should add "g" flag if it\'s missing in the regex', () => {
      const entity = new RegexNamedEntity({ name: 'mail' });
      entity.addRegex('en', /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/i);
      expect(entity).toBeDefined();
      expect(entity.locales.en).toEqual({
        regex: /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi,
      });
    });
    test('It should add a regex to several language', () => {
      const entity = new RegexNamedEntity({ name: 'mail' });
      entity.addRegex(
        ['en', 'es'],
        /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi
      );
      expect(entity).toBeDefined();
      expect(entity.locales.en).toEqual({
        regex: /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi,
      });
      expect(entity.locales.es).toEqual({
        regex: /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi,
      });
    });
  });
  describe('Extract', () => {
    test('It should extract by regex from an utterance', () => {
      const entity = new RegexNamedEntity({ name: 'mail' });
      const text = 'My email is jseijas@gmail.com and yours is not';
      entity.addRegex('en', /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi);
      const edges = entity.extract(text, 'en');
      expect(edges).toBeDefined();
      expect(edges).toHaveLength(1);
      expect(edges[0].start).toEqual(12);
      expect(edges[0].end).toEqual(29);
      expect(edges[0].accuracy).toEqual(1);
      expect(edges[0].sourceText).toEqual('jseijas@gmail.com');
      expect(edges[0].entity).toEqual('mail');
      expect(edges[0].utteranceText).toEqual('jseijas@gmail.com');
    });
    test('It locale does not exists then fallback', () => {
      const entity = new RegexNamedEntity({ name: 'mail' });
      const text = 'My email is jseijas@gmail.com and yours is not';
      entity.addRegex('en', /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi);
      const edges = entity.extract(text, 'es');
      expect(edges).toBeDefined();
      expect(edges).toHaveLength(1);
      expect(edges[0].start).toEqual(12);
      expect(edges[0].end).toEqual(29);
      expect(edges[0].accuracy).toEqual(1);
      expect(edges[0].sourceText).toEqual('jseijas@gmail.com');
      expect(edges[0].entity).toEqual('mail');
      expect(edges[0].utteranceText).toEqual('jseijas@gmail.com');
    });
    test('It locale does not exists neigher fallback return empty array', () => {
      const entity = new RegexNamedEntity({ name: 'mail' });
      const text = 'My email is jseijas@gmail.com and yours is not';
      entity.addRegex('fr', /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi);
      const edges = entity.extract(text, 'es');
      expect(edges).toEqual([]);
    });
    test('It can extract several occurences of the regex', () => {
      const entity = new RegexNamedEntity({ name: 'mail' });
      const text = 'My email is jseijas@gmail.com and yours is other@other.com';
      entity.addRegex('en', /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi);
      const edges = entity.extract(text, 'en');
      expect(edges).toBeDefined();
      expect(edges).toHaveLength(2);
      expect(edges[0].start).toEqual(12);
      expect(edges[0].end).toEqual(29);
      expect(edges[0].accuracy).toEqual(1);
      expect(edges[0].sourceText).toEqual('jseijas@gmail.com');
      expect(edges[0].entity).toEqual('mail');
      expect(edges[0].utteranceText).toEqual('jseijas@gmail.com');
      expect(edges[1].start).toEqual(43);
      expect(edges[1].end).toEqual(58);
      expect(edges[1].accuracy).toEqual(1);
      expect(edges[1].sourceText).toEqual('other@other.com');
      expect(edges[1].entity).toEqual('mail');
      expect(edges[1].utteranceText).toEqual('other@other.com');
    });
  });
});
