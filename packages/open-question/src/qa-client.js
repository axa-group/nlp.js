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

const { softMax } = require('@nlpjs/utils');
const BertTokenizer = require('./bert-tokenizer');
const Model = require('./model');

class QAClient {
  constructor(settings = {}) {
    this.settings = settings;
  }

  async start(srcSettings) {
    const settings = srcSettings || this.settings;
    this.model = new Model(
      settings.modelName,
      settings.modelDir,
      settings.proxy
    );
    await this.model.start();
    this.modelName = this.model.name;
    if (settings.tokenizer) {
      this.tokenizer = settings.tokenizer;
    } else {
      const tokenizerOptions = {
        filesDir: this.model.path,
        modelName: this.modelName,
      };
      if (settings.cased !== undefined) {
        tokenizerOptions.lowercase = !this.options.cased;
      }
      this.tokenizer = new BertTokenizer(tokenizerOptions);
    }
  }

  getFeatures(question, context, stride = 128) {
    this.tokenizer.setPadding(this.model.inputLength);
    this.tokenizer.setTruncation(this.model.inputLength, stride);
    const encoding = this.tokenizer.encodeSliced(question, context);
    const contextStartIndex = this.tokenizer.getContextStartIndex(encoding[0]);
    const encodings = encoding;
    const spans = [];
    const lengthNoStride = this.model.inputLength - stride;
    for (let i = 0; i < encodings.length; i += 1) {
      spans.push({
        startIndex: lengthNoStride * i,
        length: this.model.inputLength,
      });
    }
    const result = [];
    for (let i = 0; i < encodings.length; i += 1) {
      const maxContextMap = this.getMaxContextMap(spans, i, contextStartIndex);
      result.push({ contextStartIndex, encoding: encodings[i], maxContextMap });
    }
    return result;
  }

  getBestIndex(entries, position) {
    let bestScore = -1;
    let bestIndex = -1;
    for (const [ispan, span] of entries) {
      const spanEndIndex = span.startIndex + span.length - 1;
      if (position >= span.startIndex && position <= spanEndIndex) {
        const score =
          Math.min(position - span.startIndex, spanEndIndex - position) +
          0.01 * span.length;
        if (score > bestScore) {
          bestScore = score;
          bestIndex = ispan;
        }
      }
    }
    return bestIndex;
  }

  getMaxContextMap(spans, spanIndex, contextStartIndex) {
    const map = {};
    const selected = spans[spanIndex];
    for (let i = 0; i < selected.length; i += 1) {
      const bestIndex = this.getBestIndex(
        spans.entries(),
        selected.startIndex + i
      );
      map[contextStartIndex + i] = bestIndex === spanIndex;
    }
    return map;
  }

  async predict(question, context, maxAnswerLength = 15) {
    const features = this.getFeatures(question, context);
    const [startLogits, endLogits] = await this.model.runInference(
      features.map((f) => f.encoding)
    );
    const result = this.getAnswer(
      context,
      features,
      startLogits,
      endLogits,
      maxAnswerLength
    );
    return result;
  }

  getAllAnswers(features, startLogits, endLogits, maxAnswerLength) {
    const answers = [];
    for (let i = 0; i < features.length; i += 1) {
      const feature = features[i];
      const starts = startLogits[i];
      const ends = endLogits[i];
      const contextLastIndex = this.tokenizer.getContextEndIndex(
        feature.encoding
      );
      const [filteredStartLogits, filteredEndLogits] = [starts, ends].map(
        (logits) =>
          logits
            .slice(feature.contextStartIndex, contextLastIndex + 1)
            .map((val, j) => [j + feature.contextStartIndex, val])
      );
      filteredEndLogits.sort((a, b) => b[1] - a[1]);
      for (const startLogit of filteredStartLogits) {
        filteredEndLogits.forEach((endLogit) => {
          if (
            !(
              endLogit[0] < startLogit[0] ||
              endLogit[0] - startLogit[0] + 1 > maxAnswerLength ||
              !feature.maxContextMap[startLogit[0]]
            )
          ) {
            answers.push({
              feature,
              startIndex: startLogit[0],
              endIndex: endLogit[0],
              score: startLogit[1] + endLogit[1],
              startLogits: starts,
              endLogits: ends,
            });
          }
        });
      }
    }
    return answers.sort((a, b) => b.score - a.score);
  }

  getAnswer(context, features, startLogits, endLogits, maxAnswerLength) {
    const answers = this.getAllAnswers(
      features,
      startLogits,
      endLogits,
      maxAnswerLength
    );
    if (!answers.length) {
      return undefined;
    }
    const answer = answers[0];
    const { offsets } = answer.feature.encoding;
    const answerText = context.slice(
      offsets[answer.startIndex][0],
      offsets[answer.endIndex][1]
    );
    const startProbs = softMax(answer.startLogits);
    const endProbs = softMax(answer.endLogits);
    const probScore = startProbs[answer.startIndex] * endProbs[answer.endIndex];
    return {
      text: answerText.trim(),
      score: Math.round((probScore + Number.EPSILON) * 100) / 100,
    };
  }

  stop() {
    this.model.stop();
  }
}

module.exports = QAClient;
