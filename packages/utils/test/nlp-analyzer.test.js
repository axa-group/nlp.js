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

const path = require('path');
const fs = require('fs');
const { NlpAnalyzer } = require('../src');

const corpus = {
  name: 'test',
  locale: 'en-US',
  data: [
    {
      intent: 'intent1',
      utterances: ['utterance1-1'],
      tests: ['test1-1', 'test1-2'],
    },
    {
      intent: 'intent2',
      utterances: ['utterance2-1'],
      tests: ['test2-1', 'test2-2', 'test2-3'],
    },
  ],
};

function train() {
  return {};
}

function process(test) {
  return {
    classifications: [
      { intent: test === 'test2-1' ? 'intent2' : 'intent1', score: 0.9 },
      { intent: test === 'test2-1' ? 'intent1' : 'intent2', score: 0.2 },
    ],
  };
}

describe('NLP Analyzer', () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      const analyzer = new NlpAnalyzer({ threshold: 0.2 });
      expect(analyzer).toBeDefined();
      expect(analyzer.threshold).toEqual(0.2);
    });
  });

  describe('analyze', () => {
    it('Should return an analysis', async () => {
      const analyzer = new NlpAnalyzer();
      const analysis = await analyzer.analyze(corpus, train, process);
      expect(analysis).toBeDefined();
    });
  });

  describe('generate excel', () => {
    it('Should generate an excel file', async () => {
      const analyzer = new NlpAnalyzer();
      const analysis = await analyzer.analyze(corpus, train, process);
      const fileName = path.join(__dirname, './test-excel.xlsx');
      await analyzer.generateExcel(fileName, analysis);
      const exists = fs.existsSync(fileName);
      expect(exists).toBeTruthy();
      if (exists) {
        fs.unlinkSync(fileName);
      }
    });
  });
});
