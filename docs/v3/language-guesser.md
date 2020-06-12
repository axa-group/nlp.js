# Language Guesser

The language object gives your code the skill to guess the language of a text. The method guess do that returning to you an array of all the languages ordered descending by the score.

```javascript
const { Language } = require('node-nlp');

const language = new Language();
const guess = language.guess(
  'When the night has come And the land is dark And the moon is the only light we see',
);
console.log(guess[0]);
```

This piece of code should write in console:

```bash
{ alpha3: 'eng', alpha2: 'en', language: 'English', score: 1 }
```

You can limit the amount of results with the third parameter of the method:

```javascript
const { Language } = require('node-nlp');

const language = new Language();
let guess = language.guess(
  "Quan arriba la nit i la terra és fosca i la lluna és l'única llum que podem veure",
  null,
  3,
);
console.log(guess.length);
console.log(guess[0]);
```

In console you'll see:

```bash
3
{ alpha3: 'cat', alpha2: 'ca', language: 'Catalan', score: 1 }
```

You can also provide an allow list of accepted language to find the one that fits better

```javascript
const { Language } = require('node-nlp');

const language = new Language();
let guess = language.guess(
  'When the night has come And the land is dark And the moon is the only light we see',
  ['de', 'es'],
);
console.log(guess[0]);
```

In console you'll see:

```bash
{ alpha3: 'deu', alpha2: 'de', language: 'German', score: 1 }
```

You can also use the method guessBest that returns only the best result.

```javascript
const { Language } = require('node-nlp');

const language = new Language();
let guess = language.guessBest(
  'When the night has come And the land is dark And the moon is the only light we see',
);
console.log(guess[0]);
let guess = language.guessBest(
  'When the night has come And the land is dark And the moon is the only light we see',
  ['de', 'es'],
);
console.log(guess[0]);
```

That will show this in console:

```bash
{ alpha3: 'eng', alpha2: 'en', language: 'English', score: 1 }
{ alpha3: 'deu', alpha2: 'de', language: 'German', score: 1 }
```
