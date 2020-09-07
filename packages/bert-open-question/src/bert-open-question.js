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

const { Clonable } = require('@nlpjs/core');

class BertOpenQuestion extends Clonable {
  constructor(settings = {}, container = undefined) {
    super(
      {
        settings: {},
        container: settings.container || container,
      },
      container
    );
    this.applySettings(this.settings, settings);
    if (!this.settings.tag) {
      this.settings.tag = 'open-question';
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
  }

  registerDefault() {
    this.container.registerConfiguration(
      'open-question',
      {
        url: process.env.OPEN_QUESTION_URL || 'http://localhost:8000/qna',
        'context-en':
          'The first book title is the philosopher stone. The second book title is the chamber of secrets. The third book is the prisioner of Azkaban',
      },
      false
    );
  }

  async getAnswer(locale, query) {
    const contextName = `context-${locale}`;
    if (!this.settings[contextName]) {
      return {
        answer: '',
        position: -1,
        score: 1,
      };
    }
    const request = this.container.get('request');
    const postData = `{ "text": "${encodeURIComponent(
      this.settings[contextName]
    )}", "query": "${encodeURIComponent(query)}"}`;
    const { url } = this.settings;
    const options = {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      },
      postData,
    };
    const result = await request.get(options);
    return {
      answer: result[0][0],
      position: result[1][0],
      score: result[2][0],
    };
  }
}

module.exports = BertOpenQuestion;
