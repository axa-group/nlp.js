# Mini-FAQ

@jesus-seijas-sp collected a mini FAQ for some v4 topics:

Hi,

I will put here a FAQ with the links to different interesting parts to documentation or examples. If there is something that you want to cover that is not here, just ask, and I will update the documentation with it. Also, there are 1800 unit tests that can help to understand classes and functions that are not intended to be the API for the developer (from node-nlp the API for the developer is intented to be the class NlpManager).

**- Where do I find an example of use of v4?** https://github.com/axa-group/nlp.js#example-of-use

**- But this example seems to be of the v3...** The version 4 is splitted into different smaller packages, but the https://www.npmjs.com/package/node-nlp package use tose smaller packages to build a version so retrocompatible with v3 as we can

**- But I don't find the NluManager in this package...** You don't need it, you have the NlpManager that inside is able to handle the NLU, NLG, Language guesser....

**- Ok, but I feel that I want to go with the pure v4, how I start?** There is a quickstart here: https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md

**- But this is for backend... I want this bundle to work in my browser or mobile using react native** You have the quickstart for browser and react native here: https://github.com/axa-group/nlp.js/blob/master/docs/v4/webandreact.md

**- This thing of intents is hard to understand, I just want to do a Questions and Answers bot** You have a quickstart for simple QnA here: https://github.com/axa-group/nlp.js/blob/master/docs/v4/qna.md

**- How I test my chatbot in Console?** https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#adding-your-first-connector

**- How I do a multilanguage chatbot?** Installing the package for the language and adding it as a plugin https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#adding-multilanguage

**- Do you have some example of a chatbot running in several languages?** You can remix this project in glitch, you'll see that it only haves one line of source code, but with only one line it creates a backend with API and exposes a react frontend with the bot, and it's multi-language. To see the frontend click on the button "show" and then "next to the code". https://glitch.com/edit/?utm_content=project_nlpjs-multi&utm_source=remix_this&utm_medium=button&utm_campaign=glitchButton#!/remix/nlpjs-multi

**- Using node-nlp package I need to install the languages separately?** No. It use a pacakge @nlpjs/lang-all that mounts all the languages

**- Where I can see the languages and their locales to find the correct package to install?** Here, the one with Native Support https://github.com/axa-group/nlp.js/blob/master/docs/v4/language-support.md

**- But I want to have a web for my chatbot!** Here you have how to easely expose your chatbot with directline API, and how to expose a WebChat: https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#adding-api-and-webchat

**- But this does not help on how to orchestrate a chatbot** Well, NLP.js is the set of NLP tools, not the chatbot ones. For orchestrating a chatbot I recommend you to use Microsoft Bot Framework

**- When an intent is triggered I want to get the answer from an API call and I'm not using any chatbot orchestrating SDK** You can with pipelines that react to your intent, you've an example here: https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md#adding-logic-to-an-intent

**- How I guess the language from an utterance when I have a multi-language bot?** The language is guessed automatically using the most common 3-grams from the language, but also with the 3-grams from the corpus training it, so that way you can use even languages that does not exists, or get a better guessing based on your corpus.

**- And how I guess a language from a sentence, not integrated with the NLP?** You have the example here: https://github.com/axa-group/nlp.js/blob/master/docs/v3/language-guesser.md But if you want to get an smaller impact on your node_moules use the library _@nlpjs/language_ instead of _node-nlp_ one.

**- Ok, what about the NER?** You can use the NER directly from the NlpManager:

```js
const { NlpManager } = require('node-nlp');

async function main() {
  const manager = new NlpManager({ languages: ['en'], forceNER: true });
  manager.addNamedEntityText(
    'hero',
    'spiderman',
    ['en'],
    ['Spiderman', 'Spider-man'],
  );
  manager.addNamedEntityText(
    'hero',
    'iron man',
    ['en'],
    ['iron man', 'iron-man'],
  );
  manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
  manager.addNamedEntityText(
    'food',
    'burguer',
    ['en'],
    ['Burguer', 'Hamburguer'],
  );
  manager.addNamedEntityText('food', 'pizza', ['en'], ['pizza']);
  manager.addNamedEntityText('food', 'pasta', ['en'], ['Pasta', 'spaghetti']);
  const result = await manager.process('I saw spederman eating speghetti in the city');
  console.log(result);
}

main();
```

**- This is not extracting the entities...** When you create the NlpManager be sure to set to true forceNER. This will activate the NER even if you don't have entities associated to intents.

```js
  const manager = new NlpManager({ languages: ['en'], forceNER: true });
```

**- The enum entity extraction is slow** By default the NER threshold is 0.8, that allows users to have "mistakes" when they write, but also makes the problem to identify the entities to be heavier. Right now, until this process performance is improved, the way to do that is to set the threshold to 1:

```js
const manager = new NlpManager({ languages: ['en'], forceNER: true, ner: { threshold: 1 } });
```

With threshold set to 1, the exact match of entities is done by searching words in a dictionary, so the process is able to search over millions of posible values in miliseconds.

**- The builtin entity extraction is slow or crash the process** By default this extraction is done with Microsoft Recognizers: https://github.com/microsoft/Recognizers-Text This do the search using complex regular expressions that are computationally very slow. In windows we detected that some sentences can cause it to crash, mostly when using french. One option is to use duckling instead, but it requires to have an instance of duckling up and running, and connect to it through its API https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-duckling.md

**- How I use enum entities** https://github.com/axa-group/nlp.js/blob/master/docs/v3/ner-manager.md#enum-named-entities

**- How I search entities by regular expressions** https://github.com/axa-group/nlp.js/blob/master/docs/v3/ner-manager.md#regular-expression-named-entities

**- What builtin (golden) entities I can extract** https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md

**- I want to extract builtin (golden) entities but it only works in a few languages** You can use Duckling instead, but it requires to have an instance of duckling up and running, and connect to it through its API https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-duckling.md

**- I want to go "lowlevel" to use only the Neural Network for classifying** Here you'll find the example code if you want only to tokenize: https://github.com/jesus-seijas-sp/nlp-course/blob/master/02-classifiers/05-nlpjs-classifier.js Here you'll find the example code if you also want stemming: https://github.com/jesus-seijas-sp/nlp-course/blob/master/02-classifiers/14-nlpjs-stemmer-classifier.js

**- I want to use NGrams**

Here you have an example of how to use ngrams by char and by word:

```js
const { NGrams } = require('@nlpjs/utils');
const fs = require('fs');

const gramsByChar = new NGrams();
const gramsByWord = new NGrams({ byWord: true, startToken: '[START]', endToken: '[END]' });

const input = 'one ring to rule them all';
const outputByChar = gramsByChar.getNGrams(input, 3);
const outputByWord = gramsByWord.getNGrams(input, 3);
console.log(outputByChar);
console.log(outputByWord);

const freqByChar = gramsByChar.getNGramsFreqs(input, 2, true);
console.log(freqByChar);

const lines = fs.readFileSync('./data/wikipedia_es.txt', 'utf-8').split(/\r?\n/);
console.log(lines);
const freqs = gramsByChar.getNGramsFreqs(lines, 3);
console.log(freqs);
```

**- I want a pattern corpus, I mean, to generate a full cartesian product corpus from sentences with different options** That is, from a sentence like "I [am having|have] a [problem|question|issue]" you want to generate all the possibilities: I am having a problem, I am having a question, I am having a issue, I have a problem, I have a question, I have a issue. Here you have an example code:

```js
const { composeFromPattern, composeCorpus } = require('@nlpjs/utils');
const corpusPattern = require('./data/corpus-en-pattern.json');

const input = 'I [am having|have] a [problem|question|issue] that I have to [solve|investigate]';
const result = composeFromPattern(input);
console.log(result);

const corpus = composeCorpus(corpusPattern);
console.log(JSON.stringify(corpus, null, 2));

To use with this example corpus:
```json
{
  "name": "Corpus Pattern",
  "locale": "en-US",
  "data": [
    {
      "intent": "eat",
      "utterances": [
        "I [usually|always] [like|love] to eat [pizza|spaghetti|burguer]"
      ],
      "tests": [
        "I [like|love] [pizza|burguer]"
      ]
    },
    {
      "intent": "investigate",
      "utterances": [
        "I [am having|have] a [problem|question] that I have to [solve|investigate]"
      ],
      "tests": [
        "I should [solve|investigate] that [problem|question]"
      ]
    }
  ]
}
```

**- I want to calculate the levenshtein distance of two strings**

Use similarity function, the third parameter by default is "false", set it to "true" if you want both strings to be normalized.

```js
const { similarity } = require('@nlpjs/similarity');

console.log(similarity('potatoe', 'potatoe'));
console.log(similarity('potatoe', 'potatoes'));
console.log(similarity('potatoe', 'potsatoe'));
console.log(similarity('potatoe', 'poattoe'));
console.log(similarity('potatoe', 'postatoé', true));
console.log(similarity('potatoe', 'Postatoé', true));
```

**- Given a text I want to calculate the best substring that match an string**

Use getBestSubstring from ExtractorEnum of ner

```js
const { ExtractorEnum } = require('@nlpjs/ner');

const text = 'Morbi ainterd multricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
const str = 'interdum ultricies';

const extractor = new ExtractorEnum();
const result = extractor.getBestSubstring(text, str);
console.log(result);
```

