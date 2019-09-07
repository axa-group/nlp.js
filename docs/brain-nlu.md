# Brain NLU

You can train a multilabel (Brain) NLU classifier (indicating language) with utterances and their intents.
Then you can give a different utterance, and get the classifications for each intent, sorted descending by the score value.

```javascript
const { BrainNLU } = require('node-nlp');

async function main() {
  const classifier = new BrainNLU({ language: 'fr' });
  classifier.add('Bonjour', 'greet');
  classifier.add('bonne nuit', 'greet');
  classifier.add('Bonsoir', 'greet');
  classifier.add("J'ai perdu mes clés", 'keys');
  classifier.add('Je ne trouve pas mes clés', 'keys');
  classifier.add('Je ne me souviens pas où sont mes clés', 'keys');
  await classifier.train();
  const classifications = classifier.getClassifications('où sont mes clés');
  console.log(classifications);
  // [ { label: 'keys', value: 0.9076581467793369 },
  // { label: 'greet', value: 0.09234185322066314 } ]
}
main();
```

Or you can get only the best classification

```javascript
const { BrainNLU } = require('node-nlp');

async function main() {
  const classifier = new BrainNLU({ language: 'fr' });
  classifier.add('Bonjour', 'greet');
  classifier.add('bonne nuit', 'greet');
  classifier.add('Bonsoir', 'greet');
  classifier.add("J'ai perdu mes clés", 'keys');
  classifier.add('Je ne trouve pas mes clés', 'keys');
  classifier.add('Je ne me souviens pas où sont mes clés', 'keys');
  await classifier.train();
  const classifications = classifier.getBestClassification('où sont mes clés');
  console.log(classifications);
  // { label: 'keys', value: 0.9076581467793369 }
}
main();```

Currently 30 languages are supported:

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
- Thai (th)
- Turkish (tr)
