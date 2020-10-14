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

const { containerBootstrap } = require('../../packages/core/src');
const { Nlp } = require('../../packages/nlp/src');
// const { containerBootstrap } = require('@nlpjs/core');
// const { Nlp } = require('@nlpjs/nlp');

async function measureCorpus(corpus, plugins) {
  const container = await containerBootstrap();
  container.use(Nlp);
  if (plugins) {
    plugins.forEach((plugin) => {
      container.use(plugin);
    });
  }
  const nlp = container.get('nlp');
  nlp.settings.threshold = 0;
  nlp.settings.autoSave = false;
  await nlp.addCorpus(corpus);
  await nlp.train();
  let total = 0;
  let goodThreshold = 0;
  let goodNoThreshold = 0;
  for (let i = 0; i < corpus.data.length; i += 1) {
    const item = corpus.data[i];
    for (let j = 0; j < item.tests.length; j += 1) {
      const test = item.tests[j];
      total += 1;
      nlp.settings.threshold = 0;
      let result = await nlp.process(test);
      if (result.intent === item.intent) {
        goodNoThreshold += 1;
      } else {
        console.log(`${result.intent} ${item.intent} ${test}`);
      }
      nlp.settings.threshold = 0.5;
      result = await nlp.process(test);
      if (result.intent === item.intent) {
        goodThreshold += 1;
      }
    }
  }
  console.log(`Total tests executed: ${total}`);
  console.log(`Total intents guessed correctly: ${goodNoThreshold}`);
  console.log(
    `Total intents guessed correctly with score >= 0.5: ${goodThreshold}`
  );
  console.log(
    `Precision without threshold: ${(goodNoThreshold * 100) / total}%`
  );
  console.log(`Precision with threshold: ${(goodThreshold * 100) / total}%`);
}

module.exports = measureCorpus;
