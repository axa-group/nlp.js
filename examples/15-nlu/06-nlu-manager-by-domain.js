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

const { containerBootstrap } = require('../../packages/core/src');
const { NluManager, NluNeural } = require('../../packages/nlu/src');
const { LangEn } = require('../../packages/lang-en/src');
const { LangEs } = require('../../packages/lang-es/src');
// const { containerBootstrap } = require('@nlpjs/core');
// const { NluManager, NluNeural } = require('@nlpjs/nlu');
// const { LangEn } = require('@nlpjs/lang-en');
// const { LangEs } = require('@nlpjs/lang-es');

function addFoodDomainEn(manager) {
  manager.assignDomain('en', 'order.check', 'food');
  manager.add('en', 'what do I have in my basket', 'order.check');
  manager.add('en', 'check my cart', 'order.check');
  manager.add('en', "show me what I've ordered", 'order.check');
  manager.add('en', "what's in my basket", 'order.check');
  manager.add('en', 'check my order', 'order.check');
  manager.add('en', 'check what I have ordered', 'order.check');
  manager.add('en', 'show my order', 'order.check');
  manager.add('en', 'check my basket', 'order.check');

  manager.assignDomain('en', 'order.check_status', 'food');
  manager.add('en', 'how soon will it be delivered', 'order.check_status');
  manager.add('en', 'check the status of my delivery', 'order.check_status');
  manager.add('en', 'when should I expect delivery', 'order.check_status');
  manager.add('en', 'check my order status', 'order.check_status');
  manager.add('en', 'where is my order', 'order.check_status');
  manager.add('en', 'where is my delivery', 'order.check_status');
  manager.add('en', 'status of my order', 'order.check_status');
}

function addFoodDomainEs(manager) {
  manager.assignDomain('es', 'order.check', 'food');
  manager.add('es', 'qué tengo en mi cesta', 'order.check');
  manager.add('es', 'comprueba mi carrito', 'order.check');
  manager.add('es', 'enséñame qué he pedido', 'order.check');
  manager.add('es', 'qué hay en mi carrito?', 'order.check');
  manager.add('es', 'comprueba mi compra', 'order.check');
  manager.add('es', 'comprueba qué he comprado', 'order.check');
  manager.add('es', 'muéstrame mi compra', 'order.check');

  manager.assignDomain('es', 'order.check_status', 'food');
  manager.add('es', 'cuándo me lo van a traer?', 'order.check_status');
  manager.add('es', 'cómo va la entrega?', 'order.check_status');
  manager.add('es', 'cuándo me traerán mi pedido?', 'order.check_status');
  manager.add('es', 'en qué estado está mi pedido?', 'order.check_status');
  manager.add('es', 'dónde está mi compra?', 'order.check_status');
  manager.add('es', 'dónde está mi pedido?', 'order.check_status');
  manager.add('es', 'estado de mi compra', 'order.check_status');
}

function addPersonalityDomainEn(manager) {
  manager.assignDomain('en', 'agent.acquaintance', 'personality');
  manager.add('en', 'say about you', 'agent.acquaintance');
  manager.add('en', 'why are you here', 'agent.acquaintance');
  manager.add('en', 'what is your personality', 'agent.acquaintance');
  manager.add('en', 'describe yourself', 'agent.acquaintance');
  manager.add('en', 'tell me about yourself', 'agent.acquaintance');
  manager.add('en', 'tell me about you', 'agent.acquaintance');
  manager.add('en', 'what are you', 'agent.acquaintance');
  manager.add('en', 'who are you', 'agent.acquaintance');
  manager.add('en', 'talk about yourself', 'agent.acquaintance');

  manager.assignDomain('en', 'agent.age', 'personality');
  manager.add('en', 'your age', 'agent.age');
  manager.add('en', 'how old is your platform', 'agent.age');
  manager.add('en', 'how old are you', 'agent.age');
  manager.add('en', "what's your age", 'agent.age');
  manager.add('en', "I'd like to know your age", 'agent.age');
  manager.add('en', 'tell me your age', 'agent.age');
}

function addPersonalityDomainEs(manager) {
  manager.assignDomain('es', 'agent.acquaintance', 'personality');
  manager.add('es', 'cuéntame sobre ti', 'agent.acquaintance');
  manager.add('es', 'qué haces aquí?', 'agent.acquaintance');
  manager.add('es', 'cómo es tu personalidad?', 'agent.acquaintance');
  manager.add('es', 'descríbete', 'agent.acquaintance');
  manager.add('es', 'quién eres?', 'agent.acquaintance');
  manager.add('es', 'qué eres?', 'agent.acquaintance');
  manager.add('es', 'háblame de ti', 'agent.acquaintance');

  manager.assignDomain('es', 'agent.age', 'personality');
  manager.add('es', 'qué edad tienes?', 'agent.age');
  manager.add('es', 'cuántos años tienes?', 'agent.age');
  manager.add('es', 'cuál es tu edad?', 'agent.age');
  manager.add('es', 'quiero saber tu edad', 'agent.age');
  manager.add('es', 'dime tu edad', 'agent.age');
}

(async () => {
  const container = await containerBootstrap();
  container.use(LangEn);
  container.use(LangEs);
  container.use(NluNeural);
  // we set trainByDomain to true
  const manager = new NluManager({
    container,
    locales: ['en', 'es'],
    trainByDomain: true,
  });
  addFoodDomainEn(manager);
  addFoodDomainEs(manager);
  addPersonalityDomainEn(manager);
  addPersonalityDomainEs(manager);
  await manager.train();
  // You can provide the locale of the language
  let actual = await manager.process('es', 'dime quién eres tú');
  console.log(actual);
  // If the locale is not provided, then the language is guessed
  actual = await manager.process('dime quién eres tú');
  console.log(actual);
  // {
  //   locale: 'es',
  //   utterance: 'dime quién eres tú',
  //   domain: 'personality',
  //   languageGuessed: true,
  //   localeIso2: 'es',
  //   language: 'Spanish',
  //   nluAnswer: {
  //     classifications: [ [Object], [Object] ],
  //     entities: undefined,
  //     explanation: undefined
  //   },
  //   classifications: [
  //     { intent: 'agent.acquaintance', score: 0.8546458520495468 },
  //     { intent: 'agent.age', score: 0.14535414795045312 }
  //   ],
  //   intent: 'agent.acquaintance',
  //   score: 0.8546458520495468
  // }
})();
