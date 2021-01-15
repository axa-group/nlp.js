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
const archiver = require('archiver');
const rimraf = require('rimraf');
const path = require('path');
const decompress = require('decompress');
const { Downloader } = require('@nlpjs/utils');

function pad(n, l = 2) {
  let result = n.toString();
  while (result.length < l) {
    result = `0${result}`;
  }
  return result;
}

const getDateStr = (date) =>
  pad(date.getFullYear(), 4) + pad(date.getMonth() + 1) + pad(date.getDate());
const getTimeStr = (date) =>
  pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds());
const getDateTimeStr = (date) => getDateStr(date) + getTimeStr(date);

function ensureDir(dirPath, recursive = true) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive });
  }
}

const removeDir = (dirPath) => rimraf.sync(dirPath);

function compressFolder(folder, fileName) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(fileName);
    const archive = archiver('zip');
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(folder, false);
    archive.finalize();
  });
}

async function backup(srcFolder, tgtFolder) {
  const name = `backup_${getDateTimeStr(new Date())}.zip`;
  const tgtName = path.join(tgtFolder, name);
  ensureDir(tgtFolder);
  await compressFolder(srcFolder, tgtName);
  return tgtName;
}

function restore(fileName, tgtFolder) {
  return new Promise((resolve, reject) => {
    ensureDir(tgtFolder);
    decompress(fileName, tgtFolder).then(resolve).catch(reject);
  });
}

async function mount(options) {
  const tmpFolder = options.tmpFolder || './.tmp';
  ensureDir(tmpFolder);
  const downloader = new Downloader({
    proxy: options.proxy,
    dir: tmpFolder,
    replicateAllFolders: false,
    replaceIfExists: true,
    showProgress: options.showProgress,
    automaticUntar: false,
  });
  await downloader.download(options.url, options.fileName);
  let backupName;
  if (options.backup !== false) {
    if (options.backupFolder) {
      ensureDir(options.backupFolder);
    }
    backupName = await backup(options.dir, options.backupFolder || tmpFolder);
  }
  if (options.shouldClear !== false) {
    removeDir(options.dir);
  }
  try {
    await restore(path.join(tmpFolder, options.fileName), options.dir);
    if (options.removeTmp !== false) {
      removeDir(tmpFolder);
    }
    return true;
  } catch (err) {
    console.log('ERROR');
    console.log(err);
    if (backupName) {
      await restore(backupName, options.dir);
    }
    return false;
  }
}

function getUrlFileName(url) {
  return url.slice(url.lastIndexOf('/') + 1);
}

module.exports = {
  pad,
  getDateStr,
  getTimeStr,
  getDateTimeStr,
  ensureDir,
  removeDir,
  compressFolder,
  backup,
  restore,
  mount,
  getUrlFileName,
};
