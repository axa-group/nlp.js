/*
 * Copyright (c) AXA Shared Services Spain S.A.
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

const AggressiveTokenizer = require('./aggressive-tokenizer');

class AggressiveTokenizerSv extends AggressiveTokenizer {
  normalize(srcText) {
    let text = srcText;
    text = text.replace('à', 'a');
    text = text.replace('À', 'A');
    text = text.replace('á', 'a');
    text = text.replace('Á', 'A');
    text = text.replace('è', 'e');
    text = text.replace('È', 'E');
    text = text.replace('é', 'e');
    text = text.replace('É', 'E');
    return text;
  }

  tokenize(text) {
    return this.trim(this.normalize(text).split(/[^A-Za-z0-9_åÅäÄöÖüÜ-]+/));
  }
}

module.exports = AggressiveTokenizerSv;
