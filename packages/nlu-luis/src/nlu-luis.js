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

const { Nlu } = require('@nlpjs/nlu');
const https = require('https');
const url = require('url');
const querystring = require('querystring');

class NluLuis extends Nlu {
  constructor(settings, container) {
    super(settings, container);
    this.url = url.parse(this.settings.luisUrl || '');
    this.port = this.url.port || 443;
  }

  innerTrain(srcInput) {
    const input = srcInput;
    return input;
  }

  request(utterance) {
    return new Promise((resolve, reject) => {
      const options = {
        host: this.url.hostname,
        port: this.port,
        method: 'GET',
        path: `${this.url.path}${querystring.escape(utterance)}`,
        headers: {},
      };
      const req = https.request(options, res => {
        let result = '';
        res.on('data', chunk => {
          result += chunk;
        });
        res.on('end', () => {
          try {
            const obj = JSON.parse(result);
            resolve(obj);
          } catch (err) {
            reject(err);
          }
        });
        res.on('error', err => reject(err));
      });
      req.on('error', err => reject(err));
      req.end();
    });
  }

  async innerProcess(srcInput) {
    const input = srcInput;
    input.nluAnswer = await this.request(input.text || input.utterance);
    return input;
  }

  registerDefault() {
    super.registerDefault();
    this.container.register('NluLuis', NluLuis, false);
  }
}

module.exports = NluLuis;
