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

const { dock } = require('../../packages/core-loader/src');
const airports = require('./airports.json');

(async () => {
  await dock.start();
  const container = dock.getContainer();
  const nlp = container.get('nlp');
  const airportKeys = Object.keys(airports);
  for (let i = 0; i < airportKeys.length; i += 1) {
    const airport = airports[airportKeys[i]];
    nlp.addNerRuleOptionTexts('en', 'airport', airport.icao, airport.city);
  }
  let answer = await nlp.process('I want to flight from Albacete');
  console.log(answer.entities);
  answer = await nlp.process('I want to flight from Madrid to Las Vegas');
  console.log(answer.entities);
  console.time('algo');
  const entities = await nlp.extractEntities(
    'I want to flight from Barcelona to Paris'
  );
  console.timeEnd('algo');
  console.log(entities);
})();
