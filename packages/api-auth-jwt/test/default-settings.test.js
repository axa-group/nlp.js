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

const { Container } = require('@nlpjs/core');
const getSettings = require('../src/default-settings');

describe('Default settings', () => {
  test('It should return default settings', () => {
    const container = new Container();
    const settings = getSettings(container);
    expect(settings.usernameField).toEqual('email');
    expect(settings.passwordField).toEqual('password');
    expect(settings.usersTable).toEqual('users');
    expect(settings.jwtSecret).toEqual('Ch4nG3 Th15');
    expect(settings.jwtAlgorithm).toEqual('HS256');
    expect(settings.jwtExpiration).toEqual('15m');
    expect(settings.jwtExpirationSeconds).toEqual(900);
  });
  test('Own settings can be provided', () => {
    const container = new Container();
    container.registerConfiguration('api-auth-jwt', {
      usernameField: 'email1',
      passwordField: 'password1',
      usersTable: 'users1',
      jwtSecret: 'Ch4nG3 Th151',
      jwtAlgorithm: 'HS2561',
      jwtExpiration: '30m',
      jwtExpirationSeconds: 1800,
    });
    const settings = getSettings(container);
    expect(settings.usernameField).toEqual('email1');
    expect(settings.passwordField).toEqual('password1');
    expect(settings.usersTable).toEqual('users1');
    expect(settings.jwtSecret).toEqual('Ch4nG3 Th151');
    expect(settings.jwtAlgorithm).toEqual('HS2561');
    expect(settings.jwtExpiration).toEqual('30m');
    expect(settings.jwtExpirationSeconds).toEqual(1800);
  });
});
