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

const ModelDownloader = require('./model-downloader');
const { ModelInput } = require('./constants');
const Runtime = require('./runtime');

class Model {
  constructor(name, dir, proxy) {
    this.downloader = new ModelDownloader({ dir, proxy });
    this.name = name;
  }

  async start() {
    this.path = await this.downloader.download(this.name);
    const runtimeOptions = {
      inputs: [
        ModelInput.AttentionMask,
        ModelInput.Ids,
        ModelInput.TokenTypeIds,
      ],
      path: this.path,
    };
    this.runtime = new Runtime(runtimeOptions);
    await this.runtime.start();
    [, this.inputLength] = this.runtime.params.shape;
  }

  runInference(encodings) {
    return this.runtime.runInference(
      encodings.map((e) => e.ids),
      encodings.map((e) => e.attentionMask),
      encodings.map((e) => e.typeIds)
    );
  }

  stop() {
    this.runtime.stop();
  }
}

module.exports = Model;
