![NLPjs logo](https://github.com/axa-group/nlp.js/raw/master/screenshots/nlplogo.gif)

# NLP.js

[![Build Status](https://travis-ci.com/axa-group/nlp.js.svg?branch=master)](https://travis-ci.com/axa-group/nlp.js)
[![Coverage Status](https://coveralls.io/repos/github/axa-group/nlp.js/badge.svg?branch=master)](https://coveralls.io/github/axa-group/nlp.js?branch=master)
[![NPM version](https://img.shields.io/npm/v/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp)
[![NPM downloads](https://img.shields.io/npm/dm/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp) 
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=axa-group_nlp.js&metric=alert_status)](https://sonarcloud.io/dashboard?id=axa-group_nlp.js)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=axa-group_nlp.js&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=axa-group_nlp.js)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=axa-group_nlp.js&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=axa-group_nlp.js)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=axa-group_nlp.js&metric=security_rating)](https://sonarcloud.io/dashboard?id=axa-group_nlp.js)

*If you're looking for the version 3 docs, you can find them here* [Version 3](https://github.com/axa-group/nlp.js/blob/master/docs/v3/README.md)

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
- 40 languages natively supported, 104 languages supported with BERT integration
- Any other language is supported through tokenization, even fantasy languages

![Hibridbot](https://github.com/axa-group/nlp.js/raw/master/screenshots/hybridbot.gif)

## New in version 4`!`

The version 4 is very different from previous versions. Until this version, NLP.js was a monolithic library. The big changes:

- Now is splitted into small independant packages.
- So every language has its own package
- It provides a plugin system, so you can provide your own plugins or replace the existing ones.
- It provides a container system for the plugins, settings of the plugins and also pipelines
- A pipeline is code of how the plugins interact. Usually is something linear: there is an input into the plugin, and generates the input for the next one. To put an example about this, now the preparation of a utterance (the process to convert the utterance to a hashmap of stemmed features) is a pipeline like this: normalize -> tokenize -> removeStopwords -> stem -> arrToObj
- There is simple compiler for the pipelines, but can be also build using a modified version of javascript and python (compilers are also included as plugins, so other languages can be added as a plugin).
- Now NLP.js includes also connectors, understanding connector as something that has at least 2 methods: hear and say. Example of connectors included: Console Connector, Microsoft Bot Framework Connector and a Direct Line Offline Connector (this one allows to build a web chatbot using the Microsoft Webchat, but without having to deploy anything in Azure).
- Some plugins can be registered by language so for different languages different plugins will be used. Also some plugins, like NLU, can be registered not only by language but also by domain (functional set of intents that can be trained separately)
- One example of the previous things is that as a Microsoft LUIS NLU plugin is provided, you can make that your chatbots use the NLU of NLP.js for some languages/domains, and LUIS for other languages/domains.
- Having plugins and pipelines makes it possible to write chatbots only modifying the configuration and the pipelines file, without modifying the code.

### TABLE OF CONTENTS

<!--ts-->

- [Installation](#installation)
- [QuickStart](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md)
  - [Install the library](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#install-the-library)
  - [Create the code](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#create-the-code)
  - [Extracting the corpus into a file](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#extracting-the-corpus-into-a-file)
  - [Extracting the configuration into a file](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#extracting-the-configuration-into-a-file)
  - [Creating your first pipeline](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#creating-your-first-pipeline)
  - [Console Connector](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#adding-your-first-connector)
  - [Extending your bot with the pipeline](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#extending-your-bot-with-the-pipeline)
  - [Adding Multilanguage](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#adding-multilanguage)
  - [Adding API and WebChat](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#adding-api-and-webchat)
  - [Using Microsoft Bot Framework](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#using-microsoft-bot-framework)
  - [Recognizing the bot name and the channel](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#recognizing-the-bot-name-and-the-channel)
  - [One bot per connector](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#one-bot-per-connector)
  - [Different port for Microsoft Bot Framework and Webchat](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#different-port-for-microsoft-bot-framework-and-webchat)
  - [Adding logic to an intent](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#adding-logic-to-an-intent)
- [Web and React Native](https://github.com/axa-group/nlp.js/blob/master/docs/v4/webandreact.md)
  - [Preparing to generate a bundle](https://github.com/axa-group/nlp.js/blob/master/docs/v4/webandreact.md#preparing-to-generate-a-bundle)
  - [Your first web NLP](https://github.com/axa-group/nlp.js/blob/master/docs/v4/webandreact.md#your-first-web-nlp)
  - [Creating a distributable version](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#creating-a-distributable-version)
  - [Load corpus from URL](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#load-corpus-from-url)
- [QnA](https://github.com/axa-group/nlp.js/blob/master/docs/v4/qna.md)
  - [Install the library and the qna plugin](https://github.com/axa-group/nlp.js/blob/master/docs/v4/qna.md#install-the-library-and-the-qna-plugin)
  - [Train and test a QnA file](https://github.com/axa-group/nlp.js/blob/master/docs/v4/qna.md#train-and-test-a-qna-file)
  - [Extracting the configuration into a file](https://github.com/axa-group/nlp.js/blob/master/docs/v4/qna.md#extracting-the-configuration-into-a-file)
  - [Exposing the bot with a Web and API](https://github.com/axa-group/nlp.js/blob/master/docs/v4/qna.md#exposing-the-bot-with-a-web-and-api)
- [NeuralNetwork](https://github.com/axa-group/nlp.js/blob/master/docs/v4/neural.md)
  - [Introduction](https://github.com/axa-group/nlp.js/blob/master/docs/v4/neural.md#introduction)
  - [Installing](https://github.com/axa-group/nlp.js/blob/master/docs/v4/neural.md#installing)
  - [Corpus Format](https://github.com/axa-group/nlp.js/blob/master/docs/v4/neural.md#corpus-format)
  - [Example of use](https://github.com/axa-group/nlp.js/blob/master/docs/v4/neural.md#example-of-use)
  - [Exporting trained model to JSON and importing](https://github.com/axa-group/nlp.js/blob/master/docs/v4/neural.md#exporting-trained-model-to-json-and-importing)
  - [Options](https://github.com/axa-group/nlp.js/blob/master/docs/v4/neural.md#options)
- [Logger](https://github.com/axa-group/nlp.js/blob/master/docs/v4/logger.md)
  - [Introduction](https://github.com/axa-group/nlp.js/blob/master/docs/v4/logger.md#introduction)
  - [Default logger in @nlpjs/core](https://github.com/axa-group/nlp.js/blob/master/docs/v4/logger.md#default-logger-in-nlpjscore)
  - [Default logger in @nlpjs/basic](https://github.com/axa-group/nlp.js/blob/master/docs/v4/logger.md#default-logger-in-nlpjsbasic)
  - [Adding your own logger to the container](https://github.com/axa-group/nlp.js/blob/master/docs/v4/logger.md#adding-your-own-logger-to-the-container)
- [React Native](#react-native)
- [Example of use](#example-of-use)
- [False Positives](#false-positives)
- [Log Training Progress](#log-training-progress)
- [Benchmarking](https://github.com/axa-group/nlp.js/blob/master/docs/v3/benchmarking.md)
- [Language Support](https://github.com/axa-group/nlp.js/blob/master/docs/v4/language-support.md)
  - [Supported languages](https://github.com/axa-group/nlp.js/blob/master/docs/v4/language-support.md#supported-languages)
  - [Sentiment Analysis](https://github.com/axa-group/nlp.js/blob/master/docs/v4/language-support.md#sentiment-analysis)
  - [Comparision with other NLP products](https://github.com/axa-group/nlp.js/blob/master/docs/v4/language-support.md#comparision-with-other-nlp-products)
  - [Example with several languages](https://github.com/axa-group/nlp.js/blob/master/docs/v4/language-support.md#example-with-several-languages)
- [Language Guesser](https://github.com/axa-group/nlp.js/blob/master/docs/v3/language-guesser.md)
- [Similar Search](https://github.com/axa-group/nlp.js/blob/master/docs/v3/similar-search.md)
- [NLU](https://github.com/axa-group/nlp.js/blob/master/docs/v3/nlu-manager.md)
  - [NLU Manager](https://github.com/axa-group/nlp.js/blob/master/docs/v3/nlu-manager.md)
  - [Brain NLU](https://github.com/axa-group/nlp.js/blob/master/docs/v3/brain-nlu.md)
  - [Bayes NLU](https://github.com/axa-group/nlp.js/blob/master/docs/v3/bayes-nlu.md)
  - [Binary Relevance NLU](https://github.com/axa-group/nlp.js/blob/master/docs/v3/binary-relevance-nlu.md)
  - [Logistic Regression NLU](https://github.com/axa-group/nlp.js/blob/master/docs/v3/logistic-regression-nlu.md)
- [NER Manager](https://github.com/axa-group/nlp.js/blob/master/docs/v3/ner-manager.md)
  - [Enum Named Entities](https://github.com/axa-group/nlp.js/blob/master/docs/v3/ner-manager.md#enum-named-entities)
  - [Regular Expression Named Entities](https://github.com/axa-group/nlp.js/blob/master/docs/v3/ner-manager.md#regular-expression-named-entities)
  - [Trim Named Entities](https://github.com/axa-group/nlp.js/blob/master/docs/v3/ner-manager.md#trim-named-entities)
  - [Utterances with duplicated Entities](https://github.com/axa-group/nlp.js/blob/master/docs/v3/ner-manager.md#utterances-with-duplicated-entities)
- [Integration with Duckling](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-duckling.md)
  - [Language support](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-duckling.md#language-support)
  - [How to integrate with duckling](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-duckling.md#how-to-integrate-with-duckling)
  - [Email Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-duckling.md#email-extraction)
  - [Phone Number Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-duckling.md#phone-number-extraction)
  - [URL Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-duckling.md#url-extraction)
  - [Number Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-duckling.md#number-extraction)
  - [Ordinal Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-duckling.md#ordinal-extraction)
  - [Dimension Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-duckling.md#dimension-extraction)
  - [Quantity Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-duckling.md#quantity-extraction)
  - [Amount of Money Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-duckling.md#amount-of-money-extraction)
  - [Date Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-duckling.md#date-extraction)
- [Builtin Entity Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md)
  - [Email Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md#email-extraction)
  - [IP Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md#ip-extraction)
  - [Hashtag Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md#hashtag-extraction)
  - [Phone Number Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md#phone-number-extraction)
  - [URL Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md#url-extraction)
  - [Number Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md#number-extraction)
  - [Ordinal Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md#ordinal-extraction)
  - [Percentage Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md#percentage-extraction)
  - [Age Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md#age-extraction)
  - [Currency Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md#currency-extraction)
  - [Date Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md#date-extraction)
  - [Duration Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md#duration-extraction)
- [Sentiment Analysis](https://github.com/axa-group/nlp.js/blob/master/docs/v3/sentiment-analysis.md)
- [NLP Manager](https://github.com/axa-group/nlp.js/blob/master/docs/v3/nlp-manager.md)
  - [Load/Save](https://github.com/axa-group/nlp.js/blob/master/docs/v3/nlp-manager.md#loadsave)
  - [Import/Export](https://github.com/axa-group/nlp.js/blob/master/docs/v3/nlp-manager.md#importexport)
  - [Context](https://github.com/axa-group/nlp.js/blob/master/docs/v3/nlp-manager.md#context)
- [Slot Filling](https://github.com/axa-group/nlp.js/blob/master/docs/v3/slot-filling.md)
- [Loading from Excel](https://github.com/axa-group/nlp.js/blob/master/docs/v3/loading-from-excel.md)
- [Microsoft Bot Framework](https://github.com/axa-group/nlp.js/blob/master/docs/v3/microsoft-bot-framework.md)
  - [Introduction](https://github.com/axa-group/nlp.js/blob/master/docs/v3/microsoft-bot-framework.md#introduction)
  - [Example of use](https://github.com/axa-group/nlp.js/blob/master/docs/v3/microsoft-bot-framework.md#example-of-use)
  - [Recognizer and Slot filling](https://github.com/axa-group/nlp.js/blob/master/docs/v3/microsoft-bot-framework.md#recognizer-and-slot-filling)
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
- No loading from a file neither save to a file, but it still has import form json and export to json.

## Example of use

You can see a great example of use at the folder [`/examples/02-qna-classic`](https://github.com/axa-group/nlp.js/tree/master/examples/02-qna-classic). This example is able to train the bot and save the model to a file, so when the bot is started again, the model is loaded instead of trained again.

You can start to build your NLP from scratch with few lines:

```javascript
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'], forceNER: true });
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

You can read the guide of how to contribute at [Contributing](CONTRIBUTING.md).

## Contributors

[![Contributors](https://contributors-img.firebaseapp.com/image?repo=axa-group/nlp.js)](https://github.com/axa-group/nlp.js/graphs/contributors)

Made with [contributors-img](https://contributors-img.firebaseapp.com).

## Code of Conduct

You can read the Code of Conduct at [Code of Conduct](CODE_OF_CONDUCT.md).

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
