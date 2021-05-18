![NLPjs logo](../../screenshots/nlplogo.gif)

# @nlpjs/ner

[![Build Status](https://travis-ci.com/axa-group/nlp.js.svg?branch=master)](https://travis-ci.com/axa-group/nlp.js)
[![Coverage Status](https://coveralls.io/repos/github/axa-group/nlp.js/badge.svg?branch=master)](https://coveralls.io/github/axa-group/nlp.js?branch=master)
[![NPM version](https://img.shields.io/npm/v/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp)
[![NPM downloads](https://img.shields.io/npm/dm/node-nlp.svg?style=flat)](https://www.npmjs.com/package/node-nlp) [![Greenkeeper badge](https://badges.greenkeeper.io/axa-group/nlp.js.svg)](https://greenkeeper.io/)

## TABLE OF CONTENTS

<!--ts-->

- [Installation](#installation)
- [NluNeural](#nluneural)
- [DomainManager](#domainmanager)
- [NluManager](#nlumanager)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Code of Conduct](#code-of-conduct)
- [Who is behind it](#who-is-behind-it)
- [License](#license.md)

<!--te-->

## Installation

You can install @nlpjs/ner:

```bash
    npm install @nlpjs/ner
```

## NluNeural

Class _NluNeural_ is an abstraction built on top of _NeuralNetwork_ that help to use it with a corpus.
A language can be used as a plugin in order to use the correct tokenizer and stemmer for this language.
In this example both versions, with language and without language, are used in order to compare the results.

```javascript
const { containerBootstrap } = require('@nlpjs/core');
const { NluNeural } = require('@nlpjs/nlu');
const { LangEn } = require('@nlpjs/lang-en');
const corpus = require('./corpus50.json');

function prepareCorpus(input, isTests = false) {
  const result = [];
  for (let i = 0; i < input.data.length; i += 1) {
    const { intent } = input.data[i];
    const utterances = isTests ? input.data[i].tests : input.data[i].utterances;
    for (let j = 0; j < utterances.length; j += 1) {
      result.push({ utterance: utterances[j], intent });
    }
  }
  return result;
}

async function measure(useStemmer) {
  const container = await containerBootstrap();
  if (useStemmer) {
    container.use(LangEn);
  }
  const nlu = new NluNeural({ container, locale: 'en', log: false });
  await nlu.train(prepareCorpus(corpus));
  const tests = prepareCorpus(corpus, true);
  let good = 0;
  let total = 0;
  for (let i = 0; i < tests.length; i += 1) {
    const { utterance, intent } = tests[i];
    const result = await nlu.process(utterance);
    total += 1;
    if (result.classifications[0].intent === intent) {
      good += 1;
    }
  }
  console.log(
    `Stemmer: ${useStemmer} Good: ${good} Total: ${total} Precision: ${
      good / total
    }`
  );
}

(async () => {
  await measure(false);
  await measure(true);
})();
```

## DomainManager
_DomainManager_ is the class that is an abstraction on top of _NluNeural_.
It adds the concept of _domain_, so each intent belongs to one domain; that way we can have domains for _smalltalk_, _human resources_, _claims_, or whatever logical split of intents that we want to have.
Each _DomainManager_ instance has only one language.
It can be trained by domain or all together:
- All together means that all the intents are trained into the same model, no matters the domain of the intent
- By domain means that every single domain has its own model trained, and there is a master model that is trained to classify an utterance into a domain. That way, when a utterance is classified, it is processed by the master domain to classify into the domain, and then is processed by the model of the domain to calculate the intent.

```javascript
const { containerBootstrap } = require('@nlpjs/core');
const { DomainManager, NluNeural } = require('@nlpjs/nlu');
const { LangEn } = require('@nlpjs/lang-en');

function addFoodDomain(manager) {
  manager.add('food', 'what do I have in my basket', 'order.check');
  manager.add('food', 'check my cart', 'order.check');
  manager.add('food', "show me what I've ordered", 'order.check');
  manager.add('food', "what's in my basket", 'order.check');
  manager.add('food', 'check my order', 'order.check');
  manager.add('food', 'check what I have ordered', 'order.check');
  manager.add('food', 'show my order', 'order.check');
  manager.add('food', 'check my basket', 'order.check');
  manager.add('food', 'how soon will it be delivered', 'order.check_status');
  manager.add('food', 'check the status of my delivery', 'order.check_status');
  manager.add('food', 'when should I expect delivery', 'order.check_status');
  manager.add(
    'food',
    'what is the status of my delivery',
    'order.check_status'
  );
  manager.add('food', 'check my order status', 'order.check_status');
  manager.add('food', 'where is my order', 'order.check_status');
  manager.add('food', 'where is my delivery', 'order.check_status');
  manager.add('food', 'status of my order', 'order.check_status');
}

function addPersonalityDomain(manager) {
  manager.add('personality', 'say about you', 'agent.acquaintance');
  manager.add('personality', 'why are you here', 'agent.acquaintance');
  manager.add('personality', 'what is your personality', 'agent.acquaintance');
  manager.add('personality', 'describe yourself', 'agent.acquaintance');
  manager.add('personality', 'tell me about yourself', 'agent.acquaintance');
  manager.add('personality', 'tell me about you', 'agent.acquaintance');
  manager.add('personality', 'what are you', 'agent.acquaintance');
  manager.add('personality', 'who are you', 'agent.acquaintance');
  manager.add('personality', 'talk about yourself', 'agent.acquaintance');
  manager.add('personality', 'your age', 'agent.age');
  manager.add('personality', 'how old is your platform', 'agent.age');
  manager.add('personality', 'how old are you', 'agent.age');
  manager.add('personality', "what's your age", 'agent.age');
  manager.add('personality', "I'd like to know your age", 'agent.age');
  manager.add('personality', 'tell me your age', 'agent.age');
  manager.add('personality', "you're annoying me", 'agent.annoying');
  manager.add('personality', 'you are such annoying', 'agent.annoying');
  manager.add('personality', 'you annoy me', 'agent.annoying');
  manager.add('personality', 'you are annoying', 'agent.annoying');
  manager.add('personality', 'you are irritating', 'agent.annoying');
  manager.add('personality', 'you are annoying me so much', 'agent.annoying');
  manager.add('personality', "you're bad", 'agent.bad');
  manager.add('personality', "you're horrible", 'agent.bad');
  manager.add('personality', "you're useless", 'agent.bad');
  manager.add('personality', "you're waste", 'agent.bad');
  manager.add('personality', "you're the worst", 'agent.bad');
  manager.add('personality', 'you are a lame', 'agent.bad');
  manager.add('personality', 'I hate you', 'agent.bad');
  manager.add('personality', 'be more clever', 'agent.beclever');
  manager.add('personality', 'can you get smarter', 'agent.beclever');
  manager.add('personality', 'you must learn', 'agent.beclever');
  manager.add('personality', 'you must study', 'agent.beclever');
  manager.add('personality', 'be clever', 'agent.beclever');
  manager.add('personality', 'be smart', 'agent.beclever');
  manager.add('personality', 'be smarter', 'agent.beclever');
  manager.add('personality', 'you are looking awesome', 'agent.beautiful');
  manager.add('personality', "you're looking good", 'agent.beautiful');
  manager.add('personality', "you're looking fantastic", 'agent.beautiful');
  manager.add('personality', 'you look greet today', 'agent.beautiful');
  manager.add('personality', "I think you're beautiful", 'agent.beautiful');
  manager.add('personality', 'you look amazing today', 'agent.beautiful');
  manager.add('personality', "you're so beautiful today", 'agent.beautiful');
  manager.add('personality', 'you look very pretty', 'agent.beautiful');
  manager.add('personality', 'you look pretty good', 'agent.beautiful');
  manager.add('personality', 'when is your birthday', 'agent.birthday');
  manager.add('personality', 'when were you born', 'agent.birthday');
  manager.add('personality', 'when do you have birthday', 'agent.birthday');
  manager.add('personality', 'date of your birthday', 'agent.birthday');
}

(async () => {
  const container = await containerBootstrap();
  container.use(NluNeural);
  container.use(LangEn);
  // Set trainByDomain to true to train by domain
  const manager = new DomainManager({ container, trainByDomain: false });
  addFoodDomain(manager);
  addPersonalityDomain(manager);
  await manager.train();
  const actual = await manager.process('tell me what is in my basket');
  console.log(actual);
})();
```

## NluManager
_NluManager_ is the abstraction over _DomainManager_: it contains one _DomainManager_ instance per each language that we want to use. It is also able to guess automatically the language of the sentence, so we can provide the locale of the sentence or omit it.

This is an example with two languages (english and spanish) with two domains each (personality and food).

```javascript
const { containerBootstrap } = require('@nlpjs/core');
const { NluManager, NluNeural } = require('@nlpjs/nlu');
const { LangEn } = require('@nlpjs/lang-en');
const { LangEs } = require('@nlpjs/lang-es');

function addFoodDomainEn(manager) {
  manager.assignDomain('en', 'order.check', 'food');
  manager.add('en', 'what do I have in my basket', 'order.check');
  manager.add('en', 'check my cart', 'order.check');
  manager.add('en', "show me what I've ordered", 'order.check');
  manager.add('en', "what's in my basket", 'order.check');
  manager.add('en', 'check my order', 'order.check');
  manager.add('en', 'check what I have ordered', 'order.check');
  manager.add('en', 'show my order', 'order.check');
  manager.add('en', 'check my basket', 'order.check');

  manager.assignDomain('en', 'order.check_status', 'food');
  manager.add('en', 'how soon will it be delivered', 'order.check_status');
  manager.add('en', 'check the status of my delivery', 'order.check_status');
  manager.add('en', 'when should I expect delivery', 'order.check_status');
  manager.add('en', 'check my order status', 'order.check_status');
  manager.add('en', 'where is my order', 'order.check_status');
  manager.add('en', 'where is my delivery', 'order.check_status');
  manager.add('en', 'status of my order', 'order.check_status');
}

function addFoodDomainEs(manager) {
  manager.assignDomain('es', 'order.check', 'food');
  manager.add('es', 'qué tengo en mi cesta', 'order.check');
  manager.add('es', 'comprueba mi carrito', 'order.check');
  manager.add('es', 'enséñame qué he pedido', 'order.check');
  manager.add('es', 'qué hay en mi carrito?', 'order.check');
  manager.add('es', 'comprueba mi compra', 'order.check');
  manager.add('es', 'comprueba qué he comprado', 'order.check');
  manager.add('es', 'muéstrame mi compra', 'order.check');

  manager.assignDomain('es', 'order.check_status', 'food');
  manager.add('es', 'cuándo me lo van a traer?', 'order.check_status');
  manager.add('es', 'cómo va la entrega?', 'order.check_status');
  manager.add('es', 'cuándo me traerán mi pedido?', 'order.check_status');
  manager.add('es', 'en qué estado está mi pedido?', 'order.check_status');
  manager.add('es', 'dónde está mi compra?', 'order.check_status');
  manager.add('es', 'dónde está mi pedido?', 'order.check_status');
  manager.add('es', 'estado de mi compra', 'order.check_status');
}

function addPersonalityDomainEn(manager) {
  manager.assignDomain('en', 'agent.acquaintance', 'personality');
  manager.add('en', 'say about you', 'agent.acquaintance');
  manager.add('en', 'why are you here', 'agent.acquaintance');
  manager.add('en', 'what is your personality', 'agent.acquaintance');
  manager.add('en', 'describe yourself', 'agent.acquaintance');
  manager.add('en', 'tell me about yourself', 'agent.acquaintance');
  manager.add('en', 'tell me about you', 'agent.acquaintance');
  manager.add('en', 'what are you', 'agent.acquaintance');
  manager.add('en', 'who are you', 'agent.acquaintance');
  manager.add('en', 'talk about yourself', 'agent.acquaintance');

  manager.assignDomain('en', 'agent.age', 'personality');
  manager.add('en', 'your age', 'agent.age');
  manager.add('en', 'how old is your platform', 'agent.age');
  manager.add('en', 'how old are you', 'agent.age');
  manager.add('en', "what's your age", 'agent.age');
  manager.add('en', "I'd like to know your age", 'agent.age');
  manager.add('en', 'tell me your age', 'agent.age');
}

function addPersonalityDomainEs(manager) {
  manager.assignDomain('es', 'agent.acquaintance', 'personality');
  manager.add('es', 'cuéntame sobre ti', 'agent.acquaintance');
  manager.add('es', 'qué haces aquí?', 'agent.acquaintance');
  manager.add('es', 'cómo es tu personalidad?', 'agent.acquaintance');
  manager.add('es', 'descríbete', 'agent.acquaintance');
  manager.add('es', 'quién eres?', 'agent.acquaintance');
  manager.add('es', 'qué eres?', 'agent.acquaintance');
  manager.add('es', 'háblame de ti', 'agent.acquaintance');

  manager.assignDomain('es', 'agent.age', 'personality');
  manager.add('es', 'qué edad tienes?', 'agent.age');
  manager.add('es', 'cuántos años tienes?', 'agent.age');
  manager.add('es', 'cuál es tu edad?', 'agent.age');
  manager.add('es', 'quiero saber tu edad', 'agent.age');
  manager.add('es', 'dime tu edad', 'agent.age');
}

(async () => {
  const container = await containerBootstrap();
  container.use(LangEn);
  container.use(LangEs);
  container.use(NluNeural);
  const manager = new NluManager({
    container,
    locales: ['en', 'es'],
    trainByDomain: false,
  });
  addFoodDomainEn(manager);
  addFoodDomainEs(manager);
  addPersonalityDomainEn(manager);
  addPersonalityDomainEs(manager);
  await manager.train();
  // You can provide the locale of the language
  let actual = await manager.process('es', 'dime quién eres tú');
  console.log(actual);
  // If the locale is not provided, then the language is guessed
  actual = await manager.process('dime quién eres tú');
  console.log(actual);
  // {
  //   locale: 'es',
  //   utterance: 'dime quién eres tú',
  //   domain: 'personality',
  //   languageGuessed: true,
  //   localeIso2: 'es',
  //   language: 'Spanish',
  //   nluAnswer: {
  //     classifications: [ [Object], [Object] ],
  //     entities: undefined,
  //     explanation: undefined
  //   },
  //   classifications: [
  //     { intent: 'agent.acquaintance', score: 0.8546458520495468 },
  //     { intent: 'agent.age', score: 0.14535414795045312 }
  //   ],
  //   intent: 'agent.acquaintance',
  //   score: 0.8546458520495468
  // }
})();
```

## Contributing

You can read the guide of how to contribute at [Contributing](../../CONTRIBUTING.md).

## Contributors

[![Contributors](https://contributors-img.firebaseapp.com/image?repo=axa-group/nlp.js)](https://github.com/axa-group/nlp.js/graphs/contributors)

Made with [contributors-img](https://contributors-img.firebaseapp.com).

## Code of Conduct

You can read the Code of Conduct at [Code of Conduct](../../CODE_OF_CONDUCT.md).

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
