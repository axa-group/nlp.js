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
  return (typeof tokens === 'string' ? tokens.split(' ') : tokens).join('_');
}

function getDialogName(tokens) {
  let result = getName(tokens);
  result = result.startsWith('/') ? result : `/${result}`;
  if (result === '/main') {
    return '/';
  }
  return result;
}

function trimBetween(line, left, right, shouldBeFirst = false) {
  const indexLeft = line.indexOf(left);
  if (
    indexLeft !== -1 &&
    (!shouldBeFirst || (shouldBeFirst && indexLeft === 0))
  ) {
    const indexRight = line.indexOf(right);
    if (indexRight !== -1 && indexRight > indexLeft) {
      return {
        line:
          line.slice(0, indexLeft) + line.slice(indexRight + 1, line.length),
        trimmed: line.slice(indexLeft + 1, indexRight),
      };
    }
  }
  return {
    line,
    trimmed: '',
  };
}

function trimLine(line) {
  const trimmedCondition = trimBetween(line.trim(), '[', ']', true);
  const trimmedSettings = trimBetween(trimmedCondition.line, '(', ')');
  return {
    line: trimmedSettings.line.trim(),
    condition: trimmedCondition.trimmed.trim(),
    settings: trimmedSettings.trimmed.trim(),
  };
}

function dialogParse(text) {
  const lines = text
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter((x) => x);
  const result = [];
  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i];
    if (line.startsWith('#')) {
      result.push({ type: 'comment', text: line.slice(1).trim() });
    } else {
      const srcLine = line;
      const trimmed = trimLine(line);
      line = trimmed.line;
      const lowLine = line.toLowerCase();
      const lowTokens = lowLine.split(' ');
      const command = lowTokens[0];
      result.push({
        type: command,
        srcLine,
        line: line.slice(command.length + 1),
        condition: trimmed.condition,
        settings: trimmed.settings,
      });
    }
  }
  return result;
}

async function loadScript(fileName, fs, alreadyLoaded = [], script = []) {
  if (Array.isArray(fileName)) {
    for (let i = 0; i < fileName.length; i += 1) {
      await loadScript(fileName[i], fs, alreadyLoaded, script);
    }
  } else if (!alreadyLoaded.includes(fileName)) {
    alreadyLoaded.push(fileName);
    const text = await fs.readFile(fileName);
    if (fileName.toLowerCase().endsWith('.json')) {
      script.push({
        type: 'import',
        fileName,
        content: JSON.parse(text),
      });
    } else {
      const parsed = dialogParse(text);
      for (let i = 0; i < parsed.length; i += 1) {
        const current = parsed[i];
        if (current.type === 'import') {
          await loadScript(current.line.split(' '), fs, alreadyLoaded, script);
        } else {
          script.push(current);
        }
      }
    }
  }
  return script;
}

module.exports = {
  dialogParse,
  loadScript,
  getDialogName,
  getName,
  trimBetween,
};
