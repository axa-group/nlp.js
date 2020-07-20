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

const { TfIdf } = require('../src');

describe('TF-IDF', () => {
  describe('tf', () => {
    it('should tf', function () {
      expect(TfIdf.tf('document', { document: 2, one: 1 })).toEqual(2);
      expect(TfIdf.tf('document', { greetings: 1, program: 1 })).toEqual(0);
      expect(TfIdf.tf('program', { greetings: 1, program: 1 })).toEqual(1);
    });
  });

  describe('idfs', () => {
    it('Should calculate correct idf', () => {
      const tfidf = new TfIdf();
      tfidf.addDocument('doc1', 'this document is about node.');
      tfidf.addDocument('doc2', 'this document is about ruby.');
      tfidf.addDocument('doc3', 'this document is about ruby and node.');
      tfidf.addDocument(
        'doc3',
        'this document is about node. it has node examples'
      );
      const idf = tfidf.idf('node');
      expect(idf).toEqual(1);
    });
  });

  describe('tfidfs', () => {
    it('Should resolve simple idfs', () => {
      const tfidf = new TfIdf();
      tfidf.addDocument('doc1', 'document one');
      tfidf.addDocument('doc2', 'document two');
      const result = tfidf.tfidfs('two');
      expect(result.doc1).toEqual(0);
      expect(result.doc2).toEqual(1);
    });
  });

  describe('classify', () => {
    it('Should return tfidf classifications', () => {
      const tfidf = new TfIdf();
      tfidf.addDocument('doc1', 'this document is about node.');
      tfidf.addDocument('doc2', 'this document is about ruby.');
      tfidf.addDocument('doc3', 'this document is about ruby and node.');
      tfidf.addDocument(
        'doc4',
        'this document is about node. it has node examples'
      );
      const nodeResult = tfidf.classify('node');
      expect(nodeResult[0].document).toEqual('doc4');
      expect(nodeResult[0].score).toEqual(2);
      expect(nodeResult[1].document).toEqual('doc1');
      expect(nodeResult[1].score).toEqual(1);
      expect(nodeResult[2].document).toEqual('doc3');
      expect(nodeResult[2].score).toEqual(1);
      expect(nodeResult[3].document).toEqual('doc2');
      expect(nodeResult[3].score).toEqual(0);
      const rubyResult = tfidf.classify('ruby');
      expect(rubyResult[0].document).toEqual('doc2');
      expect(rubyResult[0].score).toEqual(1.2876820724517808);
      expect(rubyResult[1].document).toEqual('doc3');
      expect(rubyResult[1].score).toEqual(1.2876820724517808);
      expect(rubyResult[2].document).toEqual('doc1');
      expect(rubyResult[2].score).toEqual(0);
      expect(rubyResult[3].document).toEqual('doc4');
      expect(rubyResult[3].score).toEqual(0);
    });
  });
});
