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
const express = require('express');
const nlpjs = require('@nlpjs/express-api-server');

class ExpressApiApp extends nlpjs.ExpressApiApp {

  initialize() {
    this.app = express();
    this.app.use(express.urlencoded({ extended: false }));
    // INFO: required for Facebook-connector
    this.app.use(express.json({
      verify: (req, res, buf) => {
        req.rawBody = buf;
      }
    }));

    this.loadComplements();

    return this.app;
  }
  
  loadComplements() {
    const logger = this.settings.container.get('logger');
    for (let i = 0; i < this.plugins.length; i += 1) {
      const plugin = this.plugins[i];
      logger.debug(`Loading plugin: ${plugin.name}`);
      this.app.use(plugin);
    }
    if (this.settings.serveBot) {
      const clientPath = this.settings.clientPath || path.join(__dirname, '..', '..', '..', 'public');
      logger.debug(`Serving bot client (path: ${clientPath}`);
      this.app.use(express.static(clientPath));
    }
    for (let i = 0; i < this.routers.length; i += 1) {
      const router = this.routers[i];
      const routes = router.stack.map((layer) => layer.route.path);
      logger.debug(`Loading custom router: ${JSON.stringify(routes, null, 2)}`);
      this.app.use(this.settings.apiRoot, router);
    }
  }
}

module.exports = ExpressApiApp;
