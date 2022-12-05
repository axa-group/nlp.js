/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const tf = require('@tensorflow/tfjs-node');
const { parentPort } = require('worker_threads');
const { ModelInput } = require('./constants');

let loadPort;
let inferencePort;
const modelsMap = {};
const modelParamsMap = {};

async function initModel(params) {
  try {
    modelParamsMap[params.path] = params;
    modelsMap[params.path] = await tf.node.loadSavedModel(params.path);
    loadPort.postMessage({ model: params.path });
  } catch (error) {
    loadPort.postMessage({ model: params.path, error });
  }
}

async function predict(modelPath, ids, attentionMask, tokenTypeIds) {
  const model = modelsMap[modelPath];
  const params = modelParamsMap[modelPath];
  const result = tf.tidy(() => {
    const inputTensor = tf.tensor(ids, undefined, 'int32');
    const maskTensor = tf.tensor(attentionMask, undefined, 'int32');
    const modelInputs = {
      [params.inputsNames[ModelInput.Ids]]: inputTensor,
      [params.inputsNames[ModelInput.AttentionMask]]: maskTensor,
    };
    if (tokenTypeIds && params.inputsNames[ModelInput.TokenTypeIds]) {
      const tokenTypesTensor = tf.tensor(tokenTypeIds, undefined, 'int32');
      modelInputs[params.inputsNames[ModelInput.TokenTypeIds]] =
        tokenTypesTensor;
    }
    return model ? model.predict(modelInputs) : undefined;
  });
  const results = await Promise.all([
    result[params.outputsNames.startLogits].squeeze().array(),
    result[params.outputsNames.endLogits].squeeze().array(),
  ]);
  const [startLogits, endLogits] = results;
  tf.dispose(result);
  return [
    Array.isArray(startLogits[0]) ? startLogits : [startLogits],
    Array.isArray(endLogits[0]) ? endLogits : [endLogits],
  ];
}

async function runInference(value) {
  try {
    const { ids, attentionMask, tokenTypeIds } = value.inputs;
    const logits = await predict(value.model, ids, attentionMask, tokenTypeIds);
    inferencePort.postMessage({ logits, id: value.id });
  } catch (error) {
    inferencePort.postMessage({ error, id: value.id });
  }
}

parentPort.on('message', (value) => {
  switch (value.type) {
    case 'infer':
      runInference(value);
      break;
    case 'init':
      loadPort = value.loadPort || value.ports[1];
      inferencePort = value.inferencePort || value.ports[2];
      (value.initPort || value.ports[0]).close();
      break;
    case 'load':
      initModel(value.params);
      break;
    case 'close':
      parentPort.close();
      break;
    default:
      break;
  }
});
