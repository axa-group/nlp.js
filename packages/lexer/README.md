![NLPjs logo](../../screenshots/nlplogo.gif)

# @nlpjs/lexer

[![Build Status](https://travis-ci.com/axa-group/nlp.js.svg?branch=master)](https://travis-ci.com/axa-group/nlp.js)
[![Coverage Status](https://coveralls.io/repos/github/axa-group/nlp.js/badge.svg?branch=master)](https://coveralls.io/github/axa-group/nlp.js?branch=master)
[![NPM version](https://img.shields.io/npm/v/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp)
[![NPM downloads](https://img.shields.io/npm/dm/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp) [![Greenkeeper badge](https://badges.greenkeeper.io/axa-group/nlp.js.svg)](https://greenkeeper.io/)

## TABLE OF CONTENTS

<!--ts-->

- [Introduction](#introduction)
- [Installation](#installation)
- [Token Types](#token-types)
- [Example of use](#example-of-use)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Code of Conduct](#code-of-conduct)
- [Who is behind it](#who-is-behind-it)
- [License](#license.md)

<!--te-->


## Introduction

This package provides the class _Lexer_ that is the basic class to build transpilers for languages. It is used by the package _@nlpjs/python-compiler_ to build a transpiler of python to javascript.

## Installation

You can install it using NPM

```shell
  npm i @nlpjs/lexer
```

## Token Types
- Identifier: 1
- Number: 2
- String: 3
- Operator: 4
- Separator: 5
- EndOfLine: 6
- Assignment: 7
- EndOfFile: 8

## Example of use

```javascript
const { Lexer } = require('@nlpjs/lexer');

const script = `
n = 0
while n < 10:
  n += 1
print("hola")
`

const lexer = new Lexer();
lexer.init(script);
let token;
while (!token || token.type !== Lexer.TokenType.EndOfFile) {
  token = lexer.nextToken();
  console.log(token);
}
```

This will show in console:

```shell
Token { value: 'n', type: 1 }
Token { value: '=', type: 7 }
Token { value: '0', type: 2 }
Token { value: '\n', type: 6 }
Token { value: 'while', type: 1 }
Token { value: 'n', type: 1 }
Token { value: '<', type: 4 }
Token { value: '10', type: 2 }
Token { value: ':', type: 5 }
Token { value: '\n', type: 6 }
Token { value: 'n', type: 1 }
Token { value: '+=', type: 7 }
Token { value: '1', type: 2 }
Token { value: '\n', type: 6 }
Token { value: 'print', type: 1 }
Token { value: '(', type: 5 }
Token { value: 'hola', type: 3 }
Token { value: ')', type: 5 }
Token { value: '', type: 8 }
```

## Contributing

You can read the guide of how to contribute at [Contributing](../../CONTRIBUTING.md).

## Contributors

[![Contributors](https://contributors-img.firebaseapp.com/image?repo=axa-group/nlp.js)](https://github.com/axa-group/nlp.js/graphs/contributors)

Made with [contributors-img](https://contributors-img.firebaseapp.com).

## Code of Conduct

You can read the Code of Conduct at [Code of Conduct](../../CODE_OF_CONDUCT.md).

## Who is behind it`?`

This project is developed by AXA Group Operations Spain S.A.

If you need to contact us, you can do it at the email jesus.seijas@axa.com

## License

Copyright (c) AXA Group Operations Spain S.A.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
