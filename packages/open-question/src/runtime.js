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
const { MODEL_DEFAULTS, ModelInput } = require('./constants');
const RuntimeWorker = require('./runtime-worker');

class Runtime {
  constructor(settings) {
    this.settings = settings;
    this.worker = new RuntimeWorker();
  }

  async runInference(ids, attentionMask, tokenTypeIds) {
    const result = this.worker.queueInference(
      this.params.path,
      ids,
      attentionMask,
      tokenTypeIds
    );
    return result;
  }

  async start() {
    const modelGraph = (
      await tf.node.getMetaGraphsFromSavedModel(this.settings.path)
    )[0];
    this.params = Runtime.computeParams(this.settings, modelGraph);
    await this.worker.loadModel(this.params);
  }

  static computeParams(options, graph, defaults = MODEL_DEFAULTS) {
    const inputsNames = {};
    const optionsInputsNames = options.inputsNames || defaults.inputsNames;
    options.inputs.forEach((input) => {
      inputsNames[input] =
        optionsInputsNames[input] || defaults.inputsNames[input];
    });
    const optionsOutputsNames = options.outputsNames || defaults.outputsNames;
    const partialParams = {
      inputsNames,
      outputsNames: {
        endLogits:
          optionsOutputsNames.endLogits || defaults.outputsNames.endLogits,
        startLogits:
          optionsOutputsNames.startLogits || defaults.outputsNames.startLogits,
      },
      path: options.path,
      signatureName: options.signatureName || defaults.signatureName,
    };
    const signatureDef = graph.signatureDefs[partialParams.signatureName];
    if (!signatureDef) {
      throw new Error(
        `No signature matching name "${partialParams.signatureName}"`
      );
    }
    for (const inputName of Object.values(partialParams.inputsNames)) {
      if (!signatureDef.inputs[inputName]) {
        throw new Error(`No input matching name "${inputName}"`);
      }
    }
    for (const outputName of Object.values(partialParams.outputsNames)) {
      if (!signatureDef.outputs[outputName]) {
        throw new Error(`No output matching name "${outputName}"`);
      }
    }
    const rawShape =
      signatureDef.inputs[partialParams.inputsNames[ModelInput.Ids]].shape;
    const shape =
      typeof rawShape[0] === 'number'
        ? rawShape
        : rawShape.map((s) => s.array[0]);
    return {
      ...partialParams,
      shape,
    };
  }

  stop() {
    this.worker.close();
  }
}

module.exports = Runtime;
