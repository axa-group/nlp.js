# NLU Manager

The NLU Manager is the main classifier class for Natural Language Understanding. 
Is able to manage several languages at the same time, and also to train by domains.

## Training only one language

When training only one language, the domain is 'default'.

```javascript
const { NluManager } = require('./lib');

async function main() {
  const classifier = new NluManager({ languages: ['fr'] });
  classifier.addDocument('fr', 'Bonjour', 'greet');
  classifier.addDocument('fr', 'bonne nuit', 'greet');
  classifier.addDocument('fr', 'Bonsoir', 'greet');
  classifier.addDocument('fr', "J'ai perdu mes clés", 'keys');
  classifier.addDocument('fr', 'Je ne trouve pas mes clés', 'keys');
  classifier.addDocument('fr', 'Je ne me souviens pas où sont mes clés', 'keys');
  await classifier.train();
  const classifications = classifier.getClassifications('où sont mes clés');
  console.log(classifications);
  // { utterance: 'où sont mes clés',
  //   locale: 'fr',
  //   languageGuessed: true,
  //   localeIso2: 'fr',
  //   language: 'French',
  //   domain: 'default',
  //   classifications:
  //    [ { label: 'keys', value: 0.9076581467793369 },
  //      { label: 'greet', value: 0.09234185322066314 } ],
  //   intent: 'keys',
  //   score: 0.9076581467793369 }}
}
main();
```

## Training several languages and domains

When there are more than one domain, then by default the domains are trained separately, and 
a master neural network is trained with the utterances to map into the domains. That way, when
a utterance is received to be classified, the first step is to identify the domain, and then 
the intent in the neural network of the domain. This has also the effect that in the answer,
only the intents from the domain are added instead of all the intents of the agent.
When working with domains, before adding any intent to the domain, the domain must be
assigned using assignDomain as in the example:

```javascript
const { NluManager } = require('./lib');

async function main() {
  const classifier = new NluManager({ languages: ['en', 'es'] });
  classifier.assignDomain('en', 'order.check', 'food');
  classifier.addDocument('en', 'what do I have in my basket', 'order.check');
  classifier.addDocument('en', 'check my cart', 'order.check');
  classifier.addDocument('en', "show me what I've ordered", 'order.check');
  classifier.addDocument('en', "what's in my basket", 'order.check');
  classifier.addDocument('en', 'check my order', 'order.check');
  classifier.addDocument('en', 'check what I have ordered', 'order.check');
  classifier.addDocument('en', 'show my order', 'order.check');
  classifier.addDocument('en', 'check my basket', 'order.check');

  classifier.assignDomain('en', 'order.check_status', 'food');
  classifier.addDocument('en', 'how soon will it be delivered', 'order.check_status');
  classifier.addDocument('en', 'check the status of my delivery', 'order.check_status');
  classifier.addDocument('en', 'when should I expect delivery', 'order.check_status');
  classifier.addDocument('en', 'check my order status', 'order.check_status');
  classifier.addDocument('en', 'where is my order', 'order.check_status');
  classifier.addDocument('en', 'where is my delivery', 'order.check_status');
  classifier.addDocument('en', 'status of my order', 'order.check_status');

  classifier.assignDomain('en', 'agent.acquaintance', 'personality');
  classifier.addDocument('en', 'say about you', 'agent.acquaintance');
  classifier.addDocument('en', 'why are you here', 'agent.acquaintance');
  classifier.addDocument('en', 'what is your personality', 'agent.acquaintance');
  classifier.addDocument('en', 'describe yourself', 'agent.acquaintance');
  classifier.addDocument('en', 'tell me about yourself', 'agent.acquaintance');
  classifier.addDocument('en', 'tell me about you', 'agent.acquaintance');
  classifier.addDocument('en', 'what are you', 'agent.acquaintance');
  classifier.addDocument('en', 'who are you', 'agent.acquaintance');
  classifier.addDocument('en', 'talk about yourself', 'agent.acquaintance');

  classifier.assignDomain('en', 'agent.age', 'personality');
  classifier.addDocument('en', 'your age', 'agent.age');
  classifier.addDocument('en', 'how old is your platform', 'agent.age');
  classifier.addDocument('en', 'how old are you', 'agent.age');
  classifier.addDocument('en', "what's your age", 'agent.age');
  classifier.addDocument('en', "I'd like to know your age", 'agent.age');
  classifier.addDocument('en', 'tell me your age', 'agent.age');

  classifier.assignDomain('es', 'order.check', 'food');
  classifier.addDocument('es', 'qué tengo en mi cesta', 'order.check');
  classifier.addDocument('es', 'comprueba mi carrito', 'order.check');
  classifier.addDocument('es', 'enséñame qué he pedido', 'order.check');
  classifier.addDocument('es', 'qué hay en mi carrito?', 'order.check');
  classifier.addDocument('es', 'comprueba mi compra', 'order.check');
  classifier.addDocument('es', 'comprueba qué he comprado', 'order.check');
  classifier.addDocument('es', 'muéstrame mi compra', 'order.check');

  classifier.assignDomain('es', 'order.check_status', 'food');
  classifier.addDocument('es', 'cuándo me lo van a traer?', 'order.check_status');
  classifier.addDocument('es', 'cómo va la entrega?', 'order.check_status');
  classifier.addDocument('es', 'cuándo me traerán mi pedido?', 'order.check_status');
  classifier.addDocument('es', 'en qué estado está mi pedido?', 'order.check_status');
  classifier.addDocument('es', 'dónde está mi compra?', 'order.check_status');
  classifier.addDocument('es', 'dónde está mi pedido?', 'order.check_status');
  classifier.addDocument('es', 'estado de mi compra', 'order.check_status');

  classifier.assignDomain('es', 'agent.acquaintance', 'personality');
  classifier.addDocument('es', 'cuéntame sobre ti', 'agent.acquaintance');
  classifier.addDocument('es', 'qué haces aquí?', 'agent.acquaintance');
  classifier.addDocument('es', 'cómo es tu personalidad?', 'agent.acquaintance');
  classifier.addDocument('es', 'descríbete', 'agent.acquaintance');
  classifier.addDocument('es', 'quién eres?', 'agent.acquaintance');
  classifier.addDocument('es', 'qué eres?', 'agent.acquaintance');
  classifier.addDocument('es', 'háblame de ti', 'agent.acquaintance');

  classifier.assignDomain('es', 'agent.age', 'personality');
  classifier.addDocument('es', 'qué edad tienes?', 'agent.age');
  classifier.addDocument('es', 'cuántos años tienes?', 'agent.age');
  classifier.addDocument('es', 'cuál es tu edad?', 'agent.age');
  classifier.addDocument('es', 'quiero saber tu edad', 'agent.age');
  classifier.addDocument('es', 'dime tu edad', 'agent.age');

  await classifier.train();
  const classifications = classifier.getClassifications('Cuéntame algo sobre ti');
  console.log(classifications);
  // { utterance: 'Cuéntame algo sobre ti',
  //   locale: 'es',
  //   languageGuessed: true,
  //   localeIso2: 'es',
  //   language: 'Spanish',
  //   domain: 'personality',
  //   classifications:
  //    [ { label: 'agent.acquaintance', value: 1 },
  //      { label: 'agent.age', value: 0 } ],
  //   intent: 'agent.acquaintance',
  //   score: 1 }
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