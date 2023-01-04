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
const http = require('http');
const https = require('https');
const ExpressApiApp = require('./express-api-app');

class ExpressApiServer extends Clonable {
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
    if (!this.settings.apiRoot) {
      this.settings.apiRoot = '/api';
    }
    this.plugins = [];
    this.routers = [];
  }

  registerDefault() {
    this.container.registerConfiguration(
      'api-server',
      { port: 3000, serveBot: false },
      false
    );
  }

  isStarted() {
    return this.app !== undefined;
  }

  newRouter() {
    return ExpressApiApp.newRouter();
  }

  start(input = {}) {
    this.server = null;
    const port = input.port || this.settings.port;
    const expressApp = new ExpressApiApp(
      this.settings,
      this.plugins,
      this.routers
    );
    this.app = expressApp.initialize();
    this.serverLib = expressApp.express;

    if (!port || port < 1) {
      return false;
    }

    let expressServer;
    const fs = this.container.get('fs');
    let protocol = '';
    if (this.settings.key || this.settings.cert) {
      try {
        expressServer = https.createServer(
          {
            key: fs.readFileSync(this.settings.key),
            cert: fs.readFileSync(this.settings.cert),
          },
          this.app
        );
        protocol = 'https';
      } catch (error) {
        this.container.get('log').error('Error inititlising HTTPS server');
        throw error;
      }
    } else {
      expressServer = http.createServer(this.app);
      protocol = 'http';
    }
    this.server = expressServer.listen.apply(expressServer, [
      port,
      () => {
        const logger = this.container.get('logger');
        logger.info(
          `${this.settings.tag} listening on port ${port} using ${protocol}!`
        );
      },
    ]);
    return this.server !== null;
  }
}

module.exports = ExpressApiServer;
