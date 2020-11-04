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

function getName(tokens) {
  return tokens.join('_');
}

function getDialogName(tokens) {
  let result = getName(tokens);
  result = result.startsWith('/') ? result : `/${result}`;
  if (result === '/main') {
    return '/';
  }
  return result;
}

function trimSettings(line) {
  const indexOpen = line.indexOf('(');
  const indexClose = line.indexOf(')');
  if (indexOpen !== -1 && indexClose !== -1 && indexClose > indexOpen) {
    return {
      line: line.slice(0, indexOpen),
      settings: line.slice(indexOpen + 1, indexClose),
    };
  }
  return {
    line,
    settings: '',
  };
}

function dialogParse(text) {
  const lines = text
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter((x) => x);
  const result = [];
  let currentDialog = { name: '', actions: [] };
  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i];
    if (!line.startsWith('#')) {
      const trimmed = trimSettings(line);
      line = trimmed.line;
      const lowLine = line.toLowerCase();
      const tokens = line.split(' ');
      const lowTokens = lowLine.split(' ');
      switch (lowTokens[0]) {
        case 'dialog': {
          currentDialog = { name: getDialogName(tokens.slice(1)), actions: [] };
          result.push(currentDialog);
          break;
        }
        case 'run': {
          currentDialog.actions.push(`${getDialogName(tokens.slice(1))}`);
          break;
        }
        case 'say': {
          currentDialog.actions.push(line.slice(4));
          break;
        }
        case 'ask': {
          currentDialog.actions.push(`?${getName(tokens.slice(1))}`);
          break;
        }
        case 'nlp': {
          currentDialog.actions.push('/_nlp');
          break;
        }
        default: {
          console.log(`Unknown command ${lowTokens[0]}`);
        }
      }
    }
  }
  return result;
}

module.exports = dialogParse;
