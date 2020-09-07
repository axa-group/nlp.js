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

const { defaultContainer, Clonable } = require('@nlpjs/core');
const DirectlineController = require('./directline-controller');

class DirectlineConnector extends Clonable {
  constructor(settings = {}, container = undefined) {
    super(
      {
        settings: {},
        container: settings.container || container || defaultContainer,
      },
      container
    );
    this.applySettings(this.settings, settings);
    this.registerDefault();
    if (!this.settings.tag) {
      this.settings.tag = 'directline';
    }
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
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
    this.controller = new DirectlineController(this.settings);

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
}

module.exports = DirectlineConnector;
