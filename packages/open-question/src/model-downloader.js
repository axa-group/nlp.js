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
const { Downloader, getAbsolutePath } = require('@nlpjs/utils');
const { DEFAULT_ASSETS_DIR } = require('./constants');

class ModelDownloader {
  constructor(settings = {}) {
    this.baseUrl = settings.baseUrl || 'https://cdn.huggingface.co';
    this.dir = getAbsolutePath(settings.dir || DEFAULT_ASSETS_DIR);
    this.downloader = new Downloader({
      proxy: settings.proxy,
      dir: this.dir,
      replicateAllFolders: true,
      replaceIfExists: false,
    });
  }

  async download(name) {
    const url = `${this.baseUrl}/${name}`;
    const separator = name.endsWith('-') ? '' : '/';
    await this.downloader.download(`${url}${separator}saved_model.tar.gz`);
    await this.downloader.download(`${url}${separator}vocab.txt`);
    await this.downloader.download(`${url}${separator}tokenizer_config.json`);
    await this.downloader.download(`${url}${separator}special_tokens_map.json`);
    return path.join(this.dir, name);
  }
}

module.exports = ModelDownloader;
