# @nlpjs/lang-id

## Installation

You can install @nlpjs/lang-id:

```bash
    npm install @nlpjs/lang-id
```

## Normalization

Normalization of a text converts it to lowercase and remove decorations of characters.

```javascript
const { NormalizerId } = require("@nlpjs/lang-id");

const normalizer = new NormalizerId();
const input = "apa yang dikembangkan perúsahaan Anda";
const result = normalizer.normalize(input);
console.log(result);
// output: apa yang dikembangkan perusahaan anda
```

## Tokenization

Tokenization splits a sentence into words.

```javascript
const { TokenizerId } = require("@nlpjs/lang-id");

const tokenizer = new TokenizerId();
const input = "apa yang dikembangkan perusahaan Anda";
const result = tokenizer.tokenize(input);
console.log(result);
// output: [ 'apa', 'yang', 'dikembangkan', 'perusahaan', 'Anda' ]
```

Tokenizer can also normalize the sentence before tokenizing, to do that provide a _true_ as second argument to the method _tokenize_

```javascript
const { TokenizerId } = require("@nlpjs/lang-id");

const tokenizer = new TokenizerId();
const input = "apa yang dikembangkan perusahaan Anda";
const result = tokenizer.tokenize(input, true);
console.log(result);
// output: [ 'apa', 'yang', 'dikembangkan', 'perusahaan', 'anda' ]
```

## Identify if a word is an indonesian stopword

Using the class _StopwordsId_ you can identify if a word is an stopword:

```javascript
const { StopwordsId } = require("@nlpjs/lang-id");

const stopwords = new StopwordsId();
console.log(stopwords.isStopword("apa"));
// output: true
console.log(stopwords.isStopword("perusahaan"));
// output: false
```

## Remove stopwords from an array of words

Using the class _StopwordsId_ you can remove stopwords form an array of words:

```javascript
const { StopwordsId } = require("@nlpjs/lang-id");

const stopwords = new StopwordsId();
console.log(
  stopwords.removeStopwords([
    "apa",
    "yang",
    "dikembangkan",
    "perusahaan",
    "anda",
  ])
);
// output: [ 'dikembangkan', 'perusahaan' ]
```

## Change the stopwords dictionary

Using the class _StopwordsId_ you can restart it dictionary and build it from another set of words:

```javascript
const { StopwordsId } = require("@nlpjs/lang-id");

const stopwords = new StopwordsId();
stopwords.dictionary = {};
stopwords.build(["apa", "anda"]);
console.log(
  stopwords.removeStopwords([
    "apa",
    "yang",
    "dikembangkan",
    "perusahaan",
    "anda",
  ])
);
// output: [ 'yang', 'dikembangkan', 'perusahaan' ]
```

## Stemming word by word

An stemmer is an algorithm to calculate the _stem_ (root) of a word, removing affixes.

You can stem one word using method _stemWord_:

```javascript
const { StemmerId } = require("@nlpjs/lang-id");

const stemmer = new StemmerId();
const input = "dikembangkan";
console.log(stemmer.stemWord(input));
// output: kembang
```

## Stemming an array of words

You can stem an array of words using method _stem_:

```javascript
const { StemmerId } = require("@nlpjs/lang-id");

const stemmer = new StemmerId();
const input = ["apa", "yang", "dikembangkan", "perusahaan", "Anda"];
console.log(stemmer.stem(input));
// outuput: [ 'apa', 'yang', 'kembang', 'usaha', 'Anda' ]
```

## Normalizing, Tokenizing and Stemming a sentence

As you can see, stemmer does not do internal normalization, so words with uppercases will remain uppercased.
Also, stemmer works with lowercased affixes, so _perusahaan_ will be stemmed as _usaha_ but _PERUSAHAAN_ will not be changed.

You can tokenize and stem a sentence, including normalization, with the method _tokenizeAndStem_:

```javascript
const { StemmerId } = require("@nlpjs/lang-id");

const stemmer = new StemmerId();
const input = "apa yang dikembangkan PERUSAHAAN Anda";
console.log(stemmer.tokenizeAndStem(input));
// output: [ 'apa', 'yang', 'kembang', 'usaha', 'anda' ]
```

## Remove stopwords when stemming a sentence

When calling _tokenizeAndStem_ method from the class _StemmerId_, the second parameter is a boolean to set if the stemmer must keep the stopwords (true) or remove them (false). Before using it, the stopwords instance must be set into the stemmer:

```javascript
const { StemmerId, StopwordsId } = require("@nlpjs/lang-id");

const stemmer = new StemmerId();
stemmer.stopwords = new StopwordsId();
const input = "apa yang dikembangkan perusahaan Anda";
console.log(stemmer.tokenizeAndStem(input, false));
// output: [ 'kembang', 'usaha' ]
```

## Sentiment Analysis

To use sentiment analysis you'll need to create a new _Container_ and use the plugin _LangId_, because internally the _SentimentAnalyzer_ class try to retrieve the normalizer, tokenizer, stemmmer and sentiment dictionaries from the container.

```javascript
const { Container } = require("@nlpjs/core");
const { SentimentAnalyzer } = require("@nlpjs/sentiment");
const { LangId } = require("@nlpjs/lang-id");

(async () => {
  const container = new Container();
  container.use(LangId);
  const sentiment = new SentimentAnalyzer({ container });
  const result = await sentiment.process({
    locale: "id",
    text: "kucing itu mengagumkan",
  });
  console.log(result.sentiment);
})();
// output:
// {
//   score: 4,
//   numWords: 3,
//   numHits: 1,
//   average: 1.3333333333333333,
//   type: 'afinn',
//   locale: 'id',
//   vote: 'positive'
// }
```

The output of the sentiment analysis includes:

- _score_: final score of the sentence.
- _numWords_: total words of the sentence.
- _numHits_: total words of the sentence identified as having a sentiment score.
- _average_: score divided by numWords
- _type_: type of dictionary used, values can be afinn, senticon or pattern.
- _locale_: locale of the sentence
- _vote_: positive if score greater than 0, negative if score lower than 0, neutral if score equals 0.
