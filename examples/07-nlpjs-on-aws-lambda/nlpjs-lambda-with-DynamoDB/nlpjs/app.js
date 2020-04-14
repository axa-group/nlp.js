/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */

const { engine } = require('./engine.js');

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
// eslint-disable-next-line no-unused-vars
exports.lambdaHandler = function(event, context, callback) {
    console.info(JSON.stringify(event));
    try {
        let phrase = null;
        if (event.phrase && event.phrase !== '') {
            phrase = event.phrase;
            console.log('PARAMETER TAKEN FROM EVENT');
        } else if (event.body && event.body !== '') {
            const body = JSON.parse(event.body);
            if (body.phrase && body.phrase !== '') {
                phrase = body.phrase;
                console.log('PARAMETER TAKEN FROM BODY');
            }
        } else if (event.queryStringParameters && event.queryStringParameters !== '') {
            phrase = event.queryStringParameters.phrase;
            console.log('PARAMETER TAKEN FROM QUERY STRING');
        } else {
            phrase = engine.default_phrase;
            console.log('PARAMETER TAKEN FROM NOWHERE!?!?!?');
        }
        phrase = phrase && phrase !== '' ? phrase : engine.default_phrase;
        console.log('BEGIN OF PROCESS');
        const resultPromise = engine.process(phrase);
        console.log('END OF PROCESS');
        resultPromise.then(function(response) {
            console.info(`RESULT: ${JSON.stringify(response)}`);
            callback(null, {
                'statusCode': 200,
                'body': JSON.stringify(response)
            });
        }).catch(function(err) {
            console.error(err);
            callback(err);
        });
    } catch (err) {
        console.error(err);
        callback(err);
    }
};
