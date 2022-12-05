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

const dictionary = require('./dictionary.json');

class TranslateZh {
  constructor() {
    this.both = {};
    for (let i = 0; i < dictionary.both.length; i += 1) {
      this.both[dictionary.both[i]] = true;
    }
    this.st = {};
    this.ts = {};
    for (let i = 0; i < dictionary.simplified.length; i += 1) {
      this.st[dictionary.simplified[i]] = dictionary.traditional[i];
      this.ts[dictionary.traditional[i]] = dictionary.simplified[i];
    }
    for (let i = 0; i < dictionary.simplified2.length; i += 1) {
      this.ts[dictionary.traditional2[i]] = dictionary.simplified2[i];
    }
    this.stPhrases = dictionary.stphrases;
    this.tsPhrases = dictionary.tsphrases;

    this.hkVariants = dictionary.hkvariants;
    this.hkVariantsInverse = this.inversify(this.hkVariants);
    this.hkPhrases = dictionary.hkphrases;
    this.hkPhrasesInverse = this.inversify(this.hkPhrases);
    this.hkRevPhrases = dictionary.hkrevphrases;

    this.twVariants = dictionary.twvariants;
    this.twVariantsInverse = this.inversify(this.twVariants);
    this.twPhrases = dictionary.twphrases;
    this.twPhrasesInverse = this.inversify(this.twPhrases);
    this.twRevPhrases = dictionary.twrevphrases;
  }

  inversify(dict) {
    const keys = Object.keys(dict);
    const result = {};
    for (let i = 0; i < keys.length; i += 1) {
      result[dict[keys[i]]] = keys[i];
    }
    return result;
  }

  canGetSlice(processedPositions, start, currentLength) {
    for (let i = 0; i < currentLength; i += 1) {
      if (processedPositions[start + i]) {
        return false;
      }
    }
    return true;
  }

  createToken(
    text,
    processedPositions,
    start,
    currentLength,
    dialect,
    variant
  ) {
    for (let i = 0; i < currentLength; i += 1) {
      processedPositions[start + i] = true;
    }
    return {
      text,
      start,
      end: start + currentLength - 1,
      length: currentLength,
      dialect,
      variant,
    };
  }

  identifyByLength(sentence, processedPositions, currentLength) {
    const result = [];
    for (let i = 0; i < sentence.length - currentLength; i += 1) {
      if (this.canGetSlice(processedPositions, i, currentLength)) {
        const slice = sentence.slice(i, i + currentLength);
        if (this.hkPhrasesInverse[slice] || this.hkRevPhrases[slice]) {
          result.push(
            this.createToken(
              slice,
              processedPositions,
              i,
              currentLength,
              'traditional',
              'hk'
            )
          );
        } else if (this.twPhrasesInverse[slice] || this.twRevPhrases[slice]) {
          result.push(
            this.createToken(
              slice,
              processedPositions,
              i,
              currentLength,
              'traditional',
              'tw'
            )
          );
        } else if (this.stPhrases[slice]) {
          result.push(
            this.createToken(
              slice,
              processedPositions,
              i,
              currentLength,
              'simplified',
              undefined
            )
          );
        } else if (this.tsPhrases[slice]) {
          result.push(
            this.createToken(
              slice,
              processedPositions,
              i,
              currentLength,
              'traditional',
              undefined
            )
          );
        }
      }
    }
    return result;
  }

  isChineseChar(ch) {
    const regex =
      /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FCC\uF900-\uFA6D\uFA70-\uFAD9]|[\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/g;
    return regex.test(ch);
  }

  identifyByChar(sentence, processedPositions) {
    const tokens = [];
    for (let i = 0; i < sentence.length; i += 1) {
      if (!processedPositions[i]) {
        const char = sentence[i];
        if (this.both[char]) {
          tokens.push(
            this.createToken(char, processedPositions, i, 1, 'both', undefined)
          );
        } else if (this.hkVariantsInverse[char]) {
          tokens.push(
            this.createToken(
              char,
              processedPositions,
              i,
              1,
              'traditional',
              'hk'
            )
          );
        } else if (this.twVariantsInverse[char]) {
          tokens.push(
            this.createToken(
              char,
              processedPositions,
              i,
              1,
              'traditional',
              'tw'
            )
          );
        } else if (this.st[char]) {
          tokens.push(
            this.createToken(
              char,
              processedPositions,
              i,
              1,
              'simplified',
              undefined
            )
          );
        } else if (this.ts[char]) {
          tokens.push(
            this.createToken(
              char,
              processedPositions,
              i,
              1,
              'traditional',
              undefined
            )
          );
        } else {
          tokens.push(
            this.createToken(
              char,
              processedPositions,
              i,
              1,
              this.isChineseChar(char) ? 'both' : 'none',
              undefined
            )
          );
        }
      }
    }
    const result = [];
    if (tokens.length > 0) {
      let currentToken = tokens[0];
      for (let i = 1; i < tokens.length; i += 1) {
        const token = tokens[i];
        if (
          token.dialect === currentToken.dialect &&
          token.variant === currentToken.variant
        ) {
          currentToken.text += token.text;
          currentToken.end += 1;
          currentToken.length += 1;
        } else {
          result.push(currentToken);
          currentToken = token;
        }
      }
      result.push(currentToken);
    }
    return result;
  }

  identify(sentence) {
    const processedPositions = [];
    for (let i = 0; i < sentence.length; i += 1) {
      processedPositions.push(false);
    }
    const tokens = [];
    for (let i = 10; i >= 2; i -= 1) {
      const current = this.identifyByLength(sentence, processedPositions, i);
      for (let j = 0; j < current.length; j += 1) {
        tokens.push(current[j]);
      }
    }
    const byChar = this.identifyByChar(sentence, processedPositions);
    for (let j = 0; j < byChar.length; j += 1) {
      tokens.push(byChar[j]);
    }
    const result = {
      tokens,
      simplifiedCount: 0,
      traditionalCount: 0,
      hkCount: 0,
      twCount: 0,
      noneCount: 0,
      bothCount: 0,
    };
    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i];
      if (token.dialect === 'none') {
        result.noneCount += token.length;
      } else if (token.dialect === 'both') {
        result.bothCount += token.length;
      } else if (token.dialect === 'traditional') {
        result.traditionalCount += token.length;
        if (token.variant === 'hk') {
          result.hkCount += token.length;
        } else if (token.variant === 'tw') {
          result.twCount += token.length;
        }
      } else if (token.dialect === 'simplified') {
        result.simplifiedCount += token.length;
      }
    }
    if (result.simplifiedCount > result.traditionalCount) {
      result.dialect = 'simplified';
      result.variant = 'none';
    } else if (result.traditionalCount > result.simplifiedCount) {
      result.dialect = 'traditional';
      if (result.hkCount > result.twCount) {
        result.variant = 'hk';
      } else if (result.twCount > result.hkCount) {
        result.variant = 'tw';
      } else if (result.hkCount > 0) {
        result.variant = 'both';
      } else {
        result.variant = 'none';
      }
    } else if (result.bothCount > 0 || result.simplifiedCount > 0) {
      result.dialect = 'both';
      result.variant = 'none';
    } else {
      result.dialect = 'none';
      result.variant = 'none';
    }
    return result;
  }

  findIndDict(text, start, dictionaries) {
    if (!Array.isArray(dictionaries)) {
      dictionaries = [dictionaries];
    }
    for (let i = 10; i > 0; i -= 1) {
      const slice = text.substr(start, i);
      for (let j = 0; j < dictionaries.length; j += 1) {
        const dict = dictionaries[j];
        if (dict[slice]) {
          return {
            source: slice,
            target: dict[slice],
          };
        }
      }
    }
    return undefined;
  }

  translateByDict(text, dict) {
    const translated = [];
    for (let i = 0; i < text.length; i += 1) {
      const token = this.findIndDict(text, i, dict);
      if (token) {
        translated.push(token.target);
        i += token.source.length - 1;
      } else {
        translated.push(text[i]);
      }
    }
    return translated.join('');
  }

  translateChain(text, dictionaries) {
    let result = text;
    for (let i = 0; i < dictionaries.length; i += 1) {
      result = this.translateByDict(result, dictionaries[i]);
    }
    return result;
  }

  simplifiedToTraditional(text) {
    return this.translateChain(text, [[this.stPhrases, this.st]]);
  }

  simplifiedToHongKong(text) {
    return this.translateChain(text, [
      [this.stPhrases, this.st],
      [this.hkPhrases, this.hkVariants],
    ]);
  }

  simplifiedToTaiwan(text) {
    return this.translateChain(text, [
      [this.stPhrases, this.st],
      [this.twPhrases, this.twVariants],
    ]);
  }

  hongKongToSimplified(text) {
    return this.translateChain(text, [
      [this.hkRevPhrases, this.hkVariantsInverse],
      [this.tsPhrases, this.ts],
    ]);
  }

  traditionalToHongKong(text) {
    return this.translateChain(text, [this.hkVariants]);
  }

  hongKongToTraditional(text) {
    return this.translateChain(text, [this.hkVariantsInverse]);
  }

  traditionalToSimplified(text) {
    return this.translateChain(text, [[this.tsPhrases, this.ts]]);
  }

  traditionalToTaiwan(text) {
    return this.translateChain(text, [this.twVariants]);
  }

  taiwanToTraditional(text) {
    return this.translateChain(text, [this.twVariantsInverse]);
  }

  taiwanToSimplified(text) {
    return this.translateChain(text, [
      [this.twRevPhrases, this.twVariantsInverse],
      [this.twPhrasesInverse],
      [this.tsPhrases, this.ts],
    ]);
  }

  simplifiedTo(text, target) {
    switch (target) {
      case 'simplified':
        return text;
      case 'traditional':
        return this.simplifiedToTraditional(text);
      case 'hk':
        return this.simplifiedToHongKong(text);
      case 'tw':
        return this.simplifiedToTaiwan(text);
      default:
        throw new Error(
          `Cannot convert to "${target}". Available options are "simplified", "traditional", "hk" and "tw"`
        );
    }
  }

  traditionalTo(text, target) {
    switch (target) {
      case 'simplified':
        return this.traditionalToSimplified(text);
      case 'traditional':
        return text;
      case 'hk':
        return this.traditionalToHongKong(text);
      case 'tw':
        return this.traditionalToTaiwan(text);
      default:
        throw new Error(
          `Cannot convert to "${target}". Available options are "simplified", "traditional", "hk" and "tw"`
        );
    }
  }

  hkTo(text, target) {
    switch (target) {
      case 'simplified':
        return this.hongKongToSimplified(text);
      case 'traditional':
        return this.hongKongToTraditional(text);
      case 'hk':
        return text;
      case 'tw':
        return this.traditionalToTaiwan(this.hongKongToTraditional(text));
      default:
        throw new Error(
          `Cannot convert to "${target}". Available options are "simplified", "traditional", "hk" and "tw"`
        );
    }
  }

  twTo(text, target) {
    switch (target) {
      case 'simplified':
        return this.taiwanToSimplified(text);
      case 'traditional':
        return this.taiwanToTraditional(text);
      case 'hk':
        return this.traditionalToHongKong(this.taiwanToTraditional(text));
      case 'tw':
        return text;
      default:
        throw new Error(
          `Cannot convert to "${target}". Available options are "simplified", "traditional", "hk" and "tw"`
        );
    }
  }

  translate(text, source, target) {
    if (!target) {
      target = source;
      const identification = this.identify(text);
      if (identification.dialect === 'none') {
        return text;
      }
      if (
        identification.dialect === 'simplified' ||
        identification.dialect === 'both'
      ) {
        source = 'simplified';
      } else if (identification.variant === 'hk') {
        source = 'hk';
      } else if (identification.variant === 'tw') {
        source = 'tw';
      } else {
        source = 'traditional';
      }
    }
    switch (source) {
      case 'simplified':
        return this.simplifiedTo(text, target);
      case 'traditional':
        return this.traditionalTo(text, target);
      case 'hk':
        return this.hkTo(text, target);
      case 'tw':
        return this.twTo(text, target);
      default:
        throw new Error(
          `Cannot convert from "${source}". Available options are "simplified", "traditional", "hk" and "tw"`
        );
    }
  }
}

module.exports = TranslateZh;
