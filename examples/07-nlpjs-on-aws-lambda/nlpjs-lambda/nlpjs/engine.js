/* eslint-disable no-console */
/* eslint-disable prettier/prettier */

const fs = require('fs');

// const { NlpManager } = require('node-nlp');
const { NlpManager } = require('../../../../packages/node-nlp/src');

const DEFAULT_PHRASE = 'Hi';

const MODEL_FILEPATH = '/tmp/model.nlp';

const manager = new NlpManager({ languages: ['en'], autoSave: false, autoLoad: false });

if (fs.existsSync(MODEL_FILEPATH)) {
    manager.load(MODEL_FILEPATH);
} else {
    // Adds the utterances and intents for the NLP
    manager.addDocument('en', 'goodbye for now', 'greetings.bye');
    manager.addDocument('en', 'bye bye take care', 'greetings.bye');
    manager.addDocument('en', 'okay see you later', 'greetings.bye');
    manager.addDocument('en', 'bye for now', 'greetings.bye');
    manager.addDocument('en', 'i must go', 'greetings.bye');
    manager.addDocument('en', 'hello', 'greetings.hello');
    manager.addDocument('en', DEFAULT_PHRASE, 'greetings.hello');
    manager.addDocument('en', 'howdy', 'greetings.hello');

    // Train also the NLG
    manager.addAnswer('en', 'greetings.bye', 'Till next time');
    manager.addAnswer('en', 'greetings.bye', 'see you soon!');
    manager.addAnswer('en', 'greetings.hello', 'Hey there!');
    manager.addAnswer('en', 'greetings.hello', 'Greetings!');

    // Train and save the model.
    (async() => {
        await manager.train();
        manager.save(MODEL_FILEPATH);
    })();
}

exports.engine = {
    default_phrase: DEFAULT_PHRASE,
    process: (phrase) => manager.process('en', phrase)
};