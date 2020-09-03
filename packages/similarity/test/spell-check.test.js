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

const { SpellCheck } = require('../src');

describe('Similar Search', () => {
  describe('Constructor', () => {
    test('An instance can be created', () => {
      const spellCheck = new SpellCheck({
        features: { word: 1, more: 1, other: 2 },
      });
      expect(spellCheck).toBeDefined();
    });
  });

  describe('Set features', () => {
    test('Features can be changed with a method', () => {
      const spellCheck = new SpellCheck();
      spellCheck.setFeatures({ features: { word: 1, other: 2 } });
      const actual = spellCheck.checkToken('word', 1);
      expect(actual).toEqual('word');
    });
  });

  describe('Check token', () => {
    test('If the token already exists, return the token', () => {
      const spellCheck = new SpellCheck({ features: { word: 1, other: 2 } });
      const actual = spellCheck.checkToken('word', 1);
      expect(actual).toEqual('word');
    });
    test('If the token is smaller than 4 return then token', () => {
      const spellCheck = new SpellCheck({ features: { word: 1, other: 2 } });
      const actual = spellCheck.checkToken('wor', 1);
      expect(actual).toEqual('wor');
    });
    test('If exists a similar feature, return this similar feature', () => {
      const spellCheck = new SpellCheck({ features: { word: 1, other: 2 } });
      const actual = spellCheck.checkToken('world', 1);
      expect(actual).toEqual('word');
    });
    test('If not exists a similar feature, return this input token', () => {
      const spellCheck = new SpellCheck({ features: { word: 1, other: 2 } });
      const actual = spellCheck.checkToken('mandate', 1);
      expect(actual).toEqual('mandate');
    });
    test('If there are several similar features, return the one with more similar length', () => {
      const spellCheck = new SpellCheck({
        features: {
          wording: 1,
          workin: 1,
          workingo: 1,
          other: 2,
        },
      });
      const actual = spellCheck.checkToken('working', 1);
      expect(actual).toEqual('wording');
    });
  });

  describe('Check', () => {
    test('Check allows to test several words', () => {
      const spellCheck = new SpellCheck({
        features: {
          wording: 1,
          working: 3,
          workin: 1,
          workingo: 1,
          other: 2,
        },
      });
      const actual = spellCheck.check(['this', 'is', 'worling', 'otler'], 1);
      expect(actual).toEqual(['this', 'is', 'working', 'other']);
    });
    test('By default, distance should be 1', () => {
      const spellCheck = new SpellCheck({
        features: {
          wording: 1,
          working: 3,
          workin: 1,
          workingo: 1,
          other: 2,
        },
      });
      const actual = spellCheck.check(['this', 'is', 'worling', 'otler']);
      expect(actual).toEqual(['this', 'is', 'working', 'other']);
    });
    test('It should choose the word with bigger frequency', () => {
      const spellCheck = new SpellCheck({
        features: {
          wording: 1,
          worming: 4,
          working: 3,
        },
      });
      const actual = spellCheck.check(['worling'], 1);
      expect(actual).toEqual(['worming']);
    });
  });
});
