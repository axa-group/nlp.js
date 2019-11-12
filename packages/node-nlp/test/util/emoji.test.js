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

const { removeEmojis } = require('../../src');

describe('removeEmojis', () => {
  it('should parse emojis and replace them', () => {
    const actual = removeEmojis('I ❤️  ☕️! -  😯⭐️😍  ::: test : : 👍+');
    const expected =
      'I :heart:  :coffee:! -  :hushed::star::heart_eyes:  ::: test : : :thumbsup:+';
    expect(actual).toEqual(expected);
  });

  it('Should leave unknown emoji', () => {
    const actual = removeEmojis('I ⭐️ :another_one: 🦢');
    const expected = 'I :star: :another_one: 🦢';
    expect(actual).toEqual(expected);
  });

  it('Should parse a complex emoji', () => {
    const actual = removeEmojis('I love 👩‍❤️‍💋‍👩');
    const expected = 'I love :woman-kiss-woman:';
    expect(actual).toEqual(expected);
  });

  it('Should parse flags', () => {
    const actual = removeEmojis('The flags of 🇲🇽 and 🇲🇦 are not the same');
    const expected = 'The flags of :flag-mx: and :flag-ma: are not the same';
    expect(actual).toEqual(expected);
  });
});
