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
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcryptjs');

function getLocalStrategy(db, settings) {
  const localOptions = {
    usernameField: settings.usernameField || 'email',
    passwordField: settings.passwordField || 'password',
    session: false,
  };
  const localStrategy = new LocalStrategy(
    localOptions,
    (email, password, done) => {
      db.findOne(settings.usersTable || 'users', { email })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: 'This email is not registered',
            });
          }
          return bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
              return done(null, false, { message: 'Incorrect credentials' });
            }
            return done(null, user);
          });
        })
        .catch((err) => {
          done(err, null, { message: 'Error connecting to database' });
        });
    }
  );
  return localStrategy;
}

function getJwtStrategy(db, settings) {
  const opts = {};
  opts.secretOrKey = settings.jwtSecret || 'Ch4nG3 Th15';
  opts.algorithms = [settings.jwtAlgorithm || 'HS256'];
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  const jwtStrategy = new JwtStrategy(opts, (payload, done) => {
    db.findById(settings.usersTable || 'users', payload.sub)
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'This user is not registered' });
        }
        return done(null, user);
      })
      .catch((err) => {
        done(err, null, { message: 'Error connecting to database' });
      });
  });
  return jwtStrategy;
}

function configurePassport(db, settings) {
  passport.use(getLocalStrategy(db, settings));
  passport.use(getJwtStrategy(db, settings));
}

module.exports = configurePassport;
