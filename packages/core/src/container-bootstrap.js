const fs = require('fs');
const ArrToObj = require('./arr-to-obj');
const { Container } = require('./container');
const Normalizer = require('./normalizer');
const ObjToArr = require('./obj-to-arr');
const { listFilesAbsolute, getAbsolutePath } = require('./helper');
const Stemmer = require('./stemmer');
const Stopwords = require('./stopwords');
const Tokenizer = require('./tokenizer');
const Timer = require('./timer');
const logger = require('./logger');

const defaultPathConfiguration = './conf.json';
const defaultPathPipeline = './pipelines.md';
const defaultPathPlugins = './plugins';

function loadPipelines(instance, fileName) {
  if (Array.isArray(fileName)) {
    for (let i = 0; i < fileName.length; i += 1) {
      loadPipelines(instance, fileName[i]);
    }
  } else if (fs.existsSync(fileName)) {
    if (fs.lstatSync(fileName).isDirectory()) {
      const files = listFilesAbsolute(fileName).filter(x => x.endsWith('.md'));
      for (let i = 0; i < files.length; i += 1) {
        loadPipelines(instance, files[i]);
      }
    } else {
      instance.loadPipelinesFromFile(fileName);
    }
  }
}

function loadPlugins(instance, fileName) {
  if (Array.isArray(fileName)) {
    for (let i = 0; i < fileName.length; i += 1) {
      loadPlugins(instance, fileName[i]);
    }
  } else if (fs.existsSync(fileName)) {
    if (fs.lstatSync(fileName).isDirectory()) {
      const files = listFilesAbsolute(fileName).filter(x => x.endsWith('.js'));
      for (let i = 0; i < files.length; i += 1) {
        loadPlugins(instance, files[i]);
      }
    } else {
      /* eslint-disable-next-line */
      const plugin = require(fileName);
      instance.use(plugin);
    }
  }
}

function traverse(obj) {
  if (typeof obj === 'string') {
    if (obj.startsWith('$')) {
      console.log(obj.slice(1));
      console.log(process.env.LUIS_URL);
      return process.env[obj.slice(1)];
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(x => traverse(x));
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    const result = {};
    for (let i = 0; i < keys.length; i += 1) {
      result[keys[i]] = traverse(obj[keys[i]]);
    }
    return result;
  }
  return obj;
}

function containerBootstrap(srcSettings = {}) {
  const instance = new Container();
  instance.use(ArrToObj);
  instance.use(Normalizer);
  instance.use(ObjToArr);
  instance.use(Stemmer);
  instance.use(Stopwords);
  instance.use(Tokenizer);
  instance.use(Timer);
  instance.use(logger);
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
  settings.pathConfiguration = getAbsolutePath(settings.pathConfiguration);
  if (fs.existsSync(settings.pathConfiguration)) {
    const configuration = traverse(
      JSON.parse(fs.readFileSync(settings.pathConfiguration, 'utf8'))
    );

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
        /* eslint-disable-next-line */
        const lib = require(getAbsolutePath(configuration.use[i].path));
        instance.use(lib[configuration.use[i].className]);
      }
    }
  }
  loadPipelines(instance, settings.pathPipeline || './pipelines.md');
  loadPlugins(instance, settings.pathPlugins || './plugins');
  return instance;
}

module.exports = containerBootstrap;
