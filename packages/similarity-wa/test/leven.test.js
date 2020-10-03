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

const { leven } = require('../src');

describe('levenshtein', () => {
  test('Should return correct levenshtein distance', () => {
    expect(leven('potatoe', 'potatoe')).toEqual(0);
    expect(leven('', '123')).toEqual(3);
    expect(leven('123', '')).toEqual(3);
    expect(leven('a', 'b')).toEqual(1);
    expect(leven('ab', 'ac')).toEqual(1);
    expect(leven('abc', 'axc')).toEqual(1);
    expect(leven('xabxcdxxefxgx', '1ab2cd34ef5g6')).toEqual(6);
    expect(leven('xabxcdxxefxgx', 'abcdefg')).toEqual(6);
    expect(leven('javawasneat', 'scalaisgreat')).toEqual(7);
    expect(leven('example', 'samples')).toEqual(3);
    expect(leven('forward', 'drawrof')).toEqual(6);
    expect(leven('sturgeon', 'urgently')).toEqual(6);
    expect(leven('levenshtein', 'frankenstein')).toEqual(6);
    expect(leven('distance', 'difference')).toEqual(5);
    expect(leven('distance', 'eistancd')).toEqual(2);
    expect(leven('你好世界', '你好')).toEqual(2);
    expect(
      leven('因為我是中國人所以我會說中文', '因為我是英國人所以我會說英文')
    ).toEqual(2);
    expect(leven('mikailovitch', 'Mikhaïlovitch')).toEqual(3);
  });
  test('Should return correct levenshtein distance for long texts', () => {
    const text1 =
      'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
    const text2 =
      'Duis erat dolor, cursus in tincidunt a, lobortis in odio. Cras magna sem, pharetra et iaculis quis, faucibus quis tellus. Suspendisse dapibus sapien in justo cursus';
    expect(leven(text1, text2)).toEqual(143);
  });
  test('Should return the length of first string if the second is empty', () => {
    expect(leven('mikailovitch', '')).toEqual(12);
  });
  test('Should return the length of second string if the first is empty', () => {
    expect(leven('', 'mikailovitch')).toEqual(12);
  });
});
