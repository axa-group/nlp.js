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

const Token = require('./token');

class Lexer {
  constructor(settings = {}) {
    this.lastToken = {
      position: -1,
      value: '',
      type: 0,
    };
    this.operators = settings.operators || [
      '+',
      '-',
      '*',
      '/',
      '.',
      '>',
      '<',
      '<=',
      '>=',
      '!=',
      '<>',
      '**',
      '==',
      '%',
      '|',
      '&',
      '||',
      '&&',
    ];
    this.assignments = settings.assignments || ['=', '+=', '-=', '*=', '/='];
    this.separators = settings.separators || [
      '(',
      ')',
      '[',
      ']',
      '{',
      '}',
      ',',
      ':',
      ';',
    ];
    this.buildDicts();
  }

  buildDict(item) {
    let result = item;
    if (typeof result === 'string') {
      result = result.split('');
    }
    if (Array.isArray(result)) {
      const obj = {};
      for (let i = 0; i < result.length; i += 1) {
        obj[result[i]] = true;
      }
      result = obj;
    }
    return result;
  }

  buildDicts() {
    this.operators = this.buildDict(this.operators);
    this.separators = this.buildDict(this.separators);
    this.assignments = this.buildDict(this.assignments);
  }

  init(text = '') {
    this.text = this.clearText(text);
    this.length = this.text.length;
    this.position = 0;
    this.next = [];
  }

  clearText(text) {
    let result = text.replace(/\r/g, '');
    result = result.replace(/\t/g, '  ').trim();
    const lines = result.split('\n');
    const deflines = [];
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (line.trim()) {
        deflines.push(line);
      }
    }
    return `${deflines.join('\n')}`;
  }

  isEndOfLine(ch) {
    return ch === '\n';
  }

  isSeparator(ch) {
    return this.separators[ch];
  }

  isSpace(ch) {
    return ch <= ' ' && ch !== '\n';
  }

  isAssignment(ch) {
    return this.assignments[ch];
  }

  isAlpha(ch) {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
  }

  isNumeric(ch) {
    return ch >= '0' && ch <= '9';
  }

  isNameCharacter(ch, first = false) {
    return this.isAlpha(ch) || (!first && this.isNumeric(ch)) || ch === '_';
  }

  isOperator(ch) {
    return this.operators[ch];
  }

  nextByCondition(initial, condition) {
    let result = initial;
    let ch = this.nextChar();
    while (condition(ch)) {
      result += ch;
      ch = this.nextChar();
    }
    return result;
  }

  nextName(letter) {
    if (this.isNameCharacter(letter, true)) {
      const name = this.nextByCondition(
        letter,
        (ch) => ch && this.isNameCharacter(ch)
      );
      this.goBack();
      return new Token(name, Lexer.TokenType.Identifier);
    }
    return undefined;
  }

  nextString(quote) {
    if (quote === '"' || quote === "'") {
      const value = this.nextByCondition('', (ch) => ch && ch !== quote);
      return new Token(value, Lexer.TokenType.String);
    }
    return undefined;
  }

  nextNumber(digit) {
    if (this.isNumeric(digit)) {
      let number = digit;
      let ch = this.nextChar();
      while (this.isNumeric(ch)) {
        number += ch;
        ch = this.nextChar();
      }
      if (ch === '.') {
        number += ch;
        ch = this.nextChar();
        while (this.isNumeric(ch)) {
          number += ch;
          ch = this.nextChar();
        }
      }
      this.goBack();
      return new Token(number, Lexer.TokenType.Number);
    }
    return undefined;
  }

  nextSeparator(ch) {
    if (this.isSeparator(ch)) {
      return new Token(ch, Lexer.TokenType.Separator);
    }
    return undefined;
  }

  nextOperatorOrAssignment(ch, firstCall = true) {
    if (this.isOperator(ch) || this.isAssignment(ch)) {
      let nextCh = this.nextChar();
      if (nextCh && !this.isSpace(nextCh)) {
        nextCh = ch + nextCh;
        if (this.isOperator(nextCh)) {
          return new Token(nextCh, Lexer.TokenType.Operator);
        }
        if (this.isAssignment(nextCh)) {
          return new Token(nextCh, Lexer.TokenType.Assignment);
        }
      }
      this.goBack();
      return new Token(
        ch,
        this.isOperator(ch)
          ? Lexer.TokenType.Operator
          : Lexer.TokenType.Assignment
      );
    }
    if (firstCall) {
      const ch2 = this.nextChar();
      const result = this.nextOperatorOrAssignment(ch + ch2, false);
      if (!result) {
        this.goBack();
      }
      return result;
    }
    return undefined;
  }

  goBack() {
    if (this.position >= this.length - 1 && this.text[this.position] === '\n') {
      return;
    }
    this.position -= 1;
  }

  nextChar() {
    if (this.position > this.length) {
      return undefined;
    }
    let ch = this.text[this.position];
    this.position += 1;
    if (ch === '#') {
      ch = this.nextChar();
      while (ch && !this.isEndOfLine(ch)) {
        ch = this.nextChar();
      }
    }
    return ch;
  }

  skipSpaces() {
    let ch = this.nextChar();
    while (ch && this.isSpace(ch)) {
      ch = this.nextChar();
    }
    this.goBack();
  }

  nextFirstChar() {
    this.skipSpaces();
    return this.nextChar();
  }

  nextToken() {
    if (this.next.length) {
      return this.next.pop();
    }
    const ch = this.nextFirstChar();
    const token =
      this.nextName(ch) ||
      this.nextNumber(ch) ||
      this.nextOperatorOrAssignment(ch) ||
      this.nextSeparator(ch) ||
      this.nextString(ch);
    if (token) {
      if (
        this.lastToken.position === this.position &&
        this.lastToken.value === token.value &&
        this.lastToken.type === token.type
      ) {
        return new Token('', Lexer.TokenType.EndOfFile);
      }
      this.lastToken = {
        position: this.position,
        value: token.value,
        type: token.type,
      };
      return token;
    }
    if (this.position >= this.length) {
      return new Token('', Lexer.TokenType.EndOfFile);
    }
    if (this.isEndOfLine(ch)) {
      if (this.position === this.length - 1) {
        this.position = this.length;
      }
      return new Token(ch, Lexer.TokenType.EndOfLine);
    }
    throw new Error(`Unexpected "${ch}"`);
  }

  pushToken(token) {
    if (token) {
      this.next.push(token);
    }
  }

  getIndent() {
    let indent = 0;
    let ch;
    let pos = this.position;
    while (pos < this.length) {
      ch = this.text[pos];
      if (this.isEndOfLine(ch)) {
        indent = 0;
        pos += 1;
      } else {
        if (!this.isSpace(this.text[pos])) {
          break;
        }
        indent += 1;
        pos += 1;
      }
    }
    if (pos >= this.length) {
      return 0;
    }
    return indent;
  }
}

Lexer.TokenType = {
  Identifier: 1,
  Number: 2,
  String: 3,
  Operator: 4,
  Separator: 5,
  EndOfLine: 6,
  Assignment: 7,
  EndOfFile: 8,
};

module.exports = Lexer;
