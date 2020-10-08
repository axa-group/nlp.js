# @nlpjs/similarity

## TABLE OF CONTENTS

<!--ts-->

- [Installation](#installation)
- [leven](#leven)
- [similarity](#similarity)
- [SpellCheck](#spellcheck)
- [SpellCheck trained with words trained from a text](#spellcheck-trained-with-words-trained-from-a-text)

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
