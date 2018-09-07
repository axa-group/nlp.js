# Sentiment Analysis

The Sentiment Analysis module is able to calculate the sentiment based on the AFINN.
Languages accepted:

- en: English
- es: Spanish
- nl: Dutch
- fr: French
- it: Italian
- de: German

| Language | AFINN | Senticon | Pattern | Negations |
| -------- | :---: | :------: | :-----: | :-------: |
| Dutch    |       |          |    X    |     X     |
| English  |   X   |    X     |    X    |     X     |
| French   |       |          |    X    |           |
| Italian  |       |          |    X    |           |
| Spanish  |   X   |    X     |         |     X     |
| German   |       |    X     |         |     X     |

By default Senticon is used if possible, otherwise AFINN, and last one Pattern:

| Language | AFINN | Senticon | Pattern |
| -------- | :---: | :------: | :-----: |
| Dutch    |       |          |    X    |
| English  |       |    X     |         |
| French   |       |          |    X    |
| Italian  |       |          |    X    |
| Spanish  |       |    X     |         |

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
