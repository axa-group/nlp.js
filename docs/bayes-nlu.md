# Bayes NLU

You can train a Bayes NLU classifier (indicating language) with utterances and their intents.
Then you can give a different utterance, and get the classifications for each intent, sorted descending by the score value.

```javascript
const { BayesNLU } = require('node-nlp');

async function main() {
  const classifier = new BayesNLU({ language: 'fr' });
  classifier.add('Bonjour', 'greet');
  classifier.add('bonne nuit', 'greet');
  classifier.add('Bonsoir', 'greet');
  classifier.add("J'ai perdu mes clés", 'keys');
  classifier.add('Je ne trouve pas mes clés', 'keys');
  classifier.add('Je ne me souviens pas où sont mes clés', 'keys');
  await classifier.train();
  const classifications = classifier.getClassifications('où sont mes clés');
  console.log(classifications);
  // [ { label: 'keys', value: 0.9878048780487805 },
  // { label: 'greet', value: 0.01219512195121951 } ]
}
main();
```

Or you can get only the best classification

```javascript
const { BayesNLU } = require('node-nlp');

async function main() {
  const classifier = new BayesNLU({ language: 'fr' });
  classifier.add('Bonjour', 'greet');
  classifier.add('bonne nuit', 'greet');
  classifier.add('Bonsoir', 'greet');
  classifier.add("J'ai perdu mes clés", 'keys');
  classifier.add('Je ne trouve pas mes clés', 'keys');
  classifier.add('Je ne me souviens pas où sont mes clés', 'keys');
  await classifier.train();
  const classifications = classifier.getBestClassification('où sont mes clés');
  console.log(classifications);
  // { label: 'keys', value: 0.9878048780487805 }
}
main();
```

Currently 29 languages are supported:

- Arabic (ar)
- Armenian (hy)
- Basque (eu)
- Catala (ca)
- Chinese (zh)
- Czech (cs)
- Danish (da)
- Dutch (nl)
- English (en)
- Farsi (fa)
- Finnish (fi)
- French (fr)
- Galician (gl)
- German (de)
- Hungarian (hu)
- Indonesian (id)
- Irish (ga)
- Italian (it)
- Japanese (ja)
- Norwegian (no)
- Portuguese (pt)
- Romanian (ro)
- Russian (ru)
- Slovene (sl)
- Spanish (es)
- Swedish (sv)
- Tagalog (tl)
- Tamil (ta)
- Turkish (tr)
