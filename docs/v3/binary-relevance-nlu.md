# Binary Relevance NLU

You can train a Binary Relevance Neural Network NLU classifier (indicating language) with utterances and their intents.
Then you can give a different utterance, and get the classifications for each intent, sorted descending by the score value.

```javascript
const { BinaryNeuralNetworkNLU } = require('node-nlp');

async function main() {
  const classifier = new BinaryNeuralNetworkNLU({ language: 'fr' });
  classifier.add('Bonjour', 'greet');
  classifier.add('bonne nuit', 'greet');
  classifier.add('Bonsoir', 'greet');
  classifier.add("J'ai perdu mes clés", 'keys');
  classifier.add('Je ne trouve pas mes clés', 'keys');
  classifier.add('Je ne me souviens pas où sont mes clés', 'keys');
  await classifier.train();
  const classifications = classifier.getClassifications('où sont mes clés');
  console.log(classifications);
  // [ { label: 'keys', value: 0.8785389760083662 },
  // { label: 'greet', value: 0.12146102399163379 } ]
}
main();
```

Or you can get only the best classification

```javascript
const { BinaryNeuralNetworkNLU } = require('node-nlp');

async function main() {
  const classifier = new BinaryNeuralNetworkNLU({ language: 'fr' });
  classifier.add('Bonjour', 'greet');
  classifier.add('bonne nuit', 'greet');
  classifier.add('Bonsoir', 'greet');
  classifier.add("J'ai perdu mes clés", 'keys');
  classifier.add('Je ne trouve pas mes clés', 'keys');
  classifier.add('Je ne me souviens pas où sont mes clés', 'keys');
  await classifier.train();
  const classifications = classifier.getBestClassification('où sont mes clés');
  console.log(classifications);
  // { label: 'keys', value: 0.8785389760083662 }
}
main();
```

Currently 40 languages are supported:

- Arabic (ar)
- Armenian (hy)
- Basque (eu)
- Bengali (bn)
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
- Greek (el)
- Hindi (hi)
- Hungarian (hu)
- Indonesian (id)
- Irish (ga)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Lithuanian (lt)
- Malay (ms)
- Nepali (ne)
- Norwegian (no)
- Polish (pl)
- Portuguese (pt)
- Romanian (ro)
- Russian (ru)
- Serbian (sr)
- Slovene (sl)
- Spanish (es)
- Swedish (sv)
- Tagalog (tl)
- Tamil (ta)
- Thai (th)
- Turkish (tr)
- Ukrainian (uk)
