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
const formidable = require('formidable');
const { Connector } = require('@nlpjs/connector');
const DirectlineController = require('./directline-controller');

class DirectlineConnector extends Connector {
  constructor(settings, container) {
    super(settings, container);
    if (this.settings.autoRemoveFiles === undefined) {
      this.settings.autoRemoveFiles = true;
    }
    if (this.settings.uploadDir === undefined) {
      this.settings.uploadDir = './uploads/';
    }
    if (this.settings.maxFileSize === undefined) {
      this.settings.maxFileSize = 8000000;
    }
  }

  registerDefault() {
    this.container.registerConfiguration(
      'directline',
      { log: true, channelId: 'emulator' },
      false
    );
  }

  log(level, message) {
    if (this.settings.log) {
      this.container.get('logger')[level](message);
    }
  }

  start() {
    const server = this.container.get('api-server').app;
    if (!server) {
      throw new Error('No api-server found');
    }
    this.controller = new DirectlineController(this.settings, this);
    if (this.onCreateConversation) {
      this.controller.onCreateConversation = this.onCreateConversation;
    }
    if (this.onHear) {
      this.controller.onHear = this.onHear;
    }

    server.options('/directline', (req, res) => {
      this.log('debug', `OPTIONS /directline`);
      res.status(200).end();
    });

    server.post(`/directline/conversations`, async (req, res) => {
      this.log('info', `POST /directline/conversations`);
      const result = await this.controller.createConversation();
      res.status(result.status).send(result.body);
    });

    server.get(
      `/directline/conversations/:conversationId/activities`,
      async (req, res) => {
        const watermark =
          req.query.watermark && req.query.watermark !== 'null'
            ? Number(req.query.watermark)
            : 0;
        this.log(
          'debug',
          `GET /directline/conversations/:conversationId/activities`
        );
        const result = await this.controller.getActivities(
          req.params.conversationId,
          watermark
        );
        res.status(result.status).send(result.body);
      }
    );

    server.post(
      `/directline/conversations/:conversationId/activities`,
      async (req, res) => {
        this.log(
          'debug',
          `POST /directline/conversations/:conversationId/activities`
        );
        const result = await this.controller.addActivity(
          req.params.conversationId,
          req.body
        );
        res.status(result.status).send(result.body);
      }
    );

    server.post('/directline/tokens/refresh', (req, res) => {
      this.log('trace', `POST /directline/tokens/refresh`);
      res.status(200).end();
    });

    server.post(
      `/directline/conversations/:conversationId/upload`,
      async (req, res) => {
        this.log(
          'debug',
          `POST /directline/conversations/:conversationId/upload`
        );
        const form = formidable({
          multiples: true,
          uploadDir: this.settings.uploadDir,
          keepExtensions: false,
          maxFileSize: this.settings.maxFileSize,
        });
        form.parse(req, async (err, fields, files) => {
          if (err) {
            res.status(500).send('There was an error processing the message');
          } else {
            const activity = JSON.parse(
              fs.readFileSync(files.activity.path, 'utf-8')
            );
            activity.file = files.file;
            const result = await this.controller.addActivity(
              req.params.conversationId,
              activity
            );
            if (this.settings.autoRemoveFiles) {
              fs.unlinkSync(files.activity.path);
              fs.unlinkSync(files.file.path);
            }
            res.status(result.status).send(result.body);
          }
        });
      }
    );

    server.get(`/v3/directline/conversations/:conversationId`, (req, res) => {
      this.log('debug', `GET /v3/directline/conversations/:conversationId`);
      res.status(200).end();
    });

    server.post(
      `/v3/directline/conversations/:conversationId/upload`,
      (req, res) => {
        this.log(
          'debug',
          `POST /v3/directline/conversations/:conversationId/upload`
        );
        res.status(200).end();
      }
    );

    server.get(
      '/v3/directline/conversations/:conversationId/stream',
      (req, res) => {
        this.log(
          'debug',
          'GET /v3/directline/conversations/:conversationId/stream'
        );
        res.status(200).end();
      }
    );

    server.post('/v3/conversations', (req, res) => {
      this.log('debug', 'POST /v3/conversations');
      res.status(200).end();
    });

    server.post('/v3/conversations/:conversationId/activities', (req, res) => {
      this.log('debug', 'POST /v3/conversations/:conversationId/activities');
      res.status(200).end();
    });

    server.post(
      '/v3/conversations/:conversationId/activities/:activityId',
      async (req, res) => {
        this.log(
          'debug',
          'POST /v3/conversations/:conversationId/activities/:activityId'
        );
        const result = await this.controller.postActivityV3(
          req.params.conversationId,
          req.body
        );
        res.status(result.status).send(result.body);
      }
    );

    server.get('/v3/conversations/:conversationId/members', (req, res) => {
      this.log('debug', 'GET /v3/conversations/:conversationId/members');
      res.status(200).end();
    });

    server.get(
      '/v3/conversations/:conversationId/activities/:activityId/members',
      (req, res) => {
        this.log(
          'debug',
          'GET /v3/conversations/:conversationId/activities/:activityId/members'
        );
        res.status(200).end();
      }
    );

    server.get('/v3/botstate/:channelId/users/:userId', (req, res) => {
      this.log('debug', 'GET /v3/botstate/:channelId/users/:userId');
      res.status(200).end();
    });

    server.get('/v3/botstate/:channelId/users/:userId', (req, res) => {
      this.log('debug', 'GET /v3/botstate/:channelId/users/:userId');
      res.status(200).end();
    });

    server.get(
      '/v3/botstate/:channelId/conversations/:conversationId/users/:userId',
      (req, res) => {
        this.log(
          'debug',
          'GET /v3/botstate/:channelId/conversations/:conversationId/users/:userId'
        );
        res.status(200).end();
      }
    );

    server.post('/v3/botstate/:channelId/users/:userId', (req, res) => {
      this.log('debug', 'POST /v3/botstate/:channelId/users/:userId');
      res.status(200).end();
    });

    server.post(
      '/v3/botstate/:channelId/conversations/:conversationId',
      (req, res) => {
        this.log(
          'debug',
          'POST /v3/botstate/:channelId/conversations/:conversationId'
        );
        res.status(200).end();
      }
    );

    server.post(
      '/v3/botstate/:channelId/conversations/:conversationId/users/:userId',
      (req, res) => {
        this.log(
          'debug',
          'POST /v3/botstate/:channelId/conversations/:conversationId/users/:userId'
        );
        res.status(200).end();
      }
    );

    server.delete('/v3/botstate/:channelId/users/:userId', (req, res) => {
      this.log('debug', 'DELETE /v3/botstate/:channelId/users/:userId');
      res.status(200).end();
    });
  }

  createAnswer(srcActivity) {
    return this.controller.createAnswer(srcActivity);
  }

  say(srcActivity, text) {
    if (typeof text === 'string') {
      const answer = this.createAnswer(srcActivity.activity || srcActivity);
      answer.text = text || srcActivity.text;
      this.controller.say(answer);
    } else {
      this.controller.say(srcActivity);
    }
  }
}

module.exports = DirectlineConnector;
