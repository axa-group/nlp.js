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

const { uuid } = require('@nlpjs/core');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const getSettings = require('./default-settings');
const ensureAuthenticated = require('./ensure-authenticated');

const refreshTokens = {};

function login(req, res) {
  passport.authenticate('local', { session: false }, (error, user) => {
    if (error || !user) {
      return res.status(404).send('Email or password not correct');
    }
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };
    const refreshToken = uuid();
    refreshTokens[refreshToken] = {
      email: payload.email,
      name: payload.name,
      sub: payload.sub,
    };
    const settings = getSettings(this);
    const token = jwt.sign(payload, settings.jwtSecret, {
      algorithm: settings.jwtAlgorithm,
      expiresIn: settings.jwtExpiration,
    });
    return res.json({
      access_token: token,
      refresh_token: refreshToken,
      token_type: 'bearer',
      expires: settings.jwtExpirationSeconds,
    });
  })(req, res);
}

function refresh(req, res) {
  const { email } = req.body;
  const { refreshToken } = req.body;
  const refreshData = refreshTokens[refreshToken];
  if (!refreshData || refreshData.email !== email) {
    return res.status(401).send('Invalid refresh token');
  }
  const newRefreshToken = uuid();
  delete refreshTokens[refreshTokens];
  refreshTokens[newRefreshToken] = refreshData;
  const payload = {
    sub: refreshData.sub,
    email: refreshData.email,
    name: refreshData.name,
  };
  const settings = getSettings(this);
  const token = jwt.sign(payload, settings.jwtSecret, {
    algorithm: settings.jwtAlgorithm,
    expiresIn: settings.jwtExpiration,
  });
  return res.json({
    access_token: token,
    refresh_token: newRefreshToken,
    token_type: 'bearer',
    expires: settings.jwtExpirationSeconds,
  });
}

function register(req, res, next) {
  const database = this.get('database');
  database
    .findOne('users', { mail: req.body.email })
    .then((user) => {
      if (user) {
        const error = new Error('User already exists');
        error.status = 409;
        throw error;
      }
      const hash = bcrypt.hashSync(req.body.password, 10);
      const document = {
        email: req.body.email,
        password: hash,
        name: req.body.name,
      };
      database
        .insertOne('users', document)
        .then(() => {
          res.status(200).send('User created');
        })
        .catch((errCreating) => next(errCreating));
    })
    .catch((err) => next(err));
}

function testProtected(req, res) {
  res.send(`Ok ${req.user.email}, access granted`);
}

function testUnprotected(req, res) {
  res.send('Ok guest');
}

function mountUser(router, container) {
  router.post('/auth/local/login', login.bind(container));
  router.post('/auth/local/refresh', refresh.bind(container));
  router.post('/auth/local/register', register.bind(container));
  router.get(
    '/testprotected',
    ensureAuthenticated,
    testProtected.bind(container)
  );
  router.get('/testunprotected', testUnprotected.bind(container));
}

module.exports = mountUser;
