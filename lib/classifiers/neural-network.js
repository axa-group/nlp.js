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

const {
  LookupTable,
  toHash,
  lookupToArray,
  lookupToObject,
  getTypedArrayFn,
} = require('../util/helper');

let performance;
// eslint-disable-next-line
if (typeof window === 'undefined') {
  // eslint-disable-next-line
  performance = require('perf_hooks').performance;
} else {
  // eslint-disable-next-line
  performance = window.performance;
}

/**
 * Class for a dense neural network, with an input and output layers fully connected,
 * using a leaky-relu activation
 */
class NeuralNetwork {
  constructor(options = {}) {
    this.trainOpts = {};
    this.trainOpts.iterations = options.iterations || 20000;
    this.trainOpts.errorThresh = options.errorThresh || 0.005;
    this.trainOpts.fixedError =
      options.fixedError === undefined ? false : options.fixedError;
    this.trainOpts.deltaErrorThresh = options.deltaErrorThresh || 0.0000001;
    this.trainOpts.learningRate = options.learningRate || 0.3;
    this.trainOpts.momentum = options.momentum || 0.1;
    this.trainOpts.leakyReluAlpha = options.leakyReluAlpha || 0.05;
    this.trainOpts.maxDecimals = options.maxDecimals;
    this.trainOpts.log = options.log === undefined ? false : options.log;
    if (this.trainOpts.log === true) {
      this.logFn = (status, time) =>
        console.log(
          `Epoch ${status.iterations} loss ${status.error} time ${time}ms`
        );
    } else if (typeof this.trainOpts.log === 'function') {
      this.logFn = this.trainOpts.log;
    }
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

  runInput(input) {
    this.inputs = input;
    const alpha = this.trainOpts.leakyReluAlpha;
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
    if (!this.trainOpts.fixedError) {
      minError =
        this.sizes[1] > 50
          ? (this.trainOpts.errorThresh * 50) / this.sizes[1]
          : this.trainOpts.errorThresh;
      minDelta =
        this.sizes[1] > 50
          ? (this.trainOpts.deltaErrorThresh * 50) / this.sizes[1]
          : this.trainOpts.deltaErrorThresh;
    } else {
      minError = this.trainOpts.errorThresh;
      minDelta = this.trainOpts.deltaErrorThresh;
    }
    while (
      this.status.iterations < this.trainOpts.iterations &&
      this.status.error > minError &&
      this.status.deltaError > minDelta
    ) {
      const hrstart = performance.now();
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
      const hrend = performance.now();
      if (this.logFn) {
        this.logFn(this.status, hrend - hrstart);
      }
    }
    return this.status;
  }

  calculateDeltas(incoming, target, outputs, marknode) {
    const { learningRate, leakyReluAlpha: alpha, momentum } = this.trainOpts;
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
      } else {
        for (let k; k < incoming.length; k += 1) {
          const change = momentum * changes[k];
          changes[k] = change;
          weights[k] += change;
        }
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
    return this.trainOpts.maxDecimals && this.trainOpts.maxDecimals < 17
      ? parseFloat(n.toFixed(this.trainOpts.maxDecimals))
      : n;
  }

  toJSON() {
    const layers = [];
    if (this.isRunnable) {
      for (let layer = 0; layer <= 1; layer += 1) {
        layers[layer] = {};
        const nodes = Object.keys(
          layer === 0 ? this.inputLookup : this.outputLookup
        );
        for (let j = 0; j < nodes.length; j += 1) {
          const perceptron = this.perceptrons[j];
          const node = nodes[j];
          layers[layer][node] = {};
          const currentNode = layers[layer][node];
          if (layer > 0) {
            currentNode.bias = this.adjust(perceptron.bias);
            currentNode.weights = {};
            const keys = Object.keys(layers[layer - 1]);
            for (let k = 0; k < keys.length; k += 1) {
              const currentWeight = this.adjust(
                perceptron.weights[this.inputLookup[keys[k]]]
              );
              if (currentWeight !== 0) {
                currentNode.weights[keys[k]] = currentWeight;
              }
            }
          }
        }
      }
    }
    return {
      sizes: this.sizes,
      layers,
      trainOpts: this.trainOpts,
    };
  }

  fromJSON(json) {
    this.sizes = json.sizes;
    this.trainOpts = json.trainOpts;
    if (!this.sizes) return;
    this.initialize();
    this.inputLookup = toHash(json.layers[0]);
    const features = Object.keys(this.inputLookup);
    const outputLayer = json.layers[1];
    this.outputLookup = toHash(outputLayer);
    const nodes = Object.keys(outputLayer);
    this.sizes[1] = nodes.length;
    for (let j = 0; j < nodes.length; j += 1) {
      const node = nodes[j];
      const perceptron = this.perceptrons[j];
      perceptron.bias = outputLayer[node].bias;
      const weights = new Float32Array(this.sizes[0]);
      for (let k = 0; k < features.length; k += 1) {
        const feature = features[k];
        if (outputLayer[node].weights[feature]) {
          const index = this.inputLookup[feature];
          weights[index] = outputLayer[node].weights[feature];
        }
      }
      perceptron.weights = weights;
    }
  }
}

module.exports = NeuralNetwork;
