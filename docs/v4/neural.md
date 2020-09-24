# NeuralNetwork

## Introduction

_NeuralNetwork_ is the class for an NLU Neural Network, able to train a classifier and then classify into intents.

## Installing

_NeuralNetwork_ is a class of the package _@nlpjs/neural_, that you can install via NPM:

```bash
  npm install @nlpjs/neural
```

## Corpus Format

For training the classifier you need a corpus. The corpus format is an array of objects where each object contains an input and output, where the input is an object with the features and the output is an object with the intents:

```json
[
  {
    "input": { "who": 1, "are": 1, "you": 1 },
    "output": { "who": 1 }
  },
  {
    "input": { "say": 1, "about": 1, "you": 1 },
    "output": { "who": 1 }
  },
  {
    "input": { "why": 1, "are": 1, "you": 1, "here": 1 },
    "output": { "who": 1 }
  },
  {
    "input": { "who": 1, "developed": 1, "you": 1 },
    "output": { "developer": 1 }
  },
  {
    "input": { "who": 1, "is": 1, "your": 1, "developer": 1 },
    "output": { "developer": 1 }
  },
  {
    "input": { "who": 1, "do": 1, "you": 1, "work": 1, "for": 1 },
    "output": { "developer": 1 }
  },
  {
    "input": { "when": 1, "is": 1, "your": 1, "birthday": 1 },
    "output": { "birthday": 1 }
  },
  {
    "input": { "when": 1, "were": 1, "you": 1, "borned": 1 },
    "output": { "birthday": 1 }
  },
  {
    "input": { "date": 1, "of": 1, "your": 1, "birthday": 1 },
    "output": { "birthday": 1 }
  }
]
```

## Example of use

The file _corpus.json_ should contain the corpus shown in the Corpus Format section for this example.
This will train this corpus and run the input equivalent to the sentence "when birthday". 
The result is each intent with the score for this intent.

```javascript
const { NeuralNetwork } = require('@nlpjs/neural');
const corpus = require('./corpus.json');

const net = new NeuralNetwork();
net.train(corpus);
console.log(net.run({ when: 1, birthday: 1 }));
// { who: 0, developer: 0, birthday: 0.7975805386427789 }
```

## Exporting trained model to JSON and importing

You can export the model to a json with the _toJSON_ method, and import a model from a json with _fromJSON_ method:

```javascript
const { NeuralNetwork } = require('@nlpjs/neural');
const corpus = require('./corpus.json');

let net = new NeuralNetwork();
net.train(corpus);
const exported = net.toJSON();
net = new NeuralNetwork();
net.fromJSON(exported);
console.log(net.run({ when: 1, birthday: 1 }));
```

## Options

There are several options that you can customize:
- _iterations_: maximum number of iterations (epochs) that the neural network can run. By default this is 20000.
- _errorThresh_: minimum error threshold, if the loss is lower than this number, then the training ends. By default this is 0.00005.
- _deltaErrorThresh_: minimum delta error threshold, this is, the difference between the current and the last errors. If the delta error threshold is lower than this number, then the training ends. By default this is 0.000001.
- _learningRate_: learning rate for the neural network. By default this is 0.6.
- _momentum_: momentum for the gradient descent optimization. By default this is 0.5.
- _alpha_: Multiplicator or alpha factor for the ReLu activation function. By default this is 0.07.
- _log_: If is *false* then no log happens, if is *true* then there is log in console. Also a function can be provided, and will receive two parameters: the status and the elapsed time of the last epoch. By default this is false.

Example of how to provide parameters:
```javascript
const { NeuralNetwork } = require('@nlpjs/neural');
const corpus = require('./corpus.json');

const net = new NeuralNetwork({ learningRate: 0.01, log: true });
net.train(corpus);
console.log(net.run({ when: 1, birthday: 1 }));
// Epoch 2382 loss 0.0013668740975184709 time 0ms
// { who: 0, developer: 0, birthday: 0.8050273840765896 }
```