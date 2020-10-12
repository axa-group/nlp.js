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

const { Container } = require('../../../packages/core/src');
const { SentimentAnalyzer } = require('../../../packages/sentiment/src');
const { LangId } = require('../../../packages/lang-id/src');
// const { Container } = require('@nlpjs/core');
// const { SentimentAnalyzer } = require('@nlpjs/sentiment');
// const { LangId } = require('@nlpjs/lang-id');

(async () => {
  const container = new Container();
  container.use(LangId);
  const sentiment = new SentimentAnalyzer({ container });
  const result = await sentiment.process({
    locale: 'id',
    text: 'kucing itu mengagumkan',
  });
  console.log(result.sentiment);
})();
// output:
// {
//   score: 4,
//   numWords: 3,
//   numHits: 1,
//   average: 1.3333333333333333,
//   type: 'afinn',
//   locale: 'id',
//   vote: 'positive'
// }
