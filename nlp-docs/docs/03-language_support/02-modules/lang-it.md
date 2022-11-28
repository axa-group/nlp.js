# @nlpjs/lang-it

## Installation

You can install @nlpjs/lang-it:

```bash
    npm install @nlpjs/lang-it
```

## Normalization

Normalization of a text converts it to lowercase and remove decorations of characters.

```javascript
const { NormalizerIt } = require("@nlpjs/lang-it");

const normalizer = new NormalizerIt();
const input = "Questo dòvrebbe essere normalizzato";
const result = normalizer.normalize(input);
console.log(result);
// output: questo dovrebbe essere normalizzato
```

## Tokenization

Tokenization splits a sentence into words.

```javascript
const { TokenizerIt } = require("@nlpjs/lang-it");

const tokenizer = new TokenizerIt();
const input = "Questo dovrebbe essere tokenizzato";
const result = tokenizer.tokenize(input);
console.log(result);
// output: [ 'Questo', 'dovrebbe', 'essere', 'tokenizzato' ]
```

Tokenizer can also normalize the sentence before tokenizing, to do that provide a _true_ as second argument to the method _tokenize_

```javascript
const { TokenizerIt } = require("@nlpjs/lang-it");

const tokenizer = new TokenizerIt();
const input = "Questo dovrebbe essere tokenizzato";
const result = tokenizer.tokenize(input, true);
console.log(result);
// output: [ 'questo', 'dovrebbe', 'essere', 'tokenizzato' ]
```

## Identify if a word is an italian stopword

Using the class _StopwordsIt_ you can identify if a word is an stopword:

```javascript
const { StopwordsIt } = require("@nlpjs/lang-it");

const stopwords = new StopwordsIt();
console.log(stopwords.isStopword("uno"));
// output: true
console.log(stopwords.isStopword("sviluppatore"));
// output: false
```

## Remove stopwords from an array of words

Using the class _StopwordsIt_ you can remove stopwords form an array of words:

```javascript
const { StopwordsIt } = require("@nlpjs/lang-it");

const stopwords = new StopwordsIt();
console.log(stopwords.removeStopwords(["ho", "visto", "uno", "sviluppatore"]));
// output: [ 'visto', 'sviluppatore' ]
```

## Change the stopwords dictionary

Using the class _StopwordsIt_ you can restart it dictionary and build it from another set of words:

```javascript
const { StopwordsIt } = require("@nlpjs/lang-it");

const stopwords = new StopwordsIt();
stopwords.dictionary = {};
stopwords.build(["ho", "visto"]);
console.log(stopwords.removeStopwords(["ho", "visto", "uno", "sviluppatore"]));
// output: [ 'uno', 'sviluppatore' ]
```

## Stemming word by word

An stemmer is an algorithm to calculate the _stem_ (root) of a word, removing affixes.

You can stem one word using method _stemWord_:

```javascript
const { StemmerIt } = require("@nlpjs/lang-it");

const stemmer = new StemmerIt();
const input = "svilupp";
console.log(stemmer.stemWord(input));
// output: program
```

## Stemming an array of words

You can stem an array of words using method _stem_:

```javascript
const { StemmerIt } = require("@nlpjs/lang-it");

const stemmer = new StemmerIt();
const input = ["ho", "visto", "uno", "sviluppatore"];
console.log(stemmer.stem(input));
// outuput: [ 'ho', 'vist', 'uno', 'svilupp' ]
```

## Normalizing, Tokenizing and Stemming a sentence

As you can see, stemmer does not do internal normalization, so words with uppercases will remain uppercased.
Also, stemmer works with lowercased affixes, so _sviluppatore_ will be stemmed as _svilupp_ but _SVILUPPATORE_ will not be changed.

You can tokenize and stem a sentence, including normalization, with the method _tokenizeAndStem_:

```javascript
const { StemmerIt } = require("@nlpjs/lang-it");

const stemmer = new StemmerIt();
const input = "Ho visto uno SVILUPPATORE";
console.log(stemmer.tokenizeAndStem(input));
// output: [ 'ho', 'vist', 'uno', 'svilupp' ]
```

## Remove stopwords when stemming a sentence

When calling _tokenizeAndStem_ method from the class _StemmerIt_, the second parameter is a boolean to set if the stemmer must keep the stopwords (true) or remove them (false). Before using it, the stopwords instance must be set into the stemmer:

```javascript
const { StemmerIt, StopwordsIt } = require("@nlpjs/lang-it");

const stemmer = new StemmerIt();
stemmer.stopwords = new StopwordsIt();
const input = "Ho visto uno sviluppatore";
console.log(stemmer.tokenizeAndStem(input, false));
// output: [ 'vist', 'svilupp' ]
```

## Sentiment Analysis

To use sentiment analysis you'll need to create a new _Container_ and use the plugin _LangIt_, because internally the _SentimentAnalyzer_ class try to retrieve the normalizer, tokenizer, stemmmer and sentiment dictionaries from the container.

```javascript
const { Container } = require("@nlpjs/core");
const { SentimentAnalyzer } = require("@nlpjs/sentiment");
const { LangIt } = require("@nlpjs/lang-it");

(async () => {
  const container = new Container();
  container.use(LangIt);
  const sentiment = new SentimentAnalyzer({ container });
  const result = await sentiment.process({
    locale: "it",
    text: "amore per i gatti",
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

- _score_: final score of the sentence.
- _numWords_: total words of the sentence.
- _numHits_: total words of the sentence identified as having a sentiment score.
- _average_: score divided by numWords
- _type_: type of dictionary used, values can be afinn, senticon or pattern.
- _locale_: locale of the sentence
- _vote_: positive if score greater than 0, negative if score lower than 0, neutral if score equals 0.

## Example of usage on a classifier

```javascript
const { containerBootstrap } = require("@nlpjs/core");
const { Nlp } = require("@nlpjs/nlp");
const { LangIt } = require("@nlpjs/lang-it");

(async () => {
  const container = await containerBootstrap();
  container.use(Nlp);
  container.use(LangIt);
  const nlp = container.get("nlp");
  nlp.settings.autoSave = false;
  nlp.addLanguage("it");
  // Adds the utterances and intents for the NLP
  nlp.addDocument("it", "Addio per ora", "greetings.bye");
  nlp.addDocument("it", "arrivederci e stai attento", "greetings.bye");
  nlp.addDocument("it", "molto bene a dopo", "greetings.bye");
  nlp.addDocument("it", "devo andare", "greetings.bye");
  nlp.addDocument("it", "ciao", "greetings.hello");

  // Train also the NLG
  nlp.addAnswer("it", "greetings.bye", "fino alla prossima volta");
  nlp.addAnswer("it", "greetings.bye", "A presto!");
  nlp.addAnswer("it", "greetings.hello", "Ciao, come stai");
  nlp.addAnswer("it", "greetings.hello", "Saluti!");
  await nlp.train();
  const response = await nlp.process("it", "devo andare");
  console.log(response);
})();
```
