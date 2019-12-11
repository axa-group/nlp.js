const path = require('path');
const ArrToObj = require('./arr-to-obj');
const { Container } = require('./container');
const Normalizer = require('./normalizer');
const ObjToArr = require('./obj-to-arr');
const { getAbsolutePath, loadEnv, loadEnvFromJson } = require('./helper');
const Stemmer = require('./stemmer');
const Stopwords = require('./stopwords');
const Tokenizer = require('./tokenizer');
const Timer = require('./timer');
const logger = require('./logger');
const MemoryStorage = require('./memory-storage');
const pluginInformation = require('./plugin-information.json');

const defaultPathConfiguration = './conf.json';
const defaultPathPipeline = './pipelines.md';
const defaultPathPlugins = './plugins';

function loadPipelinesStr(instance, pipelines) {
  instance.loadPipelinesFromString(pipelines);
}

function loadPipelines(instance, fileName) {
  if (Array.isArray(fileName)) {
    for (let i = 0; i < fileName.length; i += 1) {
      loadPipelines(instance, fileName[i]);
    }
  }
}

function loadPlugins(instance, fileName) {
  if (Array.isArray(fileName)) {
    for (let i = 0; i < fileName.length; i += 1) {
      loadPlugins(instance, fileName[i]);
    }
  }
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
    return obj.map(x => traverse(x, preffix));
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
  srcSettings = {},
  mustLoadEnv = true,
  container,
  preffix,
  pipelines
) {
  const instance = container || new Container(preffix);
  if (!preffix) {
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
  let settings = srcSettings;
  if (typeof settings === 'string') {
    settings = {
      pathConfiguration: srcSettings,
      pathPipeline: defaultPathPipeline,
      pathPlugins: defaultPathPlugins,
    };
  } else {
    if (!settings.pathConfiguration) {
      settings.pathConfiguration = defaultPathConfiguration;
    }
    if (!settings.pathPipeline) {
      settings.pathPipeline = defaultPathPipeline;
    }
    if (!settings.pathPlugins) {
      settings.pathPlugins = defaultPathPlugins;
    }
  }
  if (
    srcSettings.loadEnv ||
    (srcSettings.loadEnv === undefined && mustLoadEnv)
  ) {
    loadEnv();
  }
  settings.pathConfiguration = getAbsolutePath(settings.pathConfiguration);
  if (srcSettings.envFileName) {
    loadEnv(srcSettings.envFileName);
  }
  if (srcSettings.env) {
    loadEnvFromJson(preffix, srcSettings.env);
  }
  let configuration;
  configuration = settings;
  configuration = traverse(configuration, preffix ? `${preffix}_` : '');
  if (configuration.pathPipeline) {
    settings.pathPipeline = configuration.pathPipeline;
  }
  if (configuration.pathPlugins) {
    settings.pathPlugins = configuration.pathPlugins;
  }
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
      const current = configuration.use[i];
      if (typeof current === 'string') {
        const info = pluginInformation[current];
        if (!info) {
          throw new Error(
            `Plugin information not found for plugin "${current}"`
          );
        }
        let lib;
        try {
          /* eslint-disable-next-line */
          lib = require(info.path);
        } catch (err) {
          try {
            /* eslint-disable-next-line */
            lib = require(getAbsolutePath(
              path.join('./node_modules', info.path)
            ));
          } catch (err2) {
            console.log(err2);
            throw new Error(
              `You have to install library "${info.path}" to use plugin "${current}"`
            );
          }
        }
        instance.use(lib[info.className], info.name, info.isSingleton);
      } else {
        let lib;
        try {
          /* eslint-disable-next-line */
            lib = require(current.path);
        } catch (err) {
          /* eslint-disable-next-line */
            lib = require(getAbsolutePath(current.path));
        }
        instance.use(lib[current.className], current.name, current.isSingleton);
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
  loadPipelines(instance, settings.pathPipeline || './pipelines.md');
  if (configuration.pipelines) {
    loadPipelinesStr(instance, configuration.pipelines);
  }
  loadPlugins(instance, settings.pathPlugins || './plugins');
  return instance;
}

module.exports = containerBootstrap;
