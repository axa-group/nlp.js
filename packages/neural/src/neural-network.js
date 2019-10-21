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
const defaultSettings = require('./default-settings.json');
const Perceptron = require('./perceptron');

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
 * Class for a fully connected neural network
 */
class NeuralNetwork extends Clonable {
  /**
   * Constructor of the class
   * @param {object} settings Settings for the perceptrons
   */
  constructor(settings) {
    super({});
    this.perceptronSettings = {};
    this.applySettings(this.perceptronSettings, settings);
    this.applySettings(this.perceptronSettings, defaultSettings);
    if (this.perceptronSettings.log === true) {
      this.logFn = (status, time) =>
        console.log(
          `Epoch ${status.iterations} loss ${status.error} time ${time}ms`
        );
    } else if (typeof this.perceptronSettings.log === 'function') {
      this.logFn = this.perceptronSettings.log;
    }
    this.jsonExport = {
      perceptrons: () => this.perceptrons.map(x => x.toJSON()),
    };
    this.jsonImport = {
      perceptrons: this.importPerceptrons,
    };
  }

  importPerceptrons(target, source, key, value) {
    const result = [];
    for (let i = 0; i < value.length; i += 1) {
      const perceptron = new Perceptron({
        feature: value[i].feature,
        features: source.features,
        ...source.perceptronSettings,
      });
      perceptron.fromJSON(value[i]);
      result.push(perceptron);
    }
    return result;
  }

  initialize() {
    this.perceptrons = [];
    for (let i = 0; i < this.outputs.length; i += 1) {
      this.perceptrons.push(
        new Perceptron({
          feature: this.outputs[i],
          features: this.features,
          ...this.perceptronSettings,
        })
      );
    }
  }

  run(input, keys) {
    if (this.outputs) {
      const result = {};
      for (let i = 0; i < this.outputs.length; i += 1) {
        const perceptron = this.perceptrons[i];
        result[this.outputs[i]] = perceptron.run(input, keys);
      }
      return result;
    }
    return undefined;
  }

  initializeNoneFeature(data) {
    const useNoneFeature =
      data[data.length - 1].input.nonefeature !== undefined;
    if (useNoneFeature) {
      const intents = {};
      for (let i = 0; i < data.length - 1; i += 1) {
        const tokens = Object.keys(data[i].output);
        for (let j = 0; j < tokens.length; j += 1) {
          if (!intents[tokens[j]]) {
            intents[tokens[j]] = 1;
          }
        }
      }
      const current = data[data.length - 1];
      const keys = Object.keys(intents);
      for (let i = 0; i < keys.length; i += 1) {
        current.output[keys[i]] = 0.0000001;
      }
    }
  }

  getFeatures(data) {
    const inputKeys = {};
    for (let i = 0; i < data.length; i += 1) {
      const current = data[i];
      current.keys = Object.keys(current.input);
      for (let j = 0; j < current.keys.length; j += 1) {
        inputKeys[current.keys[j]] = 1;
      }
    }
    return Object.keys(inputKeys);
  }

  train(data) {
    this.initializeNoneFeature(data);
    this.features = this.getFeatures(data);
    const outputKeys = {};
    for (let i = 0; i < data.length; i += 1) {
      const current = data[i];
      const keys = Object.keys(current.output);
      for (let j = 0; j < keys.length; j += 1) {
        outputKeys[keys[j]] = 1;
      }
    }
    this.outputs = Object.keys(outputKeys);
    this.initialize();
    if (!this.status) {
      this.status = { error: Infinity, deltaError: Infinity, iterations: 0 };
    }
    let minError;
    let minDelta;
    if (!this.perceptronSettings.fixedError) {
      minError =
        this.outputs.length > 50
          ? (this.perceptronSettings.errorThresh * 50) / this.outputs.length
          : this.perceptronSettings.errorThresh;
      minDelta =
        this.outputs.length > 50
          ? (this.perceptronSettings.deltaErrorThresh * 50) /
            this.outputs.length
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
      const hrstart = performance.now();
      this.status.iterations += 1;
      const lastError = this.status.error;
      this.status.error = 0;
      for (let i = 0; i < data.length; i += 1) {
        const current = data[i];
        for (let j = 0; j < this.perceptrons.length; j += 1) {
          const perceptron = this.perceptrons[j];
          this.status.error +=
            perceptron.calculateDeltas(current, this.status.iterations) ** 2;
        }
      }
      this.status.error /= data.length * this.outputs.length;
      this.status.deltaError = Math.abs(this.status.error - lastError);
      const hrend = performance.now();
      if (this.logFn) {
        this.logFn(this.status, hrend - hrstart);
      }
    }
    return this.status;
  }
}

module.exports = NeuralNetwork;
