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

const {
  LangAr,
  NormalizerAr,
  StemmerAr,
  StopwordsAr,
  TokenizerAr,
} = require('@nlpjs/lang-ar');
const {
  LangBn,
  NormalizerBn,
  StemmerBn,
  StopwordsBn,
  TokenizerBn,
} = require('@nlpjs/lang-bn');
const {
  LangCa,
  NormalizerCa,
  StemmerCa,
  StopwordsCa,
  TokenizerCa,
} = require('@nlpjs/lang-ca');
const {
  LangCs,
  NormalizerCs,
  StemmerCs,
  StopwordsCs,
  TokenizerCs,
} = require('@nlpjs/lang-cs');
const {
  LangDa,
  NormalizerDa,
  StemmerDa,
  StopwordsDa,
  TokenizerDa,
} = require('@nlpjs/lang-da');
const {
  LangDe,
  NormalizerDe,
  StemmerDe,
  StopwordsDe,
  TokenizerDe,
} = require('@nlpjs/lang-de');
const {
  LangEl,
  NormalizerEl,
  StemmerEl,
  StopwordsEl,
  TokenizerEl,
} = require('@nlpjs/lang-el');
const {
  LangEn,
  NormalizerEn,
  StemmerEn,
  StopwordsEn,
  TokenizerEn,
} = require('@nlpjs/lang-en');
const {
  LangEs,
  NormalizerEs,
  StemmerEs,
  StopwordsEs,
  TokenizerEs,
} = require('@nlpjs/lang-es');
const {
  LangEu,
  NormalizerEu,
  StemmerEu,
  StopwordsEu,
  TokenizerEu,
} = require('@nlpjs/lang-eu');
const {
  LangFa,
  NormalizerFa,
  StemmerFa,
  StopwordsFa,
  TokenizerFa,
} = require('@nlpjs/lang-fa');
const {
  LangFi,
  NormalizerFi,
  StemmerFi,
  StopwordsFi,
  TokenizerFi,
} = require('@nlpjs/lang-fi');
const {
  LangFr,
  NormalizerFr,
  StemmerFr,
  StopwordsFr,
  TokenizerFr,
} = require('@nlpjs/lang-fr');
const {
  LangGa,
  NormalizerGa,
  StemmerGa,
  StopwordsGa,
  TokenizerGa,
} = require('@nlpjs/lang-ga');
const {
  LangGl,
  NormalizerGl,
  StemmerGl,
  StopwordsGl,
  TokenizerGl,
} = require('@nlpjs/lang-gl');
const {
  LangHi,
  NormalizerHi,
  StemmerHi,
  StopwordsHi,
  TokenizerHi,
} = require('@nlpjs/lang-hi');
const {
  LangHu,
  NormalizerHu,
  StemmerHu,
  StopwordsHu,
  TokenizerHu,
} = require('@nlpjs/lang-hu');
const {
  LangHy,
  NormalizerHy,
  StemmerHy,
  StopwordsHy,
  TokenizerHy,
} = require('@nlpjs/lang-hy');
const {
  LangId,
  NormalizerId,
  StemmerId,
  StopwordsId,
  TokenizerId,
} = require('@nlpjs/lang-id');
const {
  LangIt,
  NormalizerIt,
  StemmerIt,
  StopwordsIt,
  TokenizerIt,
} = require('@nlpjs/lang-it');
const {
  LangJa,
  NormalizerJa,
  StemmerJa,
  StopwordsJa,
  TokenizerJa,
} = require('@nlpjs/lang-ja');
const {
  LangNl,
  NormalizerNl,
  StemmerNl,
  StopwordsNl,
  TokenizerNl,
} = require('@nlpjs/lang-nl');
const {
  LangNo,
  NormalizerNo,
  StemmerNo,
  StopwordsNo,
  TokenizerNo,
} = require('@nlpjs/lang-no');
const {
  LangPt,
  NormalizerPt,
  StemmerPt,
  StopwordsPt,
  TokenizerPt,
} = require('@nlpjs/lang-pt');
const {
  LangRo,
  NormalizerRo,
  StemmerRo,
  StopwordsRo,
  TokenizerRo,
} = require('@nlpjs/lang-ro');
const {
  LangRu,
  NormalizerRu,
  StemmerRu,
  StopwordsRu,
  TokenizerRu,
} = require('@nlpjs/lang-ru');
const {
  LangSl,
  NormalizerSl,
  StemmerSl,
  StopwordsSl,
  TokenizerSl,
} = require('@nlpjs/lang-sl');
const {
  LangSv,
  NormalizerSv,
  StemmerSv,
  StopwordsSv,
  TokenizerSv,
} = require('@nlpjs/lang-sv');
const {
  LangTa,
  NormalizerTa,
  StemmerTa,
  StopwordsTa,
  TokenizerTa,
} = require('@nlpjs/lang-ta');
const {
  LangTh,
  NormalizerTh,
  StemmerTh,
  StopwordsTh,
  TokenizerTh,
} = require('@nlpjs/lang-th');
const {
  LangTl,
  NormalizerTl,
  StemmerTl,
  StopwordsTl,
  TokenizerTl,
} = require('@nlpjs/lang-tl');
const {
  LangTr,
  NormalizerTr,
  StemmerTr,
  StopwordsTr,
  TokenizerTr,
} = require('@nlpjs/lang-tr');
const {
  LangUk,
  NormalizerUk,
  StemmerUk,
  StopwordsUk,
  TokenizerUk,
} = require('@nlpjs/lang-uk');
const {
  LangZh,
  NormalizerZh,
  StemmerZh,
  StopwordsZh,
  TokenizerZh,
} = require('@nlpjs/lang-zh');
const LangAll = require('./lang-all');

module.exports = {
  LangAll,

  LangAr,
  NormalizerAr,
  StemmerAr,
  StopwordsAr,
  TokenizerAr,

  LangBn,
  NormalizerBn,
  StemmerBn,
  StopwordsBn,
  TokenizerBn,

  LangCa,
  NormalizerCa,
  StemmerCa,
  StopwordsCa,
  TokenizerCa,

  LangCs,
  NormalizerCs,
  StemmerCs,
  StopwordsCs,
  TokenizerCs,

  LangDa,
  NormalizerDa,
  StemmerDa,
  StopwordsDa,
  TokenizerDa,

  LangDe,
  NormalizerDe,
  StemmerDe,
  StopwordsDe,
  TokenizerDe,

  LangEl,
  NormalizerEl,
  StemmerEl,
  StopwordsEl,
  TokenizerEl,

  LangEn,
  NormalizerEn,
  StemmerEn,
  StopwordsEn,
  TokenizerEn,

  LangEs,
  NormalizerEs,
  StemmerEs,
  StopwordsEs,
  TokenizerEs,

  LangEu,
  NormalizerEu,
  StemmerEu,
  StopwordsEu,
  TokenizerEu,

  LangFa,
  NormalizerFa,
  StemmerFa,
  StopwordsFa,
  TokenizerFa,

  LangFi,
  NormalizerFi,
  StemmerFi,
  StopwordsFi,
  TokenizerFi,

  LangFr,
  NormalizerFr,
  StemmerFr,
  StopwordsFr,
  TokenizerFr,

  LangGa,
  NormalizerGa,
  StemmerGa,
  StopwordsGa,
  TokenizerGa,

  LangGl,
  NormalizerGl,
  StemmerGl,
  StopwordsGl,
  TokenizerGl,

  LangHi,
  NormalizerHi,
  StemmerHi,
  StopwordsHi,
  TokenizerHi,

  LangHu,
  NormalizerHu,
  StemmerHu,
  StopwordsHu,
  TokenizerHu,

  LangHy,
  NormalizerHy,
  StemmerHy,
  StopwordsHy,
  TokenizerHy,

  LangIt,
  NormalizerIt,
  StemmerIt,
  StopwordsIt,
  TokenizerIt,

  LangId,
  NormalizerId,
  StemmerId,
  StopwordsId,
  TokenizerId,

  LangJa,
  NormalizerJa,
  StemmerJa,
  StopwordsJa,
  TokenizerJa,

  LangNl,
  NormalizerNl,
  StemmerNl,
  StopwordsNl,
  TokenizerNl,

  LangNo,
  NormalizerNo,
  StemmerNo,
  StopwordsNo,
  TokenizerNo,

  LangPt,
  NormalizerPt,
  StemmerPt,
  StopwordsPt,
  TokenizerPt,

  LangRo,
  NormalizerRo,
  StemmerRo,
  StopwordsRo,
  TokenizerRo,

  LangRu,
  NormalizerRu,
  StemmerRu,
  StopwordsRu,
  TokenizerRu,

  LangSl,
  NormalizerSl,
  StemmerSl,
  StopwordsSl,
  TokenizerSl,

  LangSv,
  NormalizerSv,
  StemmerSv,
  StopwordsSv,
  TokenizerSv,

  LangTa,
  NormalizerTa,
  StemmerTa,
  StopwordsTa,
  TokenizerTa,

  LangTh,
  NormalizerTh,
  StemmerTh,
  StopwordsTh,
  TokenizerTh,

  LangTl,
  NormalizerTl,
  StemmerTl,
  StopwordsTl,
  TokenizerTl,

  LangTr,
  NormalizerTr,
  StemmerTr,
  StopwordsTr,
  TokenizerTr,

  LangUk,
  NormalizerUk,
  StemmerUk,
  StopwordsUk,
  TokenizerUk,

  LangZh,
  NormalizerZh,
  StemmerZh,
  StopwordsZh,
  TokenizerZh,
};
