# Quick Start

## Install the library
At the folder where is your node project, install the basic library, that will install the core and basic plugins for working in backend.

```bash
npm i @nlpjs/basic
```

## Create the code
You have the code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/01.quickstart/01.basic
Then you can create a file index.js with this content:

```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
  const dock = await dockStart({ use: ['Basic']});
  const nlp = dock.get('nlp');
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
  nlp.addAnswer('en', 'greetings.hello', 'Greetings!');  await nlp.train();
  const response = await nlp.process('en', 'I should go now');
  console.log(response);
})();
```

## Extracting the corpus into a file
You have the code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/01.quickstart/02.filecorpus
You can put the corpus as json files. The format of the json is:

```json
{
  "name": "Name of the corpus",
  "locale": "en-US",
  "data": [
    {
      "intent": "agent.birthday",
      "utterances": [
        "when is your birthday",
        "when do you celebrate your birthday",
        "when were you born",
        "when do you have birthday",
        "date of your birthday"
      ],
      "answers": [
        "Wait, are you planning a party for me? It's today! My birthday is today!",
        "I'm young. I'm not sure of my birth date",
        "I don't know my birth date. Most virtual agents are young, though, like me."
      ]
    },
    ...
  ]
}
```

So the new code will be: 
```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
  const dock = await dockStart({ use: ['Basic']});
  const nlp = dock.get('nlp');
  await nlp.addCorpus('./corpus-en.json');
  await nlp.train();
  const response = await nlp.process('en', 'Who are you');
  console.log(response);
})();
```

## Extracting the configuration into a file
You have the code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/01.quickstart/03.config
Now we can remove things that are configuration into a file. Add a _conf.json_ file with this content:

```json
{
  "settings": {
    "nlp": {
      "corpora": [
        "./corpus-en.json"
      ]
    }
  },
  "use": ["Basic"]
}
```

And the new code will be:
```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
  const dock = await dockStart();
  const nlp = dock.get('nlp');
  await nlp.train();
  const response = await nlp.process('en', 'Who are you');
  console.log(response);
})();
```

As you can see now we don't need to provide the plugins to dockStart, neither to add the corpus manually.

## Creating your first pipeline
You have the code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/01.quickstart/04.firstpipeline
Now create a _pipelines.md_ file with this content:
```markdown
# default

## main
nlp.train
```

And remove the nlp.train() from the code:
```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
  const dock = await dockStart();
  const nlp = dock.get('nlp');
  const response = await nlp.process('en', 'Who are you');
  console.log(response);
})();
```

We are defining a pipeline called _main_ so it will be executed after loading the configuration and mounting the plugins, so the train process will be executed automatically in the dockStart process.

## Adding your first connector
You have the code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/01.quickstart/05.consoleconnector
Now modify the _conf.json_ to use also the plugin _ConsoleConnector_:

```json
{
  "settings": {
    "nlp": {
      "corpora": [
        "./corpus-en.json"
      ]
    }
  },
  "use": ["Basic", "ConsoleConnector"]
}
```

And at the _index.js_ you will only need the dockStart:

```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
  await dockStart();
})();
```

Now when you execute you can talk with your bot in the terminal, read the corpus to know what to ask to your bot

## Extending your bot with the pipeline
You have the code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/01.quickstart/06.javascriptpipelines
Now we will do two modifications: 
First one, we want that when our chatbot starts it should write "Say something!" in console, so we can change the pipeline _main_

```markdown
# default

## main
nlp.train
console.say "Say something!"
```

Also, we want that if we write "quit" in console, the process ends. For ending the process, the console plugin has a method called _exit_. And we want to write the code in the pipeline in javascript, so we add this to the _pipelines.md_ file:

```markdown
## console.hear
// compiler=javascript
if (message === 'quit') {
  return console.exit();
}
nlp.process();
this.say();
```

To explain the pipeline better: 
- The name of the pipeline is _console.hear_ because is the name of the event that the console connector will raise when it hears something. If this event does not exists in the pipeline, then will do default things. The code inside the pipeline will be executed with the input that this method receives.
- The line "// compiler=javascript" is telling what compiler to use for the pipelines. The default compiler is very simple, but you can write your pipelines also in javascript or python (adding the corresponding plugin).
- "nlp.process()" is calling the _process_ method of the plugin _nlp_. Notable here: this method returns a promise but you don't need to put the await in the pipelines, the await is automatically done. Also, no arguments are being provided: when the pipeline javascript compiler finds a method where we do not pass any argument, by default it adds the current input of the pipeline.
- "this.say()" as the _console.hear_ is executed by the _console_ plugin, _this_ refers to this plugin. As in the "nlp.process" we are not providing arguments, so the input is automatically provided.

The _index.js_ file will be:

```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
  await dockStart();
})();
```

## Adding Multilanguage
You can have the code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/01.quickstart/07.multilanguage
Now we want to add a corpus in spanish. First at all we must install the spanish language plugin:
```bash
npm i @nlpjs/lang-es
```

Then add the _LangEn_ plugin in the configuration, and of course the corpus to the corpora:
```json
{
  "settings": {
    "nlp": {
      "corpora": [
        "./corpus-en.json",
        "./corpus-es.json"
      ]
    }
  },
  "use": ["Basic", "ConsoleConnector"]
}
```

And add an spanish corpus. In the example, the spanish corpus does not have answers, and the default behaviour of ConsoleConnector is to do an echo. To show the intent and the score in console, we can add set debug to true in the console settings, modifying the configuration:
```json
{
  "settings": {
    "nlp": {
      "corpora": [
        "./corpus-en.json",
        "./corpus-es.json"
      ]
    },
    "console": {
      "debug": true
    }
  },
  "use": ["Basic", "ConsoleConnector"]
}
```

Now when you talk with the chatbot you can ask questions from the english corpus or from the spanish corpus. The NLP process automatically will identify the language and send the utterance to the correct trained model.

## Adding API and WebChat
You have the code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/01.quickstart/08.webchat
First you will need an Api Server to serve the web. For this you can install the plugin _ExpressApiServer_ that will create an api server using Express.
```bash
npm i @nlpjs/express-api-server
```

The internal name of the plugin is "api-server". 
Also you will have to configure the plugin to provide the port, and to set that it will serve a bot using webchat (Microsoft Webchat CDN).
This should be the content of the _conf.json_:
```json
{
  "settings": {
    "nlp": {
      "corpora": [
        "../corpora/corpus50en.json",
        "../corpora/corpus50es.json"
      ]
    },
    "api-server": { "port": 3000, "serveBot": true }
  },
  "use": ["Basic", "LangEn", "ConsoleConnector", "ExpressApiServer", "DirectlineConnector"]
}
```

Now if you start the application, and in your browser navigate to http://localhost:3000, you will see an empty chat saying "impossible to connect".

So lets add the Directline Connector, that will create an API like the Microsoft Directline, but in your local exposed with your API server. To do this install the DirectlineConnector plugin:
```bash
npm i @nlpjs/directline-connector
```

Restart your application and navigate again to http://localhost:3000 and you'll be able to chat with your bot.
<div align="center">
<img src="https://github.com/axa-group/nlp.js/raw/master/screenshots/webchat.png" width="auto" height="auto"/>
</div>

## Using Microsoft Bot Framework
You have the code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/01.quickstart/09.microsoftbot
There is a Microsoft Bot Framework Connector. First install the library:
```bash
npm i @nlpjs/msbf-connector
```
Then use the plugin adding it in your _conf.json_:

```json
{
  "settings": {
    "nlp": {
      "corpora": [
        "./corpus-en.json",
        "./corpus-es.json"
      ]
    },
    "console": {
      "debug": true
    },
    "api-server": {
      "port": 3000,
      "serveBot": true
    }
  },
  "use": ["Basic", "ConsoleConnector", "ExpressApiServer", "DirectlineConnector", "MsbfConnector"]
}
```

Now start you app and use Microsoft Bot Framework Emulator https://aka.ms/botemulator
The endpoint will be http://localhost:3000/default/api/messages
<div align="center">
<img src="https://github.com/axa-group/nlp.js/raw/master/screenshots/microsoftemulator.png" width="auto" height="auto"/>
</div>

Why is added /default to the api path? Because is the name of the container: NLP.js is built so you can have different container with different names running at the same time in the application, allowing you to build a chatbot exposed to the same channel in different ways, i.e., you can have a chatbot sharing corpus, models, etc. but with different behaviour by channel or by country or any other setting.

If you want the api to be exposed in /api/messages you can set the settings of msfb in the _conf.json:
```json
{
  "settings": {
    "nlp": {
      "corpora": [
        "./corpus-en.json",
        "./corpus-es.json"
      ]
    },
    "console": {
      "debug": true
    },
    "api-server": {
      "port": 3000,
      "serveBot": true
    },
    "msbf": {
      "apiPath": "",
      "messagesPath": "/api/messages"
    }
  },
  "use": ["Basic", "ConsoleConnector", "ExpressApiServer", "DirectlineConnector", "MsbfConnector"]
}
```

How to add the Microsoft Application ID and the Microsoft Bot Password? 
You have 3 different ways:
1. Providing it at the settings:
```json
    "msbf": {
      "apiPath": "",
      "messagesPath": "/api/messages",
      "appId": "<YOUR MICROSOFT BOT APP ID>",
      "appPassword": "<YOUR MICROSOFT BOT PASSWORD>"
    }
```

2. Define the environment variables MSBF_BOT_APP_ID and MSBF_BOT_APP_PASSWORD and will be loaded if there are no _appId_ and _appPassword_ in the plugin settings
3. You can define those environment variables in a _.env_ file, the _.env_ file is automatically loaded at the dockStart process if exists without installing dotenv.
