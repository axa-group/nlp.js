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

const Tokenizer = require('./tokenizer');
const ChineseTokenizer = require('./chinese-tokenizer');
const PunctTokenizer = require('./punct-tokenizer');
const TreebankWordTokenizer = require('./treebank-word-tokenizer');
const AggressiveTokenizer = require('./aggressive-tokenizer');
const AggressiveTokenizerBn = require('./aggressive-tokenizer-bn');
const AggressiveTokenizerEn = require('./aggressive-tokenizer-en');
const AggressiveTokenizerFa = require('./aggressive-tokenizer-fa');
const AggressiveTokenizerFr = require('./aggressive-tokenizer-fr');
const AggressiveTokenizerRu = require('./aggressive-tokenizer-ru');
const AggressiveTokenizerEl = require('./aggressive-tokenizer-el');
const AggressiveTokenizerEs = require('./aggressive-tokenizer-es');
const AggressiveTokenizerGl = require('./aggressive-tokenizer-gl');
const AggressiveTokenizerHi = require('./aggressive-tokenizer-hi');
const AggressiveTokenizerId = require('./aggressive-tokenizer-id');
const AggressiveTokenizerIt = require('./aggressive-tokenizer-it');
const AggressiveTokenizerNl = require('./aggressive-tokenizer-nl');
const AggressiveTokenizerNo = require('./aggressive-tokenizer-no');
const AggressiveTokenizerPt = require('./aggressive-tokenizer-pt');
const AggressiveTokenizerPl = require('./aggressive-tokenizer-pl');
const AggressiveTokenizerSv = require('./aggressive-tokenizer-sv');
const AggressiveTokenizerTl = require('./aggressive-tokenizer-tl');
const AggressiveTokenizerUk = require('./aggressive-tokenizer-uk');
const DefaultTokenizer = require('./default-tokenizer');
const ThaiTokenizer = require('./thai-tokenizer');
const TokenizerJa = require('./tokenizer-ja');

module.exports = {
  Tokenizer,
  ChineseTokenizer,
  PunctTokenizer,
  TreebankWordTokenizer,
  AggressiveTokenizer,
  AggressiveTokenizerBn,
  AggressiveTokenizerEn,
  AggressiveTokenizerFa,
  AggressiveTokenizerFr,
  AggressiveTokenizerRu,
  AggressiveTokenizerEl,
  AggressiveTokenizerEs,
  AggressiveTokenizerGl,
  AggressiveTokenizerHi,
  AggressiveTokenizerId,
  AggressiveTokenizerIt,
  AggressiveTokenizerNl,
  AggressiveTokenizerNo,
  AggressiveTokenizerPt,
  AggressiveTokenizerPl,
  AggressiveTokenizerSv,
  AggressiveTokenizerTl,
  AggressiveTokenizerUk,
  DefaultTokenizer,
  ThaiTokenizer,
  TokenizerJa,
};
