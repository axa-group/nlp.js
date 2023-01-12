![NLPjs logo](../../screenshots/nlplogo.gif)

# @nlpjs/lang-it

[![](https://github.com/axa-group/nlp.js/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/axa-group/nlp.js/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/axa-group/nlp.js/badge.svg?branch=master)](https://coveralls.io/github/axa-group/nlp.js?branch=master)
[![NPM version](https://img.shields.io/npm/v/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp)
[![NPM downloads](https://img.shields.io/npm/dm/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp)

## TABLE OF CONTENTS

<!--ts-->

- [Installation](#installation)
- [Normalization](#normalization)
- [Tokenization](#tokenization)
- [Identify if a word is an italian stopword](#identify-if-a-word-is-an-italian-stopword)
- [Remove stopwords from an array of words](#remove-stopwords-from-an-array-of-words)
- [Change the stopwords dictionary](#change-the-stopwords-dictionary)
- [Stemming word by word](#stemming-word-by-word)
- [Stemming an array of words](#stemming-an-array-of-words)
- [Normalizing, Tokenizing and Stemming a sentence](#normalizing-tokenizing-and-stemming-a-sentence)
- [Remove stopwords when stemming a sentence](#remove-stopwords-when-stemming-a-sentence)
- [Sentiment Analysis](#sentiment-analysis)
- [Example of usage on a classifier](#example-of-usage-on-a-classifier)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Code of Conduct](#code-of-conduct)
- [Who is behind it](#who-is-behind-it)
- [License](#license.md)
  <!--te-->

## Installation

You can install @nlpjs/lang-it:

```bash
    npm install @nlpjs/lang-it
```

## Normalization

Normalization of a text converts it to lowercase and remove decorations of characters.
 
```javascript
const { NormalizerIt } = require('@nlpjs/lang-it');

const normalizer = new NormalizerIt();
const input = 'Questo dòvrebbe essere normalizzato';
const result = normalizer.normalize(input);
console.log(result);
// output: questo dovrebbe essere normalizzato
```

## Tokenization

Tokenization splits a sentence into words.

```javascript
const { TokenizerIt } = require('@nlpjs/lang-it');

const tokenizer = new TokenizerIt();
const input = 'Questo dovrebbe essere tokenizzato';
const result = tokenizer.tokenize(input);
console.log(result);
// output: [ 'Questo', 'dovrebbe', 'essere', 'tokenizzato' ]
```

Tokenizer can also normalize the sentence before tokenizing, to do that provide a _true_ as second argument to the method _tokenize_

```javascript
const { TokenizerIt } = require('@nlpjs/lang-it');

const tokenizer = new TokenizerIt();
const input = 'Questo dovrebbe essere tokenizzato';
const result = tokenizer.tokenize(input, true);
console.log(result);
// output: [ 'questo', 'dovrebbe', 'essere', 'tokenizzato' ]
```

## Identify if a word is an italian stopword

Using the class _StopwordsIt_ you can identify if a word is an stopword:

```javascript
const { StopwordsIt } = require('@nlpjs/lang-it');

const stopwords = new StopwordsIt();
console.log(stopwords.isStopword('uno'));
// output: true
console.log(stopwords.isStopword('sviluppatore'));
// output: false
```

## Remove stopwords from an array of words

Using the class _StopwordsIt_ you can remove stopwords form an array of words:

```javascript
const { StopwordsIt } = require('@nlpjs/lang-it');

const stopwords = new StopwordsIt();
console.log(stopwords.removeStopwords(['ho', 'visto', 'uno', 'sviluppatore']));
// output: [ 'visto', 'sviluppatore' ]
```

## Change the stopwords dictionary
Using the class _StopwordsIt_ you can restart it dictionary and build it from another set of words:

```javascript
const { StopwordsIt } = require('@nlpjs/lang-it');

const stopwords = new StopwordsIt();
stopwords.dictionary = {};
stopwords.build(['ho', 'visto']);
console.log(stopwords.removeStopwords(['ho', 'visto', 'uno', 'sviluppatore']));
// output: [ 'uno', 'sviluppatore' ]
```

## Stemming word by word

An stemmer is an algorithm to calculate the _stem_ (root) of a word, removing affixes. 

You can stem one word using method _stemWord_:

```javascript
const { StemmerIt } = require('@nlpjs/lang-it');

const stemmer = new StemmerIt();
const input = 'svilupp';
console.log(stemmer.stemWord(input));
// output: program
```

## Stemming an array of words

You can stem an array of words using method _stem_:

```javascript
const { StemmerIt } = require('@nlpjs/lang-it');

const stemmer = new StemmerIt();
const input = ['ho', 'visto', 'uno', 'sviluppatore'];
console.log(stemmer.stem(input));
// outuput: [ 'ho', 'vist', 'uno', 'svilupp' ]
```

## Normalizing, Tokenizing and Stemming a sentence

As you can see, stemmer does not do internal normalization, so words with uppercases will remain uppercased. 
Also, stemmer works with lowercased affixes, so _sviluppatore_ will be stemmed as _svilupp_ but _SVILUPPATORE_ will not be changed.

You can tokenize and stem a sentence, including normalization, with the method _tokenizeAndStem_:

```javascript
const { StemmerIt } = require('@nlpjs/lang-it');

const stemmer = new StemmerIt();
const input = 'Ho visto uno SVILUPPATORE';
console.log(stemmer.tokenizeAndStem(input));
// output: [ 'ho', 'vist', 'uno', 'svilupp' ]
```

## Remove stopwords when stemming a sentence

When calling _tokenizeAndStem_ method from the class _StemmerIt_, the second parameter is a boolean to set if the stemmer must keep the stopwords (true) or remove them (false). Before using it, the stopwords instance must be set into the stemmer:

```javascript
const { StemmerIt, StopwordsIt } = require('@nlpjs/lang-it');

const stemmer = new StemmerIt();
stemmer.stopwords = new StopwordsIt();
const input = 'Ho visto uno sviluppatore';
console.log(stemmer.tokenizeAndStem(input, false));
// output: [ 'vist', 'svilupp' ]
```

## Sentiment Analysis

To use sentiment analysis you'll need to create a new _Container_ and use the plugin _LangIt_, because internally the _SentimentAnalyzer_ class try to retrieve the normalizer, tokenizer, stemmmer and sentiment dictionaries from the container.

```javascript
const { Container } = require('@nlpjs/core');
const { SentimentAnalyzer } = require('@nlpjs/sentiment');
const { LangIt } = require('@nlpjs/lang-it');

(async () => {
  const container = new Container();
  container.use(LangIt);
  const sentiment = new SentimentAnalyzer({ container });
  const result = await sentiment.process({
    locale: 'it',
    text: 'amore per i gatti',
  });
  console.log(result.sentiment);
})();
// output:
// {
//   score: 0.25,
//   numWords: 4,
//   numHits: 2,
//   average: 0.0625,
//   type: 'pattern',
//   locale: 'it',
//   vote: 'positive'
// }
```

The output of the sentiment analysis includes:
- *score*: final score of the sentence. 
- *numWords*: total words of the sentence.
- *numHits*: total words of the sentence identified as having a sentiment score.
- *average*: score divided by numWords
- *type*: type of dictionary used, values can be afinn, senticon or pattern.
- *locale*: locale of the sentence
- *vote*: positive if score greater than 0, negative if score lower than 0, neutral if score equals 0.

## Example of usage on a classifier

```javascript
const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangIt } = require('@nlpjs/lang-it');

(async () => {
  const container = await containerBootstrap();
  container.use(Nlp);
  container.use(LangIt);
  const nlp = container.get('nlp');
  nlp.settings.autoSave = false;
  nlp.addLanguage('it');
  // Adds the utterances and intents for the NLP
  nlp.addDocument('it', 'Addio per ora', 'greetings.bye');
  nlp.addDocument('it', 'arrivederci e stai attento', 'greetings.bye');
  nlp.addDocument('it', 'molto bene a dopo', 'greetings.bye');
  nlp.addDocument('it', 'devo andare', 'greetings.bye');
  nlp.addDocument('it', 'ciao', 'greetings.hello');
  
  // Train also the NLG
  nlp.addAnswer('it', 'greetings.bye', 'fino alla prossima volta');
  nlp.addAnswer('it', 'greetings.bye', 'A presto!');
  nlp.addAnswer('it', 'greetings.hello', 'Ciao, come stai');
  nlp.addAnswer('it', 'greetings.hello', 'Saluti!');
  await nlp.train();
  const response = await nlp.process('it', 'devo andare');
  console.log(response);
})();
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
