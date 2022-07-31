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

const CorpusLookup = require('./corpus-lookup');

const defaultSettings = {
  iterations: 20000,
  errorThresh: 0.00005,
  deltaErrorThresh: 0.000001,
  learningRate: 0.6,
  momentum: 0.5,
  alpha: 0.07,
  log: false,
};

class NeuralNetwork {
  constructor(settings = {}) {
    this.settings = settings;
    this.applySettings(this.settings, defaultSettings);
    if (this.settings.log === true) {
      this.logFn = (status, time) =>
        console.log(
          `Epoch ${status.iterations} loss ${status.error} time ${time}ms`
        );
    } else if (typeof this.settings.log === 'function') {
      this.logFn = this.settings.log;
    }
  }

  applySettings(obj = {}, settings = {}) {
    Object.keys(settings).forEach((key) => {
      if (obj[key] === undefined) {
        obj[key] = settings[key];
      }
    });
    return obj;
  }

  initialize(numInputs, outputNames) {
    this.perceptronsByName = {};
    this.perceptrons = [];
    this.outputs = {};
    this.numPerceptrons = outputNames.length;
    for (let i = 0; i < outputNames.length; i += 1) {
      const name = outputNames[i];
      this.outputs[name] = 0;
      const perceptron = {
        name,
        id: i,
        weights: new Float32Array(numInputs),
        changes: new Float32Array(numInputs),
        bias: 0,
      };
      this.perceptrons.push(perceptron);
      this.perceptronsByName[name] = perceptron;
    }
  }

  runInputPerceptron(perceptron, input) {
    const sum = input.keys.reduce(
      (prev, key) => prev + input.data[key] * perceptron.weights[key],
      perceptron.bias
    );
    return sum <= 0 ? 0 : this.settings.alpha * sum;
  }

  runInput(input) {
    for (let i = 0; i < this.numPerceptrons; i += 1) {
      this.outputs[this.perceptrons[i].name] = this.runInputPerceptron(
        this.perceptrons[i],
        input
      );
    }
    return this.outputs;
  }

  get isRunnable() {
    return !!this.numPerceptrons;
  }

  run(input) {
    return this.numPerceptrons
      ? this.runInput(this.lookup.transformInput(input))
      : undefined;
  }

  prepareCorpus(corpus) {
    this.lookup = new CorpusLookup();
    return this.lookup.build(corpus);
  }

  verifyIsInitialized() {
    if (!this.perceptrons) {
      this.initialize(this.lookup.numInputs, this.lookup.outputLookup.items);
    }
  }

  trainPerceptron(perceptron, data) {
    const { alpha, momentum } = this.settings;
    const { changes, weights } = perceptron;
    let error = 0;
    for (let i = 0; i < data.length; i += 1) {
      const { input, output } = data[i];
      const actualOutput = this.runInputPerceptron(perceptron, input);
      const expectedOutput = output.data[perceptron.id] || 0;
      const currentError = expectedOutput - actualOutput;
      if (currentError) {
        error += currentError ** 2;
        const delta =
          (actualOutput > 0 ? 1 : alpha) *
          currentError *
          this.decayLearningRate;
        for (let j = 0; j < input.keys.length; j += 1) {
          const key = input.keys[j];
          const change = delta * input.data[key] + momentum * changes[key];
          changes[key] = change;
          weights[key] += change;
        }
        perceptron.bias += delta;
      }
    }
    return error;
  }

  train(corpus) {
    if (!corpus || !corpus.length) {
      return {};
    }
    const useNoneFeature =
      corpus[corpus.length - 1].input.nonefeature !== undefined;
    if (useNoneFeature) {
      const intents = {};
      for (let i = 0; i < corpus.length - 1; i += 1) {
        const tokens = Object.keys(corpus[i].output);
        for (let j = 0; j < tokens.length; j += 1) {
          if (!intents[tokens[j]]) {
            intents[tokens[j]] = 1;
          }
        }
      }
      const current = corpus[corpus.length - 1];
      const keys = Object.keys(intents);
      for (let i = 0; i < keys.length; i += 1) {
        current.output[keys[i]] = 0.0000001;
      }
    }
    const data = this.prepareCorpus(corpus);
    if (!this.status) {
      this.status = { error: Infinity, deltaError: Infinity, iterations: 0 };
    }
    this.verifyIsInitialized();
    const minError = this.settings.errorThresh;
    const minDelta = this.settings.deltaErrorThresh;
    while (
      this.status.iterations < this.settings.iterations &&
      this.status.error > minError &&
      this.status.deltaError > minDelta
    ) {
      const hrstart = new Date();
      this.status.iterations += 1;
      this.decayLearningRate =
        this.settings.learningRate / (1 + 0.001 * this.status.iterations);
      const lastError = this.status.error;
      this.status.error = 0;
      for (let i = 0; i < this.numPerceptrons; i += 1) {
        this.status.error += this.trainPerceptron(this.perceptrons[i], data);
      }
      this.status.error /= this.numPerceptrons * data.length;
      this.status.deltaError = Math.abs(this.status.error - lastError);
      const hrend = new Date();
      if (this.logFn) {
        this.logFn(this.status, hrend.getTime() - hrstart.getTime());
      }
    }
    return this.status;
  }

  explain(input, intent) {
    const transformedInput = this.lookup.transformInput(input);
    const result = {};
    const intentIndex = this.lookup.outputLookup.dict[intent];
    if (intentIndex === undefined) {
      return {};
    }
    for (let i = 0; i < transformedInput.keys.length; i += 1) {
      const key = transformedInput.keys[i];
      result[this.lookup.inputLookup.items[key]] =
        this.perceptrons[intentIndex].weights[key];
    }
    return {
      weights: result,
      bias: this.perceptrons[intentIndex].bias,
    };
  }

  toJSON() {
    const settings = {};
    const keys = Object.keys(this.settings);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (this.settings[key] !== defaultSettings[key]) {
        settings[key] = this.settings[key];
      }
    }
    if (!this.lookup) {
      return {
        settings,
      };
    }
    const features = this.lookup.inputLookup.items;
    const intents = this.lookup.outputLookup.items;
    const perceptrons = [];
    for (let i = 0; i < this.perceptrons.length; i += 1) {
      const perceptron = this.perceptrons[i];
      const weights = [...perceptron.weights, perceptron.bias];
      perceptrons.push(weights);
    }
    return {
      settings,
      features,
      intents,
      perceptrons,
    };
  }

  fromJSON(json) {
    this.settings = this.applySettings({
      ...defaultSettings,
      ...json.settings,
    });
    if (json.features) {
      this.lookup = new CorpusLookup(json.features, json.intents);
      this.initialize(json.features.length, json.intents);
      for (let i = 0; i < this.perceptrons.length; i += 1) {
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
