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

const path = require('path');
const { Worker, SHARE_ENV, MessageChannel } = require('worker_threads');

const threadName = '../runtime-thread.js';

class RuntimeWorker extends Worker {
  constructor() {
    super(path.join(__filename, threadName), { env: SHARE_ENV });
    this.models = new Map();
    this.queues = new Map();
    this.taskId = 0;
    const channels = [
      new MessageChannel(),
      new MessageChannel(),
      new MessageChannel(),
    ];
    const ports = channels.map((x) => x.port1);
    this.initPort = channels[0].port2;
    this.loadPort = channels[1].port2;
    this.inferencePort = channels[2].port2;
    this.inferencePort.setMaxListeners(1000000);
    this.once('online', () => {
      this.initPort.once('close', () => {
        this.loaded = true;
      });
      const message = {
        type: 'init',
        initPort: ports[0],
        loadPort: ports[1],
        inferencePort: ports[2],
      };
      this.postMessage(message, ports);
    });

    this.loadPort.on('message', (data) => {
      const modelInfos = this.models.get(data.model);
      if (data.error) {
        if (modelInfos && modelInfos.onloaderror) {
          modelInfos.onloaderror(data.error);
        }
        return;
      }
      if (modelInfos && modelInfos.onloaded) {
        modelInfos.onloaded();
      }
      this.models.set(data.model, { loaded: true });
      this.run(data.model);
    });
  }

  loadModel(params) {
    return new Promise((resolve, reject) => {
      this.models.set(params.path, {
        loaded: false,
        onloaded: resolve,
        onloaderror: reject,
      });
      this.queues.set(params.path, []);
      if (this.loaded) {
        this.postMessage({ type: 'load', params });
      } else {
        this.initPort.once('close', () => {
          this.postMessage({ type: 'load', params });
        });
      }
    });
  }

  close() {
    this.postMessage({ type: 'close' });
  }

  queueInference(modelPath, ids, attentionMask, tokenTypeIds) {
    this.taskId += 1;
    const { taskId } = this;
    return new Promise((resolve, reject) => {
      const task = {
        id: taskId,
        model: modelPath,
        onsuccess: resolve,
        onerror: reject,
        inputs: { ids, attentionMask, tokenTypeIds },
      };
      const model = this.models.get(task.model);
      if (!model || !model.loaded) {
        this.queues.get(task.model).push(task);
      } else {
        this.runTask(task);
      }
    });
  }

  run(model) {
    const queue = this.queues.get(model) || [];
    const l = queue.length;
    for (let i = 0; i < l; i += 1) {
      this.runTask(queue[i]);
    }
    queue.splice(0, l);
  }

  runTask(task) {
    const listener = (data) => {
      if (data.id !== task.id) {
        return;
      }
      this.inferencePort.removeListener('message', listener);
      if (data.logits) {
        task.onsuccess(data.logits);
      } else {
        task.onerror(data.error);
      }
    };
    this.inferencePort.on('message', listener);
    this.postMessage({
      id: task.id,
      inputs: task.inputs,
      model: task.model,
      type: 'infer',
    });
  }
}

module.exports = RuntimeWorker;
