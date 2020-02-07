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

const { Among, BaseStemmer } = require('@nlpjs/core');

/* eslint-disable */
class StemmerNe extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-ne';
    this.I_p1 = 0;
  }

  r_remove_category_1() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerNe.a_0);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 1:
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        lab0: {
          let v_1 = this.limit - this.cursor;
          lab1: {
            lab2: {
              let v_2 = this.limit - this.cursor;
              lab3: {
                if (!(this.eq_s_b("\u090F"))) {
                  break lab3;
                }
                break lab2;
              }
              this.cursor = this.limit - v_2;
              if (!(this.eq_s_b("\u0947"))) {
                break lab1;
              }
            }
            break lab0;
          }
          this.cursor = this.limit - v_1;
          if (!this.slice_del()) {
            return false;
          }
        }
        break;
    }
    return true;
  }

  r_check_category_2() {
    this.ket = this.cursor;
    if (this.find_among_b(StemmerNe.a_1) === 0) {
      return false;
    }
    this.bra = this.cursor;
    return true;
  };

  r_remove_category_2() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerNe.a_2);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 1:
        lab0: {
          let v_1 = this.limit - this.cursor;
          lab1: {
            if (!(this.eq_s_b("\u092F\u094C"))) {
              break lab1;
            }
            break lab0;
          }
          this.cursor = this.limit - v_1;
          lab2: {
            if (!(this.eq_s_b("\u091B\u094C"))) {
              break lab2;
            }
            break lab0;
          }
          this.cursor = this.limit - v_1;
          lab3: {
            if (!(this.eq_s_b("\u0928\u094C"))) {
              break lab3;
            }
            break lab0;
          }
          this.cursor = this.limit - v_1;
          if (!(this.eq_s_b("\u0925\u0947"))) {
            return false;
          }
        }
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        if (!(this.eq_s_b("\u0924\u094D\u0930"))) {
          return false;
        }
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    return true;
  };

  r_remove_category_3() {
    this.ket = this.cursor;
    if (this.find_among_b(StemmerNe.a_3) == 0) {
      return false;
    }
    this.bra = this.cursor;
    if (!this.slice_del()) {
      return false;
    }
    return true;
  };


  innerStem() {
    this.limit_backward = this.cursor; this.cursor = this.limit;
    let v_1 = this.limit - this.cursor;
    this.r_remove_category_1();
    this.cursor = this.limit - v_1;
    let v_2 = this.limit - this.cursor;
    lab0: {
      while (true) {
        let v_3 = this.limit - this.cursor;
        lab1: {
          let v_4 = this.limit - this.cursor;
          lab2: {
            let v_5 = this.limit - this.cursor;
            if (!this.r_check_category_2()) {
              break lab2;
            }
            this.cursor = this.limit - v_5;
            if (!this.r_remove_category_2()) {
              break lab2;
            }
          }
          this.cursor = this.limit - v_4;
          if (!this.r_remove_category_3()) {
            break lab1;
          }
          continue;
        }
        this.cursor = this.limit - v_3;
        break;
      }
    }
    this.cursor = this.limit - v_2;
    this.cursor = this.limit_backward;
    return true;
  }
}

StemmerNe.a_0 = [
  ["\u0932\u093E\u0907", -1, 1],
  ["\u0932\u093E\u0908", -1, 1],
  ["\u0938\u0901\u0917", -1, 1],
  ["\u0938\u0902\u0917", -1, 1],
  ["\u092E\u093E\u0930\u094D\u092B\u0924", -1, 1],
  ["\u0930\u0924", -1, 1],
  ["\u0915\u093E", -1, 2],
  ["\u092E\u093E", -1, 1],
  ["\u0926\u094D\u0935\u093E\u0930\u093E", -1, 1],
  ["\u0915\u093F", -1, 2],
  ["\u092A\u091B\u093F", -1, 1],
  ["\u0915\u0940", -1, 2],
  ["\u0932\u0947", -1, 1],
  ["\u0915\u0948", -1, 2],
  ["\u0938\u0901\u0917\u0948", -1, 1],
  ["\u092E\u0948", -1, 1],
  ["\u0915\u094B", -1, 2]
].map(x => new Among(x[0], x[1], x[2]));

StemmerNe.a_1 = [
  ["\u0901", -1, -1],
  ["\u0902", -1, -1],
  ["\u0948", -1, -1]
].map(x => new Among(x[0], x[1], x[2]));

StemmerNe.a_2 = [
  ["\u0901", -1, 1],
  ["\u0902", -1, 1],
  ["\u0948", -1, 2]
].map(x => new Among(x[0], x[1], x[2]));

StemmerNe.a_3 = [
  ["\u0925\u093F\u090F", -1, 1],
  ["\u091B", -1, 1],
  ["\u0907\u091B", 1, 1],
  ["\u090F\u091B", 1, 1],
  ["\u093F\u091B", 1, 1],
  ["\u0947\u091B", 1, 1],
  ["\u0928\u0947\u091B", 5, 1],
  ["\u0939\u0941\u0928\u0947\u091B", 6, 1],
  ["\u0907\u0928\u094D\u091B", 1, 1],
  ["\u093F\u0928\u094D\u091B", 1, 1],
  ["\u0939\u0941\u0928\u094D\u091B", 1, 1],
  ["\u090F\u0915\u093E", -1, 1],
  ["\u0907\u090F\u0915\u093E", 11, 1],
  ["\u093F\u090F\u0915\u093E", 11, 1],
  ["\u0947\u0915\u093E", -1, 1],
  ["\u0928\u0947\u0915\u093E", 14, 1],
  ["\u0926\u093E", -1, 1],
  ["\u0907\u0926\u093E", 16, 1],
  ["\u093F\u0926\u093E", 16, 1],
  ["\u0926\u0947\u0916\u093F", -1, 1],
  ["\u092E\u093E\u0925\u093F", -1, 1],
  ["\u090F\u0915\u0940", -1, 1],
  ["\u0907\u090F\u0915\u0940", 21, 1],
  ["\u093F\u090F\u0915\u0940", 21, 1],
  ["\u0947\u0915\u0940", -1, 1],
  ["\u0926\u0947\u0916\u0940", -1, 1],
  ["\u0925\u0940", -1, 1],
  ["\u0926\u0940", -1, 1],
  ["\u091B\u0941", -1, 1],
  ["\u090F\u091B\u0941", 28, 1],
  ["\u0947\u091B\u0941", 28, 1],
  ["\u0928\u0947\u091B\u0941", 30, 1],
  ["\u0928\u0941", -1, 1],
  ["\u0939\u0930\u0941", -1, 1],
  ["\u0939\u0930\u0942", -1, 1],
  ["\u091B\u0947", -1, 1],
  ["\u0925\u0947", -1, 1],
  ["\u0928\u0947", -1, 1],
  ["\u090F\u0915\u0948", -1, 1],
  ["\u0947\u0915\u0948", -1, 1],
  ["\u0928\u0947\u0915\u0948", 39, 1],
  ["\u0926\u0948", -1, 1],
  ["\u0907\u0926\u0948", 41, 1],
  ["\u093F\u0926\u0948", 41, 1],
  ["\u090F\u0915\u094B", -1, 1],
  ["\u0907\u090F\u0915\u094B", 44, 1],
  ["\u093F\u090F\u0915\u094B", 44, 1],
  ["\u0947\u0915\u094B", -1, 1],
  ["\u0928\u0947\u0915\u094B", 47, 1],
  ["\u0926\u094B", -1, 1],
  ["\u0907\u0926\u094B", 49, 1],
  ["\u093F\u0926\u094B", 49, 1],
  ["\u092F\u094B", -1, 1],
  ["\u0907\u092F\u094B", 52, 1],
  ["\u092D\u092F\u094B", 52, 1],
  ["\u093F\u092F\u094B", 52, 1],
  ["\u0925\u093F\u092F\u094B", 55, 1],
  ["\u0926\u093F\u092F\u094B", 55, 1],
  ["\u0925\u094D\u092F\u094B", 52, 1],
  ["\u091B\u094C", -1, 1],
  ["\u0907\u091B\u094C", 59, 1],
  ["\u090F\u091B\u094C", 59, 1],
  ["\u093F\u091B\u094C", 59, 1],
  ["\u0947\u091B\u094C", 59, 1],
  ["\u0928\u0947\u091B\u094C", 63, 1],
  ["\u092F\u094C", -1, 1],
  ["\u0925\u093F\u092F\u094C", 65, 1],
  ["\u091B\u094D\u092F\u094C", 65, 1],
  ["\u0925\u094D\u092F\u094C", 65, 1],
  ["\u091B\u0928\u094D", -1, 1],
  ["\u0907\u091B\u0928\u094D", 69, 1],
  ["\u090F\u091B\u0928\u094D", 69, 1],
  ["\u093F\u091B\u0928\u094D", 69, 1],
  ["\u0947\u091B\u0928\u094D", 69, 1],
  ["\u0928\u0947\u091B\u0928\u094D", 73, 1],
  ["\u0932\u093E\u0928\u094D", -1, 1],
  ["\u091B\u093F\u0928\u094D", -1, 1],
  ["\u0925\u093F\u0928\u094D", -1, 1],
  ["\u092A\u0930\u094D", -1, 1],
  ["\u0907\u0938\u094D", -1, 1],
  ["\u0925\u093F\u0907\u0938\u094D", 79, 1],
  ["\u091B\u0938\u094D", -1, 1],
  ["\u0907\u091B\u0938\u094D", 81, 1],
  ["\u090F\u091B\u0938\u094D", 81, 1],
  ["\u093F\u091B\u0938\u094D", 81, 1],
  ["\u0947\u091B\u0938\u094D", 81, 1],
  ["\u0928\u0947\u091B\u0938\u094D", 85, 1],
  ["\u093F\u0938\u094D", -1, 1],
  ["\u0925\u093F\u0938\u094D", 87, 1],
  ["\u091B\u0947\u0938\u094D", -1, 1],
  ["\u0939\u094B\u0938\u094D", -1, 1]
].map(x => new Among(x[0], x[1], x[2]));


module.exports = StemmerNe;
