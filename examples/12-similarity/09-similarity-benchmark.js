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

const levenwa = require('../../packages/similarity-wa/src/leven');
const levenjs = require('../../packages/similarity/src/leven');

const levenAlgs = [levenjs, levenwa];
const execTimeWord = [];
const execTimeMedium = [];
const execTimeLong = [];

function getTime(hrTime) {
  return hrTime[0] * 1000000000 + hrTime[1];
}

function runWordTests(leven) {
  const t0 = process.hrtime();

  leven('potatoe', 'potatoe');
  leven('', '123');
  leven('123', '');
  leven('a', 'b');
  leven('ab', 'ac');
  leven('abc', 'axc');
  leven('xabxcdxxefxgx', '1ab2cd34ef5g6');
  leven('xabxcdxxefxgx', 'abcdefg');
  leven('javawasneat', 'scalaisgreat');
  leven('example', 'samples');
  leven('forward', 'drawrof');
  leven('sturgeon', 'urgently');
  leven('levenshtein', 'frankenstein');
  leven('distance', 'difference');
  leven('distance', 'eistancd');
  leven('你好世界', '你好');
  leven('因為我是中國人所以我會說中文', '因為我是英國人所以我會說英文');
  leven('mikailovitch', 'Mikhaïlovitch');

  const tEllapsed = process.hrtime(t0);
  return getTime(tEllapsed);
}

function runMediumTests(leven) {
  const t0 = process.hrtime();

  const text1 =
    'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
  const text2 =
    'Duis erat dolor, cursus in tincidunt a, lobortis in odio. Cras magna sem, pharetra et iaculis quis, faucibus quis tellus. Suspendisse dapibus sapien in justo cursus';
  leven(text1, text2);

  const tEllapsed = process.hrtime(t0);
  return getTime(tEllapsed);
}

function runLongTests(leven) {
  const t0 = process.hrtime();

  let text1 = '';
  let text2 = '';
  // copy each text 50 times to make a longer sentence
  for (let i = 0; i < 50; i += 1) {
    text1 +=
      'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
    text2 +=
      'Duis erat dolor, cursus in tincidunt a, lobortis in odio. Cras magna sem, pharetra et iaculis quis, faucibus quis tellus. Suspendisse dapibus sapien in justo cursus';
  }

  leven(text1, text2);

  const tEllapsed = process.hrtime(t0);
  return getTime(tEllapsed);
}

for (let i = 0; i < levenAlgs.length; i += 1) {
  const leven = levenAlgs[i];

  execTimeWord[i] = runWordTests(leven);
  execTimeMedium[i] = runMediumTests(leven);
  execTimeLong[i] = runLongTests(leven);
}

console.log(
  'Web Assembly vs JavaScript benchmark on words:',
  execTimeWord[1],
  ' vs ',
  execTimeWord[0]
);
console.log(
  'Web Assembly vs JavaScript benchmark on medium texts:',
  execTimeMedium[1],
  ' vs ',
  execTimeMedium[0]
);
console.log(
  'Web Assembly vs JavaScript benchmark on long texts:',
  execTimeLong[1],
  ' vs ',
  execTimeLong[0]
);
