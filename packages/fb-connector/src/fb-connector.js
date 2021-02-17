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

const { containerBootstrap } = require('@nlpjs/core');
const { Connector } = require('@nlpjs/connector');
const { ActivityTypes } = require('botbuilder');
const { FacebookAdapter } = require('botbuilder-adapter-facebook');

const FB = require('./settings');

const pageToken = {
  [FB.PAGE_ID]: FB.ACCESS_TOKEN,
};

const fbAdapter = new FacebookAdapter({
  verify_token: FB.VERIFY_TOKEN,
  app_secret: FB.APP_SECRET,
  getAccessTokenForPage: async (pageId) => pageToken[pageId],
});

class FbConnector extends Connector {
  constructor(settings = {}, container = undefined) {
    super(
      {
        settings: {},
        container: settings.container || container || containerBootstrap(),
      },
      container
    );
    this.applySettings(this.settings, settings);
    if (!this.settings.tag) {
      this.settings.tag = 'fb';
    }
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
  }

  start() {
    const server = this.container.get('api-server').app;
    if (!server) {
      throw new Error('No api-server found');
    }
    const logger = this.container.get('logger');
    this.adapter = fbAdapter;
    this.adapter.onTurnError = async (context) => {
      logger.debug('onTurnError');
      await context.sendActivity('Oops. Something went wrong!');
    };
    const routePath = this.getRoutePath();
    logger.info(`FB connector initialized at route ${routePath}`);

    server.get(routePath, (req, res) => {
      this.verifyToken(req, res);
    });

    server.post(routePath, (req, res) => {
      this.adapter.processActivity(req, res, async (context) => {
        if (context.activity.type === ActivityTypes.Message) {
          try {
            if (this.onReceiveInput) {
              await this.onReceiveInput(context.activity, context);
            }
            const stickerText = this.extractStickerText(context.activity);
            const input = {
              message: stickerText || context.activity.text,
              channel: `fb-${context.activity.channelId}`,
              app: this.container.name,
              fbContext: context,
            };
            if (this.onHear) {
              logger.debug('fb > processActivity > on hear');
              await this.onHear(this, input);
            } else {
              const name = `${this.settings.tag}.hear`;
              const pipeline = this.container.getPipeline(name);
              if (pipeline) {
                this.container.runPipeline(pipeline, input, this);
              } else {
                logger.info(`> User says: ${input.message}`);
                const bot = this.settings.container.get('bot');
                if (bot) {
                  const session = this.createSession(context.activity);
                  session.channel = input.channel;
                  session.app = input.app;
                  session.fbContext = input.fbContext;
                  await bot.process(session);
                } else {
                  const nlp = this.container.get('nlp');
                  if (nlp) {
                    const result = await nlp.process(input);
                    await this.say(result, input.fbContext);
                  }
                }
              }
            }
          } catch (ex) {
            console.error('Error', ex);
            await context.sendActivity('Oops. Something went wrong!');
          }
        }
      });
    });
  }

  async say(output, context) {
    let nlpjsCtx = context;
    if (!context) {
      context = output.fbContext;
    }
    if (!context.sendActivity) {
      nlpjsCtx = context;
      context = context.fbContext;
    }
    const logger = this.container.get('logger');
    const text = output.answer || output.text;
    logger.debug(`> Bot says: ${text}`);
    const { suggestedActions } = output;
    const activity = {
      text,
      ...output,
    };
    if (suggestedActions) {
      activity.channelData = activity.channelData || {};
      activity.channelData.quick_replies = suggestedActions.actions.map(
        (action) => ({
          content_type: 'text',
          title: action.title,
          payload: action.value,
        })
      );
    }
    await context.sendActivity(activity);
    if (this.onSendOutput) {
      await this.onSendOutput(activity, context, nlpjsCtx);
    }
  }

  async createAttachmentFromUrl(context, url) {
    const api = await this.adapter.getAPI(context.activity);
    const res = await api.callAPI('/me/message_attachments', 'POST', {
      message: {
        attachment: {
          type: 'video',
          payload: {
            is_reusable: true,
            url,
          },
        },
      },
    });
    return res.attachment_id;
  }

  extractStickerText(activity) {
    let stickerText;
    if (
      activity.channelData &&
      activity.channelData.message &&
      activity.channelData.message.attachments &&
      activity.channelData.message.attachments.length
    ) {
      const attachment = activity.channelData.message.attachments[0];
      const stickerId = attachment.payload.sticker_id;
      stickerText = FB.STICKERS_MAP[stickerId];
    }
    return stickerText;
  }

  verifyToken(req, res) {
    if (req.query['hub.mode'] === 'subscribe') {
      console.log('hub.verify_token -> ', req.query['hub.verify_token']);
      if (req.query['hub.verify_token'] === FB.VERIFY_TOKEN) {
        const val = req.query['hub.challenge'];
        console.log('Fb token verified');
        return res.send(val);
      }
      console.log('failed to verify endpoint');
      return res.send('ko');
    }
    return res.send();
  }

  getRoutePath() {
    let routePath = this.settings.apiPath;
    if (routePath === undefined) {
      routePath = this.container.name || '';
    }
    if (routePath && !routePath.startsWith('/')) {
      routePath = `/${routePath}`;
    }
    routePath = routePath
      ? `${routePath}${this.settings.messagesPath || '/api/messages'}`
      : this.settings.messagesPath || '/api/messages';

    return routePath;
  }
}

module.exports = FbConnector;
