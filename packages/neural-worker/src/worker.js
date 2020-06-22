const { workerData, parentPort } = require('worker_threads');
const NeuralNetwork = require('./neural-network');

const network = new NeuralNetwork(workerData.settings);
const status = network.train(workerData.data);
parentPort.postMessage({ json: network.toJSON(), status });
