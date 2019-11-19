/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const { Among, BaseStemmer } = require('@nlpjs/core');

/* eslint-disable */
class StemmerHy extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-hy';
    this.I_p2 = 0;
    this.I_pV = 0;
  }

  r_mark_regions() {
    let v_1;
    this.I_pV = this.limit;
    this.I_p2 = this.limit;
    v_1 = this.cursor;
    lab0: do {
      golab1: while (true) {
        lab2: do {
          if (!this.in_grouping(StemmerHy.g_v, 1377, 1413)) {
            break lab2;
          }
          break golab1;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      this.I_pV = this.cursor;
      golab3: while (true) {
        lab4: do {
          if (!this.out_grouping(StemmerHy.g_v, 1377, 1413)) {
            break lab4;
          }
          break golab3;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      golab5: while (true) {
        lab6: do {
          if (!this.in_grouping(StemmerHy.g_v, 1377, 1413)) {
            break lab6;
          }
          break golab5;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      golab7: while (true) {
        lab8: do {
          if (!this.out_grouping(StemmerHy.g_v, 1377, 1413)) {
            break lab8;
          }
          break golab7;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      this.I_p2 = this.cursor;
    } while (false);
    this.cursor = v_1;
    return true;
  }
  r_R2() {
    if (!(this.I_p2 <= this.cursor)) {
      return false;
    }
    return true;
  }
  r_adjective() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerHy.a_0);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        this.slice_del();
        break;
    }
    return true;
  }
  r_verb() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerHy.a_1);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        this.slice_del();
        break;
    }
    return true;
  }
  r_noun() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerHy.a_2);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        this.slice_del();
        break;
    }
    return true;
  }
  r_ending() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerHy.a_3);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    if (!this.r_R2()) {
      return false;
    }
    switch (among_var) {
      case 0:
        return false;
      case 1:
        this.slice_del();
        break;
    }
    return true;
  }
  innerStem() {
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    let v_5;
    let v_6;
    let v_7;
    v_1 = this.cursor;
    lab0: do {
      if (!this.r_mark_regions()) {
        break lab0;
      }
    } while (false);
    this.cursor = v_1;
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    v_2 = this.limit - this.cursor;
    if (this.cursor < this.I_pV) {
      return false;
    }
    this.cursor = this.I_pV;
    v_3 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_2;
    v_4 = this.limit - this.cursor;
    lab1: do {
      if (!this.r_ending()) {
        break lab1;
      }
    } while (false);
    this.cursor = this.limit - v_4;
    v_5 = this.limit - this.cursor;
    lab2: do {
      if (!this.r_verb()) {
        break lab2;
      }
    } while (false);
    this.cursor = this.limit - v_5;
    v_6 = this.limit - this.cursor;
    lab3: do {
      if (!this.r_adjective()) {
        break lab3;
      }
    } while (false);
    this.cursor = this.limit - v_6;
    v_7 = this.limit - this.cursor;
    lab4: do {
      if (!this.r_noun()) {
        break lab4;
      }
    } while (false);
    this.cursor = this.limit - v_7;
    this.limit_backward = v_3;
    this.cursor = this.limit_backward;
    return true;
  }
}

StemmerHy.a_0 = [
  new Among('\u0580\u0578\u0580\u0564', -1, 1),
  new Among('\u0565\u0580\u0578\u0580\u0564', 0, 1),
  new Among('\u0561\u056C\u056B', -1, 1),
  new Among('\u0561\u056F\u056B', -1, 1),
  new Among('\u0578\u0580\u0561\u056F', -1, 1),
  new Among('\u0565\u0572', -1, 1),
  new Among('\u0561\u056F\u0561\u0576', -1, 1),
  new Among('\u0561\u0580\u0561\u0576', -1, 1),
  new Among('\u0565\u0576', -1, 1),
  new Among('\u0565\u056F\u0565\u0576', 8, 1),
  new Among('\u0565\u0580\u0565\u0576', 8, 1),
  new Among('\u0578\u0580\u0567\u0576', -1, 1),
  new Among('\u056B\u0576', -1, 1),
  new Among('\u0563\u056B\u0576', 12, 1),
  new Among('\u0578\u057E\u056B\u0576', 12, 1),
  new Among('\u056C\u0561\u0575\u0576', -1, 1),
  new Among('\u057E\u0578\u0582\u0576', -1, 1),
  new Among('\u057A\u0565\u057D', -1, 1),
  new Among('\u056B\u057E', -1, 1),
  new Among('\u0561\u057F', -1, 1),
  new Among('\u0561\u057E\u0565\u057F', -1, 1),
  new Among('\u056F\u0578\u057F', -1, 1),
  new Among('\u0562\u0561\u0580', -1, 1)
];

StemmerHy.a_1 = [
  new Among('\u0561', -1, 1),
  new Among('\u0561\u0581\u0561', 0, 1),
  new Among('\u0565\u0581\u0561', 0, 1),
  new Among('\u057E\u0565', -1, 1),
  new Among('\u0561\u0581\u0580\u056B', -1, 1),
  new Among('\u0561\u0581\u056B', -1, 1),
  new Among('\u0565\u0581\u056B', -1, 1),
  new Among('\u057E\u0565\u0581\u056B', 6, 1),
  new Among('\u0561\u056C', -1, 1),
  new Among('\u0568\u0561\u056C', 8, 1),
  new Among('\u0561\u0576\u0561\u056C', 8, 1),
  new Among('\u0565\u0576\u0561\u056C', 8, 1),
  new Among('\u0561\u0581\u0576\u0561\u056C', 8, 1),
  new Among('\u0565\u056C', -1, 1),
  new Among('\u0568\u0565\u056C', 13, 1),
  new Among('\u0576\u0565\u056C', 13, 1),
  new Among('\u0581\u0576\u0565\u056C', 15, 1),
  new Among('\u0565\u0581\u0576\u0565\u056C', 16, 1),
  new Among('\u0579\u0565\u056C', 13, 1),
  new Among('\u057E\u0565\u056C', 13, 1),
  new Among('\u0561\u0581\u057E\u0565\u056C', 19, 1),
  new Among('\u0565\u0581\u057E\u0565\u056C', 19, 1),
  new Among('\u057F\u0565\u056C', 13, 1),
  new Among('\u0561\u057F\u0565\u056C', 22, 1),
  new Among('\u0578\u057F\u0565\u056C', 22, 1),
  new Among('\u056F\u0578\u057F\u0565\u056C', 24, 1),
  new Among('\u057E\u0561\u056E', -1, 1),
  new Among('\u0578\u0582\u0574', -1, 1),
  new Among('\u057E\u0578\u0582\u0574', 27, 1),
  new Among('\u0561\u0576', -1, 1),
  new Among('\u0581\u0561\u0576', 29, 1),
  new Among('\u0561\u0581\u0561\u0576', 30, 1),
  new Among('\u0561\u0581\u0580\u056B\u0576', -1, 1),
  new Among('\u0561\u0581\u056B\u0576', -1, 1),
  new Among('\u0565\u0581\u056B\u0576', -1, 1),
  new Among('\u057E\u0565\u0581\u056B\u0576', 34, 1),
  new Among('\u0561\u056C\u056B\u057D', -1, 1),
  new Among('\u0565\u056C\u056B\u057D', -1, 1),
  new Among('\u0561\u057E', -1, 1),
  new Among('\u0561\u0581\u0561\u057E', 38, 1),
  new Among('\u0565\u0581\u0561\u057E', 38, 1),
  new Among('\u0561\u056C\u0578\u057E', -1, 1),
  new Among('\u0565\u056C\u0578\u057E', -1, 1),
  new Among('\u0561\u0580', -1, 1),
  new Among('\u0561\u0581\u0561\u0580', 43, 1),
  new Among('\u0565\u0581\u0561\u0580', 43, 1),
  new Among('\u0561\u0581\u0580\u056B\u0580', -1, 1),
  new Among('\u0561\u0581\u056B\u0580', -1, 1),
  new Among('\u0565\u0581\u056B\u0580', -1, 1),
  new Among('\u057E\u0565\u0581\u056B\u0580', 48, 1),
  new Among('\u0561\u0581', -1, 1),
  new Among('\u0565\u0581', -1, 1),
  new Among('\u0561\u0581\u0580\u0565\u0581', 51, 1),
  new Among('\u0561\u056C\u0578\u0582\u0581', -1, 1),
  new Among('\u0565\u056C\u0578\u0582\u0581', -1, 1),
  new Among('\u0561\u056C\u0578\u0582', -1, 1),
  new Among('\u0565\u056C\u0578\u0582', -1, 1),
  new Among('\u0561\u0584', -1, 1),
  new Among('\u0581\u0561\u0584', 57, 1),
  new Among('\u0561\u0581\u0561\u0584', 58, 1),
  new Among('\u0561\u0581\u0580\u056B\u0584', -1, 1),
  new Among('\u0561\u0581\u056B\u0584', -1, 1),
  new Among('\u0565\u0581\u056B\u0584', -1, 1),
  new Among('\u057E\u0565\u0581\u056B\u0584', 62, 1),
  new Among('\u0561\u0576\u0584', -1, 1),
  new Among('\u0581\u0561\u0576\u0584', 64, 1),
  new Among('\u0561\u0581\u0561\u0576\u0584', 65, 1),
  new Among('\u0561\u0581\u0580\u056B\u0576\u0584', -1, 1),
  new Among('\u0561\u0581\u056B\u0576\u0584', -1, 1),
  new Among('\u0565\u0581\u056B\u0576\u0584', -1, 1),
  new Among('\u057E\u0565\u0581\u056B\u0576\u0584', 69, 1)
];

StemmerHy.a_2 = [
  new Among('\u0578\u0580\u0564', -1, 1),
  new Among('\u0578\u0582\u0575\u0569', -1, 1),
  new Among('\u0578\u0582\u0570\u056B', -1, 1),
  new Among('\u0581\u056B', -1, 1),
  new Among('\u056B\u056C', -1, 1),
  new Among('\u0561\u056F', -1, 1),
  new Among('\u0575\u0561\u056F', 5, 1),
  new Among('\u0561\u0576\u0561\u056F', 5, 1),
  new Among('\u056B\u056F', -1, 1),
  new Among('\u0578\u0582\u056F', -1, 1),
  new Among('\u0561\u0576', -1, 1),
  new Among('\u057A\u0561\u0576', 10, 1),
  new Among('\u057D\u057F\u0561\u0576', 10, 1),
  new Among('\u0561\u0580\u0561\u0576', 10, 1),
  new Among('\u0565\u0572\u0567\u0576', -1, 1),
  new Among('\u0575\u0578\u0582\u0576', -1, 1),
  new Among('\u0578\u0582\u0569\u0575\u0578\u0582\u0576', 15, 1),
  new Among('\u0561\u056E\u0578', -1, 1),
  new Among('\u056B\u0579', -1, 1),
  new Among('\u0578\u0582\u057D', -1, 1),
  new Among('\u0578\u0582\u057D\u057F', -1, 1),
  new Among('\u0563\u0561\u0580', -1, 1),
  new Among('\u057E\u0578\u0580', -1, 1),
  new Among('\u0561\u057E\u0578\u0580', 22, 1),
  new Among('\u0578\u0581', -1, 1),
  new Among('\u0561\u0576\u0585\u0581', -1, 1),
  new Among('\u0578\u0582', -1, 1),
  new Among('\u0584', -1, 1),
  new Among('\u0579\u0565\u0584', 27, 1),
  new Among('\u056B\u0584', 27, 1),
  new Among('\u0561\u056C\u056B\u0584', 29, 1),
  new Among('\u0561\u0576\u056B\u0584', 29, 1),
  new Among('\u057E\u0561\u056E\u0584', 27, 1),
  new Among('\u0578\u0582\u0575\u0584', 27, 1),
  new Among('\u0565\u0576\u0584', 27, 1),
  new Among('\u0578\u0576\u0584', 27, 1),
  new Among('\u0578\u0582\u0576\u0584', 27, 1),
  new Among('\u0574\u0578\u0582\u0576\u0584', 36, 1),
  new Among('\u056B\u0579\u0584', 27, 1),
  new Among('\u0561\u0580\u0584', 27, 1)
];

StemmerHy.a_3 = [
  new Among('\u057D\u0561', -1, 1),
  new Among('\u057E\u0561', -1, 1),
  new Among('\u0561\u0574\u0562', -1, 1),
  new Among('\u0564', -1, 1),
  new Among('\u0561\u0576\u0564', 3, 1),
  new Among('\u0578\u0582\u0569\u0575\u0561\u0576\u0564', 4, 1),
  new Among('\u057E\u0561\u0576\u0564', 4, 1),
  new Among('\u0578\u057B\u0564', 3, 1),
  new Among('\u0565\u0580\u0564', 3, 1),
  new Among('\u0576\u0565\u0580\u0564', 8, 1),
  new Among('\u0578\u0582\u0564', 3, 1),
  new Among('\u0568', -1, 1),
  new Among('\u0561\u0576\u0568', 11, 1),
  new Among('\u0578\u0582\u0569\u0575\u0561\u0576\u0568', 12, 1),
  new Among('\u057E\u0561\u0576\u0568', 12, 1),
  new Among('\u0578\u057B\u0568', 11, 1),
  new Among('\u0565\u0580\u0568', 11, 1),
  new Among('\u0576\u0565\u0580\u0568', 16, 1),
  new Among('\u056B', -1, 1),
  new Among('\u057E\u056B', 18, 1),
  new Among('\u0565\u0580\u056B', 18, 1),
  new Among('\u0576\u0565\u0580\u056B', 20, 1),
  new Among('\u0561\u0576\u0578\u0582\u0574', -1, 1),
  new Among('\u0565\u0580\u0578\u0582\u0574', -1, 1),
  new Among('\u0576\u0565\u0580\u0578\u0582\u0574', 23, 1),
  new Among('\u0576', -1, 1),
  new Among('\u0561\u0576', 25, 1),
  new Among('\u0578\u0582\u0569\u0575\u0561\u0576', 26, 1),
  new Among('\u057E\u0561\u0576', 26, 1),
  new Among('\u056B\u0576', 25, 1),
  new Among('\u0565\u0580\u056B\u0576', 29, 1),
  new Among('\u0576\u0565\u0580\u056B\u0576', 30, 1),
  new Among('\u0578\u0582\u0569\u0575\u0561\u0576\u0576', 25, 1),
  new Among('\u0565\u0580\u0576', 25, 1),
  new Among('\u0576\u0565\u0580\u0576', 33, 1),
  new Among('\u0578\u0582\u0576', 25, 1),
  new Among('\u0578\u057B', -1, 1),
  new Among('\u0578\u0582\u0569\u0575\u0561\u0576\u057D', -1, 1),
  new Among('\u057E\u0561\u0576\u057D', -1, 1),
  new Among('\u0578\u057B\u057D', -1, 1),
  new Among('\u0578\u057E', -1, 1),
  new Among('\u0561\u0576\u0578\u057E', 40, 1),
  new Among('\u057E\u0578\u057E', 40, 1),
  new Among('\u0565\u0580\u0578\u057E', 40, 1),
  new Among('\u0576\u0565\u0580\u0578\u057E', 43, 1),
  new Among('\u0565\u0580', -1, 1),
  new Among('\u0576\u0565\u0580', 45, 1),
  new Among('\u0581', -1, 1),
  new Among('\u056B\u0581', 47, 1),
  new Among('\u057E\u0561\u0576\u056B\u0581', 48, 1),
  new Among('\u0578\u057B\u056B\u0581', 48, 1),
  new Among('\u057E\u056B\u0581', 48, 1),
  new Among('\u0565\u0580\u056B\u0581', 48, 1),
  new Among('\u0576\u0565\u0580\u056B\u0581', 52, 1),
  new Among('\u0581\u056B\u0581', 48, 1),
  new Among('\u0578\u0581', 47, 1),
  new Among('\u0578\u0582\u0581', 47, 1)
];

StemmerHy.g_v = [209, 4, 128, 0, 18];

module.exports = StemmerHy;
