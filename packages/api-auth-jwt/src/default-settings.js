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

function getSettings(container) {
  const settings = container.getConfiguration('api-auth-jwt') || {};
  if (!settings.usernameField) {
    settings.usernameField = process.env.JWT_USERNAME_FIELD || 'email';
  }
  if (!settings.passwordField) {
    settings.passwordField = process.env.JWT_PASSWORD_FIELD || 'password';
  }
  if (!settings.usersTable) {
    settings.usersTable = process.env.JWT_USERS_TABLE || 'users';
  }
  if (!settings.jwtSecret) {
    settings.jwtSecret = process.env.JWT_SECRET || 'Ch4nG3 Th15';
  }
  if (!settings.jwtAlgorithm) {
    settings.jwtAlgorithm = process.env.JWT_ALGORITHM || 'HS256';
  }
  if (!settings.jwtExpiration) {
    settings.jwtExpiration = process.env.JWT_LIFETIME || '15m';
  }
  if (!settings.jwtExpirationSeconds) {
    settings.jwtExpirationSeconds = parseInt(
      process.env.JWT_LIFETIME_SECONDS || '900',
      10
    );
  }
  return settings;
}

module.exports = getSettings;
