const { dockStart } = require('../../packages/basic');
const { uppers } = require('./actions/uppers');

(async () => {
  const dock = await dockStart();
  const bot = dock.get('bot');
  bot.registerAction('uppers', uppers);
})();
