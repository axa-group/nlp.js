# QnA

This will guide you through the process of creating a bot using a QnA tsv file instead of a corpus with intents.
The format of the file is a text file where each line is a question and an answer, separated by a tabulator.
You have an example of file here: https://github.com/jesus-seijas-sp/nlpjs-examples/blob/master/03.qna/01.filecorpus/qna.tsv

The process is exactly the same as having a bot with a chatbot, so we strongly recommend to do the quickstart: https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md

## Install the library and the qna plugin

At the folder where is your node project, install the basic library and the qna importer, that will install the core and basic plugins for working in backend, and also the plugin for converting qna files to corpus.

```sh
npm i @nlpjs/basic @nlpjs/qna-importer
```

## Train and test a QnA file

You have the source code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/03.qna/01.filecorpus

Add the corpus file to your folder, and then create this index.js:
```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
  const dock = await dockStart({ use: ['Basic', 'Qna'] });
  const nlp = dock.get('nlp');
  await nlp.addCorpus({ filename: './qna.tsv', importer: 'qna', locale: 'en' });
  await nlp.train();
  const response = await nlp.process('en', 'Who are you');
  console.log(response);
})();
```

Replace the filename './qna.tsv' with the path to your qna file, and the locale with the locale of your file (remember that if it's not english, you should install the language plugin for your langague).

Now you can execute this, and you'll see that the qna is trained and it resolves the answer to the question.

## Extracting the configuration into a file

You have the source code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/03.qna/02.config

Now we can remove code that are configuration related into a file. Add a conf.json file with this content:

```javascript
{
  "settings": {
    "nlp": {
      "corpora": [
        { "filename": "qna.tsv", "importer": "qna", "locale": "en" }
      ]
    }
  },
  "use": ["Basic", "Qna"]
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

## Exposing the bot with a Web and API

You have the code of this example here: https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/03.qna/03.webchat

You have to install now the plugins for the express server and the directline API:
```javascript
npm i @nlpjs/express-api-server @nlpjs/directline-connector
```

Change the conf.json to have those plugins and expose the API:

```javascript
{
  "settings": {
    "nlp": {
      "corpora": [
        { "filename": "qna.tsv", "importer": "qna", "locale": "en" }
      ]
    },
    "api-server": {
      "port": 3000,
      "serveBot": true
    }
  },
  "use": ["Basic", "Qna", "ExpressApiServer", "DirectlineConnector"]
}
```

You'll need a pipeline file to train the nlp, so create a pipelines.md file with this content:

```markdown
# default

## main
nlp.train
```

Finally the index.js code should be:

```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
  await dockStart();
})();
```

Now if you browse http://localhost:3000 you'll se an empty page with an small blue bubble, if you click in the bubble you'll be able to chat with your bot

<div align="center">
<img src="https://github.com/axa-group/nlp.js/raw/master/screenshots/webchat.png" width="auto" height="auto"/>
</div>
