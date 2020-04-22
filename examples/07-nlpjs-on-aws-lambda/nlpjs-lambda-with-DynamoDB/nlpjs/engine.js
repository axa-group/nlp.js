/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */

// eslint-disable-next-line import/no-extraneous-dependencies
const aws = require('aws-sdk');

const NOT_PROD_ENV = process.env.AWS_SAM_LOCAL === 'true';

const dynamoDB = NOT_PROD_ENV ? new aws.DynamoDB({ endpoint : 'http://host.docker.internal:8000/', region: 'eu-west-1' }) : new aws.DynamoDB();

if (NOT_PROD_ENV) console.info('>>>>>>>>>>>>>>>>>>> DynamoDb:', dynamoDB);

const documentClient = new aws.DynamoDB.DocumentClient();

// const { NlpManager } = require('node-nlp');
const { NlpManager } = require('../../../../packages/node-nlp/src');

const DEFAULT_LANGUAGE = 'en';

const DEFAULT_PHRASE = 'Hi';

const { MODEL_TABLENAME } = process.env;

const MODEL_TABLENAME_KEY = 'themodel'; // 'ec4b835b-3aae-42a8-92d0-751bd55151fa';

const manager = new NlpManager({ languages: [DEFAULT_LANGUAGE], autoSave: false, autoLoad: false });

let isModelDefined = false;
function defineModel() {
    if (isModelDefined) {
        console.debug('MODEL ALREADY GENERATED');
        return;
    }

    console.debug("GENERATING THE MODEL");
    // Adds the utterances and intents for the NLP
    manager.addDocument(DEFAULT_LANGUAGE, 'goodbye for now', 'greetings.bye');
    manager.addDocument(DEFAULT_LANGUAGE, 'bye bye take care', 'greetings.bye');
    manager.addDocument(DEFAULT_LANGUAGE, 'okay see you later', 'greetings.bye');
    manager.addDocument(DEFAULT_LANGUAGE, 'bye for now', 'greetings.bye');
    manager.addDocument(DEFAULT_LANGUAGE, 'i must go', 'greetings.bye');
    manager.addDocument(DEFAULT_LANGUAGE, 'hello', 'greetings.hello');
    manager.addDocument(DEFAULT_LANGUAGE, DEFAULT_PHRASE, 'greetings.hello');
    manager.addDocument(DEFAULT_LANGUAGE, 'howdy', 'greetings.hello');

    // Train also the NLG
    manager.addAnswer(DEFAULT_LANGUAGE, 'greetings.bye', 'Till next time');
    manager.addAnswer(DEFAULT_LANGUAGE, 'greetings.bye', 'see you soon!');
    manager.addAnswer(DEFAULT_LANGUAGE, 'greetings.hello', 'Hey there!');
    manager.addAnswer(DEFAULT_LANGUAGE, 'greetings.hello', 'Greetings!');

    isModelDefined = true;
    console.debug('MODEL GENERATED');
}

let isModelTrained = false;
function trainModel() {
    if (isModelTrained) {
        console.debug('MODEL ALREADY TRAINED');
        return;
    }
    console.debug("TRAINING THE MODEL");
    (async() => {
        await manager.train();
    })();
    isModelTrained = true;
    console.debug('MODEL TRAINED');
}
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#describeTable-property
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-examples.html

function regenerateModel(afterTrainCallback) {
    defineModel();
    trainModel();
    if (afterTrainCallback) {
        afterTrainCallback();
    }
}

function checkModel() {
    const params = {
        TableName: MODEL_TABLENAME
    };

    try {
        const description = dynamoDB.describeTable(params, function(errDesc, dataDesc) {
            if (errDesc) {
                console.error("THERE IS A BIG PROBLEM! SEEMS THAT THE TABLE WHICH MUST CONTAIN THE MODEL DOESN'T EXIST: ", errDesc);
                regenerateModel(null);
            }
            if (dataDesc.Table.ItemCount === 0) {
                regenerateModel(function() {
                    params.Item = { 'id': MODEL_TABLENAME_KEY, 'model': manager.export() };
                    console.debug('SAVING MODEL INTO DynamoDB TABLE: ', params);
                    documentClient.put(params, function(errPut, dataPut) {
                        if (errPut) {
                            console.error('ERROR SAVING THE GENERATED MODEL: ', errPut);
                        }
                        if (dataPut) {
                            console.debug('MODEL SAVED INTO DynamDB TABLE: ', dataPut);
                        } else if (!errPut) {
                            console.warning('WITHOUT RESPONSE FROM "put" OPERATION');
                        }
                    });
                });
            } else { // dataDesc.Table.ItemCount > 0
                console.info(`THE TABLE WITH A MODEL ALREADY EXISTS. THERE IS ${dataDesc.Table.ItemCount} ITEMS`);
                params.Key = { id: MODEL_TABLENAME_KEY };
                documentClient.get(params, function(errGet, dataGet) {
                    if (errGet) {
                        console.error('CANNOT GET RECORDS FROM TABLE: ', errGet);
                        regenerateModel(null);
                    }
                    if (dataGet) {
                        console.debug('SETTING THE MODEL RETRIEVED: ', dataGet);
                        manager.import(dataGet.Item.model);
                    } else if (!errGet) {
                        console.error('NO-RECORD RETRIEVED FROM TABLE');
                        regenerateModel(null);
                    }
                });
            }
        });

        console.debug('DESCRIPTION: ', description);
    } catch(excp) {
        console.error('PROBLEMS ON INITIALIZATION OF THE THE MODEL: ', excp);
        regenerateModel(null);
    }
}

checkModel();

exports.engine = {
    default_phrase: DEFAULT_PHRASE,
    process: (phrase) => manager.process(DEFAULT_LANGUAGE, phrase)
};