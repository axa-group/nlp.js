# NLP Classifier

You can train a classifier (indicating language) with utterances and their intents.
Then you can give a different utterance, and get the classifications for each intent, sorted descending by the score value.

```javascript
const { NlpClassifier } = require('node-nlp');

const classifier = new NlpClassifier({ language: 'fr' });
classifier.add('Bonjour', 'greet');
classifier.add('bonne nuit', 'greet');
classifier.add('Bonsoir', 'greet');
classifier.add("J'ai perdu mes clés", 'keys');
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
classifier.add("J'ai perdu mes clés", 'keys');
classifier.add('Je ne trouve pas mes clés', 'keys');
classifier.add('Je ne me souviens pas où sont mes clés', 'keys');
classifier.train();
const classification = classifier.classify('où sont mes clés');
// value is { label: 'keys', value: 0.994927593677957 }
```

Currently 19 languages are supported:

- Chinese (zh)
- Danish (da)
- Dutch (nl)
- English (en)
- Farsi (fa)
- Finnish (fi)
- French (fr)
- German (de)
- Hungarian (hu)
- Indonesian (id)
- Italian (it)
- Japanese (ja)
- Norwegian (no)
- Portuguese (pt)
- Romanian (ro)
- Russian (ru)
- Spanish (es)
- Swedish (sv)
- Turkish (tr)
