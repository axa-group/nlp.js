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

const { isGibberish } = require('../src');

describe('Gibberish', () => {
  describe('isGibberish', () => {
    test('Should return false for good sentences', () => {
      expect(isGibberish('This sentence is totally valid.')).toBeFalsy();
      expect(isGibberish('This is not gibberish')).toBeFalsy();
      expect(isGibberish('Esta frase es totalmente correcta')).toBeFalsy();
      expect(isGibberish('goodbye')).toBeFalsy();
      expect(isGibberish('sure')).toBeFalsy();
      expect(isGibberish('very much')).toBeFalsy();
      expect(isGibberish('it feels so good')).toBeFalsy();
      expect(
        isGibberish(
          'Qué tiene la zarzamora que a todas horas llora que llora por los rincones'
        )
      ).toBeFalsy();
      expect(isGibberish('are you a male?')).toBeFalsy();
      expect(isGibberish('are you a female?')).toBeFalsy();
    });

    test('Should return true for gibberish sentences', () => {
      expect(isGibberish('zxcvwerjasc')).toBeTruthy();
      expect(isGibberish('ertrjiloifdfyyoiu')).toBeTruthy();
      expect(isGibberish('ajgñsgj ajdskfig jskf')).toBeTruthy();
      expect(
        isGibberish('euzbfdhuifdgiuhdsiudvbdjibgdfijbfdsiuddsfhjibfsdifdhbfd')
      ).toBeTruthy();
      expect(isGibberish('nmnjcviburili,<>')).toBeTruthy();
      expect(isGibberish('ubkddhepwxfzmpc')).toBeTruthy();
      expect(isGibberish('kwinsghocyevlzep')).toBeTruthy();
      expect(isGibberish('ertrjiloifdfyyoiu')).toBeTruthy();
      expect(isGibberish('asddsa adsdsa asdadsasd')).toBeTruthy();
      expect(isGibberish('ioqwioeioqwe')).toBeTruthy();
    });
  });
});
