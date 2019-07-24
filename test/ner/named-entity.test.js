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

const { NamedEntity } = require('../../lib');

describe('Named Entity', () => {
  describe('Constructor', () => {
    test('Should create an instance', () => {
      const entity = new NamedEntity();
      expect(entity).toBeDefined();
    });
    test('Should initialize properties without settings', () => {
      const entity = new NamedEntity();
      expect(entity.name).toBeUndefined();
      expect(entity.locales).toEqual({});
      expect(entity.localeFallback).toEqual({ '*': 'en' });
    });
    test('Should initialize properties with settings', () => {
      const entity = new NamedEntity({ name: 'entity' });
      expect(entity.name).toEqual('entity');
      expect(entity.locales).toEqual({});
      expect(entity.localeFallback).toEqual({ '*': 'en' });
    });
  });
  describe('Get locale', () => {
    test('If create is true and does not exists then create', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const locale = entity.getLocale('en');
      expect(locale).toBeDefined();
    });
    test('If create is false and does not exists, then return undefined', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const locale = entity.getLocale('en', false);
      expect(locale).toBeUndefined();
    });
    test('If get locale is called twice, first one creates new, second returns this one', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const expected = entity.getLocale('en');
      const actual = entity.getLocale('en');
      expect(actual).toBe(expected);
    });
    test('If get locale is called for different locales, should return different objects', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const expected = entity.getLocale('en');
      const actual = entity.getLocale('es');
      expect(actual).not.toBe(expected);
    });
  });
  describe('Get locale rules', () => {
    test('If asking for an existing locale, return it', () => {
      const entity = new NamedEntity({ name: 'entity' });
      const localeEs = entity.getLocale('es');
      const actual = entity.getLocaleRules('es');
      expect(actual).toBe(localeEs);
    });
    test('If asking for an routed locale, return the target', () => {
      const entity = new NamedEntity({
        name: 'entity',
        localeFallback: { ar: 'es' },
      });
      const localeEs = entity.getLocale('es');
      const actual = entity.getLocaleRules('ar');
      expect(actual).toBe(localeEs);
    });
    test('If asking for an unrouted locale, return the default', () => {
      const entity = new NamedEntity({ name: 'entity' });
      entity.getLocale('es');
      const localeEn = entity.getLocale('en');
      const actual = entity.getLocaleRules('ar');
      expect(actual).toBe(localeEn);
    });
    test('If default locale is not defined, return undefined', () => {
      const entity = new NamedEntity({ name: 'entity' });
      entity.getLocale('es');
      const actual = entity.getLocaleRules('ar');
      expect(actual).toBeUndefined();
    });
  });
  describe('Extract', () => {
    test('It should raise an exception', () => {
      const entity = new NamedEntity({ name: 'entity' });
      expect(() => entity.extract()).toThrow('Not implemented');
    });
  });
});
