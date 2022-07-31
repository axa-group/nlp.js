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

const { BaseStemmer } = require('@nlpjs/core');
const { tokenize, stemWord } = require('./korean-tokenizer');
const { initDicts, dictionary } = require('./korean-dictionary');
const TokenizerKo = require('./tokenizer-ko');
const NormalizerKo = require('./normalizer-ko');

const preendings = [
  '하고있는',
  '합니까',
  '습니다',
  '자에게',
  '머에게',
  '밍하는',
  '에게',
  '자에',
  '자의',
  '하고',
  '하는',
  '자는',
  '자가',
  '습니',
  '읍시',
  '는다',
  '으냐',
  'ᆻ다',
  '하는',
  'ᆻ',
  '처',
  '다',
  '요',
  '까',
  '니',
  '시',
  '를',
  '는',
  '에',
  '을',
  '이',
  '의',
  '를',
  '에',
  '는',
  '밍',
];

class StemmerKo extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-ko';
    this.tokenizer = new TokenizerKo();
    this.normalizer = new NormalizerKo();
  }

  isHangulChar(ch) {
    const regex =
      /[\u1100-\u11FF\u302E\u302F\u3131-\u318E\u3200-\u321E\u3260-\u327E\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/g;
    return regex.test(ch);
  }

  normalize(text) {
    return (
      text
        // .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/까?/g, '')
        .toLowerCase()
    );
  }

  tokenize(text) {
    const tokens = text.split(/[\s,.!?;:([\]'"¡¿)/]+/).filter((x) => x);
    const result = [];
    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i];
      let word = token[0];
      let isHangul = this.isHangulChar(token[0]);
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
    return result;
  }

  prestem(word) {
    for (let i = 0; i < preendings.length; i += 1) {
      if (word.endsWith(preendings[i])) {
        return word.slice(0, -preendings[i].length);
      }
    }
    if (word.endsWith('습니다')) {
      return word.slice(0, -2);
    }
    if (word.endsWith('세요')) {
      return word.slice(0, -2);
    }
    if (word.endsWith('으러')) {
      return word.slice(0, -2);
    }
    if (word.endsWith('러')) {
      return word.slice(0, -1);
    }
    if (word.endsWith('고')) {
      return word.slice(0, -1);
    }
    if (word.endsWith('네')) {
      return word.slice(0, -1);
    }
    if (word.endsWith('다')) {
      return word.slice(0, -1);
    }
    if (word.endsWith('자')) {
      return word.slice(0, -1);
    }
    return word;
  }

  innerStem() {
    initDicts();
    const word = this.getCurrent();
    const token = stemWord(this.prestem(word.trim()));
    const value = dictionary[token];
    this.setCurrent(value && value.root ? value.root : token);
  }

  async stem(text, input) {
    initDicts();
    const inputText =
      typeof text === 'string' ? text : input.utterance || input.text;
    const newText = this.tokenizer
      .tokenize(this.normalizer.normalize(inputText))
      .join(' ');
    const tokens = tokenize(this.normalizer.normalize(newText))
      .map((x) => stemWord(this.prestem(x.trim())))
      .filter((x) => x);
    const result = [];
    for (let i = 0; i < tokens.length; i += 1) {
      const value = dictionary[tokens[i]];
      if (value && value.root) {
        result.push(value.root);
      } else {
        result.push(tokens[i]);
      }
    }
    return result;
  }

  async run(srcInput) {
    const input = srcInput;
    const locale = input.locale || 'en';
    const stemmer = this.container.get(`stemmer-${locale}`) || this;
    input.tokens = await stemmer.stem(
      input.text || input.tokens.join(' '),
      input
    );
    return input;
  }

  tokenizeAndStem(text) {
    initDicts();
    const newText = this.tokenize(this.normalize(text)).join(' ');
    const tokens = tokenize(this.normalize(newText))
      .map((x) => stemWord(this.prestem(x.trim())))
      .filter((x) => x);
    const result = [];
    for (let i = 0; i < tokens.length; i += 1) {
      const value = dictionary[tokens[i]];
      if (value && value.root) {
        result.push(value.root);
      } else {
        result.push(tokens[i]);
      }
    }
    return result;
  }
}

module.exports = StemmerKo;
