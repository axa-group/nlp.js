<div align="center">
<img src="https://github.com/axa-group/nlp.js/raw/master/screenshots/nlplogo.gif" width="925" height="auto"/>
</div>

# NLP.js

[![Build Status](https://travis-ci.com/axa-group/nlp.js.svg?branch=master)](https://travis-ci.com/axa-group/nlp.js)
[![Coverage Status](https://coveralls.io/repos/github/axa-group/nlp.js/badge.svg?branch=master)](https://coveralls.io/github/axa-group/nlp.js?branch=master)
[![NPM version](https://img.shields.io/npm/v/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp)
[![NPM downloads](https://img.shields.io/npm/dm/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp) [![Greenkeeper badge](https://badges.greenkeeper.io/axa-group/nlp.js.svg)](https://greenkeeper.io/)

"NLP.js" is a general natural language utility for nodejs. Currently supporting:

- Guess the language of a phrase
- Fast levenshtein distance of two strings
- Search the best substring of a string with less levenshtein distance to a given pattern.
- Get stemmers and tokenizers for several languages.
- Sentiment Analysis for phrases (with negation support).
- Named Entity Recognition and management, multilanguage, and accepting similar strings, so the introduced text does not need to be exact.
- Natural Language Processing Classifier, to classify utterance into intents.
- Natural Language Generation Manager, so from intents and conditions it can generate an answer.
- NLP Manager: a tool able to manage several languages, the Named Entities for each language, the utterance, and intents for the training of the classifier, and for a given utterance return the entity extraction, the intent classification and the sentiment analysis. Also, it is able to maintain a Natural Language Generation Manager for the answers.
- 34 languages with stemmers supported: Arabic (ar), Armenian (hy), Bengali (bn), Basque (eu), Catala (ca), Chinese (zh), Czech (cs), Danish (da), Dutch (nl), English (en), Farsi (fa), Finnish (fi), French (fr), Galician (gl), German (de), Greek (el), Hindi (hi), Hungarian (hu), Indonesian (id), Irish (ga), Italian (it), Japanese (ja), Norwegian (no), Portuguese (pt), Romanian (ro), Russian (ru), Slovene (sl), Spanish (es), Swedish (sv), Tagalog (tl), Tamil (ta), Thai (th), Turkish (tr), Ukrainian (uk)
- Any other language is supported through tokenization, even fantasy languages
<div align="center">
<img src="https://github.com/axa-group/nlp.js/raw/master/screenshots/hybridbot.gif" width="auto" height="auto"/>
</div>

## New in version 3!

The version 3 comes with some important changes, mainly focused on improving performance:
- NlpClassifier no longer exists, in favor of NluManager as the manager of several NLU classes, and is able to manage several languages and several domains inside each language.
- Now by default, each domain of a language has it's own neural network classifier. When a language has more than 1 domain, a master neural network is trained that instead of classifying into the intent, classify into de domain. That way the models are faster to train and have a better score.
- The language guesser is now trained with the trigrams from the utterances used to train. That means that has the best guessing, and also that non-existing languages are guessed (example, klingon).
- Added Tagalog and Galician languages.
- The console-bot example training time in version 2.x in my laptop was 108 seconds, in the version 3.x the training time went down to 3 seconds, so the improvement in performance is notable.
- Also the size of the model.nlp files are decreased, the console-bot example went from 1614KB down to 928KB.
- The browser version has decreased from 5.08MB down to 2.3MB

### TABLE OF CONTENTS

<!--ts-->

- [Installation](#installation)
- [React Native](#react-native)
- [Example of use](#example-of-use)
- [False Positives](#false-positives)
- [Log Training Progress](#log-training-progress)
- [Benchmarking](docs/benchmarking.md)
- [Language Support](docs/language-support.md)
  - [Classification](docs/language-support.md#classification)
  - [Sentiment Analysis](docs/language-support.md#sentiment-analysis)
  - [Builtin Entity Extraction](docs/language-support.md#builtin-entity-extraction)
  - [Example with languages](docs/example-with-languages.md)
  - [Auto Stemmer](docs/language-support.md#auto-stemmer)
- [Language Guesser](docs/language-guesser.md)
- [Similar Search](docs/similar-search.md)
- [NLU](docs/nlu-manager.md)
  - [NLU Manager](docs/nlu-manager.md)
  - [Brain NLU](docs/brain-nlu.md)
  - [Bayes NLU](docs/bayes-nlu.md)
  - [Binary Relevance NLU](docs/binary-relevance-nlu.md)
  - [Logistic Regression NLU](docs/logistic-regression-nlu.md)
- [NER Manager](docs/ner-manager.md)
  - [Enum Named Entities](docs/ner-manager.md#enum-named-entities)
  - [Regular Expression Named Entities](docs/ner-manager.md#regular-expression-named-entities)
  - [Trim Named Entities](docs/ner-manager.md#trim-named-entities)
  - [Utterances with duplicated Entities](docs/ner-manager.md#utterances-with-duplicated-entities)
- [Integration with Duckling](docs/builtin-duckling.md)
  - [Language support](docs/builtin-duckling.md#language-support)
  - [How to integrate with duckling](docs/builtin-duckling.md#how-to-integrate-with-duckling)
  - [Email Extraction](docs/builtin-duckling.md#email-extraction)
  - [Phone Number Extraction](docs/builtin-duckling.md#phone-number-extraction)
  - [URL Extraction](docs/builtin-duckling.md#url-extraction)
  - [Number Extraction](docs/builtin-duckling.md#number-extraction)
  - [Ordinal Extraction](docs/builtin-duckling.md#ordinal-extraction)
  - [Dimension Extraction](docs/builtin-duckling.md#dimension-extraction)
  - [Quantity Extraction](docs/builtin-duckling.md#quantity-extraction)
  - [Amount of Money Extraction](docs/builtin-duckling.md#amount-of-money-extraction)
  - [Date Extraction](docs/builtin-duckling.md#date-extraction)
- [Builtin Entity Extraction](docs/builtin-entity-extraction.md)
  - [Email Extraction](docs/builtin-entity-extraction.md#email-extraction)
  - [IP Extraction](docs/builtin-entity-extraction.md#ip-extraction)
  - [Hashtag Extraction](docs/builtin-entity-extraction.md#hashtag-extraction)
  - [Phone Number Extraction](docs/builtin-entity-extraction.md#phone-number-extraction)
  - [URL Extraction](docs/builtin-entity-extraction.md#url-extraction)
  - [Number Extraction](docs/builtin-entity-extraction.md#number-extraction)
  - [Ordinal Extraction](docs/builtin-entity-extraction.md#ordinal-extraction)
  - [Percentage Extraction](docs/builtin-entity-extraction.md#percentage-extraction)
  - [Age Extraction](docs/builtin-entity-extraction.md#age-extraction)
  - [Currency Extraction](docs/builtin-entity-extraction.md#currency-extraction)
  - [Date Extraction](docs/builtin-entity-extraction.md#date-extraction)
  - [Duration Extraction](docs/builtin-entity-extraction.md#duration-extraction)
- [Sentiment Analysis](docs/sentiment-analysis.md)
- [NLP Manager](docs/nlp-manager.md)
  - [Load/Save](docs/nlp-manager.md#loadsave)
  - [Import/Export](docs/nlp-manager.md#importexport)
  - [Context](docs/nlp-manager.md#context)
- [Slot Filling](docs/slot-filling.md)
- [Loading from Excel](docs/loading-from-excel.md)
- [Microsoft Bot Framework](docs/microsoft-bot-framework.md)
  - [Introduction](docs/microsoft-bot-framework.md#introduction)
  - [Example of use](docs/microsoft-bot-framework.md#example-of-use)
  - [Recognizer and Slot filling](docs/microsoft-bot-framework.md#recognizer-and-slot-filling)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Code of Conduct](#code-of-conduct)
- [Who is behind it](#who-is-behind-it)
- [License](#license.md)
  <!--te-->

## Installation

If you're looking to use NLP.js in your node application, you can install via NPM like so:

```bash
    npm install node-nlp
```

## React Native

There is a version of NLP.js that works in React Native, so you can build chatbots that can be trained and executed on the mobile even without internet. You can install it via NPM:

```bash
    npm install node-nlp-rn
```

Some Limitations:
- No Chinese
- Japanese stemmer is not the complete one
- No excel import
- No load from file neither save to file, but it still has import form json and export to json.

## Example of use

You can see a great example of use at the folder [`/examples/console-bot`](https://github.com/axa-group/nlp.js/tree/master/examples/console-bot). This example is able to train the bot and save the model to a file, so when the bot is started again, the model is loaded instead of trained again.

You can start to build your NLP from scratch with few lines:

```javascript
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });
// Adds the utterances and intents for the NLP
manager.addDocument('en', 'goodbye for now', 'greetings.bye');
manager.addDocument('en', 'bye bye take care', 'greetings.bye');
manager.addDocument('en', 'okay see you later', 'greetings.bye');
manager.addDocument('en', 'bye for now', 'greetings.bye');
manager.addDocument('en', 'i must go', 'greetings.bye');
manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('en', 'hi', 'greetings.hello');
manager.addDocument('en', 'howdy', 'greetings.hello');

// Train also the NLG
manager.addAnswer('en', 'greetings.bye', 'Till next time');
manager.addAnswer('en', 'greetings.bye', 'see you soon!');
manager.addAnswer('en', 'greetings.hello', 'Hey there!');
manager.addAnswer('en', 'greetings.hello', 'Greetings!');

// Train and save the model.
(async() => {
    await manager.train();
    manager.save();
    const response = await manager.process('en', 'I should go now');
    console.log(response);
})();
```

This will show this result in console:

```bash
{ utterance: 'I should go now',
  locale: 'en',
  languageGuessed: false,
  localeIso2: 'en',
  language: 'English',
  domain: 'default',
  classifications:
   [ { label: 'greetings.bye', value: 0.698219120207268 },
     { label: 'None', value: 0.30178087979273216 },
     { label: 'greetings.hello', value: 0 } ],
  intent: 'greetings.bye',
  score: 0.698219120207268,
  entities:
   [ { start: 12,
       end: 14,
       len: 3,
       accuracy: 0.95,
       sourceText: 'now',
       utteranceText: 'now',
       entity: 'datetime',
       resolution: [Object] } ],
  sentiment:
   { score: 1,
     comparative: 0.25,
     vote: 'positive',
     numWords: 4,
     numHits: 2,
     type: 'senticon',
     language: 'en' },
  actions: [],
  srcAnswer: 'Till next time',
  answer: 'Till next time' }
```

## False Positives

By default, the neural network tries to avoid false positives. To achieve that, one of the internal processes is that words never seen by the network, are represented as a feature that gives some weight into the None intent. So if you try the previous example with "I have to go" it will return the None intent because 2 of the 4 words have been never seen while training.
If you don't want to avoid those false positives, and you feel more comfortable with classifications into the intents that you declare, then you can disable this behavior with the useNoneFeature setting to false:

```javascript
const manager = new NlpManager({ languages: ['en'], nlu: { useNoneFeature: false } });
```

## Log Training Progress

You can also add a log progress, so you can trace what is happening during the training.
You can log the progress into console:

```javascript
const nlpManager = new NlpManager({ languages: ['en'], nlu: { log: true } });
```
Or you can provide your own log function:
```javascript
const logfn = (status, time) => console.log(status, time);
const nlpManager = new NlpManager({ languages: ['en'], nlu: { log: logfn } });
```

## Contributing

You can read the guide of how to contribute at [Contributing](https://github.com/axa-group/nlp.js/blob/master/CONTRIBUTING.md).

## Contributors

<a href="https://github.com/axa-group/nlp.js/graphs/contributors">
  <img src="https://contributors-img.firebaseapp.com/image?repo=axa-group/nlp.js" />
</a>

Made with [contributors-img](https://contributors-img.firebaseapp.com).

## Code of Conduct

You can read the Code of Conduct at [Code of Conduct](https://github.com/axa-group/nlp.js/blob/master/CODE_OF_CONDUCT.md).

## Who is behind it?

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
