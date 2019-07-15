/*
 * Copyright (c) AXA Shared Services Spain S.A.
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
  toArray,
  toHash,
  lookupToArray,
  lookupToObject,
  getTypedArrayFn,
} = require('../util/helper');

/**
 * Class for a dense neural network, with an input and output layers fully connected,
 * using a leaky-relu activation
 */
class NeuralNetwork {
  constructor(options = {}) {
    this.trainOpts = {};
    this.trainOpts.iterations = options.iterations || 20000;
    this.trainOpts.errorThresh = options.errorThresh || 0.005;
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
    this.outputErrors = [];
    this.outputDeltas = [];
    this.biases = new Float32Array(size);
    this.weights = new Array(size);
    this.changes = new Array(size);
    for (let node = 0; node < size; node += 1) {
      this.weights[node] = new Float32Array(this.sizes[0]);
      this.changes[node] = new Float32Array(this.sizes[0]);
    }
  }

  get isRunnable() {
    return !!this.sizes;
  }

  run(srcInput) {
    if (this.isRunnable) {
      const input = lookupToArray(
        this.inputLookup,
        srcInput,
        Object.keys(this.inputLookup).length
      );
      return lookupToObject(this.outputLookup, this.runInput(input).slice(0));
    }
    return undefined;
  }

  runInput(input) {
    this.inputs = input;
    const alpha = this.trainOpts.leakyReluAlpha;
    for (let node = 0; node < this.sizes[1]; node += 1) {
      const weights = this.weights[node];
      // If you're thinking about using a reduce here, be aware that it
      // causes a huge penalization in performance... so if you modify
      // the code below, test it with a big model and benchmark it.
      let sum = this.biases[node];
      for (let y = 0; y < weights.length; y += 1) {
        if (input[y]) {
          sum += weights[y];
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
    const data = this.formatData(srcData);
    if (!this.status) {
      this.status = { error: Infinity, deltaError: Infinity, iterations: 0 };
    }
    this.verifyIsInitialized(data);
    while (
      this.status.iterations < this.trainOpts.iterations &&
      this.status.error > this.trainOpts.errorThresh &&
      this.status.deltaError > this.trainOpts.deltaErrorThresh
    ) {
      const hrstart = process.hrtime();
      this.status.iterations += 1;
      const lastError = this.status.error;
      this.status.error = 0;
      for (let i = 0; i < data.length; i += 1) {
        const current = data[i];
        this.runInput(current.input);
        this.calculateDeltas(current.output);
        let error = 0;
        for (let j = 0, l = this.outputErrors.length; j < l; j += 1) {
          error += this.outputErrors[j] ** 2;
        }
        this.status.error += error / this.outputErrors.length;
      }
      this.status.error /= data.length;
      this.status.deltaError = Math.abs(this.status.error - lastError);
      const hrend = process.hrtime(hrstart);
      if (this.logFn) {
        this.logFn(this.status, hrend[0] * 1000 + hrend[1] / 1000000);
      }
    }
    return this.status;
  }

  calculateDeltas(target) {
    const alpha = this.trainOpts.leakyReluAlpha;
    const incoming = this.inputs;
    for (let node = 0, l = this.sizes[1]; node < l; node += 1) {
      const output = this.outputs[node];
      this.outputErrors[node] = target[node] - output;
      this.outputDeltas[node] =
        output > 0 ? this.outputErrors[node] : alpha * this.outputErrors[node];
      const delta = this.outputDeltas[node] * this.trainOpts.learningRate;
      const changes = this.changes[node];
      const weights = this.weights[node];
      for (let k = 0, m = incoming.length; k < m; k += 1) {
        const change =
          delta * incoming[k] + this.trainOpts.momentum * changes[k];
        changes[k] = change;
        weights[k] += change;
      }
      this.biases[node] += delta;
    }
  }

  formatData(data) {
    if (!this.inputLookup) {
      this.inputLookup = new LookupTable(data, 'input').table;
      this.outputLookup = new LookupTable(data, 'output').table;
    }
    const formatInput = getTypedArrayFn(this.inputLookup);
    const formatOutput = getTypedArrayFn(this.outputLookup);
    return data.reduce((prev, current) => {
      prev.push({
        input: formatInput(current.input),
        output: formatOutput(current.output),
      });
      return prev;
    }, []);
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
          const node = nodes[j];
          layers[layer][node] = {};
          const currentNode = layers[layer][node];
          if (layer > 0) {
            currentNode.bias = this.adjust(this.biases[j]);
            currentNode.weights = {};
            const keys = Object.keys(layers[layer - 1]);
            for (let k = 0; k < keys.length; k += 1) {
              currentNode.weights[keys[k]] = this.adjust(
                this.weights[j][this.inputLookup[keys[k]]]
              );
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
    const outputLayer = json.layers[1];
    this.outputLookup = toHash(outputLayer);
    const nodes = Object.keys(outputLayer);
    this.sizes[1] = nodes.length;
    for (let j = 0; j < nodes.length; j += 1) {
      const node = nodes[j];
      this.biases[j] = outputLayer[node].bias;
      this.weights[j] = toArray(outputLayer[node].weights);
    }
  }
}

module.exports = NeuralNetwork;
