<div align="center">
<img src="https://github.com/axa-group/nlp.js/raw/master/screenshots/nlplogo.gif" width="925" height="auto"/>
</div>

# NLP.js

[![Build Status](https://travis-ci.com/axa-group/nlp.js.svg?branch=master)](https://travis-ci.com/axa-group/nlp.js)
[![Coverage Status](https://coveralls.io/repos/github/axa-group/nlp.js/badge.svg?branch=master)](https://coveralls.io/github/axa-group/nlp.js?branch=master)
[![NPM version](https://img.shields.io/npm/v/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp)
[![NPM downloads](https://img.shields.io/npm/dm/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp) [![Greenkeeper badge](https://badges.greenkeeper.io/axa-group/nlp.js.svg)](https://greenkeeper.io/)

"NLP.js" is a general natural language utilities for nodejs. Currently supporting:

- Guess the language of a phrase
- Fast levenshtein distance of two strings
- Search the best substring of a string with less levenshtein distance to a given pattern.
- Get stemmers and tokenizers for several languages.
- Sentiment Analysis for phrases (with negation support).
- Named Entity Recognition and management, multilanguage, and accepting similar strings, so the introduced text does not need to be exact.
- Natural Language Processing Classifier, to classify utterance into intents.
- Natural Language Generation Manager, so from intents and conditions it can generate an answer.
- NLP Manager: a tool able to manage several languages, the Named Entities for each language, the utterance and intents for the training of the classifier, and for a given utterance return the entity extraction, the intent classification and the sentiment analysis. Also, it is able to maintain a Natural Language Generation Manager for the answers.
- 27 languages with stemmers supported: Arabic (ar), Armenian (hy), Basque (eu), Catala (ca), Chinese (zh), Czech (cs), Danish (da), Dutch (nl), English (en), Farsi (fa), Finnish (fi), French (fr), German (de), Hungarian (hu), Indonesian (id), Irish (ga), Italian (it), Japanese (ja), Norwegian (no), Portuguese (pt), Romanian (ro), Russian (ru), Slovene (sl), Spanish (es), Swedish (sv), Tamil (ta), Turkish (tr)
- Any other language is supported through tokenization, even fantasy languages
<div align="center">
<img src="https://github.com/axa-group/nlp.js/raw/master/screenshots/hybridbot.gif" width="auto" height="auto"/>
</div>

### TABLE OF CONTENTS

<!--ts-->

- [Installation](#installation)
- [Example of use](#example-of-use)
- [Benchmarking](docs/benchmarking.md)
- [Language Support](docs/language-support.md)
  - [Classification](docs/language-support.md#classification)
  - [Sentiment Analysis](docs/language-support.md#sentiment-analysis)
  - [Builtin Entity Extraction](docs/language-support.md#builtin-entity-extraction)
  - [Example with languages](docs/example-with-languages.md)
- [Language Guesser](docs/language-guesser.md)
- [Similar Search](docs/similar-search.md)
- [NLP Classifier](docs/nlp-classifier.md)
- [NER Manager](docs/ner-manager.md)
  - [Enum Named Entities](docs/ner-manager.md#enum-named-entities)
  - [Regular Expression Named Entities](docs/ner-manager.md#regular-expression-named-entities)
  - [Trim Named Entities](docs/ner-manager.md#trim-named-entities)
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
- [Code of Conduct](#code-of-conduct)
- [Who is behind it](#who-is-behind-it)
- [License](#license.md)
  <!--te-->

## Installation

If you're looking to use NLP.js in your node application, you can install via NPM like so:

```bash
    npm install node-nlp
```

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
    const response = await manager.process('en', 'I have to go');
    console.log(response);
})();
```

This will show this result in console:

```bash
{ locale: 'en',
  localeIso2: 'en',
  language: 'English',
  utterance: 'I have to go',
  classification:
   [ { label: 'greetings.bye', value: 0.9791293407583773 },
     { label: 'greetings.hello', value: 0.020870659241622735 } ],
  intent: 'greetings.bye',
  score: 0.9791293407583773,
  entities: [],
  sentiment:
   { score: 0.5,
     comparative: 0.125,
     vote: 'positive',
     numWords: 4,
     numHits: 1,
     type: 'senticon',
     language: 'en' },
  answer: 'Till next time' }
```

## Contributing

You can read the guide of how to contribute at [Contributing](https://github.com/axa-group/nlp.js/blob/master/CONTRIBUTING.md).

## Code of Conduct

You can read the Code of Conduct at [Code of Conduct](https://github.com/axa-group/nlp.js/blob/master/CODE_OF_CONDUCT.md).

## Who is behind it?

This project is developed by AXA Shared Services Spain S.A.

If you need to contact us, you can do it at the email jesus.seijas@axa.com

## License

Copyright (c) AXA Shared Services Spain S.A.

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
