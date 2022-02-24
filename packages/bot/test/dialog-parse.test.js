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

const {
  dialogParse,
  trimBetween,
  getName,
  getDialogName,
} = require('../src/dialog-parse');

describe('Dialog Parse', () => {
  describe('dialogParse', () => {
    test('parse basic dialog', async () => {
      const dialog = `say Hello! this is a dialog`;
      const parsed = dialogParse(dialog);
      expect(parsed).toMatchObject([
        {
          condition: '',
          line: 'Hello! this is a dialog',
          settings: '',
          srcLine: 'say Hello! this is a dialog',
          type: 'say',
        },
      ]);
    });

    test('parse dialog with condition', async () => {
      const dialog = `[myVar == 1] say Hello! this is a dialog`;
      const parsed = dialogParse(dialog);
      expect(parsed).toMatchObject([
        {
          condition: 'myVar == 1',
          line: 'Hello! this is a dialog',
          settings: '',
          srcLine: '[myVar == 1] say Hello! this is a dialog',
          type: 'say',
        },
      ]);
    });

    test('parse dialog with comment', async () => {
      const dialog = `# this is comment`;
      const parsed = dialogParse(dialog);
      expect(parsed).toMatchObject([
        { text: 'this is comment', type: 'comment' },
      ]);
    });

    test('parse dialog with link', async () => {
      const dialog = `say Hello! this is a dialog with [link](http://www.test.com)`;
      const parsed = dialogParse(dialog);
      expect(parsed).toMatchObject([
        {
          condition: '',
          line: 'Hello! this is a dialog with [link](http://www.test.com)',
          settings: '',
          srcLine:
            'say Hello! this is a dialog with [link](http://www.test.com)',
          type: 'say',
        },
      ]);
    });
  });

  describe('trimBetween', () => {
    const trimInputExample1 =
      'say Hey this an example with [text inside] and (opt1, opt2)';
    it('filter settings inside ()', () => {
      const result = trimBetween(trimInputExample1, '(', ')');
      expect(result).toMatchObject({
        line: 'say Hey this an example with [text inside] and ',
        trimmed: 'opt1, opt2',
      });
    });

    it('filter settings inside []', () => {
      const result = trimBetween(trimInputExample1, '[', ']');
      expect(result).toMatchObject({
        line: 'say Hey this an example with  and (opt1, opt2)',
        trimmed: 'text inside',
      });
    });

    it('dont filter text inside [] if shouldBeFirst enabled', () => {
      const result = trimBetween(trimInputExample1, '[', ']', true);
      expect(result).toMatchObject({
        line: 'say Hey this an example with [text inside] and (opt1, opt2)',
        trimmed: '',
      });
    });

    it('filter text inside [] appearing at the beginning only if shouldBeFirst is enabled', () => {
      const result = trimBetween(
        '[hello] this is another example',
        '[',
        ']',
        true
      );
      expect(result).toMatchObject({
        line: ' this is another example',
        trimmed: 'hello',
      });
    });
  });

  describe('getName', () => {
    it('generates name from text', () => {
      expect(getName('this is a test')).toBe('this_is_a_test');
    });

    it('generates name from list', () => {
      expect(getName(['aaa', 'bbb'])).toBe('aaa_bbb');
    });
  });

  describe('getDialogName', () => {
    it('returns dialog name from tokens (case 1)', () => {
      expect(getDialogName(['aaa', 'bbb'])).toBe('/aaa_bbb');
    });

    it('returns dialog name from tokens (case 2)', () => {
      expect(getDialogName(['/aaa', 'bbb'])).toBe('/aaa_bbb');
    });

    it('returns dialog name from tokens (case special main)', () => {
      expect(getDialogName(['/main'])).toBe('/');
    });
  });
});
