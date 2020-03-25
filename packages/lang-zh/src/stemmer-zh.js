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

const TranslateZh = require('./translate-zh');
const dictionary = require('./dictionary');

class StemmerZh {
  constructor(container) {
    this.container = container;
    this.name = 'stemmer-zh';
    this.translate = new TranslateZh();
    this.dictionary = dictionary;
  }

  definitionContains(arr, text) {
    return arr.filter((x) => x.definition.includes(text)).length > 0;
  }

  parseDefinition(definitions) {
    if (this.definitionContains(definitions, '(possessive particle)')) {
      return undefined;
    }
    if (this.definitionContains(definitions, '(modal particle')) {
      return undefined;
    }
    if (definitions.length === 0) {
      return undefined;
    }
    const firstDefinition = definitions[0].definition;
    if (firstDefinition.includes('you (')) {
      return 'ni3';
    }
    let pinyin = dictionary.getPinyin(definitions[0].simplified);
    if (Array.isArray(pinyin)) {
      pinyin = pinyin.join(' ');
    }
    return pinyin;
  }

  translateToEnglish(token) {
    const definitions = dictionary.search(token);
    if (!definitions || definitions.length === 0) {
      return token;
    }
    return this.parseDefinition(definitions);
  }

  clearText(text) {
    text = text.replace('？', ' ');
    text = text.replace('！', ' ');
    return text.replace(
      new RegExp('.:+-=()"\'!?،,؛;。，？！￥：；《》【】（）', 'g'),
      ' '
    );
  }

  getSegments(text) {
    const presegments = dictionary.segment(text);
    const result = [];
    let chars = '';
    for (let i = 0; i < presegments.length; i += 1) {
      const segment = presegments[i];
      if (this.translate.isChineseChar(segment)) {
        if (chars) {
          result.push(chars);
          chars = '';
        }
        result.push(segment);
      } else {
        chars += segment;
      }
    }
    if (chars) {
      result.push(chars);
    }
    return result;
  }

  processText(text) {
    text = this.clearText(text);
    const result = [];
    const segments = this.getSegments(text);
    for (let i = 0; i < segments.length; i += 1) {
      const translated = this.translateToEnglish(segments[i]);
      if (translated) {
        result.push(translated);
      }
    }
    return this.clearText(result.join(' '))
      .toLowerCase()
      .split(' ')
      .filter((x) => x);
  }

  async stem(text, input) {
    const inputText =
      typeof text === 'string' ? text : input.utterance || input.text;
    return this.processText(inputText);
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
}

module.exports = StemmerZh;
