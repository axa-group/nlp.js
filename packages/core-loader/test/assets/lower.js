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

class Lower {
  constructor() {
    this.name = 'lower';
  }

  toLower(srcInput, text, holder, container, context) {
    const input = srcInput;
    const result = text.toLowerCase();
    if (holder && container) {
      container.setValue(holder, `"${result}"`, context, input, this);
    } else {
      input.text = result;
    }
    return input;
  }

  run(input, arg1, arg2) {
    let text = input.text ? input.text : input;
    let holder;
    let container;
    let context = {};
    if (arg1) {
      if (arg1.type === 'literal') {
        text = arg1.value;
      } else if (arg1.type === 'reference') {
        text = arg2 ? arg2.value : arg1.value;
        holder = arg1.src;
        container = arg1.container;
        context = arg1.context;
      }
    }
    return this.toLower(input, text, holder, container, context);
  }
}

module.exports = Lower;
