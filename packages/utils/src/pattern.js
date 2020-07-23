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

function cartesian(arr) {
  return arr.reduce(
    (prev, cur) => {
      const result = [];
      for (let i = 0; i < prev.length; i += 1) {
        for (let j = 0; j < cur.length; j += 1) {
          result.push(prev[i].concat(cur[j]));
        }
      }
      return result;
    },
    [[]]
  );
}

function splitPattern(str) {
  let isInBrackets = false;
  let currentStr = '';
  const result = [];
  for (let i = 0; i < str.length; i += 1) {
    const c = str[i];
    if (isInBrackets) {
      if (c === ']') {
        isInBrackets = false;
        if (currentStr) {
          result.push(currentStr.split('|'));
          currentStr = '';
        }
      } else {
        currentStr += c;
      }
    } else if (c === '[') {
      isInBrackets = true;
      if (currentStr) {
        result.push([currentStr]);
        currentStr = '';
      }
    } else {
      currentStr += c;
    }
  }
  if (currentStr !== '') {
    result.push([currentStr]);
  }
  return result;
}

function composeFromPattern(str) {
  const tokens = splitPattern(str);
  return cartesian(tokens).map((x) => x.join(''));
}

function composeCorpus(corpus) {
  const result = { ...corpus };
  result.data = [];
  corpus.data.forEach((item) => {
    const newItem = { ...item };
    ['utterances', 'tests', 'answers'].forEach((name) => {
      if (item[name]) {
        newItem[name] = [];
        item[name].forEach((str) => {
          const list = composeFromPattern(str);
          list.forEach((composed) => {
            newItem[name].push(composed);
          });
        });
      }
    });
    result.data.push(newItem);
  });
  return result;
}

module.exports = {
  cartesian,
  splitPattern,
  composeFromPattern,
  composeCorpus,
};
