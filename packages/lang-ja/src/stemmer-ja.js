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

const fs = require('fs');
const path = require('path');
const { BaseStemmer } = require('@nlpjs/core');

const kuromoji = require('kuromoji');
const hepburn = require('./hepburn.json');
const keigo = require('./keigo.json');

/**
 * Class for a Japanese Stemmer
 */
class StemmerJa extends BaseStemmer {
  /**
   * Constructor of the class
   */
  constructor(container) {
    super(container);
    this.name = 'stemmer-ja';
    this.shiftToHiragana = '\u3041'.charCodeAt(0) - '\u30a1'.charCodeAt(0);
  }

  /**
   * Promise to initialize the class and get the tokenizer
   */
  static classInit() {
    return new Promise((resolve, reject) => {
      if (StemmerJa.tokenizer) {
        resolve();
      } else {
        let dicPath = path.join(__dirname, '../node_modules/kuromoji/dict');
        if (!fs.existsSync(dicPath)) {
          dicPath = path.join(
            __dirname,
            '../../../../node_modules/kuromoji/dict'
          );
          if (!fs.existsSync(dicPath)) {
            dicPath = './node_modules/kuromoji/dict';
          }
        }
        kuromoji.builder({ dicPath }).build((err, tokenizer) => {
          if (err) {
            reject(err);
          } else {
            StemmerJa.tokenizer = tokenizer;
            resolve();
          }
        });
      }
    });
  }

  init() {
    return StemmerJa.classInit();
  }

  /**
   * Indicates if the character is Hiragana
   * @param {String} ch Character
   */
  isHiraganaChar(ch) {
    return ch && ch >= '\u3040' && ch <= '\u309f';
  }

  /**
   * Indicates if the character is Katakana
   * @param {String} ch Character
   */
  isKatakanaChar(ch) {
    return ch && ch >= '\u30a0' && ch <= '\u30ff';
  }

  /**
   * Indicates if the character is Hiragana or Katakana
   * @param {String} ch Character
   */
  isKanaChar(ch) {
    return this.isHiraganaChar(ch) || this.isKatakanaChar(ch);
  }

  /**
   * Indicates if the character is a Kanji
   * @param {String} ch Character
   */
  isKanjiChar(ch) {
    return (
      (ch >= '\u4e00' && ch <= '\u9fcf') ||
      (ch >= '\uf900' && ch <= '\ufaff') ||
      (ch >= '\u3400' && ch <= '\u4dbf')
    );
  }

  /**
   * Indicates if the character is Hiragana, Katakana or Kanji
   * @param {String} ch Character
   */
  isJapaneseChar(ch) {
    return this.isKanaChar(ch) || this.isKanjiChar(ch);
  }

  /**
   * Indicates if a string contains Hiragana
   * @param {String} str Input string.
   */
  hasHiragana(str) {
    for (let i = 0; i < str.length; i += 1) {
      if (this.isHiraganaChar(str[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Indicates if a string contains Katakana
   * @param {String} str Input string.
   */
  hasKatakana(str) {
    for (let i = 0; i < str.length; i += 1) {
      if (this.isKatakanaChar(str[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Indicates if a string contains Hiragana or Katakana
   * @param {String} str Input string.
   */
  hasKana(str) {
    for (let i = 0; i < str.length; i += 1) {
      if (this.isKanaChar(str[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Indicates if a string contains Kanji
   * @param {String} str Input string.
   */
  hasKanji(str) {
    for (let i = 0; i < str.length; i += 1) {
      if (this.isKanjiChar(str[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Indicates if a string contains Hiragana, Katakana or Kanji
   * @param {String} str Input string.
   */
  hasJapanese(str) {
    for (let i = 0; i < str.length; i += 1) {
      if (this.isJapaneseChar(str[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Converts katakana characters to hiragana
   * @param {String} str Input string
   */
  toHiragana(str) {
    return [...str]
      .map((ch) =>
        ch > '\u30a0' && ch < '\u30f7'
          ? String.fromCharCode(ch.charCodeAt(0) + this.shiftToHiragana)
          : ch
      )
      .join('');
  }

  /**
   * Converts hiragana characters to katakana
   * @param {String} str Input string.
   */
  toKatakana(str) {
    return [...str]
      .map((ch) =>
        ch > '\u3040' && ch < '\u3097'
          ? String.fromCharCode(ch.charCodeAt(0) - this.shiftToHiragana)
          : ch
      )
      .join('');
  }

  /**
   * Converts a string to romaji.
   * The string must contain hiragana or katakana, but kanjis are not converted.
   * @param {String} srcStr Input string
   */
  toRomaji(srcStr) {
    const reghatu =
      /(ん|ン)(?=あ|い|う|え|お|ア|イ|ウ|エ|オ|ぁ|ぃ|ぅ|ぇ|ぉ|ァ|ィ|ゥ|ェ|ォ|や|ゆ|よ|ヤ|ユ|ヨ|ゃ|ゅ|ょ|ャ|ュ|ョ)/g;
    const indices = [];
    let str = srcStr;
    let match = reghatu.exec(str);
    while (match !== null) {
      indices.push(match.index + 1);
      match = reghatu.exec(str);
    }
    if (indices.length !== 0) {
      let mstr = '';
      for (let i = 0; i < indices.length; i += 1) {
        mstr +=
          i === 0
            ? `${str.slice(0, indices[i])}`
            : `${str.slice(indices[i - 1], indices[i])}`;
      }
      mstr += str.slice(indices[indices.length - 1]);
      str = mstr;
    }
    let pnt = 0;
    let result = '';
    while (pnt <= str.length) {
      let current = str.substring(pnt, pnt + 2);
      current = hepburn[current] ? current : str.substring(pnt, pnt + 1);
      result += hepburn[current] || current;
      pnt += current.length || 1;
    }
    result = result.replace(/(っ|ッ)([bcdfghijklmnopqrstuvwyz])/gm, '$2$2');
    result = result.replace(/cc/gm, 'tc');
    result = result.replace(/っ|ッ/gm, 'tsu');
    result = result.replace(/nm/gm, 'mm');
    result = result.replace(/nb/gm, 'mb');
    result = result.replace(/np/gm, 'mp');
    result = result.replace(/aー/gm, 'ā');
    result = result.replace(/iー/gm, 'ī');
    result = result.replace(/uー/gm, 'ū');
    result = result.replace(/eー/gm, 'ē');
    result = result.replace(/oー/gm, 'ō');
    return result;
  }

  /**
   * Parse a text to obtain the japanese tokens
   * @param {String} text Input string
   */
  parse(text) {
    const tokens = StemmerJa.tokenizer.tokenize(text);
    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i];
      if (this.hasJapanese(token.surface_form)) {
        if (!token.reading) {
          token.reading = token.surface_form
            .split('')
            .every(this.isKanaChar.bind(this))
            ? this.toKatakana(token.surface_form)
            : token.surface_form;
        } else if (this.hasHiragana(token.reading)) {
          token.reading = this.toKatakana(token.reading);
        }
      } else {
        token.reading = token.surface_form;
      }
    }
    for (let i = 0; i < tokens.length; i += 1) {
      const current = tokens[i];
      const prev = tokens[i - 1];
      if (
        current.pos &&
        current.pos === '助動詞' &&
        (current.surface_form === 'う' || current.surface_form === 'ウ')
      ) {
        if (i - 1 >= 0 && prev.pos && prev.pos === '動詞') {
          prev.surface_form += 'う';
          if (prev.pronunciation) {
            prev.pronunciation += 'ー';
          } else {
            prev.pronunciation = `${prev.reading}ー`;
          }
          prev.reading += 'ウ';
          tokens.splice(i, 1);
          i -= 1;
        }
      }
    }
    for (let i = 0; i < tokens.length; i += 1) {
      const current = tokens[i];
      const next = tokens[i + 1];
      if (
        current.pos &&
        (current.pos === '動詞' || current.pos === '形容詞') &&
        current.surface_form.length > 1 &&
        (current.surface_form[current.surface_form.length - 1] === 'っ' ||
          current.surface_form[current.surface_form.length - 1] === 'ッ')
      ) {
        if (
          i + 1 < tokens.length &&
          next.pos &&
          (next.pos === '動詞' || next.pos === '助動詞')
        ) {
          current.surface_form += next.surface_form;
          if (current.pronunciation) {
            current.pronunciation += next.pronunciation;
          } else {
            current.pronunciation = `${current.reading}${next.reading}`;
          }
          current.reading += next.reading;
          tokens.splice(i + 1, 1);
          i -= 1;
        }
      }
    }
    return tokens;
  }

  /**
   * Convert a string to katakana
   * @param {String} text Input text
   */
  convertToKatakana(text) {
    return this.parse(text)
      .map((token) => token.reading)
      .join(' ');
  }

  /**
   * Convert a string to romaji
   * @param {String} text Input text
   */
  convertToRomaji(text) {
    return this.toRomaji(
      this.parse(text)
        .map((token) => token.reading)
        .join(' ')
    );
  }

  /**
   * Indicates if the string is a number
   * @param {String} str Input string
   */
  isNumber(str) {
    for (let i = 0; i < str.length; i += 1) {
      if (!'0123456789'.includes(str[i])) {
        return false;
      }
    }
    return true;
  }

  async stem(text, input) {
    await this.init();
    text = input.text;
    let tokens;
    const normalizeFormality =
      input.normalizeFormality === undefined ? true : input.normalizeFormality;
    if (normalizeFormality) {
      tokens = this.formalityLevel(text).informalTokens;
    } else {
      tokens = this.parse(text).map((token) => token.reading);
    }
    tokens = tokens
      .map((token) =>
        token.replace(
          /[＿－・，、；：！？．。（）［］｛｝｢｣＠＊＼／＆＃％｀＾＋＜＝＞｜～≪≫─＄＂_\-･,､;:!?.｡()[\]{}「」@*/&#%`^+<=>|~«»$"\s]+/g,
          ''
        )
      )
      .filter((token) => token !== '');
    const removeNumbers =
      input.removeNumbers === undefined ? true : input.removeNumbers;
    if (removeNumbers) {
      tokens = tokens.filter((x) => !this.isNumber(x));
    }
    const stemMinLength =
      input.stemMinLength === undefined ? 2 : input.stemMinLength;
    tokens = tokens.filter((x) => x.length >= stemMinLength);
    return tokens;
  }

  run(srcInput) {
    const input = srcInput;
    const locale = input.locale || 'en';
    const stemmer = this.container.get(`stemmer-${locale}`) || this;
    input.tokens = stemmer.stem(input.text || input.tokens.join(' '), input);
    return input;
  }

  /**
   * Find a keigo chain and returns the replacement and formality level.
   * @param {String[]} tokens Input tokens
   * @param {Number} pnt Current pointer in the chain
   */
  findKeigo(tokens, pnt) {
    let node = keigo;
    let result;
    let currentPnt = pnt;
    let currentToken = tokens[currentPnt];
    while (currentToken && node[currentToken]) {
      node = node[currentToken];
      if (node.result) {
        result = {
          value: node.result.value,
          keigo: node.result.keigo,
          length: currentPnt - pnt + 1,
        };
      }
      currentPnt += 1;
      currentToken = tokens[currentPnt];
    }
    return result;
  }

  // Informal
  // Keigo (敬語) levels:
  // - Teineigo (丁寧語) (polite)
  // - Sonkeigo (尊敬語) (respectful: raise other status)
  // - Kenjougo (謙譲語) (humble: lower own status)
  formalityLevel(text) {
    const tokens = this.parse(text)
      .map((x) => x.reading)
      .filter((x) => x && x !== ' ');
    const informalTokens = [];
    const counts = {
      keigo: 0,
      teineigo: 0,
      sonkeigo: 0,
      kenjougo: 0,
      informal: 0,
    };
    let pnt = 0;
    while (pnt < tokens.length) {
      const token = tokens[pnt];
      const currentKeigo = this.findKeigo(tokens, pnt);
      if (currentKeigo) {
        if (currentKeigo.keigo !== 'dictionary') {
          counts[currentKeigo.keigo] += 1;
        }
        for (let i = 0; i < currentKeigo.value.length; i += 1) {
          informalTokens.push(currentKeigo.value[i]);
        }
        pnt += currentKeigo.length;
      } else {
        if (['ダ', 'ダッ', 'スル'].includes(token)) {
          counts.informal += 1;
          informalTokens.push(token);
        } else if (token === 'ゴ') {
          counts.keigo += 1;
        } else {
          informalTokens.push(token);
        }
        pnt += 1;
      }
    }
    counts.keigo += counts.sonkeigo + counts.teineigo + counts.kenjougo;
    return {
      tokens,
      informalTokens,
      counts,
      isKeigo: counts.keigo > 0,
    };
  }
}

module.exports = StemmerJa;
