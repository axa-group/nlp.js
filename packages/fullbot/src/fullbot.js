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

const fs = require('fs');
const path = require('path');
const {
  dock,
  dockStart,
  logger,
  Evaluator,
  JavascriptCompiler,
  Nlp,
  Template,
  LangEn,
  listFilesAbsolute,
} = require('@nlpjs/basic');
const { ExpressApiServer } = require('@nlpjs/express-api-server');
const { DirectlineConnector } = require('@nlpjs/directline-connector');
const { Bot } = require('@nlpjs/bot');
const { BuiltinMicrosoft } = require('@nlpjs/builtin-microsoft');
const { BuiltinDuckling } = require('@nlpjs/builtin-duckling');
const { Database } = require('@nlpjs/database');
const { MongodbAdapter } = require('@nlpjs/mongodb-adapter');
const { mount, getUrlFileName, ensureDir } = require('./utils');

const defaultConfiguration = {
  settings: {
    nlp: {},
    'api-server': {
      port: 3000,
      serveBot: true,
    },
    bot: {
      scripts: ['./bot/scripts/script.dlg'],
    },
  },
};

class FullBot {
  constructor(settings) {
    this.settings = settings || {};
    this.marketUrl =
      this.settings.marketUrl || 'https://nlpjsmarket.herokuapp.com/public';
  }

  setDefaultConfiguration() {
    const result = { ...defaultConfiguration };
    if (this.settings.port) {
      result.settings['api-server'].port = this.settings.port;
    }
    if (this.settings.scripts) {
      result.settings.bot.scripts = this.settings.scripts;
    }
    if (this.settings.mongoUrl) {
      result.settings['mongodb-adapter'] = {};
      result.settings['mongodb-adapter'].url = this.settings.mongoUrl;
    }
    return result;
  }

  async initializeContainer() {
    this.container.use(logger);
    this.container.use(Evaluator);
    this.container.use(JavascriptCompiler);
    this.container.use(Nlp);
    this.container.use(Template);
    this.container.use(LangEn);
    this.container.use(ExpressApiServer);
    this.container.use(DirectlineConnector);
    this.container.use(Bot);
    this.container.use(Database);
    if (this.settings.ner && this.settings.ner.ducklingUrl) {
      const builtin = new BuiltinDuckling(this.settings.ner);
      this.container.register('extract-builtin-??', builtin, true);
    } else {
      const builtin = new BuiltinMicrosoft(this.settings.ner);
      this.container.register('extract-builtin-??', builtin, true);
    }
    if (this.settings.mongoUrl || process.env.MONGO_URL) {
      this.container.use(MongodbAdapter);
    }
    await this.container.start();
    const database = this.container.get('database');
    await database.connect();
  }

  getFiles(name) {
    let folder = this.settings[`${name}Path`];
    if (!folder && this.settings.botPath) {
      folder = path.join(this.settings.botPath, name);
    }
    return listFilesAbsolute(folder || `./bot/${name}`);
  }

  async loadItems(name, fn) {
    const files = await this.getFiles(name);
    for (let i = 0; i < files.length; i += 1) {
      // eslint-disable-next-line
      const lib = require(files[i]);
      const keys = Object.keys(lib);
      for (let j = 0; j < keys.length; j += 1) {
        fn(this.bot, keys[j], lib[keys[j]]);
      }
    }
  }

  async loadActions() {
    await this.loadItems('actions', (bot, name, item) => {
      bot.registerAction(name, item);
    });
  }

  async loadValidators() {
    await this.loadItems('validators', (bot, srcName, item) => {
      let name = srcName;
      if (name.toLowerCase().startsWith('validator')) {
        name = name.slice(9);
      }
      bot.registerValidator(name, item);
    });
  }

  async loadCards() {
    const files = await this.getFiles('cards');
    for (let i = 0; i < files.length; i += 1) {
      // eslint-disable-next-line
      const lib = require(files[i]);
      if (Array.isArray(lib)) {
        for (let j = 0; j < lib.length; j += 1) {
          this.bot.registerCard(lib[j]);
        }
      } else {
        this.bot.registerCard(lib);
      }
    }
  }

  async start(confFileName = './conf.json') {
    const confFileExits = fs.existsSync(confFileName);
    const config = confFileExits ? undefined : this.setDefaultConfiguration();
    await dockStart(config);
    this.dock = dock;
    this.container = dock.getContainer();
    if (
      config.settings &&
      config.settings.bot &&
      config.settings.bot.scripts &&
      config.settings.bot.scripts.length === 1 &&
      !fs.existsSync(config.settings.bot.scripts[0])
    ) {
      this.mount(`${this.marketUrl}/default.zip`);
    } else {
      if (!confFileExits) {
        await this.initializeContainer();
      }
      this.bot = dock.get('bot');
      this.nlp = dock.get('nlp');
      await this.loadActions();
      await this.loadCards();
      await this.loadValidators();
      if (this.onIntent) {
        this.nlp.onIntent = this.onIntent;
      }
      const directline = dock.get('directline');
      if (directline) {
        ensureDir(directline.settings.uploadDir);
        if (!directline.onCreateConversation) {
          directline.onCreateConversation =
            this.onDirectlineCreateConversation.bind(this);
        }
      }
    }
  }

  async onDirectlineCreateConversation(connector, conversation) {
    if (
      this.bot &&
      this.bot.dialogManager &&
      this.bot.dialogManager.dialogs['/directlineCreateConversation']
    ) {
      const activity = {
        conversation: {
          id: conversation.conversationId,
        },
      };
      const session = connector.createSession(activity);
      session.forcedDialog = '/directlineCreateConversation';
      await this.bot.process(session);
    }
  }

  stop() {
    const apiServer = dock.get('api-server');
    if (apiServer && apiServer.server) {
      apiServer.server.close();
    }
  }

  async mount(url) {
    const fileName = getUrlFileName(url);
    await mount({
      url,
      fileName,
      dir: this.settings.botPath || './bot',
    });
    this.stop();
    this.dock.containers = {};
    await this.start();
  }
}

module.exports = FullBot;
