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

const { ConsoleConnector } = require('../../packages/console-connector/src');
const { Nlp } = require('../../packages/nlp/src');
const { LangEn } = require('../../packages/lang-en/src');
const { fs } = require('../../packages/request/src');
const trainnlp = require('./train-nlp');

const nlp = new Nlp({ languages: ['en'], threshold: 0.5 });
nlp.container.register('fs', fs);
nlp.use(LangEn);

const connector = new ConsoleConnector();
connector.onHear = async (parent, line) => {
  if (line.toLowerCase() === 'quit') {
    connector.destroy();
    process.exit();
  } else {
    const result = await nlp.process(line);
    connector.say(result.answer);
  }
};

(async () => {
  await trainnlp(nlp);
  connector.say('Say something!');
})();
