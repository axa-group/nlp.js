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

const { BrainNLU } = require('../../packages/node-nlp/src');
// const { BrainNLU } = require('node-nlp');
const corpus = require('./corpus50.json');

(async () => {
  const nlu = new BrainNLU({ language: 'en' });
  for (let i = 0; i < corpus.data.length; i += 1) {
    const { utterances, intent } = corpus.data[i];
    for (let j = 0; j < utterances.length; j += 1) {
      nlu.add(utterances[j], intent);
    }
  }
  await nlu.train();
  let total = 0;
  let good = 0;
  for (let i = 0; i < corpus.data.length; i += 1) {
    const { tests, intent } = corpus.data[i];
    for (let j = 0; j < tests.length; j += 1) {
      const classification = await nlu.getBestClassification(tests[j]);
      total += 1;
      if (classification.intent === intent) {
        good += 1;
      }
    }
  }
  console.log(`Good: ${good} Total: ${total} Precision: ${good / total}`);
})();
