![NLPjs logo](../../screenshots/nlplogo.gif)

# @nlpjs/similarity

[![](https://github.com/axa-group/nlp.js/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/axa-group/nlp.js/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/axa-group/nlp.js/badge.svg?branch=master)](https://coveralls.io/github/axa-group/nlp.js?branch=master)
[![NPM version](https://img.shields.io/npm/v/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp)
[![NPM downloads](https://img.shields.io/npm/dm/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp)

## TABLE OF CONTENTS

<!--ts-->

- [Installation](#installation)
- [leven](#leven)
- [similarity](#similarity)
- [SpellCheck](#spellcheck)
- [SpellCheck trained with words trained from a text](#spellcheck-trained-with-words-trained-from-a-text)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Code of Conduct](#code-of-conduct)
- [Who is behind it](#who-is-behind-it)
- [License](#license.md)

<!--te-->

## Installation

You can install @nlpjs/similarity:

```bash
    npm install @nlpjs/similarity
```

## leven

It's used to calculate the levenshtein distance between two texts:

```javascript
const { leven } = require('@nlpjs/similarity');

console.log(leven('potatoe', 'potatoe')); // expected: 0
console.log(leven('distance', 'eistancd')); // expected: 2
console.log(leven('mikailovitch', 'Mikhaïlovitch')); // expected: 3
```

## similarity

It's used to calculate the levenshtein distance between two texts, but with an option to normalize both texts between calculation.

```javascript
const { similarity } = require('@nlpjs/similarity');

function showDistances(word1, word2) {
  console.log(`"${word1}" vs "${word2}" :`);
  console.log(`    similarity (non normalized): ${similarity(word1, word2)}`);
  console.log(
    `        similarity (normalized): ${similarity(word1, word2, true)}`
  );
}

showDistances('potatoe', 'potatoe');
showDistances('potatoe', 'Potatoe');
showDistances('distance', 'eistancd');
showDistances('mikailovitch', 'Mikhaïlovitch');
```

## SpellCheck

It can do spell check based on a dictionary of words with frequency.
It search for the most similar word based on levenshtein distance. When several words has the same levenshtein distance, the word with more frequency is chosen.

```javascript
const { SpellCheck } = require('../../packages/similarity/src');
// const { SpellCheck } = require('@nlpjs/similarity');

const spellCheck = new SpellCheck({
  features: {
    wording: 1,
    worming: 4,
    working: 3,
  },
});
const actual = spellCheck.check(['worling'], 1);
console.log(actual);
```

## SpellCheck trained with words trained from a text

```javascript
const fs = require('fs');
const { SpellCheck } = require('@nlpjs/similarity');
const { NGrams } = require('@nlpjs/utils');

// File book.txt should contain the text that contains the words to be learnt. 
// In the example we used Pride and Prejudice from Project Gutenberg 
const lines = fs.readFileSync('./data/book.txt', 'utf-8').split(/\r?\n/);
const ngrams = new NGrams({ byWord: true });
const freqs = ngrams.getNGramsFreqs(lines, 1);
const spellCheck = new SpellCheck({ features: freqs });
const actual = spellCheck.check(['knowldge', 'thas', 'prejudize']);
console.log(actual);
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

If you need to contact us, you can do it at the email opensource@axa.com

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
