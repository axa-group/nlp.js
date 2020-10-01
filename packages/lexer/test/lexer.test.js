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

const { Lexer } = require('../src');

describe('Lexer', () => {
  describe('Constructor', () => {
    test('Constructor', () => {
      const lexer = new Lexer();
      expect(lexer).toBeDefined();
    });
  });

  describe('Init', () => {
    test('Should init text', () => {
      const lexer = new Lexer();
      lexer.init('This is a text');
      expect(lexer.text).toEqual('This is a text');
    });
  });

  describe('Next Token', () => {
    test('Next Token', () => {
      const script = `
      n = 0
      while n < 10:
        n += 1.2
      print("hola")
      `;
      const lexer = new Lexer();
      lexer.init(script);
      const tokens = [];
      for (let i = 0; i < 20; i += 1) {
        tokens.push(lexer.nextToken());
      }
      expect(tokens[0].value).toEqual('n');
      expect(tokens[0].type).toEqual(Lexer.TokenType.Identifier);
      expect(tokens[1].value).toEqual('=');
      expect(tokens[1].type).toEqual(Lexer.TokenType.Assignment);
      expect(tokens[2].value).toEqual('0');
      expect(tokens[2].type).toEqual(Lexer.TokenType.Number);
      expect(tokens[3].value).toEqual('\n');
      expect(tokens[3].type).toEqual(Lexer.TokenType.EndOfLine);
      expect(tokens[4].value).toEqual('while');
      expect(tokens[4].type).toEqual(Lexer.TokenType.Identifier);
      expect(tokens[5].value).toEqual('n');
      expect(tokens[5].type).toEqual(Lexer.TokenType.Identifier);
      expect(tokens[6].value).toEqual('<');
      expect(tokens[6].type).toEqual(Lexer.TokenType.Operator);
      expect(tokens[7].value).toEqual('10');
      expect(tokens[7].type).toEqual(Lexer.TokenType.Number);
      expect(tokens[8].value).toEqual(':');
      expect(tokens[8].type).toEqual(Lexer.TokenType.Separator);
      expect(tokens[9].value).toEqual('\n');
      expect(tokens[9].type).toEqual(Lexer.TokenType.EndOfLine);
      expect(tokens[10].value).toEqual('n');
      expect(tokens[10].type).toEqual(Lexer.TokenType.Identifier);
      expect(tokens[11].value).toEqual('+=');
      expect(tokens[11].type).toEqual(Lexer.TokenType.Assignment);
      expect(tokens[12].value).toEqual('1.2');
      expect(tokens[12].type).toEqual(Lexer.TokenType.Number);
      expect(tokens[13].value).toEqual('\n');
      expect(tokens[13].type).toEqual(Lexer.TokenType.EndOfLine);
      expect(tokens[14].value).toEqual('print');
      expect(tokens[14].type).toEqual(Lexer.TokenType.Identifier);
      expect(tokens[15].value).toEqual('(');
      expect(tokens[15].type).toEqual(Lexer.TokenType.Separator);
      expect(tokens[16].value).toEqual('hola');
      expect(tokens[16].type).toEqual(Lexer.TokenType.String);
      expect(tokens[17].value).toEqual(')');
      expect(tokens[17].type).toEqual(Lexer.TokenType.Separator);
      expect(tokens[18].value).toEqual('');
      expect(tokens[18].type).toEqual(Lexer.TokenType.EndOfFile);
      expect(tokens[19].value).toEqual('');
      expect(tokens[19].type).toEqual(Lexer.TokenType.EndOfFile);
    });
  });
});
