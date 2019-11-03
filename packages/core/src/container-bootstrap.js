const fs = require('fs');
const ArrToObj = require('./arr-to-obj');
const { Container } = require('./container');
const Normalizer = require('./normalizer');
const ObjToArr = require('./obj-to-arr');
const { listFilesAbsolute } = require('./helper');
const Stemmer = require('./stemmer');
const Stopwords = require('./stopwords');
const Tokenizer = require('./tokenizer');
const Timer = require('./timer');

function containerBootstrap(settings = {}) {
  const instance = new Container();
  instance.use(ArrToObj);
  instance.use(Normalizer);
  instance.use(ObjToArr);
  instance.use(Stemmer);
  instance.use(Stopwords);
  instance.use(Tokenizer);
  instance.use(Timer);
  const pathPipeline = settings.pathPipeline || './pipelines.md';
  if (fs.existsSync(pathPipeline)) {
    instance.loadPipelinesFromFile(pathPipeline);
  }
  const pathPlugins = settings.pathPlugins || './plugins';
  const files = listFilesAbsolute(pathPlugins).filter(x => x.endsWith('.js'));
  for (let i = 0; i < files.length; i += 1) {
    /* eslint-disable-next-line */
    const plugin = require(files[i]);
    instance.use(plugin);
  }
  return instance;
}

module.exports = containerBootstrap;
