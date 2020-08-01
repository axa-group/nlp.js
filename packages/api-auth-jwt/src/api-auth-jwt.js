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

const passport = require('passport');
const configurePassport = require('./configure-passport');
const ensureAuthenticated = require('./ensure-authenticated');
const mountUser = require('./user.router');
const getSettings = require('./default-settings');

class ApiAuthJwt {
  register(container) {
    process.nextTick(() => {
      const settings = getSettings(container);
      const database = container.get('database');
      const apiServer = container.get('api-server');
      configurePassport(database, settings);
      const plugin = passport.initialize();
      apiServer.plugins.push(plugin);
      const logger = container.get('logger');
      container.register('auth', { ensureAuthenticated });
      const router = apiServer.newRouter();
      mountUser(router, container);
      apiServer.routers.push(router);
      logger.info('API Auth JWT plugin mounted');
    });
  }
}

module.exports = ApiAuthJwt;
