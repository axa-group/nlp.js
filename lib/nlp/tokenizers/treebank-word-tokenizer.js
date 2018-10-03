/*
 * Copyright (c) AXA Shared Services Spain S.A.
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

const Tokenizer = require('./tokenizer');

class TreebankWordTokenizer extends Tokenizer {
  constructor(settings) {
    super(settings);
    this.contractions2 = [
      /(.)('ll|'re|'ve|n't|'s|'m|'d)\b/ig,
      /\b(can)(not)\b/ig,
      /\b(D)('ye)\b/ig,
      /\b(Gim)(me)\b/ig,
      /\b(Gon)(na)\b/ig,
      /\b(Got)(ta)\b/ig,
      /\b(Lem)(me)\b/ig,
      /\b(Mor)('n)\b/ig,
      /\b(T)(is)\b/ig,
      /\b(T)(was)\b/ig,
      /\b(Wan)(na)\b/ig,
    ];
    this.contraction3 = [
      /\b(Whad)(dd)(ya)\b/ig,
      /\b(Wha)(t)(cha)\b/ig,
    ];
  }

  applyRegexList(text, regexList, replaceValue) {
    let result = text;
    regexList.forEach((regex) => {
      result = result.replace(regex, replaceValue);
    });
    return result;
  }

  tokenize(srcText) {
    let text = this.applyRegexList(srcText, this.contractions2, '$1 $2');
    text = this.applyRegexList(text, this.contraction3, '$1 $2 $3');
    text = text.replace(/([^\w.'\-/+<>,&])/g, ' $1 ');
    text = text.replace(/(,\s)/g, ' $1');
    text = text.replace(/('\s)/g, ' $1');
    text = text.replace(/\. *(\n|$)/g, ' . ');
    const tokens = text.split(/\s+/);
    return tokens.filter(s => s);
  }
}

module.exports = TreebankWordTokenizer;
