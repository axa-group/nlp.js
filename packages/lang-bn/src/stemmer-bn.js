/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const { BaseStemmer } = require('@nlpjs/core');

class StemmerBn extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-bn';
  }

  processSuffixes(word) {
    const maxSuffixes = word.length > 7 ? 6 : word.length - 2;
    for (let i = maxSuffixes; i >= 0; i -= 1) {
      const suffixes = StemmerBn.suffixes[i];
      for (let j = 0; j < suffixes.length; j += 1) {
        if (word.endsWith(suffixes[j])) {
          return word.slice(0, -suffixes[j].length);
        }
      }
    }
    return word;
  }

  innerStem() {
    let word = this.getCurrent();
    word = this.processSuffixes(word);
    word = StemmerBn.dict[word] || word;
    this.setCurrent(word);
  }
}

StemmerBn.suffixes = [
  ['য়', 'ও', 'র', 'ই', 'ি'],
  [
    'তি',
    'েই',
    'ের',
    'িত',
    'তা',
    'েও',
    'ীয়',
    'কে',
    'তে',
    'টি',
    'িক',
    'রা',
    'টা',
    'সহ',
    'রই',
  ],
  [
    'শীল',
    'তায়',
    'তাম',
    'বলী',
    'লেন',
    'টিও',
    'েরও',
    'টাও',
    'টিই',
    'ছেন',
    'ত্ব',
    'তার',
    'হীন',
    'রাও',
    'খোর',
    'তেও',
    'টাই',
    'কেই',
    'কেও',
    'টার',
    'ন্ত',
    'দের',
    'টির',
    'টায়',
    'য়ের',
    'য়েন',
  ],
  [
    'ভাবে',
    'টিতে',
    'টাতে',
    'টিকে',
    'ত্বই',
    'টারই',
    'দেরও',
    'টাকে',
    'চ্ছি',
    ' েরই',
    'গুলো',
    'মূলক',
    'গুলা',
    'কারী',
    'ছিলে',
    'টুকু',
    'গুলি',
  ],
  [
    'গুলোর',
    'কারীই',
    'ত্বকে',
    'কারীও',
    'টুকুর',
    'গুলোই',
    ' িদের',
    'টাতেই',
    'টুকুও',
    'ছিলাম',
    'কারীর',
    'টুকুই',
    'িতেছি',
    'ত্বের',
    'দেরকে',
    'গুলোয়',
    'টাকেই',
  ],
  [
    'কারীসহ',
    'কারীরা',
    'কারীকে',
    'দেরকেও',
    'দেরকেই',
    'চ্ছিলে',
    'গুলোতে',
    'টুকুরই',
    'গুলোকে',
    'গুলিতে',
    'টুকুতে',
  ],
  ['গুলোকেও', 'টুকুতেও', 'চ্ছিলাম', 'ত্বমূলক', 'কারীদের', 'গুলোতেও', 'কারীরাও'],
];

StemmerBn.dict = {
  এগি: 'যাওয়া',
  এগ: 'যাওয়া',
  গিয়ে: 'যাওয়া',
  খাই: 'খাওয়া',
  যা: 'যাওয়া',
  খা: 'খাওয়া',
  দে: 'দেওয়া',
  খাও: 'খাওয়া',
  যাও: 'যাওয়া',
  দেও: 'দেওয়া',
  খেয়: 'খাওয়া',
  চেয়: 'চাওয়া',
};

module.exports = StemmerBn;
