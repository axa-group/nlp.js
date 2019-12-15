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

const { Stopwords } = require('@nlpjs/core');

class StopwordsCs extends Stopwords {
  constructor(container, words) {
    super(container);
    this.name = 'stopwords-cs';
    this.dictionary = {};
    const list = words || [
      'nad',
      'za',
      'po',
      'znovu',
      'všechno',
      'také',
      'další',
      'jakýkoli',
      'jakýkoliv',
      'je',
      'jsou',
      'jako',
      'protože',
      'byly',
      'byli',
      'byla',
      'před',
      'předtím',
      'pod',
      'oba',
      'ale',
      'od',
      'přišel',
      'přišla',
      'přišli',
      'přišly',
      'může',
      'můžou',
      'mohou',
      'mohli',
      'udělal',
      'udělali',
      'udělaly',
      'udělala',
      'nemohli',
      'nemohla',
      'nemohly',
      'když',
      'každý',
      'každá',
      'každé',
      'pár',
      'několik',
      'málo',
      'on',
      'má',
      'ona',
      'oni',
      'ony',
      'tady',
      'sám',
      'nemohou',
      'uvnitř',
      'pokud',
      'rád',
      'ráda',
      'rádi',
      'rády',
      'můj',
      'tvůj',
      'naše',
      'vaše',
      'tak',
      'sami',
      'sama',
      'do',
      'též',
      'spod',
      'zespod',
      'vespod',
      'my',
      'co',
      'jak',
      'kde',
      'když',
      'kdy',
      'proč',
      'kým',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      '$',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      '_',
    ];
    this.build(list);
  }
}

module.exports = StopwordsCs;
