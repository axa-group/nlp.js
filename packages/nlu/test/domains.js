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

function addFoodDomain(manager) {
  manager.add('food', 'what do I have in my basket', 'order.check');
  manager.add('food', 'check my cart', 'order.check');
  manager.add('food', "show me what I've ordered", 'order.check');
  manager.add('food', "what's in my basket", 'order.check');
  manager.add('food', 'check my order', 'order.check');
  manager.add('food', 'check what I have ordered', 'order.check');
  manager.add('food', 'show my order', 'order.check');
  manager.add('food', 'check my basket', 'order.check');
  manager.add('food', 'how soon will it be delivered', 'order.check_status');
  manager.add('food', 'check the status of my delivery', 'order.check_status');
  manager.add('food', 'when should I expect delivery', 'order.check_status');
  manager.add(
    'food',
    'what is the status of my delivery',
    'order.check_status'
  );
  manager.add('food', 'check my order status', 'order.check_status');
  manager.add('food', 'where is my order', 'order.check_status');
  manager.add('food', 'where is my delivery', 'order.check_status');
  manager.add('food', 'status of my order', 'order.check_status');
}

function addPersonalityDomain(manager) {
  manager.add('personality', 'say about you', 'agent.acquaintance');
  manager.add('personality', 'why are you here', 'agent.acquaintance');
  manager.add('personality', 'what is your personality', 'agent.acquaintance');
  manager.add('personality', 'describe yourself', 'agent.acquaintance');
  manager.add('personality', 'tell me about yourself', 'agent.acquaintance');
  manager.add('personality', 'tell me about you', 'agent.acquaintance');
  manager.add('personality', 'what are you', 'agent.acquaintance');
  manager.add('personality', 'who are you', 'agent.acquaintance');
  manager.add('personality', 'talk about yourself', 'agent.acquaintance');
  manager.add('personality', 'your age', 'agent.age');
  manager.add('personality', 'how old is your platform', 'agent.age');
  manager.add('personality', 'how old are you', 'agent.age');
  manager.add('personality', "what's your age", 'agent.age');
  manager.add('personality', "I'd like to know your age", 'agent.age');
  manager.add('personality', 'tell me your age', 'agent.age');
  manager.add('personality', "you're annoying me", 'agent.annoying');
  manager.add('personality', 'you are such annoying', 'agent.annoying');
  manager.add('personality', 'you annoy me', 'agent.annoying');
  manager.add('personality', 'you are annoying', 'agent.annoying');
  manager.add('personality', 'you are irritating', 'agent.annoying');
  manager.add('personality', 'you are annoying me so much', 'agent.annoying');
  manager.add('personality', "you're bad", 'agent.bad');
  manager.add('personality', "you're horrible", 'agent.bad');
  manager.add('personality', "you're useless", 'agent.bad');
  manager.add('personality', "you're waste", 'agent.bad');
  manager.add('personality', "you're the worst", 'agent.bad');
  manager.add('personality', 'you are a lame', 'agent.bad');
  manager.add('personality', 'I hate you', 'agent.bad');
  manager.add('personality', 'be more clever', 'agent.beclever');
  manager.add('personality', 'can you get smarter', 'agent.beclever');
  manager.add('personality', 'you must learn', 'agent.beclever');
  manager.add('personality', 'you must study', 'agent.beclever');
  manager.add('personality', 'be clever', 'agent.beclever');
  manager.add('personality', 'be smart', 'agent.beclever');
  manager.add('personality', 'be smarter', 'agent.beclever');
  manager.add('personality', 'you are looking awesome', 'agent.beautiful');
  manager.add('personality', "you're looking good", 'agent.beautiful');
  manager.add('personality', "you're looking fantastic", 'agent.beautiful');
  manager.add('personality', 'you look greet today', 'agent.beautiful');
  manager.add('personality', "I think you're beautiful", 'agent.beautiful');
  manager.add('personality', 'you look amazing today', 'agent.beautiful');
  manager.add('personality', "you're so beautiful today", 'agent.beautiful');
  manager.add('personality', 'you look very pretty', 'agent.beautiful');
  manager.add('personality', 'you look pretty good', 'agent.beautiful');
  manager.add('personality', 'when is your birthday', 'agent.birthday');
  manager.add('personality', 'when were you born', 'agent.birthday');
  manager.add('personality', 'when do you have birthday', 'agent.birthday');
  manager.add('personality', 'date of your birthday', 'agent.birthday');
}

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

module.exports = {
  addFoodDomain,
  addPersonalityDomain,
  addFoodDomainEn,
  addFoodDomainEs,
  addPersonalityDomainEn,
  addPersonalityDomainEs,
};
