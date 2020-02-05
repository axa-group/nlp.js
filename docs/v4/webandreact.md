# Web and React Native

## Preparing to generate a bundle

NLP.js is developed to be a Node.js project, but even with that can be compiled to run in both Web and React Native applications. In fact, the libraries of NLP.js take this into account and the core libraries don't use anything that cannot be executed on web, like the file system.
But to generate the web bundle it's need to install two development libraries: browserify and terser. To do that run this in your project folder:
```bash
npm i -D browserify terser
```

Now you will need an script to generated the bundle. Open your _package.json_ and add this into the scripts section:
```json
    "browserdist": "browserify ./index.js | terser --compress --mangle > ./bundle.js"
```

From this moment, you can generate a file _bundle.js_ containing the browser bundle executing this:
```bash
npm run browserdist
```

## Your first web NLP

You can download the code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/02.web/01.bundle

Now you will need an HTML to run the code in the browser, we will start with this simple one:
```html
<html>
<head>
  <title>Test</title>
  <script src='./bundle.js'></script>
</head>
<body>
</body>
</html>
```

Install the libraries that will be needed to run the nlp:
```bash
npm i @nlpjs/core @nlpjs/lang-en-min @nlpjs/nlp
```

The @nlpjs/core is the one that install the container system and basic architecture, the @nlpjs/nlp install the nlp related things, and finally @nlpjs/lang-en-min install the english language but without the sentiment dictionaries. That's because the sentiment analysis dictionaries have a big size.

Now create an _index.js_ with this content:
```javascript
const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');

(async () => {
  const container = await containerBootstrap();
  container.use(Nlp);
  container.use(LangEn);
  const nlp = container.get('nlp');
  nlp.settings.autoSave = false;
  nlp.addLanguage('en');
  // Adds the utterances and intents for the NLP
  nlp.addDocument('en', 'goodbye for now', 'greetings.bye');
  nlp.addDocument('en', 'bye bye take care', 'greetings.bye');
  nlp.addDocument('en', 'okay see you later', 'greetings.bye');
  nlp.addDocument('en', 'bye for now', 'greetings.bye');
  nlp.addDocument('en', 'i must go', 'greetings.bye');
  nlp.addDocument('en', 'hello', 'greetings.hello');
  nlp.addDocument('en', 'hi', 'greetings.hello');
  nlp.addDocument('en', 'howdy', 'greetings.hello');
  
  // Train also the NLG
  nlp.addAnswer('en', 'greetings.bye', 'Till next time');
  nlp.addAnswer('en', 'greetings.bye', 'see you soon!');
  nlp.addAnswer('en', 'greetings.hello', 'Hey there!');
  nlp.addAnswer('en', 'greetings.hello', 'Greetings!');
  await nlp.train();
  const response = await nlp.process('en', 'I should go now');
  console.log(response);
})();
```

This creates a model equal to the first example of the quickstart.
This line is very important because by default the nlp plugin tries to save the model after training, but in we this will generate an exception.
```javscript
nlp.settings.autoSave = false
```

Now you can generate the bundle running
```bash
npm run browserdist
```
The bundle size will be 111KB, that compared to the 3MB of the version 3.x is much better for the browser.
Open the index.html in a browser and take a look into the console.

## Creating a distributable version

You can download the source code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/02.web/02.dist
The problem with the previous example, is that every time that you have to modify your bot or build a new bot, you have to create the bundle again.
But, what if we can compile and expose the classes and functions of the modules of NLP.js that we want? That way we can create a bundle that can be reusable between different bots, while separating what is NLP.js from our bot logic.

First modify the _index.js_ to not include our bot logic and to simply import all from the NLP.js libraries and expose them using window object:

```javascript
const core = require('@nlpjs/core');
const nlp = require('@nlpjs/nlp');
const langenmin = require('@nlpjs/lang-en-min');

window.nlpjs = { ...core, ...nlp, ...langenmin };
```

Second, compile the bundle:
```bash
npm run browserdist
```

Third, move the logic of your bot to the index.hmtl:

```html
<html>
<head>
  <title>Test</title>
  <script src='./bundle.js'></script>
  <script>
  const { containerBootstrap, Nlp, LangEn } = window.nlpjs;

  (async () => {
    const container = await containerBootstrap();
    container.use(Nlp);
    container.use(LangEn);
    const nlp = container.get('nlp');
    nlp.settings.autoSave = false;
    nlp.addLanguage('en');
    // Adds the utterances and intents for the NLP
    nlp.addDocument('en', 'goodbye for now', 'greetings.bye');
    nlp.addDocument('en', 'bye bye take care', 'greetings.bye');
    nlp.addDocument('en', 'okay see you later', 'greetings.bye');
    nlp.addDocument('en', 'bye for now', 'greetings.bye');
    nlp.addDocument('en', 'i must go', 'greetings.bye');
    nlp.addDocument('en', 'hello', 'greetings.hello');
    nlp.addDocument('en', 'hi', 'greetings.hello');
    nlp.addDocument('en', 'howdy', 'greetings.hello');
    
    // Train also the NLG
    nlp.addAnswer('en', 'greetings.bye', 'Till next time');
    nlp.addAnswer('en', 'greetings.bye', 'see you soon!');
    nlp.addAnswer('en', 'greetings.hello', 'Hey there!');
    nlp.addAnswer('en', 'greetings.hello', 'Greetings!');
    await nlp.train();
    const response = await nlp.process('en', 'I should go now');
    console.log(response);
  })();
  </script>
</head>
<body>
</body>
</html>
```

## Load corpus from URL

You can download the source code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/02.web/03.filecorpus
At previous examples, the corpus is manually loaded into the nlp, but what if we want a corpus in json like in backend ant to load it from an URL?
First at all we need to register a valid file system into our container, in our case a request plugin that uses axios.
First install the package:
```bash
npm i @nlpjs/request-rn
```

Now we need to expose it in our _index.js_:
```javascript
const core = require('@nlpjs/core');
const nlp = require('@nlpjs/nlp');
const langenmin = require('@nlpjs/lang-en-min');
const requestrn = require('@nlpjs/request-rn');

window.nlpjs = { ...core, ...nlp, ...langenmin, ...requestrn };
```

And compile the bundle:
```bash
npm run browserdist
```
The new bundle will be 126KB, that is 15KB more than without this plugin.

And at our _index.html_ we change our script:

```javascript
  const { containerBootstrap, Nlp, LangEn, fs } = window.nlpjs;

  (async () => {
    const container = await containerBootstrap();
    container.register('fs', fs);
    container.use(Nlp);
    container.use(LangEn);
    const nlp = container.get('nlp');
    nlp.settings.autoSave = false;
    await nlp.addCorpus('https://raw.githubusercontent.com/jesus-seijas-sp/nlpjs-examples/master/01.quickstart/02.filecorpus/corpus-en.json');
    await nlp.train();
    const response = await nlp.process('en', 'who are you');
    console.log(response);
  })();
```
