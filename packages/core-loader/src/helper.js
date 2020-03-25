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
const path = require('path');

const {
  hasUnicode,
  unicodeToArray,
  asciiToArray,
  stringToArray,
  compareWildcars,
  loadEnvFromJson,
} = require('@nlpjs/core');

function listFiles(folderPath, recursive = true) {
  if (fs.existsSync(folderPath)) {
    const all = fs.readdirSync(folderPath).map((x) => path.join(folderPath, x));
    const files = all.filter((x) => fs.statSync(x).isFile());
    if (recursive) {
      const dirs = all.filter((x) => !files.includes(x));
      const dirFiles = dirs.reduce(
        (prev, current) => prev.concat(listFiles(current)),
        []
      );
      return [...files, ...dirFiles];
    }
    return files;
  }
  return [];
}

function getAbsolutePath(relative) {
  if (path.isAbsolute(relative)) {
    return relative;
  }
  return path.normalize(path.join(process.cwd(), relative));
}

function listFilesAbsolute(folderPath, recursive = true) {
  const files = listFiles(folderPath, recursive);
  return files.map((x) => getAbsolutePath(x));
}

function loadEnv(fileName = '.env') {
  const absolutePath = getAbsolutePath(fileName);
  if (fs.existsSync(absolutePath)) {
    const content = fs.readFileSync(absolutePath, 'utf8');
    const lines = content.split(/\n|\r|\r\n/);
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const keyValueArr = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (keyValueArr) {
        const key = keyValueArr[1];
        let val = keyValueArr[2] || '';
        const endVal = val.length - 1;
        const isDoubleQuoted = val[0] === '"' && val[endVal] === '"';
        const isSingleQuoted = val[0] === "'" && val[endVal] === "'";
        if (isSingleQuoted || isDoubleQuoted) {
          val = val.substring(1, endVal);
          if (isDoubleQuoted) {
            val = val.replace(/\\n/g, '\n');
          }
        } else {
          val = val.trim();
        }
        if (process.env[key] === undefined) {
          process.env[key] = val;
        }
      }
    }
  }
}

module.exports = {
  hasUnicode,
  unicodeToArray,
  asciiToArray,
  stringToArray,
  compareWildcars,
  getAbsolutePath,
  listFiles,
  listFilesAbsolute,
  loadEnv,
  loadEnvFromJson,
};
