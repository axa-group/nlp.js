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
  Classifier,
  LogisticRegressionClassifier,
  BayesClassifier,
  BinaryNeuralNetworkClassifier,
  BrainClassifier,
  NeuralNetwork,
} = require('./classifiers');
const { Language } = require('./language');
const { Mathops, Vector, Matrix } = require('./math');
const { ActionManager, NlgManager } = require('./nlg');
const {
  BaseNLU,
  BayesNLU,
  BinaryNeuralNetworkNLU,
  BrainNLU,
  DomainManager,
  LogisticRegressionNLU,
  NluManager,
} = require('./nlu');
const { NlpManager, NlpUtil, NlpExcelReader } = require('./nlp');
const {
  NerManager,
  NamedEntity,
  EnumNamedEntity,
  RegexNamedEntity,
  TrimNamedEntity,
} = require('./ner');
const { SentimentAnalyzer, SentimentManager } = require('./sentiment');
const { SlotManager } = require('./slot');
const {
  Evaluator,
  Handlebars,
  SimilarSearch,
  SpellCheck,
  removeEmojis,
} = require('./util');
const { XTableUtils, XTable, XDoc } = require('./xtables');
const {
  ConversationContext,
  MemoryConversationContext,
  Recognizer,
} = require('./recognizer');

const exportClasses = {
  Classifier,
  LogisticRegressionClassifier,
  BayesClassifier,
  BinaryNeuralNetworkClassifier,
  BrainClassifier,
  NeuralNetwork,
  Language,
  Mathops,
  Vector,
  Matrix,
  ActionManager,
  NlgManager,
  NerManager,
  NlpManager,
  NlpUtil,
  NlpExcelReader,
  NamedEntity,
  EnumNamedEntity,
  RegexNamedEntity,
  TrimNamedEntity,
  SentimentAnalyzer,
  SentimentManager,
  SlotManager,
  Evaluator,
  Handlebars,
  SimilarSearch,
  SpellCheck,
  removeEmojis,
  XTableUtils,
  XTable,
  XDoc,
  ConversationContext,
  MemoryConversationContext,
  Recognizer,
  BaseNLU,
  BayesNLU,
  BinaryNeuralNetworkNLU,
  BrainNLU,
  DomainManager,
  LogisticRegressionNLU,
  NluManager,
};

module.exports = exportClasses;
// istanbul ignore next
// eslint-disable-next-line
if (typeof window !== "undefined") {
  // eslint-disable-next-line
  window.NLPJS = exportClasses;
}
