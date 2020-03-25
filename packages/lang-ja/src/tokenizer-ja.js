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
const { Tokenizer } = require('@nlpjs/core');
const JapaneseRules = require('./japanese-rules.json');

class TokenizerJa extends Tokenizer {
  constructor(container, shouldTokenize) {
    super(container, shouldTokenize);
    this.name = 'tokenizer-ja';
    this.chartype = [
      [/[〇一二三四五六七八九十百千万億兆]/, 'M'],
      [/[一-鿌〆]/, 'H'],
      [/[ぁ-ゟ]/, 'I'],
      [/[゠-ヿ]/, 'K'],
      [/[a-zA-Z]/, 'A'],
      [/[0-9]/, 'N'],
    ];
    this.bias = -332;
  }

  ctype(str) {
    for (let i = 0, l = this.chartype.length; i < l; i += 1) {
      if (str.match(this.chartype[i][0])) {
        return this.chartype[i][1];
      }
    }
    return 'O';
  }

  ts(v) {
    return v || 0;
  }

  removePuncTokens(tokens) {
    return tokens
      .map((token) =>
        token.replace(
          /[＿－・，、；：！？．。（）［］｛｝｢｣＠＊＼／＆＃％｀＾＋＜＝＞｜～≪≫─＄＂_\-･,､;:!?.｡()[\]{}「」@*/&#%`^+<=>|~«»$"\s]+/g,
          ''
        )
      )
      .filter((token) => token !== '');
  }

  innerTokenize(srcText) {
    if (!srcText || srcText === '') {
      return [];
    }
    const text = srcText;
    const result = [];
    const seg = ['B3', 'B2', 'B1'];
    const ctype = ['O', 'O', 'O'];
    const o = text.split('');
    for (let i = 0, l = o.length; i < l; i += 1) {
      seg.push(o[i]);
      ctype.push(this.ctype(o[i]));
    }
    seg.push('E1');
    seg.push('E2');
    seg.push('E3');
    ctype.push('O');
    ctype.push('O');
    ctype.push('O');
    let word = seg[3];
    let p1 = 'U';
    let p2 = 'U';
    let p3 = 'U';
    for (let i = 4, l = seg.length - 3; i < l; i += 1) {
      let score = this.bias;
      const w1 = seg[i - 3];
      const w2 = seg[i - 2];
      const w3 = seg[i - 1];
      const w4 = seg[i];
      const w5 = seg[i + 1];
      const w6 = seg[i + 2];
      const c1 = ctype[i - 3];
      const c2 = ctype[i - 2];
      const c3 = ctype[i - 1];
      const c4 = ctype[i];
      const c5 = ctype[i + 1];
      const c6 = ctype[i + 2];
      score += this.ts(JapaneseRules.UP1[p1]);
      score += this.ts(JapaneseRules.UP2[p2]);
      score += this.ts(JapaneseRules.UP3[p3]);
      score += this.ts(JapaneseRules.BP1[p1 + p2]);
      score += this.ts(JapaneseRules.BP2[p2 + p3]);
      score += this.ts(JapaneseRules.UW1[w1]);
      score += this.ts(JapaneseRules.UW2[w2]);
      score += this.ts(JapaneseRules.UW3[w3]);
      score += this.ts(JapaneseRules.UW4[w4]);
      score += this.ts(JapaneseRules.UW5[w5]);
      score += this.ts(JapaneseRules.UW6[w6]);
      score += this.ts(JapaneseRules.BW1[w2 + w3]);
      score += this.ts(JapaneseRules.BW2[w3 + w4]);
      score += this.ts(JapaneseRules.BW3[w4 + w5]);
      score += this.ts(JapaneseRules.TW1[w1 + w2 + w3]);
      score += this.ts(JapaneseRules.TW2[w2 + w3 + w4]);
      score += this.ts(JapaneseRules.TW3[w3 + w4 + w5]);
      score += this.ts(JapaneseRules.TW4[w4 + w5 + w6]);
      score += this.ts(JapaneseRules.UC1[c1]);
      score += this.ts(JapaneseRules.UC2[c2]);
      score += this.ts(JapaneseRules.UC3[c3]);
      score += this.ts(JapaneseRules.UC4[c4]);
      score += this.ts(JapaneseRules.UC5[c5]);
      score += this.ts(JapaneseRules.UC6[c6]);
      score += this.ts(JapaneseRules.BC1[c2 + c3]);
      score += this.ts(JapaneseRules.BC2[c3 + c4]);
      score += this.ts(JapaneseRules.BC3[c4 + c5]);
      score += this.ts(JapaneseRules.TC1[c1 + c2 + c3]);
      score += this.ts(JapaneseRules.TC2[c2 + c3 + c4]);
      score += this.ts(JapaneseRules.TC3[c3 + c4 + c5]);
      score += this.ts(JapaneseRules.TC4[c4 + c5 + c6]);
      score += this.ts(JapaneseRules.UQ1[p1 + c1]);
      score += this.ts(JapaneseRules.UQ2[p2 + c2]);
      score += this.ts(JapaneseRules.UQ3[p3 + c3]);
      score += this.ts(JapaneseRules.BQ1[p2 + c2 + c3]);
      score += this.ts(JapaneseRules.BQ2[p2 + c3 + c4]);
      score += this.ts(JapaneseRules.BQ3[p3 + c2 + c3]);
      score += this.ts(JapaneseRules.BQ4[p3 + c3 + c4]);
      score += this.ts(JapaneseRules.TQ1[p2 + c1 + c2 + c3]);
      score += this.ts(JapaneseRules.TQ2[p2 + c2 + c3 + c4]);
      score += this.ts(JapaneseRules.TQ3[p3 + c1 + c2 + c3]);
      score += this.ts(JapaneseRules.TQ4[p3 + c2 + c3 + c4]);
      let p = 'O';
      if (score > 0) {
        result.push(word);
        word = '';
        p = 'B';
      }
      p1 = p2;
      p2 = p3;
      p3 = p;
      word += seg[i];
    }
    result.push(word);
    return this.removePuncTokens(result);
  }
}

module.exports = TokenizerJa;
