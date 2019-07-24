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

const { Recognizer } = require('../../lib');

class SessionMock {
  constructor(locale, text) {
    this.locale = locale;
    this.message = {
      text,
      address: {
        conversation: {
          id: 'a1b2c3',
        },
      },
    };
  }

  dialogStack() {
    return ['/'];
  }

  routeToActiveDialog() {
    return 'active';
  }

  send(text) {
    this.messageSent = text;
  }
}

async function fill(recognizer) {
  recognizer.nlpManager.addLanguage('en');
  const fromEntity = recognizer.nlpManager.addTrimEntity('fromCity');
  fromEntity.addBetweenCondition('en', 'from', 'to', { skip: ['travel'] });
  fromEntity.addAfterLastCondition('en', 'from', { skip: ['travel'] });
  const toEntity = recognizer.nlpManager.addTrimEntity('toCity');
  toEntity.addBetweenCondition('en', 'to', 'from', { skip: ['travel'] });
  toEntity.addAfterLastCondition('en', 'to', { skip: ['travel'] });
  recognizer.nlpManager.slotManager.addSlot('travel', 'toCity', true, {
    en: 'Where do you want to go?',
  });
  recognizer.nlpManager.slotManager.addSlot('travel', 'fromCity', true, {
    en: 'From where you are traveling?',
  });
  recognizer.nlpManager.slotManager.addSlot('travel', 'date', true, {
    en: 'When do you want to travel?',
  });
  recognizer.nlpManager.addDocument(
    'en',
    'I want to travel from %fromCity% to %toCity% %date%',
    'travel'
  );
  recognizer.nlpManager.addDocument('en', 'good morning', 'greet');
  recognizer.nlpManager.addAnswer(
    'en',
    'travel',
    'You want to travel {{ date }} from {{ fromCity }} to {{ toCity }}'
  );
  await recognizer.nlpManager.train();
}

async function fillActions(srcRecognizer) {
  const recognizer = srcRecognizer;
  const manager = recognizer.nlpManager;
  manager.addLanguage('en');
  manager.addDocument('en', 'Good morning', 'greet');
  manager.addDocument('en', 'Goodbye', 'bye');
  manager.addAnswer('en', 'greet', 'Hello');
  manager.addAnswer('en', 'bye', 'Goodbye');
  manager.addAction('greet', 'start', '"Fernando"');
  if (!recognizer.actions) {
    recognizer.actions = {};
  }
  recognizer.actions.start = (srcRecognizer2, context, name) => {
    const recognizer2 = srcRecognizer2;
    if (!recognizer2.context) {
      recognizer2.context = {};
    }
    recognizer2.context.name = name;
  };
  await manager.train();
}

function mockBot(beginRouting = true) {
  return {
    libraries: {
      BotBuilder: {
        constructor: {
          bestRouteResult(result, dialogStack, name) {
            return name;
          },
        },
      },
    },
    recognizer(value) {
      this.recognizerValue = value;
    },
    _onDisambiguateRoute() {
      this.defaultDisambiguate = true;
    },
    onBeginRouting() {
      return beginRouting;
    },
  };
}

describe('Recognizer', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const recognizer = new Recognizer();
      expect(recognizer).toBeDefined();
    });
  });
  describe('The model can be loaded from an excel file', () => {
    test('It should load the excel and train', () => {
      const recognizer = new Recognizer();
      recognizer.loadExcel('./test/nlp/rules.xls');
      expect(recognizer.nlpManager.nluManager.languages).toEqual(['en', 'es']);
    });
  });
  describe('The model can be loaded from a model.nlp file', () => {
    test('It should load the model', () => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      expect(recognizer.nlpManager.nluManager.languages).toEqual(['en']);
    });
  });
  describe('Process', () => {
    test('It should process an utterance', async () => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      const process = await recognizer.process({}, 'en', 'What is your age?');
      expect(process.intent).toEqual('agent.age');
      expect(process.language).toEqual('English');
      expect(process.score).toBeGreaterThan(0.7);
    });
    test('It should autodetect the language if not provided', async () => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      const process = await recognizer.process(
        {},
        undefined,
        'What is your age?'
      );
      expect(process.intent).toEqual('agent.age');
      expect(process.language).toEqual('English');
      expect(process.score).toBeGreaterThan(0.7);
    });
    test('It should create a new temporal context if not provided', async () => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      const process = await recognizer.process(
        undefined,
        undefined,
        'What is your age?'
      );
      expect(process.intent).toEqual('agent.age');
      expect(process.language).toEqual('English');
      expect(process.score).toBeGreaterThan(0.7);
    });
    test('If the intent is None then the answer should not be calculated', async () => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      const process = await recognizer.process(
        undefined,
        undefined,
        'yupi caramelo?'
      );
      expect(process.intent).toEqual('None');
      expect(process.answer).toBeUndefined();
    });
  });
  describe('Recognize Utterance', () => {
    test('It should process providing a locale in the model', done => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      recognizer.recognizeUtterance(
        'What is your age?',
        { locale: 'en' },
        (error, result) => {
          expect(result.intent).toEqual('agent.age');
          expect(result.language).toEqual('English');
          expect(result.score).toBeGreaterThan(0.7);
          done();
        }
      );
    });
    test('It should process without providing a model', done => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      recognizer.recognizeUtterance(
        'What is your age?',
        undefined,
        (error, result) => {
          expect(result.intent).toEqual('agent.age');
          expect(result.language).toEqual('English');
          expect(result.score).toBeGreaterThan(0.7);
          done();
        }
      );
    });
  });
  describe('Recognize', () => {
    test('It should recognize the intent from the session', done => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      const session = new SessionMock('en', 'What is your age?');
      recognizer.recognize(session, (err, result) => {
        expect(result.intent).toEqual('agent.age');
        expect(result.language).toEqual('English');
        expect(result.score).toBeGreaterThan(0.7);
        done();
      });
    });
    test('If the callback is not provided, return a promise', done => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      const session = new SessionMock('en', 'What is your age?');
      recognizer.recognize(session).then(result => {
        expect(result.intent).toEqual('agent.age');
        expect(result.language).toEqual('English');
        expect(result.score).toBeGreaterThan(0.7);
        done();
      });
    });
    test('It should use context if conversation id is provided', done => {
      const recognizer = new Recognizer();
      recognizer.loadExcel('./test/nlp/rules.xls').then(() => {
        const session1 = {
          locale: 'en',
          message: {
            address: {
              conversation: {
                id: 'a1b2c3',
              },
            },
            text: 'Who is spiderman?',
          },
        };
        const session2 = {
          locale: 'en',
          message: {
            address: {
              conversation: {
                id: 'a1b2c3',
              },
            },
            text: 'Where he lives?',
          },
        };
        recognizer.recognize(session1, () => {
          recognizer.recognize(session2, (err, result) => {
            expect(result.answer).toEqual('Hanging on a web');
            done();
          });
        });
      });
    });
    test('It should use context if conversation id is provided in v4', done => {
      const recognizer = new Recognizer();
      recognizer.loadExcel('./test/nlp/rules.xls').then(() => {
        const session1 = {
          _activity: {
            type: 'message',
            locale: 'en',
            text: 'Who is spiderman',
            conversation: {
              id: 'a1b2c3',
            },
          },
        };
        const session2 = {
          _activity: {
            type: 'message',
            locale: 'en',
            text: 'Where he lives?',
            conversation: {
              id: 'a1b2c3',
            },
          },
        };
        recognizer.recognize(session1, () => {
          recognizer.recognize(session2, (err, result) => {
            expect(result.answer).toEqual('Hanging on a web');
            done();
          });
        });
      });
    });
    test('If the utterance cannot be retrieved from the session the intent should be undefined and score 0', done => {
      const recognizer = new Recognizer();
      recognizer.load('./test/recognizer/model.nlp');
      const session = {
        locale: 'en',
        message: {},
      };
      recognizer.recognize(session, (err, result) => {
        expect(result.intent).toBeUndefined();
        expect(result.score).toEqual(0.0);
        done();
      });
    });
  });

  describe('Actions', () => {
    test('It should be able to execute actions', async () => {
      const bot = mockBot();
      const session = new SessionMock(undefined, 'Good morning');
      const recognizer = new Recognizer();
      await fillActions(recognizer);
      recognizer.setBot(bot, true);
      // eslint-disable-next-line
      bot._onDisambiguateRoute(session, undefined, () => {
        expect(recognizer.context.name).toEqual('Fernando');
        expect(session.messageSent).toEqual('Hello');
      });
    });
  });

  describe('Slot filling', () => {
    test('If all slots are filled return the correct answer', async () => {
      const recognizer = new Recognizer();
      await fill(recognizer);
      const session = {
        locale: 'en',
        message: {
          address: {
            conversation: {
              id: 'a1b2c3',
            },
          },
          text: 'I want to travel from Barcelona to London tomorrow',
        },
      };
      return new Promise(done =>
        recognizer.recognize(session, (err, result) => {
          expect(result.answer).toEqual(
            'You want to travel tomorrow from Barcelona to London'
          );
          done();
        })
      );
    });
    test('It can chain several slots', async () => {
      const recognizer = new Recognizer();
      await fill(recognizer);
      const session = {
        locale: 'en',
        message: {
          address: {
            conversation: {
              id: 'a1b2c3',
            },
          },
          text: 'I want to travel to London',
        },
      };
      const session2 = {
        locale: 'en',
        message: {
          address: {
            conversation: {
              id: 'a1b2c3',
            },
          },
          text: 'Barcelona',
        },
      };
      const session3 = {
        locale: 'en',
        message: {
          address: {
            conversation: {
              id: 'a1b2c3',
            },
          },
          text: 'tomorrow',
        },
      };
      return new Promise(done =>
        recognizer.recognize(session, (err, result) => {
          expect(result.answer).toEqual('From where you are traveling?');
          recognizer.recognize(session2, (err2, result2) => {
            expect(result2.answer).toEqual('When do you want to travel?');
            recognizer.recognize(session3, (err3, result3) => {
              expect(result3.answer).toEqual(
                'You want to travel tomorrow from Barcelona to London'
              );
              done();
            });
          });
        })
      );
    });
  });

  describe('Recognize Twice', () => {
    test('It should not change result if context has last recognized', async () => {
      const recognizer = new Recognizer();
      await fill(recognizer);
      const session = {
        locale: 'en',
        message: {
          address: {
            conversation: {
              id: 'a1b2c3',
            },
          },
          text: 'I want to travel to London',
        },
      };
      const session2 = {
        locale: 'en',
        message: {
          address: {
            conversation: {
              id: 'a1b2c3',
            },
          },
          text: 'Barcelona',
        },
      };
      const session3 = {
        locale: 'en',
        message: {
          address: {
            conversation: {
              id: 'a1b2c3',
            },
          },
          text: 'tomorrow',
        },
      };
      return new Promise(done =>
        recognizer.recognize(session, (err, result) => {
          expect(result.answer).toEqual('From where you are traveling?');
          recognizer.recognizeTwice(session, () => {
            recognizer.recognize(session2, (err2, result2) => {
              expect(result2.answer).toEqual('When do you want to travel?');
              recognizer.recognize(session3, (err3, result3) => {
                expect(result3.answer).toEqual(
                  'You want to travel tomorrow from Barcelona to London'
                );
                done();
              });
            });
          });
        })
      );
    });
    test('It should recognize again if the context has not last recognized', async () => {
      const recognizer = new Recognizer();
      await fill(recognizer);
      const session = {
        locale: 'en',
        message: {
          address: {
            conversation: {
              id: 'a1b2c3',
            },
          },
          text: 'I want to travel to London',
        },
      };
      const session2 = {
        locale: 'en',
        message: {
          address: {
            conversation: {
              id: 'a1b2c4',
            },
          },
          text: 'I want to travel to London tomorrow',
        },
      };
      return new Promise(done =>
        recognizer.recognize(session, (err, result) => {
          expect(result.answer).toEqual('From where you are traveling?');
          recognizer.recognizeTwice(session2, (err2, result2) => {
            expect(result2).not.toEqual(result);
            done();
          });
        })
      );
    });
  });

  describe('Get dialog id', () => {
    test('Given a session with dialog stack, get the first developer dialog', () => {
      const session = {
        dialogStack: () => ['not this', 'neither this', '*:/dialog'],
      };
      const recognizer = new Recognizer();
      const dialogId = recognizer.getDialogId(session);
      expect(dialogId).toEqual('/dialog');
    });
    test('If no developer dialog found, return empty string', () => {
      const session = { dialogStack: () => ['not this', 'neither this'] };
      const recognizer = new Recognizer();
      const dialogId = recognizer.getDialogId(session);
      expect(dialogId).toEqual('');
    });
    test('If dialogStack method does not exists, return empty string', () => {
      const session = {};
      const recognizer = new Recognizer();
      const dialogId = recognizer.getDialogId(session);
      expect(dialogId).toEqual('');
    });
  });
  describe('Default routing', () => {
    test('If a route is given, it should select the route at the bot', () => {
      let routeToActiveDialogCalls = 0;
      let selectRouteCalls = 0;
      const route = {
        libraryName: 'library',
      };
      const library = {
        selectRoute: () => {
          selectRouteCalls += 1;
        },
      };
      const bot = {
        name: 'bot',
        library: () => library,
        libraries: {
          BotBuilder: {
            constructor: {
              bestRouteResult: () => route,
            },
          },
        },
      };
      const session = {
        dialogStack: () => [],
        routeToActiveDialog: () => {
          routeToActiveDialogCalls += 1;
        },
      };
      const recognizer = new Recognizer();
      recognizer.defaultRouting(bot, session, []);
      expect(selectRouteCalls).toEqual(1);
      expect(routeToActiveDialogCalls).toEqual(0);
    });
    test('If no route is given, it should route to active dialog', () => {
      let routeToActiveDialogCalls = 0;
      let selectRouteCalls = 0;
      const route = undefined;
      const library = {
        selectRoute: () => {
          selectRouteCalls += 1;
        },
      };
      const bot = {
        name: 'bot',
        library: () => library,
        libraries: {
          BotBuilder: {
            constructor: {
              bestRouteResult: () => route,
            },
          },
        },
      };
      const session = {
        dialogStack: () => [],
        routeToActiveDialog: () => {
          routeToActiveDialogCalls += 1;
        },
      };
      const recognizer = new Recognizer();
      recognizer.defaultRouting(bot, session, []);
      expect(selectRouteCalls).toEqual(0);
      expect(routeToActiveDialogCalls).toEqual(1);
    });
  });
  describe('Process Answer', () => {
    test('If the answer starts with / then it is a dialog', () => {
      let beginDialogCalls = 0;
      let sendCalls = 0;
      const session = {
        beginDialog: () => {
          beginDialogCalls += 1;
        },
        send: () => {
          sendCalls += 1;
        },
      };
      const recognizer = new Recognizer();
      recognizer.processAnswer(session, '/dialog');
      expect(beginDialogCalls).toEqual(1);
      expect(sendCalls).toEqual(0);
    });
    test('If the answer does not starts with / then it is a message', () => {
      let beginDialogCalls = 0;
      let sendCalls = 0;
      const session = {
        beginDialog: () => {
          beginDialogCalls += 1;
        },
        send: () => {
          sendCalls += 1;
        },
      };
      const recognizer = new Recognizer();
      recognizer.processAnswer(session, 'text');
      expect(beginDialogCalls).toEqual(0);
      expect(sendCalls).toEqual(1);
    });
  });

  describe('Set Bot', () => {
    test('If not activate routing default disambiguate route is still there', () => {
      const bot = mockBot();
      const recognizer = new Recognizer();
      recognizer.setBot(bot);
      /* eslint-disable no-underscore-dangle */
      bot._onDisambiguateRoute();
      expect(bot.defaultDisambiguate).toBeTruthy();
    });
    test('If activate routing disambiguate route is changed', () => {
      const bot = mockBot();
      const session = {
        dialogStack() {
          return ['/'];
        },
        routeToActiveDialog() {
          return 'active';
        },
      };
      const recognizer = new Recognizer();
      recognizer.setBot(bot, true);
      /* eslint-disable no-underscore-dangle */
      bot._onDisambiguateRoute(session);
      expect(bot.defaultDisambiguate).toBeFalsy();
    });
    test('If recognizer onBeginRouting is false, return undefined', async () => {
      const bot = mockBot();
      const session = {
        dialogStack() {
          return ['/'];
        },
        routeToActiveDialog() {
          return 'active';
        },
        message: {
          text: 'I want to travel from Barcelona to London tomorrow',
        },
      };
      const recognizer = new Recognizer();
      await fill(recognizer);
      recognizer.setBot(bot, true);
      recognizer.onBeginRouting = () => {
        return false;
      };
      /* eslint-disable no-underscore-dangle */
      const actual = bot._onDisambiguateRoute(session);
      expect(actual).toBeUndefined();
    });
    test('If session contains message must process it', async () => {
      const bot = mockBot();
      const session = new SessionMock(
        undefined,
        'I want to travel from Barcelona to London tomorrow'
      );
      const recognizer = new Recognizer();
      await fill(recognizer);
      recognizer.setBot(bot, true);
      /* eslint-disable no-underscore-dangle */
      bot._onDisambiguateRoute(session, undefined, () => {
        expect(session.messageSent).toEqual(
          'You want to travel tomorrow from Barcelona to London'
        );
      });
    });
    test('If there is no answer should be no message sent', async () => {
      const bot = mockBot();
      const session = new SessionMock(undefined, 'good morning');
      const recognizer = new Recognizer();
      await fill(recognizer);
      recognizer.setBot(bot, true);
      /* eslint-disable no-underscore-dangle */
      bot._onDisambiguateRoute(session, undefined, () => {
        expect(session.messageSent).toBeUndefined();
      });
    });
    test('If there is onRecognizedRouting and there is answer, should be called', async () => {
      const bot = mockBot();
      const session = new SessionMock(
        undefined,
        'I want to travel from Barcelona to London tomorrow'
      );
      const recognizer = new Recognizer();
      await fill(recognizer);
      recognizer.setBot(bot, true);
      recognizer.onRecognizedRouting = () => {
        recognizer.onRecognizedRoutingCalled = true;
      };
      /* eslint-disable no-underscore-dangle */
      bot._onDisambiguateRoute(session, undefined, () => {
        expect(recognizer.onRecognizedRoutingCalled).toBeTruthy();
      });
    });
    test('If there is onUnrecognizedRouting and there is no answer, should be called', async () => {
      const bot = mockBot();
      const session = new SessionMock(undefined, 'good morning');
      const recognizer = new Recognizer();
      await fill(recognizer);
      recognizer.setBot(bot, true);
      recognizer.onUnrecognizedRouting = () => {
        recognizer.onUnrecognizedRoutingCalled = true;
      };
      /* eslint-disable no-underscore-dangle */
      bot._onDisambiguateRoute(session, undefined, () => {
        expect(recognizer.onUnrecognizedRoutingCalled).toBeTruthy();
      });
    });
    test('If there is onNoTextRouting and there is no text, should be called', async () => {
      const bot = mockBot();
      const session = new SessionMock();
      const recognizer = new Recognizer();
      await fill(recognizer);
      recognizer.setBot(bot, true);
      recognizer.onNoTextRouting = () => {
        recognizer.onNoTextRoutingCalled = true;
      };
      /* eslint-disable no-underscore-dangle */
      bot._onDisambiguateRoute(session, undefined, () => {
        expect(recognizer.onNoTextRoutingCalled).toBeTruthy();
      });
    });
  });
});
