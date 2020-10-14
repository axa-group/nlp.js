# Example NER Corpus

This example shows how to load a corpus from a json file that includes NER information. 

## How to configure in your project

As being an example inside this repo, this does not includes a package.json neither installation of the packages. The packages are loaded from the routes. To use this example in your own project start by initializating a project and installing these packages:

```shell
  npm i @nlpjs/basic @nlpjs/express-api-server @nlpjs/directline-connector
```

Also, the file _conf.json_ in this example use the plugins by className and path, in your project you can use the plugins directly by name:

```json
{
  "settings": {
    "nlp": {
      "corpora": ["./corpus.json"],
      "nlu": { "log": true }
    },
    "api-server": {
      "port": 3000,
      "serveBot": true      
    }
  },
  "use": ["Basic", "LangEn", "ExpressApiServer", "DirectlineConnector"]
}
```

## Entities

This example includes entities in the _corpus.json_. The entity _hero_ is an enum entity, while the entity _email_ is a regular expression entity.

```json
  "entities": {
    "hero": {
      "options": {
        "spiderman": ["spiderman", "spider-man"],
        "ironman": ["ironman", "iron-man"],
        "thor": ["thor"]
      }
    },
    "email": "/\\b(\\w[-._\\w]*\\w@\\w[-._\\w]*\\w\\.\\w{2,3})\\b/gi"
  }
```

The entities receive the locale from the corpus. If you want to register the entities for several locales, you can do it by the property _locale_:

```json
  "entities": {
    "hero": {
      "locale": ["en", "es"]
      "options": {
        "spiderman": ["spiderman", "spider-man"],
        "ironman": ["ironman", "iron-man"],
        "thor": ["thor"]
      }
    },
    "email": {
      "locale": ["en", "es"],
      "regex": "/\\b(\\w[-._\\w]*\\w@\\w[-._\\w]*\\w\\.\\w{2,3})\\b/gi"
    }
  }
```

## Using the project

Start the project:

```shell
  node index.js
```

Navigate to http://localhost:3000 and you'll find a web with a bubble to open the chat.
The chat is trained with two intents: one to know the real name of a hero ("what's the real name of spiderman?") and other one to know where a hero lives ("where spiderman lives?"). It knows three heros trained in the entity @hero: spiderman, ironman and thor. When a hero is identified it's able to retrieve the data from the json contained in _heros.json_ to give the answer.

It's able to mantain the context, so if the chatbot knows the last hero that you were talking about, then you can omit the entity information. Example:
```
user> What's the real name of spiderman?
bot> The real name of spiderman is Peter Parker
user> and where he lives?
bot> spiderman lives at Queens, New York
user> where thor lives?
bot> thor lives at Asgard
user> and what's his real name?
bot> The real name of thor is Odinson
```