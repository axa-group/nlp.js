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
  }

  initialize() {
    this.biases = [];
    this.weights = [];
    this.outputs = [[], []];
    this.deltas = [[], []];
    this.changes = [];
    this.errors = [[], []];
    const size = this.sizes[1];
    this.biases[1] = new Float32Array(size);
    this.weights[1] = new Array(size);
    this.changes[1] = new Array(size);
    for (let node = 0; node < size; node += 1) {
      this.weights[1][node] = new Float32Array(this.sizes[0]);
      this.changes[1][node] = new Float32Array(this.sizes[0]);
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
    this.outputs[0] = input;
    const alpha = this.trainOpts.leakyReluAlpha;
    for (let node = 0; node < this.sizes[1]; node += 1) {
      const weights = this.weights[1][node];
      // If you're thinking about using a reduce here, be aware that it
      // causes a huge penalization in performance... so if you modify
      // the code below, test it with a big model and benchmark it.
      let sum = this.biases[1][node];
      for (let y = 0; y < weights.length; y += 1) {
        if (input[y]) {
          sum += weights[y];
        }
      }
      this.outputs[1][node] = sum < 0 ? 0 : alpha * sum;
    }
    return this.outputs[1];
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
    const status = { error: Infinity, deltaError: Infinity, iterations: 0 };
    this.verifyIsInitialized(data);
    let lastError;
    while (
      status.iterations < this.trainOpts.iterations &&
      status.error > this.trainOpts.errorThresh &&
      status.deltaError > this.trainOpts.deltaErrorThresh
    ) {
      status.iterations += 1;
      lastError = status.error;
      status.error = 0;
      for (let i = 0; i < data.length; i += 1) {
        status.error += this.trainPattern(data[i]);
      }
      status.error /= data.length;
      status.deltaError = Math.abs(status.error - lastError);
    }
    return status;
  }

  trainPattern(value) {
    this.runInput(value.input);
    this.calculateDeltas(value.output);
    const errors = this.errors[1];
    return errors.reduce((p, c) => p + c ** 2, 0) / errors.length;
  }

  calculateDeltas(target) {
    const alpha = this.trainOpts.leakyReluAlpha;
    for (let layer = 1; layer >= 0; layer -= 1) {
      const errors = this.errors[layer];
      const deltas = this.deltas[layer];
      const currentOutputs = this.outputs[layer];
      for (let node = 0; node < this.sizes[layer]; node += 1) {
        const output = currentOutputs[node];
        if (layer === 1) {
          errors[node] = target[node] - output;
        } else {
          const nextDeltas = this.deltas[layer + 1];
          let error = 0;
          for (let k = 0; k < nextDeltas.length; k += 1) {
            error += nextDeltas[k] * this.weights[layer + 1][k][node];
          }
          errors[node] = error;
        }
        deltas[node] = output > 0 ? errors[node] : alpha * errors[node];
      }
    }
    let change;
    for (let layer = 1; layer <= 1; layer += 1) {
      const incoming = this.outputs[layer - 1];
      for (let node = 0; node < this.sizes[layer]; node += 1) {
        const delta = this.deltas[layer][node];
        for (let k = 0; k < incoming.length; k += 1) {
          change =
            this.trainOpts.learningRate * delta * incoming[k] +
            this.trainOpts.momentum * this.changes[layer][node][k];
          this.changes[layer][node][k] = change;
          this.weights[layer][node][k] += change;
        }
        this.biases[layer][node] += this.trainOpts.learningRate * delta;
      }
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
            currentNode.bias = this.adjust(this.biases[layer][j]);
            currentNode.weights = {};
            const keys = Object.keys(layers[layer - 1]);
            for (let k = 0; k < keys.length; k += 1) {
              currentNode.weights[keys[k]] = this.adjust(
                this.weights[layer][j][this.inputLookup[keys[k]]]
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
      this.biases[1][j] = outputLayer[node].bias;
      this.weights[1][j] = toArray(outputLayer[node].weights);
    }
  }
}

module.exports = NeuralNetwork;
