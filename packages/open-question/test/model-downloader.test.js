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
const { ModelDownloader } = require('../src');

describe('Model Downloader', () => {
  describe('constructor', () => {
    test('It should create an instance', () => {
      const downloader = new ModelDownloader();
      expect(downloader).toBeDefined();
      expect(downloader.baseUrl).toEqual('https://cdn.huggingface.co');
      expect(downloader.downloader).toBeDefined();
    });
  });

  describe('download', () => {
    test('It should return the path of the model', async () => {
      const name = 'henryk/bert-base-multilingual-cased-finetuned-dutch-squad2';
      const downloader = new ModelDownloader({
        dir: path.join(__filename, '../.models'),
      });
      const actual = await downloader.download(name);
      expect(
        actual.endsWith('bert-base-multilingual-cased-finetuned-dutch-squad2')
      ).toEqual(true);
    });
  });
});
