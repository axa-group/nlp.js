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

const fs = require('fs');
const { containerBootstrap } = require('@nlpjs/core');
const { Bot, TestConnector } = require('../src');

const container = containerBootstrap();
container.register('fs', {
  readFileSync: (file) => fs.readFileSync(file, 'utf-8'),
});

describe('Bot', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const bot = new Bot({ container });
      expect(bot).toBeDefined();
    });
  });

  describe('loadScript', () => {
    test('It should be able to load several scripts', async () => {
      const bot = new Bot({ container });
      await bot.start();
      bot.loadScript([
        './packages/bot/test/script1.dlg',
        './packages/bot/test/script2.dlg',
      ]);
    });
  });

  describe('process', () => {
    test('It should be able to process a conversation', async () => {
      const bot = new Bot({ container });
      container.register('bot', bot, true);
      await bot.start();
      bot.loadScript([
        './packages/bot/test/script1.dlg',
        './packages/bot/test/script2.dlg',
      ]);
      const connector = new TestConnector({ container });
      await connector.hear('hello');
      await connector.hear('John');
      const expected = [
        'user> hello',
        "bot> What's your name?",
        'user> John',
        'bot> Hello {{ user_name }}',
        'bot> This is the help',
        'bot> This is the second help',
        'bot> Bye user',
      ];
      expect(connector.messages).toEqual(expected);
    });
  });
});
