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

const { Clonable } = require('@nlpjs/core');

class BertWordPieceTokenizer extends Clonable {
  constructor(settings = {}) {
    super({ settings: {}, container: settings.container });
    this.lowercase = settings.lowercase;
    this.configuration = {
      clsToken: '[CLS]',
      maskToken: '[MASK]',
      padToken: '[PAD]',
      sepToken: '[SEP]',
      unkToken: '[UNK]',
    };
    this.tokenPositions = {
      clsToken: 101,
      maskToken: 103,
      padToken: 0,
      sepToken: 102,
      unkToken: 100,
    };
    if (settings.vocabContent) {
      this.loadDictionary(settings.vocabContent);
    }
  }

  loadDictionary(inputVocabContent) {
    let vocabContent = inputVocabContent;
    if (typeof vocabContent === 'string') {
      vocabContent = vocabContent.split(/\r?\n/);
    }
    this.words = {};
    this.extra = {};
    this.affixes = {};
    this.affixMaxLength = 0;
    for (let i = 0; i < vocabContent.length; i += 1) {
      const word = vocabContent[i];
      this.words[word] = i;
      if (word.startsWith('##')) {
        const affix = word.slice(2);
        if (affix.length > this.affixMaxLength) {
          this.affixMaxLength = affix.length;
        }
        this.affixes[affix] = i;
      }
    }
    this.numWords = Object.keys(this.words).length;
    this.numExtra = 0;
    Object.keys(this.configuration).forEach((tokenName) => {
      this.tokenPositions[tokenName] =
        this.words[this.configuration[tokenName]];
    });
  }

  createToken(text, start, srcType) {
    let type = srcType;
    if (!type) {
      type = ['\r', '\n', ' ', '\t'].includes(text) ? 'space' : 'separator';
    }
    return {
      token: text,
      start,
      end: start + text.length - 1,
      type,
    };
  }

  splitSentence(str) {
    const normalized = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const result = [];
    const regex = /\W+/g;
    let match;
    let lastEnd = 0;
    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(normalized))) {
      const chars = match[0].split('');
      for (let i = 0; i < chars.length; i += 1) {
        const token = this.createToken(chars[i], match.index + i);
        if (token.start > lastEnd) {
          const wordToken = this.createToken(
            str.slice(lastEnd, token.start),
            lastEnd,
            'word'
          );
          result.push(wordToken);
        }
        result.push(token);
        lastEnd = token.end + 1;
      }
    }
    if (lastEnd < str.length) {
      result.push(
        this.createToken(str.slice(lastEnd, str.length), lastEnd, 'word')
      );
    }
    return result;
  }

  getBestAffix(word) {
    const maxLength = Math.min(word.length - 1, this.affixMaxLength);
    for (let i = maxLength; i > 0; i -= 1) {
      const current = word.slice(-i);
      if (this.affixes[current]) {
        return current;
      }
    }
    return undefined;
  }

  tokenizeWord(srcWord, useExtra = false) {
    const word = this.lowercase ? srcWord.toLowerCase() : srcWord;
    const result = {
      tokens: [],
      ids: [],
    };
    const wordIndex = this.words[word];
    if (wordIndex !== undefined) {
      result.tokens.push(word);
      result.ids.push(wordIndex);
      return result;
    }
    const bestAffix = this.getBestAffix(word);
    if (!bestAffix) {
      if (useExtra) {
        const index = this.numWords + this.numExtra;
        this.extra[word] = index;
        this.numExtra += 1;
        result.tokens.push(word);
        result.ids.push(index);
      } else {
        result.tokens.push(this.configuration.unkToken);
        result.ids.push(this.tokenPositions.unkToken);
      }
      return result;
    }
    const newWord = word.slice(0, -bestAffix.length);
    const newWordTokens = this.tokenizeWord(newWord, useExtra);
    for (let i = 0; i < newWordTokens.tokens.length; i += 1) {
      result.tokens.push(newWordTokens.tokens[i]);
      result.ids.push(newWordTokens.ids[i]);
    }
    const text = `##${bestAffix}`;
    result.tokens.push(text);
    result.ids.push(this.words[text]);
    return result;
  }

  tokenizeSentence(sentence, useExtra = false) {
    const result = {
      ids: [],
      offsets: [],
      tokens: [],
    };
    if (!sentence) {
      return result;
    }
    const sentenceTokens = this.splitSentence(sentence);
    for (let i = 0; i < sentenceTokens.length; i += 1) {
      const currentToken = sentenceTokens[i];
      if (currentToken.type !== 'space') {
        let { start } = currentToken;
        const wordTokens = this.tokenizeWord(currentToken.token, useExtra);
        for (let j = 0; j < wordTokens.tokens.length; j += 1) {
          const currentValue = wordTokens.tokens[j];
          const currentValueLength = currentValue.startsWith('##')
            ? currentValue.length - 2
            : currentValue.length;
          result.ids.push(wordTokens.ids[j]);
          result.tokens.push(wordTokens.tokens[j]);
          result.offsets.push([start, start + currentValueLength]);
          start += currentValueLength;
        }
      }
    }
    return result;
  }

  insertEncoding(
    encodings,
    id,
    token,
    offset,
    isContext,
    wordIndex,
    isFilling
  ) {
    encodings.ids.push(id);
    encodings.tokens.push(token);
    encodings.offsets.push(offset || [0, 0]);
    const isSpecial = token.startsWith('[') && token.endsWith(']');
    encodings.specialTokensMask.push(isSpecial ? 1 : 0);
    encodings.typeIds.push(isContext ? 1 : 0);
    encodings.wordIndexes.push(wordIndex === undefined ? null : wordIndex);
    encodings.attentionMask.push(isFilling ? 0 : 1);
  }

  encodeQuestion(question, useExtra = false) {
    const result = {
      attentionMask: [],
      ids: [],
      offsets: [],
      specialTokensMask: [],
      tokens: [],
      typeIds: [],
      wordIndexes: [],
      overflowing: [],
    };
    this.insertEncoding(
      result,
      this.tokenPositions.clsToken,
      this.configuration.clsToken,
      undefined,
      false
    );
    const questionTokens = this.tokenizeSentence(question, useExtra);
    let wordIndex = 0;
    for (let i = 0; i < questionTokens.tokens.length; i += 1) {
      this.insertEncoding(
        result,
        questionTokens.ids[i],
        questionTokens.tokens[i],
        questionTokens.offsets[i],
        false,
        wordIndex
      );
      wordIndex += 1;
    }
    this.insertEncoding(
      result,
      this.tokenPositions.sepToken,
      this.configuration.sepToken,
      undefined,
      false
    );
    return result;
  }

  getLastWordIndex(encodings) {
    for (let i = encodings.wordIndexes.length - 1; i >= 0; i -= 1) {
      const wordIndex = encodings.wordIndexes[i];
      if (wordIndex !== null && wordIndex !== undefined) {
        return wordIndex;
      }
    }
    return null;
  }

  encode(
    question,
    context,
    expectedMinLength,
    expectedMaxLength,
    useExtra = false
  ) {
    const result = this.encodeQuestion(question, useExtra);
    let wordIndex = this.getLastWordIndex(result);
    if (wordIndex === null) {
      wordIndex = 0;
    } else {
      wordIndex += 1;
    }
    if (context) {
      const contextTokens = this.tokenizeSentence(context, useExtra);
      for (let i = 0; i < contextTokens.tokens.length; i += 1) {
        this.insertEncoding(
          result,
          contextTokens.ids[i],
          contextTokens.tokens[i],
          contextTokens.offsets[i],
          true,
          wordIndex
        );
        wordIndex += 1;
      }
      this.insertEncoding(
        result,
        this.tokenPositions.sepToken,
        this.configuration.sepToken,
        undefined,
        true
      );
    }
    if (expectedMinLength) {
      while (result.tokens.length < expectedMinLength) {
        this.insertEncoding(
          result,
          this.tokenPositions.padToken,
          this.configuration.padToken,
          undefined,
          false,
          undefined,
          true
        );
      }
    }
    if (expectedMaxLength && result.tokens.length > expectedMaxLength) {
      Object.keys(result).forEach((key) => {
        if (Array.isArray(result[key])) {
          result[key] = result[key].slice(0, expectedMaxLength);
        }
      });
    }
    result.length = result.tokens.length;
    return result;
  }

  cloneEncoding(encoding) {
    const result = {};
    Object.keys(encoding).forEach((key) => {
      if (Array.isArray(encoding[key])) {
        result[key] = encoding[key].slice();
      } else {
        result[key] = encoding[key];
      }
    });
    return result;
  }

  encodeSliced(
    question,
    context,
    sliceSize = 384,
    padding = 0.5,
    useExtra = false
  ) {
    const result = [];
    const encodedQuestion = this.encodeQuestion(question, useExtra);
    const questionLastWordIndex = this.getLastWordIndex(encodedQuestion);
    const contextTokens = this.tokenizeSentence(context, useExtra);
    const questionLength = encodedQuestion.ids.length;
    const paddingLength = Math.floor((sliceSize - questionLength) * padding);
    if (paddingLength <= 0) {
      throw new Error(`There is not enough padding with this slice size`);
    }
    let pendingSize = contextTokens.ids.length;
    let offset = 0;
    while (pendingSize > 0) {
      const currentSlice = this.cloneEncoding(encodedQuestion);
      let i = offset;
      let wordIndex = questionLastWordIndex;
      if (wordIndex === null) {
        wordIndex = 0;
      } else {
        wordIndex += 1;
      }
      while (currentSlice.ids.length < sliceSize) {
        if (i < contextTokens.ids.length) {
          this.insertEncoding(
            currentSlice,
            contextTokens.ids[i],
            contextTokens.tokens[i],
            contextTokens.offsets[i],
            true,
            wordIndex
          );
        } else {
          this.insertEncoding(
            currentSlice,
            this.tokenPositions.padToken,
            this.configuration.padToken,
            undefined,
            false,
            undefined,
            true
          );
        }
        wordIndex += 1;
        i += 1;
      }
      currentSlice.length = sliceSize;
      result.push(currentSlice);
      offset += paddingLength;
      pendingSize -= paddingLength;
    }
    return result;
  }
}

module.exports = BertWordPieceTokenizer;
