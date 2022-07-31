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
const { Clonable } = require('@nlpjs/core');
const path = require('path');
const {
  LookupTable,
  lookupToArray,
  lookupToObject,
  toHash,
  getTypedArrayFn,
} = require('./helper');
const defaultSettings = require('./default-settings.json');

let Worker;
let isMainThread;
try {
  // eslint-disable-next-line global-require
  const workerThreads = require('worker_threads');
  Worker = workerThreads.Worker;
  isMainThread = workerThreads.isMainThread;
} catch (err) {
  console.log('No worker threads');
}

/**
 * Class for a dense neural network, with an input and output layers fully connected,
 * using a leaky-relu activation
 */
class NeuralNetwork extends Clonable {
  constructor(settings = {}, container) {
    super({}, container);
    this.perceptronSettings = {};
    this.applySettings(this.perceptronSettings, settings);
    this.applySettings(this.perceptronSettings, defaultSettings);
    if (this.perceptronSettings.log === true) {
      this.logFn = (status, time) => {
        this.logger.info(
          `Epoch ${status.iterations} loss ${status.error} time ${time}ms`
        );
      };
    } else if (typeof this.perceptronSettings.log === 'function') {
      this.logFn = this.perceptronSettings.log;
    }
    this.jsonExport = {
      perceptrons: this.exportPerceptrons,
    };
    this.jsonImport = {
      perceptrons: this.importPerceptrons,
    };
  }

  initialize() {
    const size = this.sizes[1];
    this.inputs = [];
    this.outputs = [];
    this.perceptrons = [];
    for (let node = 0; node < size; node += 1) {
      this.perceptrons.push({
        weights: new Float32Array(this.sizes[0]),
        changes: new Float32Array(this.sizes[0]),
        bias: 0,
      });
    }
  }

  get isRunnable() {
    return !!this.sizes;
  }

  run(srcInput) {
    if (this.isRunnable) {
      const input = lookupToArray(this.inputLookup, srcInput);
      return lookupToObject(this.outputLookup, this.runInput(input).slice(0));
    }
    return undefined;
  }

  explain(input, intent) {
    const keys = Object.keys(input);
    const result = {};
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const index = this.inputLookup[key];
      if (index !== undefined) {
        result[key] =
          this.perceptrons[this.outputLookup[intent]].weights[index];
      } else {
        result[key] = 0;
      }
    }
    return {
      weights: result,
      bias: this.perceptrons[this.outputLookup[intent]].bias,
    };
  }

  runInput(input) {
    this.inputs = input;
    const { alpha } = this.perceptronSettings;
    const keys = Object.keys(input);
    for (let node = 0; node < this.sizes[1]; node += 1) {
      const perceptron = this.perceptrons[node];
      const { weights, bias } = perceptron;
      let sum = bias;
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        if (weights[key]) {
          if (input[key] === 1) {
            sum += weights[key];
          } else {
            sum += input[key] * weights[key];
          }
        }
      }
      this.outputs[node] = sum < 0 ? 0 : alpha * sum;
    }
    return this.outputs;
  }

  /**
   * If the model is not initilized, then initialize it.
   * @param {Object} data Data for the initialization.
   */
  verifyIsInitialized(data) {
    if (!this.sizes) {
      this.sizes = [data[0].input.length, data[0].output.length];
      this.initialize();
    }
  }

  train(srcData) {
    if (!srcData || !srcData.length) {
      return {};
    }
    if (isMainThread) {
      return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, './worker.js'), {
          workerData: { settings: this.perceptronSettings, data: srcData },
        });
        worker.on('message', (data) => {
          this.fromJSON(data.json);
          return resolve(data.status);
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
    }
    const useNoneFeature =
      srcData[srcData.length - 1].input.nonefeature !== undefined;
    if (useNoneFeature) {
      const intents = {};
      for (let i = 0; i < srcData.length - 1; i += 1) {
        const tokens = Object.keys(srcData[i].output);
        for (let j = 0; j < tokens.length; j += 1) {
          if (!intents[tokens[j]]) {
            intents[tokens[j]] = 1;
          }
        }
      }
      const current = srcData[srcData.length - 1];
      const keys = Object.keys(intents);
      for (let i = 0; i < keys.length; i += 1) {
        current.output[keys[i]] = 0.0000001;
      }
    }
    const data = this.formatData(srcData);
    const dataDict = [];
    for (let i = 0; i < data.length; i += 1) {
      const current = data[i].input;
      const currentObj = {};
      for (let j = 0; j < current.length; j += 1) {
        if (current[j]) {
          currentObj[j] = current[j];
        }
      }
      dataDict.push(currentObj);
    }
    if (!this.status) {
      this.status = { error: Infinity, deltaError: Infinity, iterations: 0 };
    }
    this.verifyIsInitialized(data);
    let minError;
    let minDelta;
    if (!this.perceptronSettings.fixedError) {
      minError =
        this.sizes[1] > 50
          ? (this.perceptronSettings.errorThresh * 50) / this.sizes[1]
          : this.perceptronSettings.errorThresh;
      minDelta =
        this.sizes[1] > 50
          ? (this.perceptronSettings.deltaErrorThresh * 50) / this.sizes[1]
          : this.perceptronSettings.deltaErrorThresh;
    } else {
      minError = this.perceptronSettings.errorThresh;
      minDelta = this.perceptronSettings.deltaErrorThresh;
    }
    while (
      this.status.iterations < this.perceptronSettings.iterations &&
      this.status.error > minError &&
      this.status.deltaError > minDelta
    ) {
      const hrstart = new Date();
      this.status.iterations += 1;
      const lastError = this.status.error;
      this.status.error = 0;
      for (let i = 0; i < data.length; i += 1) {
        const current = data[i];
        this.status.error += this.calculateDeltas(
          current.input,
          current.output,
          this.runInput(dataDict[i])
        );
      }
      this.status.error /= data.length;
      this.status.deltaError = Math.abs(this.status.error - lastError);
      const hrend = new Date();
      if (this.logFn) {
        this.logFn(this.status, hrend.getTime() - hrstart.getTime());
      }
    }
    return this.status;
  }

  calculateDeltas(incoming, target, outputs, marknode) {
    const { learningRate, alpha, momentum } = this.perceptronSettings;
    const numOutputs = this.sizes[1];
    let error = 0;
    const decayLearningRate =
      learningRate / (1 + 0.001 * this.status.iterations);
    const startNode = marknode === undefined ? 0 : marknode;
    const endNode = marknode === undefined ? numOutputs : marknode + 1;
    for (let node = startNode; node < endNode; node += 1) {
      const perceptron = this.perceptrons[node];
      const { changes, weights } = perceptron;
      const output = outputs[node];
      const currentError = target[node] - output;
      if (currentError) {
        error += currentError ** 2;
        const delta =
          (output > 0 ? 1 : alpha) * currentError * decayLearningRate;
        for (let k = 0; k < incoming.length; k += 1) {
          const change = delta * incoming[k] + momentum * changes[k];
          changes[k] = change;
          weights[k] += change;
        }
        perceptron.bias += delta;
      }
    }
    return error / numOutputs;
  }

  formatData(data) {
    if (!this.inputLookup) {
      this.inputLookup = new LookupTable(data, 'input').table;
      this.outputLookup = new LookupTable(data, 'output').table;
    }
    const formatInput = getTypedArrayFn(this.inputLookup);
    const formatOutput = getTypedArrayFn(this.outputLookup);
    const result = [];
    for (let i = 0; i < data.length; i += 1) {
      result.push({
        input: formatInput(data[i].input),
        output: formatOutput(data[i].output),
      });
    }
    return result;
  }

  adjust(n) {
    return this.perceptronSettings.maxDecimals &&
      this.perceptronSettings.maxDecimals < 17
      ? parseFloat(n.toFixed(this.perceptronSettings.maxDecimals))
      : n;
  }

  toJSON() {
    const settings = {};
    const keys = Object.keys(this.perceptronSettings);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (this.perceptronSettings[key] !== defaultSettings[key]) {
        settings[key] = this.perceptronSettings[key];
      }
    }
    if (!this.inputLookup) {
      return {
        perceptronSettings: settings,
      };
    }
    const features = Object.entries(this.inputLookup)
      .sort((a, b) => a[1] - b[1])
      .map((entry) => entry[0]);
    const intents = Object.keys(this.outputLookup);
    const perceptrons = [];
    for (let i = 0; i < intents.length; i += 1) {
      const perceptron = this.perceptrons[i];
      const weights = [...perceptron.weights, perceptron.bias];
      perceptrons.push(weights);
    }
    return {
      features,
      intents,
      perceptrons,
      perceptronSettings: settings,
    };
  }

  fromJSON(json) {
    this.perceptronSettings = this.applySettings({
      ...defaultSettings,
      ...json.perceptronSettings,
    });
    if (json.features) {
      this.sizes = [json.features.length, json.intents.length];
      const inputLookup = {};
      for (let i = 0; i < json.features.length; i += 1) {
        inputLookup[json.features[i]] = i;
      }
      this.inputLookup = inputLookup;
      const layer1 = {};
      for (let i = 0; i < json.intents.length; i += 1) {
        const intent = json.intents[i];
        layer1[intent] = {};
      }
      this.outputLookup = toHash(layer1);
      this.initialize();
      for (let i = 0; i < json.intents.length; i += 1) {
        const perceptron = this.perceptrons[i];
        const data = json.perceptrons[i];
        perceptron.bias = data[data.length - 1];
        for (let j = 0; j < json.features.length; j += 1) {
          perceptron.weights[j] = data[j];
        }
      }
    }
  }
}

module.exports = NeuralNetwork;
