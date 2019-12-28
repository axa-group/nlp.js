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

const { Lexer } = require('@nlpjs/lexer');
const expressions = require('./expressions');

const { TokenType } = Lexer;

class PythonParser {
  constructor(text) {
    this.lexer = new Lexer();
    this.lexer.init(text);
    this.skipnewline = false;
    this.constantIdentifiers = {
      None: 'null',
      True: 'true',
      False: 'false',
    };
    this.separatorIdentifiers = {
      '(': {
        closing: ')',
        Clazz: expressions.GroupExpression,
        func: 'parseExpression',
      },
      '[': {
        closing: ']',
        Clazz: expressions.ListExpression,
        func: 'parseExpressionList',
      },
      '{': {
        closing: '}',
        Clazz: expressions.DictionaryExpression,
        func: 'parseKeyValueList',
      },
    };
  }

  nextToken() {
    let token = this.lexer.nextToken();
    if (this.skipnewline) {
      while (token && token.type === TokenType.EndOfLine) {
        token = this.lexer.nextToken();
      }
    }
    return token;
  }

  parseToken(value, type) {
    if (!this.tryParseToken(value, type)) {
      throw new Error(`Expected '${value}'`);
    }
  }

  tryParseEndOfCommand() {
    return (
      this.tryParseToken(';', TokenType.Separator) || this.tryParseEndOfLine()
    );
  }

  parseEndOfLine() {
    const token = this.nextToken();
    if (!token) {
      return undefined;
    }
    if (
      token.type === TokenType.EndOfLine ||
      token.type === TokenType.EndOfFile
    ) {
      return token;
    }
    this.lexer.pushToken(token);
    throw new Error('Expected end of line');
  }

  tryParseName() {
    return this.tryParseType(TokenType.Identifier);
  }

  tryParseToken(value, type) {
    const token = this.nextToken();
    if (!token) {
      return false;
    }
    if (token.type === type && token.value === value) {
      return true;
    }
    this.lexer.pushToken(token);
    return false;
  }

  tryParseType(type) {
    const token = this.nextToken();
    if (!token) {
      return undefined;
    }
    if (token.type === type) {
      return token.value;
    }
    this.lexer.pushToken(token);
    return undefined;
  }

  tryParseEndOfLine() {
    return !!this.tryParseType(TokenType.EndOfLine);
  }

  tryParseOperator() {
    return this.tryParseType(TokenType.Operator);
  }

  tryParseAssignment() {
    return this.tryParseType(TokenType.Assignment);
  }

  parseSuite(indent) {
    return this.tryParseEndOfLine()
      ? this.parseMultiLineSuite(indent)
      : this.parseSingleLineSuite(indent);
  }

  parseExpressionCommand() {
    return new expressions.ExpressionCommand(this.parseExpression());
  }

  parseKeyValueList() {
    const list = [];
    let token;
    for (
      token = this.nextToken();
      token && !(token.type === TokenType.Separator && token.value === '}');
      token = this.nextToken()
    ) {
      this.lexer.pushToken(token);
      const key = this.parseExpression();
      this.parseToken(':', TokenType.Separator);
      const value = this.parseExpression();
      list.push({ key, value });
      if (!this.tryParseToken(',', TokenType.Separator)) {
        return list;
      }
    }
    if (!token) {
      throw new Error('Unexpected end of input');
    }
    this.lexer.pushToken(token);
    return list;
  }

  parseNames() {
    const names = [];
    for (let name = this.tryParseName(); name; name = this.tryParseName()) {
      names.push(name);
      if (!this.tryParseToken(',', TokenType.Separator)) {
        break;
      }
    }
    return names;
  }

  parseName() {
    const token = this.nextToken();
    if (token && token.type === TokenType.Identifier) {
      return token.value;
    }
    throw new Error('Identifier expected');
  }

  parseSingleLineSuite(indent) {
    const cmd = this.parseSimpleCommand(indent);
    if (!this.tryParseToken(';', TokenType.Separator)) {
      return cmd;
    }
    const cmds = [cmd];
    for (
      cmds.push(this.parseSimpleCommand());
      this.tryParseToken(';', TokenType.Separator);

    ) {
      cmds.push(this.parseSimpleCommand(indent));
    }
    return new expressions.CompositeCommand(cmds);
  }

  parseMultiLineSuite(indent) {
    const cmds = [];
    const newindent = this.lexer.getIndent();
    if (newindent <= indent) {
      throw new Error('Invalid indent');
    }
    let token;
    while (true) {
      cmds.push(this.parseSingleLineSuite(newindent));
      token = this.parseEndOfLine();
      const nextindent = this.lexer.getIndent();
      if (nextindent > newindent) {
        throw new Error('Invalid indent');
      }
      if (nextindent < newindent) {
        break;
      }
    }
    if (token) {
      this.lexer.pushToken(token);
    }
    return new expressions.CompositeCommand(cmds);
  }

  parseExpressionList() {
    const list = [];
    let token;
    for (
      token = this.nextToken();
      token &&
      !(token.type === TokenType.Separator && [')', ']'].includes(token.value));
      token = this.nextToken()
    ) {
      this.lexer.pushToken(token);
      list.push(this.parseExpression());
      if (!this.tryParseToken(',', TokenType.Separator)) {
        return list;
      }
    }
    if (!token) {
      throw new Error('Undexpected end of input');
    }
    this.lexer.pushToken(token);
    return list;
  }

  parseTerm() {
    const token = this.nextToken();
    if (!token) {
      return undefined;
    }
    if (token.type === TokenType.Number) {
      return new expressions.ConstantExpression(token.value);
    }
    if (token.type === TokenType.String) {
      return new expressions.StringExpression(token.value);
    }
    if (token.type === TokenType.Identifier) {
      if (this.constantIdentifiers[token.value]) {
        return new expressions.ConstantExpression(
          this.constantIdentifiers[token.value]
        );
      }
      if (token.value === 'new') {
        return new expressions.NewExpression(this.parseExpression());
      }
      return new expressions.VariableExpression(token.value);
    }
    if (
      token.type === TokenType.Separator &&
      Object.keys(this.separatorIdentifiers).includes(token.value)
    ) {
      const oldskip = this.skipnewline;
      this.skipnewline = true;
      const { closing, Clazz, func } = this.separatorIdentifiers[token.value];
      const expr = this[func]();
      this.parseToken(closing, TokenType.Separator);
      this.skipnewline = oldskip;
      return new Clazz(expr);
    }
    if (token.type === TokenType.Operator && token.value === '-') {
      return new expressions.MinusExpression(this.parseTerm());
    }
    return undefined;
  }

  parseSimpleExpression() {
    let expr = this.parseTerm();
    if (!expr) {
      return undefined;
    }
    while (true) {
      if (this.tryParseToken('[', TokenType.Separator)) {
        const index = this.parseExpression();
        this.parseToken(']', TokenType.Separator);
        expr = new expressions.IndexExpression(expr, index);
      } else if (this.tryParseToken('(', TokenType.Separator)) {
        const expressionList = this.parseExpressionList();
        this.parseToken(')', TokenType.Separator);
        expr = new expressions.CallExpression(expr, expressionList);
      } else if (this.tryParseToken('.', TokenType.Operator)) {
        expr = new expressions.DottedExpression(expr, this.parseTerm());
      } else {
        break;
      }
    }
    return expr;
  }

  parseExpression() {
    let expr = this.parseSimpleExpression();
    if (!expr) {
      return undefined;
    }
    for (
      let oper = this.tryParseOperator();
      oper;
      oper = this.tryParseOperator()
    ) {
      expr = new expressions.BinaryExpression(
        oper,
        expr,
        this.parseSimpleExpression()
      );
    }
    return expr;
  }

  parseCommand(indent = 0) {
    let cmd = this.parseSimpleCommand(indent);
    if (!cmd) {
      return undefined;
    }
    const cmds = [cmd];
    while (this.tryParseEndOfCommand()) {
      cmd = this.parseSimpleCommand(indent);
      if (!cmd) {
        break;
      }
      cmds.push(cmd);
    }
    return cmds.length === 1 ? cmds[0] : new expressions.CompositeCommand(cmds);
  }

  parseSimpleCommand(indent) {
    let token = this.nextToken();
    while (token && token.type === TokenType.EndOfLine) {
      token = this.nextToken();
    }
    if (!token) {
      return undefined;
    }
    if (token.type !== TokenType.Identifier) {
      this.lexer.pushToken(token);
      return this.parseExpressionCommand();
    }
    switch (token.value) {
      case 'break':
        return new expressions.BreakCommand();
      case 'continue':
        return new expressions.ContinueCommand();
      case 'pass':
        return new expressions.PassCommand();
      case 'import':
        return new expressions.ImportCommand(this.parseName());
      case 'def': {
        const name = this.parseName();
        this.parseToken('(', TokenType.Separator);
        const oldskip = this.skipnewline;
        this.skipnewline = true;
        const names = this.parseNames();
        this.parseToken(')', TokenType.Separator);
        this.skipnewline = oldskip;
        this.parseToken(':', TokenType.Separator);
        const cmd = this.parseSuite(indent);
        return new expressions.DefCommand(name, names, cmd);
      }
      case 'class': {
        const name = this.parseName();
        this.parseToken(':', TokenType.Separator);
        const cmd = this.parseSuite(indent);
        return new expressions.ClassCommand(name, cmd);
      }
      case 'return':
        return new expressions.ReturnCommand(this.parseExpression());
      case 'if': {
        const condition = this.parseExpression();
        this.parseToken(':', TokenType.Separator);
        const thencmd = this.parseSuite(indent);
        let elsecmd;
        const newtoken = this.nextToken();
        if (
          newtoken &&
          newtoken.type === TokenType.EndOfLine &&
          this.lexer.getIndent() === indent &&
          this.tryParseToken('else', TokenType.Identifier)
        ) {
          this.parseToken(':', TokenType.Separator);
          elsecmd = this.parseSuite(indent);
        } else {
          this.lexer.pushToken(newtoken);
        }
        return new expressions.IfCommand(condition, thencmd, elsecmd);
      }
      case 'assert':
        return new expressions.AssertCommand(this.parseExpression());
      case 'raise':
        return new expressions.RaiseCommand(this.parseExpression());
      case 'global':
        return new expressions.GlobalVariableCommand(this.parseName());
      case 'nonlocal':
        return new expressions.GlobalVariableCommand(this.parseName());
      case 'for': {
        const name = this.parseName();
        this.parseToken('in', TokenType.Identifier);
        const expr = this.parseExpression();
        this.parseToken(':', TokenType.Separator);
        const cmd = this.parseSuite(indent);
        return new expressions.ForInCommand(name, expr, cmd);
      }
      case 'while': {
        const condition = this.parseExpression();
        this.parseToken(':', TokenType.Separator);
        const cmd = this.parseSuite(indent);
        return new expressions.WhileCommand(condition, cmd);
      }
      default: {
        this.lexer.pushToken(token);
        const expr = this.parseExpression();
        const assign = this.tryParseAssignment();
        return assign
          ? new expressions.AssignmentCommand(
              expr,
              this.parseExpression(),
              assign
            )
          : new expressions.ExpressionCommand(expr);
      }
    }
  }

  static transpile(text) {
    return new PythonParser(text).parseCommand().transpile();
  }
}

module.exports = PythonParser;
