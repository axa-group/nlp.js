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

const express = require('express');
const cors = require('cors');
const path = require('path');

class ExpressApiApp {
  constructor(settings, plugins, routers) {
    this.settings = settings || {};
    this.plugins = plugins || [];
    this.routers = routers || [];
  }

  static newRouter() {
    return express.Router();
  }

  initialize() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    for (let i = 0; i < this.plugins.length; i += 1) {
      this.app.use(this.plugins[i]);
    }
    if (this.settings.serveBot) {
      this.app.use(express.static(path.join(__dirname, './public')));
    }
    for (let i = 0; i < this.routers.length; i += 1) {
      this.app.use(this.settings.apiRoot, this.routers[i]);
    }
    return this.app;
  }
}

module.exports = ExpressApiApp;
