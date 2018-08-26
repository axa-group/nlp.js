NLP.js
=======

[![Build Status](https://travis-ci.com/axa-group/nlp.js.svg?branch=master)](https://travis-ci.com/axa-group/nlp.js)

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

### TABLE OF CONTENTS

* [Installation](#installation)
* [Example of use](#example-of-use)
* [Language Support](#language-support)
* [Language Guesser](#language-guesser)
* [Similar Search](#similar-search)
* [NLP Classifier](#nlp-classifier)
* [NER Manager](#ner-manager)
* [Sentiment Analysis](#sentiment-analysis)
* [NLP Manager](#nlp-manager)
* [Loading from Excel](#loading-from-excel)
* [Contributing](#contributing)
* [Code of Conduct](#code-of-conduct)
* [Who is behind it](#who-is-behind-it)
* [License](#license)

## Installation

If you're looking to use NLP.js in your node application, you can install via NPM like so:

```bash
    npm install node-nlp
```

## Example of use

You can see a great example of use at the folder \examples\console-bot. This example is able to train the bot and save the model to a file, so when the bot is started again, the model is loaded instead of trained again.

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
  manager.train();
  manager.save();

  console.log(manager.process('en', 'I have to go'));
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

## Language Support

There are several languages supported. The language support can be for the Stemmers or for Sentiment Analysis.
Inside Stemmers there are three type of stemmers: Natural, Snowball and Custom. Natural stemmers are these supported by the Natural library, while Snowball stemmers are the ported version from the Snowball ones from Java. Custom stemmers are those with custom development out of the scope of Natural or Snowball.
Inside Sentiment Analysis, there are three possible algoritms: AFINN, Senticon and Pattern.

| Language        | Natural | Snowball | Custom | AFINN | Senticon | Pattern |
|:--------------- |:-------:|:--------:|:------:|:-----:|:--------:|:-------:|
| Chinese (zh)    |         |          | X      |       |          |         |
| Danish (da)     |         | X        |        |       |          |         |
| Dutch (nl)      | X       | X        |        |       |          | X       |
| English (en)    | X       | X        |        | X     | X        | X       |
| Farsi (fa)      | X       |          |        |       |          |         |
| Finnish (fi)    |         | X        |        |       |          |         |
| French (fr)     | X       | X        |        |       |          | X       |
| German (de)     |         | X        |        |       |          |         |
| Hungarian (hu)  |         | X        |        |       |          |         |
| Indonesian (id) | X       |          |        |       |          |         |
| Italian (it)    | X       | X        |        |       |          | X       |
| Japanese (ja)   | X       |          |        |       |          |         |
| Norwegian (no)  | X       | X        |        |       |          |         |
| Portuguese (pt) | X       | X        |        |       |          |         |
| Romanian (ro)   |         | X        |        |       |          |         |
| Russian (ru)    | X       | X        |        |       |          |         |
| Spanish (es)    | X       | X        |        | X     | X        |         |
| Swedish (sv)    | X       | X        |        |       |          |         |
| Turkish (tr)    |         | X        |        |       |          |         |


## Language Guesser

The language object gives your code the skill to guess the language of a text. The method guess do that returning to you an array of all the languages ordered descending by the score.

```javascript
  const { Language } = require('node-nlp');

  const language = new Language();
  const guess = language.guess('When the night has come And the land is dark And the moon is the only light we see');
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
  let guess = language.guess('Quan arriba la nit i la terra és fosca i la lluna és l\'única llum que podem veure', null, 3);
  console.log(guess.length);
  console.log(guess[0]);
 ```
 
 In console you'll see:
```bash
3
{ alpha3: 'cat', alpha2: 'ca', language: 'Catalan', score: 1 }
```

You can also provide a whitelist of accepted language to find the one that fits better

```javascript
  const { Language } = require('node-nlp');

  const language = new Language();
  let guess = language.guess('When the night has come And the land is dark And the moon is the only light we see', ['de', 'es']);
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
  let guess = language.guessBest('When the night has come And the land is dark And the moon is the only light we see');
  console.log(guess[0]);
  let guess = language.guessBest('When the night has come And the land is dark And the moon is the only light we see', ['de', 'es']);
  console.log(guess[0]);
 ```

That will show this in console:

```bash
{ alpha3: 'eng', alpha2: 'en', language: 'English', score: 1 }
{ alpha3: 'deu', alpha2: 'de', language: 'German', score: 1 }
```

## Similar Search

Similar Search is used to calculate the levenshtein distance between two strings and also is able to search the best substring inside a string, i.e., the substring of a string which levenshtein distance is the smaller to another string.

You can calculate the levenshtein distance:

```javascript
  const { SimilarSearch } = require('node-nlp');

  const similar = new SimilarSearch();
  similar.getSimilarity('mikailovitch', 'Mikhaïlovitch'); 
  // returns 3
```

Also you can use collation so case and special characters are compared using collation:
```javascript
  const { SimilarSearch } = require('node-nlp');

  const similar = new SimilarSearch({ useCollation: true });
  similar.getSimilarity('mikailovitch', 'Mikhaïlovitch'); 
  // returns 1
```

Unfortunately, collation is very slow, but you can use normalization. Normalization preprocess strings converting to lowercase and converting accented characters to their unaccented equivalent, and this is pretty much faster than collation:
```javascript
  const { SimilarSearch } = require('node-nlp');

  const similar = new SimilarSearch({ normalize: true });
  similar.getSimilarity('mikailovitch', 'Mikhaïlovitch'); 
  // returns 1
```

You can search the best substring of string with the lower levenshtein distance. The accuracy is calculated as *(length - distance) / length*:

```javascript
  const { SimilarSearch } = require('node-nlp');

  const similar = new SimilarSearch();
  const text1 = 'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate.';
  const text2 = 'interdumaultriciesbneque';
  const result = similar.getBestSubstring(text1, text2);
  // result is { start: 6, end: 30, levenshtein: 2, accuracy: 0.9166666666666666 }
```

## NLP Classifier

You can train a classifier (indicating language) with utterances and their intents.
Then you can give a different utterance, and get the classifications for each intent, sorted descending by the score value.

```javascript
  const { NlpClassifier } = require('node-nlp');

  const classifier = new NlpClassifier({ language: 'fr' });
  classifier.add('Bonjour', 'greet');
  classifier.add('bonne nuit', 'greet');
  classifier.add('Bonsoir', 'greet');
  classifier.add('J\'ai perdu mes clés', 'keys');
  classifier.add('Je ne trouve pas mes clés', 'keys');
  classifier.add('Je ne me souviens pas où sont mes clés', 'keys');
  classifier.train();
  const classifications = classifier.getClassifications('où sont mes clés');
  // value is [ { label: 'keys', value: 0.994927593677957 }, { label: 'greet', value: 0.005072406322043053 } ]
```

Or you can get only the best classification

```javascript
  const { NlpClassifier } = require('node-nlp');

  const classifier = new NlpClassifier({ language: 'fr' });
  classifier.add('Bonjour', 'greet');
  classifier.add('bonne nuit', 'greet');
  classifier.add('Bonsoir', 'greet');
  classifier.add('J\'ai perdu mes clés', 'keys');
  classifier.add('Je ne trouve pas mes clés', 'keys');
  classifier.add('Je ne me souviens pas où sont mes clés', 'keys');
  classifier.train();
  const classification = classifier.classify('où sont mes clés');
  // value is { label: 'keys', value: 0.994927593677957 }
```

Currently 19 languages are supported:

* Chinese (zh)
* Danish (da)
* Dutch (nl)
* Enlish (en)
* Farsi (fa)
* Finnish (fi)
* French (fr)
* German (de)
* Hungarian (hu)
* Indonesian (id)
* Italian (it)
* Japanese (ja)
* Norwegian (no)
* Portuguese (pt)
* Romanian (ro)
* Russian (ru)
* Spanish (es)
* Swedish (sv)
* Turkish (tr)


## NER Manager

The Named Entity Recognition manager is able to store an structure of entities and options of the entity for each language.
Then, given an utterance and the language, is able to search the options of the entity inside the utterance, and return a list
of the bests substrings. This is done using a threshold for the accuracy, by default the accuracy is 0.5 but you can provide it in the options when creating the instance.

```javascript
  const { NerManager } = require('node-nlp');

  const manager = new NerManager({ threshold: 0.8 });
  manager.addNamedEntityText('hero', 'spiderman', ['en'], ['Spiderman', 'Spider-man']);
  manager.addNamedEntityText('hero', 'iron man', ['en'], ['iron man', 'iron-man']);
  manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
  manager.addNamedEntityText('food', 'burguer', ['en'], ['Burguer', 'Hamburguer']);
  manager.addNamedEntityText('food', 'pizza', ['en'], ['pizza']);
  manager.addNamedEntityText('food', 'pasta', ['en'], ['Pasta', 'spaghetti']);
  const entities = manager.findEntities('I saw spederman eating speghetti in the city', 'en');
  // value is [ { start: 6, end: 15, levenshtein: 1, accuracy: 0.8888888888888888, option: 'spiderman',
  //  sourceText: 'Spiderman', entity: 'hero', utteranceText: 'spederman' },
  //  { start: 23, end: 32, levenshtein: 1, accuracy: 0.8888888888888888, option: 'pasta',
  //  sourceText: 'spaghetti', entity: 'food', utteranceText: 'speghetti' } ]
```

It also support Regular Expression entities

```javascript
  const { NerManager } = require('node-nlp');

  const manager = new NerManager({ threshold: 0.8 });
  manager.addNamedEntityText('hero', 'spiderman', ['en'], ['Spiderman', 'Spider-man']);
  manager.addNamedEntityText('hero', 'iron man', ['en'], ['iron man', 'iron-man']);
  manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
  manager.addNamedEntityText('food', 'burguer', ['en'], ['Burguer', 'Hamburguer']);
  manager.addNamedEntityText('food', 'pizza', ['en'], ['pizza']);
  manager.addNamedEntityText('food', 'pasta', ['en'], ['Pasta', 'spaghetti']);
  manager.addNamedEntity('email', /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/ig);
  const entities = manager.findEntities('I saw spiderman eating speghetti in the city and his mail is spiderman@gmial.com', 'en');
  console.log(entities);
  // [ { start: 6,
  //     end: 15,
  //     levenshtein: 0,
  //     accuracy: 1,
  //     option: 'spiderman',
  //     sourceText: 'Spiderman',
  //     entity: 'hero',
  //     utteranceText: 'spiderman' },
  //   { start: 23,
  //     end: 32,
  //     levenshtein: 1,
  //     accuracy: 0.8888888888888888,
  //     option: 'pasta',
  //     sourceText: 'spaghetti',
  //     entity: 'food',
  //     utteranceText: 'speghetti' },
  //   { start: 61,
  //     end: 80,
  //     accuracy: 1,
  //     sourceText: 'spiderman@gmial.com',
  //     utteranceText: 'spiderman@gmial.com',
  //     entity: 'email' } ]  
```

## Sentiment Analysis

The Sentiment Analysis module is able to calculate the sentiment based on the AFINN. 
Languages accepted:
* en: English
* es: Spanish
* nl: Dutch
* fr: French
* it: Italian

| Language      | AFINN       | Senticon  | Pattern   | Negations |
| ------------- |:-----------:|:---------:|:---------:|:---------:|
| Dutch         |             |           | X         | X         |
| English       | X           |  X        | X         | X         |
| French        |             |           | X         |           |
| Italian       |             |           | X         |           |
| Spanish       | X           |  X        |           | X         |     

By default Senticon is used if possible, otherwise AFINN, and last one Pattern:

| Language      | AFINN       | Senticon  | Pattern   |
| ------------- |:-----------:|:---------:|:---------:|
| Dutch         |             |           | X         |
| English       |             |  X        |           |
| French        |             |           | X         |
| Italian       |             |           | X         |
| Spanish       |             |  X        |           |


You can use a SentimentAnalyzer if you want to manage only one language:

```javascript
  const { SentimentAnalyzer } = require('node-nlp');

  const sentiment = new SentimentAnalyzer({ language: 'en' });
  let result = sentiment.getSentiment('I like cats');
  console.log(result);
  // { score: 0.313,
  //   numWords: 3,
  //   numHits: 1,
  //   comparative: 0.10433333333333333,
  //   type: 'senticon',
  //   language: 'en' }

  result = sentiment.getSentiment('cats are stupid');
  console.log(result);
  // { score: -0.458,
  //   numWords: 3,
  //   numHits: 1,
  //   comparative: -0.15266666666666667,
  //   type: 'senticon',
  //   language: 'en' }
```

Or you can use the SentimentManager if you want to manage several languages:

```javascript
  const { SentimentManager } = require('node-nlp');

  const sentiment = new SentimentManager();
  let result = sentiment.process('en', 'I like cats');
  console.log(result);
  // { score: 0.313,
  //   numWords: 3,
  //   numHits: 1,
  //   comparative: 0.10433333333333333,
  //   type: 'senticon',
  //   language: 'en' }

  result = sentiment.process('es', 'Los gatitos son amor');
  console.log(result);
  // { score: 0.278,
  //   comparative: 0.0695,
  //   vote: 'positive',
  //   numWords: 4,
  //   numHits: 1,
  //   type: 'senticon',
  //   language: 'es' }
```

## NLP Manager

The NLP Manager is able to manage several languages. For each one, he manages the Named Entities, and is able to train the NLP classifier. Once we have it trained, we can ask the NLP manager to process one utterance. We can even don't tell the language and the NLP Manger will guess it from the languages that it knows.
When the utterance is processed, the NLP manager will:
* Identify the language
* Classify the utterance using ML, and returns the classifications and the best intent and score
* Gets the entities from the utterance. If the NLP was trained using entities in the format %entity%, then the search for entities will be limited to those that are present in this intent; otherwise, all the possible entities will be checked.
* Gets the sentiment analysis.

```javascript
  const { NlpManager } = require('node-nlp');

  const manager = new NlpManager({ languages: ['en'] });
  manager.addNamedEntityText('hero', 'spiderman', ['en'], ['Spiderman', 'Spider-man']);
  manager.addNamedEntityText('hero', 'iron man', ['en'], ['iron man', 'iron-man']);
  manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
  manager.addNamedEntityText('food', 'burguer', ['en'], ['Burguer', 'Hamburguer']);
  manager.addNamedEntityText('food', 'pizza', ['en'], ['pizza']);
  manager.addNamedEntityText('food', 'pasta', ['en'], ['Pasta', 'spaghetti']);
  manager.addDocument('en', 'I saw %hero% eating %food%', 'sawhero');
  manager.addDocument('en', 'I have seen %hero%, he was eating %food%', 'sawhero');
  manager.addDocument('en', 'I want to eat %food%', 'wanteat');
  manager.train();
  const result = manager.process('I saw spiderman eating spaghetti today in the city!');
  console.log(result);
  // { locale: 'en',
  //   localeIso2: 'en',
  //   language: 'English',
  //   utterance: 'I saw spiderman eating spaghetti today in the city!',
  //   classification:
  //    [ { label: 'sawhero', value: 0.9920519933583061 },
  //      { label: 'wanteat', value: 0.00794800664169383 } ],
  //   intent: 'sawhero',
  //   score: 0.9920519933583061,
  //   entities:
  //    [ { start: 6,
  //        end: 15,
  //        levenshtein: 0,
  //        accuracy: 1,
  //        option: 'spiderman',
  //        sourceText: 'Spiderman',
  //        entity: 'hero',
  //        utteranceText: 'spiderman' },
  //      { start: 23,
  //        end: 32,
  //        levenshtein: 0,
  //        accuracy: 1,
  //        option: 'pasta',
  //        sourceText: 'spaghetti',
  //        entity: 'food',
  //        utteranceText: 'spaghetti' } ],
  //   sentiment:
  //    { score: 0.708,
  //      comparative: 0.07866666666666666,
  //      vote: 'positive',
  //      numWords: 9,
  //      numHits: 2,
  //      type: 'senticon',
  //      language: 'en' } }
```

Also, you can save and load the NLP Manager to be reused without having to train it, because the thetas of the ML are also stored.

```
      manager.train();
      manager.save(filename);
      manager = new NlpManager();
      manager.load(filename);
      const result = manager.process('I saw spiderman eating spaghetti today in the city!');
```

If no filename is provided by default it is './model.nlp'.

## Loading from Excel

The NLP manager can load all the information from an excel file.
You can find an example excel file at https://github.com/axa-group/nlp.js/blob/master/test/nlp/rules.xls
Inside the excel there must exists 4 tables: Languages, Named Entities, Intents and Responses. It's very important to keep the existing format of the tables: first row is the name of the table, second row are the column names, next rows are the da.

![Tables](https://github.com/axa-group/nlp.js/blob/master/screenshots/screenshot01.png)
![Tables2](https://github.com/axa-group/nlp.js/blob/master/screenshots/screenshot02.png)

## Contributing

You can read the guide of how to contribute at [Contributing](https://github.com/axa-group/nlp.js/blob/master/CONTRIBUTING.md).

## Code of Conduct

You can read the Code of Conduct at [Code of Conduct](https://github.com/axa-group/nlp.js/blob/master/CODE_OF_CONDUCT.md).

## Who is behind it?

This project is developed by AXA Shared Services Spain S.A.

If you need to contact us, you can do it at the email jesus.seijas@axa-groupsolutions.com

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
