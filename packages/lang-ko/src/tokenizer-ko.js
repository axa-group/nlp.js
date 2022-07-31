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
const { tokenize } = require('./korean-tokenizer');

class TokenizerKo extends Tokenizer {
  constructor(container, shouldTokenize) {
    super(container, shouldTokenize);
    this.name = 'tokenizer-ko';
  }

  isHangulChar(ch) {
    const regex =
      /[\u1100-\u11FF\u302E\u302F\u3131-\u318E\u3200-\u321E\u3260-\u327E\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/g;
    return regex.test(ch);
  }

  clean(text) {
    const tokens = text.split(/[\s,.!?;:([\]'"¡¿)/]+/).filter((x) => x);
    const result = [];
    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i];
      let word = token[0];
      let isHangul = this.isHangulChar(word);
      for (let j = 1; j < token.length; j += 1) {
        const char = token[j];
        const newIsHangul = this.isHangulChar(char);
        if (newIsHangul !== isHangul) {
          result.push(word);
          word = char;
          isHangul = newIsHangul;
        } else {
          word += char;
        }
      }
      result.push(word);
    }
    return result.join(' ');
  }

  innerTokenize(text) {
    const tokens = tokenize(this.clean(text));
    const trimmed = tokens.map((x) => x.trim());
    const filtered = trimmed.filter((x) => x);
    return filtered;
  }
}

module.exports = TokenizerKo;
