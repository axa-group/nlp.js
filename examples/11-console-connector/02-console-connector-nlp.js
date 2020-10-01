const { dockStart } = require('../../packages/basic/src');

(async () => {
  const dockConfiguration = {
    settings: {
      nlp: { corpora: ['./corpus.json'] },
    },
    use: [
      { className: 'Nlp', path: '../../packages/nlp/src' },
      {
        className: 'ConsoleConnector',
        path: '../../packages/console-connector/src',
      },
    ],
  };
  const dock = await dockStart(dockConfiguration);
  const nlp = dock.get('nlp');
  await nlp.train();
  const connector = dock.get('console');
  connector.say('Say something!');
})();
