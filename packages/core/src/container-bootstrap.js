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

const ArrToObj = require('./arr-to-obj');
const { Container } = require('./container');
const Normalizer = require('./normalizer');
const ObjToArr = require('./obj-to-arr');
const { loadEnvFromJson } = require('./helper');
const Stemmer = require('./stemmer');
const Stopwords = require('./stopwords');
const Tokenizer = require('./tokenizer');
const Timer = require('./timer');
const logger = require('./logger');
const MemoryStorage = require('./memory-storage');
const fs = require('./mock-fs');

function loadPipelinesStr(instance, pipelines) {
  instance.loadPipelinesFromString(pipelines);
}

function traverse(obj, preffix) {
  if (typeof obj === 'string') {
    if (obj.startsWith('$')) {
      return (
        process.env[`${preffix}${obj.slice(1)}`] || process.env[obj.slice(1)]
      );
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((x) => traverse(x, preffix));
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    const result = {};
    for (let i = 0; i < keys.length; i += 1) {
      result[keys[i]] = traverse(obj[keys[i]], preffix);
    }
    return result;
  }
  return obj;
}

function containerBootstrap(
  inputSettings,
  mustLoadEnv,
  container,
  preffix,
  pipelines,
  parent
) {
  const srcSettings = inputSettings || {};
  const instance = container || new Container(preffix);
  instance.parent = parent;
  if (!preffix) {
    instance.register('fs', fs);
    instance.use(ArrToObj);
    instance.use(Normalizer);
    instance.use(ObjToArr);
    instance.use(Stemmer);
    instance.use(Stopwords);
    instance.use(Tokenizer);
    instance.use(Timer);
    instance.use(logger);
    instance.use(MemoryStorage);
  }
  const settings = srcSettings;
  if (srcSettings.env) {
    loadEnvFromJson(preffix, srcSettings.env);
  }
  let configuration;
  configuration = settings;
  configuration = traverse(configuration, preffix ? `${preffix}_` : '');
  if (configuration.settings) {
    const keys = Object.keys(configuration.settings);
    for (let i = 0; i < keys.length; i += 1) {
      instance.registerConfiguration(
        keys[i],
        configuration.settings[keys[i]],
        true
      );
    }
  }
  if (configuration.use) {
    for (let i = 0; i < configuration.use.length; i += 1) {
      const item = configuration.use[i];
      if (Array.isArray(item)) {
        instance.register(item[0], item[1]);
      } else {
        instance.use(item);
      }
    }
  }
  if (configuration.terraform) {
    for (let i = 0; i < configuration.terraform.length; i += 1) {
      const current = configuration.terraform[i];
      const terra = instance.get(current.className);
      instance.register(current.name, terra, true);
    }
  }
  if (configuration.childs) {
    instance.childs = configuration.childs;
  }
  if (pipelines) {
    for (let i = 0; i < pipelines.length; i += 1) {
      const pipeline = pipelines[i];
      instance.registerPipeline(
        pipeline.tag,
        pipeline.pipeline,
        pipeline.overwrite
      );
    }
  }
  if (configuration.pipelines) {
    loadPipelinesStr(instance, configuration.pipelines);
  }
  return instance;
}

module.exports = containerBootstrap;
