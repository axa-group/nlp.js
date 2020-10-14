# NER Quick Start

## Install the needed packages
At the folder where is your node project, install the @nlpjs/basic, @nlpjs/express-api-server and @nlpjs/directline-connector packages.
```bash
npm i @nlpjs/basic @nlpjs/express-api-server @nlpjs/directline-connector
```

## Create the conf.json

Create the file _conf.json_ with this content:

```json
{
  "settings": {
    "nlp": {
      "corpora": ["./corpus.json"]
    },
    "api-server": {
      "port": 3000,
      "serveBot": true      
    }
  },
  "use": ["Basic", "LangEn", "ExpressApiServer", "DirectlineConnector"]
}
```

You'll telling the applicaition to use 4 plugins:
- Basic: the basic plugins for an NLP backend, that includes evaluator, javascript compiler, logger, and NLP classes
- LangEn: the plugin to use english language
- ExpressApiServer: the plugin to have an API server done with express
- DirectlineConnector: the plugin that uses the ExpressApiServer to serve an API for the chatbot

Also this configure the ExpressApiServer to be exposed in the port 3000 and to serve the chatbot frontend (serveBot: true).
Finally, it tells the NLP to import the corpus defined in the file _corpus.json_.

## Create the corpus.json

Add the file _corpus.json_ with this content:

```json
{
  "name": "Corpus with entities",
  "locale": "en-US",
  "contextData": "./heros.json",
  "data": [
    {
      "intent": "hero.realname",
      "utterances": [
        "what is the real name of @hero"
      ],
      "answers": [
        "The real name of {{ hero }} is {{ _data[entities.hero.option].realName }}"
      ]
    },
    {
      "intent": "hero.city",
      "utterances": [
        "where @hero lives?",
        "what's the city of @hero?"
      ],
      "answers": [
        "{{ hero }} lives at {{ _data[entities.hero.option].city }}"
      ]
    }
  ],
  "entities": {
    "hero": {
      "options": {
        "spiderman": ["spiderman", "spider-man"],
        "ironman": ["ironman", "iron-man"],
        "thor": ["thor"]
      }
    }
  }
}
```

This creates 2 intents: one to know the real name of a hero and other one to know where the hero lives.
Also creates the entity to recognize thre heros: spiderman, ironman and thor, and also their synonyms.
There is a part in the json to tell the NLP to load some contextData that will be used to generate the answers:
```json
  "contextData": "./heros.json",
```

If you take a look at one answer, ```_data[entities.hero.option].city``` as an example, the content at the json _heros.json_ will be accesible at the context as data. Also, the entities are accesible at the property _entities_, so as the entity name is _hero_ you'll have the result from the NER for the entity _hero_ stored at _entities.hero_

## Create the heros.json

Create the file _heros.json_ with this content:

```json
{
  "spiderman": {
    "realName": "Peter Parker",
    "city": "Queens, New York"
  },
  "ironman": {
    "realName": "Tony Stark",
    "city": "Stark Tower, New York"
  },
  "thor": {
    "realName": "Odinson",
    "city": "Asgard"
  }
}
```

## Create the index.js

Create the file _index.js_ with this content:

```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
  const dock = await dockStart();
  const nlp = dock.get('nlp');
  await nlp.train();
})();
```

This initializes the project and load all the jsons building the structure when you call _dockStart()_ and returns to you a dock for the containers.
Then you can retrieve instances from the container, in this case we retrieve the _nlp_ instance to train it.

## Start the application

You can start your application running:

```shell
node index.js
```

Then you can navigate to http://localhost:3000 to use it.

## Stored context

You'll see that you can ask for information of a hero, but also that if you're talking with the bot about a hero then you can omit the reference to the hero you're talking about.
This context is stored per conversation, so different conversations have its own context variables.

<div align="center">
<img src="https://github.com/axa-group/nlp.js/raw/master/screenshots/ner-demo.png" width="auto" height="auto"/>
</div>
