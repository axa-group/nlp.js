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

const AggressiveTokenizer = require('./aggressive-tokenizer');

class AggressiveTokenizerHi extends AggressiveTokenizer {
  normalize(text) {
    let result = text.replace('\u0928\u094D', '\u0902');
    result = result.replace('\u0901', '\u0902');
    result = result.replace('\u093C', '');
    result = result.replace('\u0929', '\u0928');
    result = result.replace('\u0931', '\u0930');
    result = result.replace('\u0934', '\u0933');
    result = result.replace('\u0958', '\u0915');
    result = result.replace('\u0959', '\u0916');
    result = result.replace('\u095A', '\u0917');
    result = result.replace('\u095B', '\u091C');
    result = result.replace('\u095C', '\u0921');
    result = result.replace('\u095D', '\u0922');
    result = result.replace('\u095E', '\u092B');
    result = result.replace('\u095F', '\u092F');
    result = result.replace('\u200D', '');
    result = result.replace('\u200C', '');
    result = result.replace('\u094D', '');
    result = result.replace('\u0945', '\u0947');
    result = result.replace('\u0946', '\u0947');
    result = result.replace('\u0949', '\u094B');
    result = result.replace('\u094A', '\u094B');
    result = result.replace('\u090D', '\u090F');
    result = result.replace('\u090E', '\u090F');
    result = result.replace('\u0911', '\u0913');
    result = result.replace('\u0912', '\u0913');
    result = result.replace('\u0972', '\u0905');
    result = result.replace('\u0906', '\u0905');
    result = result.replace('\u0908', '\u0907');
    result = result.replace('\u090A', '\u0909');
    result = result.replace('\u0960', '\u090B');
    result = result.replace('\u0961', '\u090C');
    result = result.replace('\u0910', '\u090F');
    result = result.replace('\u0914', '\u0913');
    result = result.replace('\u0940', '\u093F');
    result = result.replace('\u0942', '\u0941');
    result = result.replace('\u0944', '\u0943');
    result = result.replace('\u0963', '\u0962');
    result = result.replace('\u0948', '\u0947');
    result = result.replace('\u094C', '\u094B');
    return result;
  }

  trim(text) {
    return text.replace(/^[^\u0980-\u09FF]+|[^\u0980-\u09FF]+$/g, '');
  }

  tokenize(text) {
    return this.trim(this.normalize(text)).split(/[\s,.!?;:([\]'"¡¿।-]+/);
  }
}

module.exports = AggressiveTokenizerHi;
