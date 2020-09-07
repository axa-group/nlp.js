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

const { defaultContainer, Clonable } = require('@nlpjs/core');
const express = require('serverless-express/express');

class ExpressApiServerless extends Clonable {
  constructor(settings = {}, container = undefined) {
    super(
      {
        settings: {},
        container: settings.container || container || defaultContainer,
      },
      container
    );
    this.applySettings(this.settings, settings);
    this.registerDefault();
    if (!this.settings.tag) {
      this.settings.tag = 'api-server';
    }
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
  }

  registerDefault() {
    this.container.registerConfiguration('api-server', {}, false);
  }

  isStarted() {
    return this.app !== undefined;
  }

  start() {
    this.app = express();
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    const logger = this.container.get('logger');
    logger.info(`${this.settings.tag} started as serverless`);
  }
}

module.exports = ExpressApiServerless;
