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

class StemmerSv extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-sv';
    this.I_x = 0;
    this.I_p1 = 0;
  }

  copy_from(other) {
    this.I_x = other.I_x;
    this.I_p1 = other.I_p1;
    super.copy_from(other);
  }

  r_mark_regions() {
    let v_1;
    let v_2;
    // (, line 26
    this.I_p1 = this.limit;
    // test, line 29
    v_1 = this.cursor;
    // (, line 29
    // hop, line 29
    {
      const c = this.cursor + 3;
      if (c < 0 || c > this.limit) {
        return false;
      }
      this.cursor = c;
    }
    // setmark x, line 29
    this.I_x = this.cursor;
    this.cursor = v_1;
    // goto, line 30
    golab0: while (true) {
      v_2 = this.cursor;
      let lab1 = true;
      while (lab1 == true) {
        lab1 = false;
        if (!this.in_grouping(StemmerSv.g_v, 97, 246)) {
          break;
        }
        this.cursor = v_2;
        break golab0;
      }
      this.cursor = v_2;
      if (this.cursor >= this.limit) {
        return false;
      }
      this.cursor++;
    }
    // gopast, line 30
    golab2: while (true) {
      let lab3 = true;
      while (lab3 == true) {
        lab3 = false;
        if (!this.out_grouping(StemmerSv.g_v, 97, 246)) {
          break;
        }
        break golab2;
      }
      if (this.cursor >= this.limit) {
        return false;
      }
      this.cursor++;
    }
    // setmark p1, line 30
    this.I_p1 = this.cursor;
    // try, line 31
    let lab4 = true;
    while (lab4 == true) {
      lab4 = false;
      // (, line 31
      if (!(this.I_p1 < this.I_x)) {
        break;
      }
      this.I_p1 = this.I_x;
    }
    return true;
  }

  r_main_suffix() {
    let among_var;
    let v_1;
    let v_2;
    // (, line 36
    // setlimit, line 37
    v_1 = this.limit - this.cursor;
    // tomark, line 37
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 37
    // [, line 37
    this.ket = this.cursor;
    // substring, line 37
    among_var = this.find_among_b(StemmerSv.a_0, 37);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 37
    this.bra = this.cursor;
    this.limit_backward = v_2;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 44
        // delete, line 44
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 46
        if (!this.in_grouping_b(StemmerSv.g_s_ending, 98, 121)) {
          return false;
        }
        // delete, line 46
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    return true;
  }

  r_consonant_pair() {
    let v_1;
    let v_2;
    let v_3;
    // setlimit, line 50
    v_1 = this.limit - this.cursor;
    // tomark, line 50
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 50
    // and, line 52
    v_3 = this.limit - this.cursor;
    // among, line 51
    if (this.find_among_b(StemmerSv.a_1, 7) == 0) {
      this.limit_backward = v_2;
      return false;
    }
    this.cursor = this.limit - v_3;
    // (, line 52
    // [, line 52
    this.ket = this.cursor;
    // next, line 52
    if (this.cursor <= this.limit_backward) {
      this.limit_backward = v_2;
      return false;
    }
    this.cursor--;
    // ], line 52
    this.bra = this.cursor;
    // delete, line 52
    if (!this.slice_del()) {
      return false;
    }
    this.limit_backward = v_2;
    return true;
  }

  r_other_suffix() {
    let among_var;
    let v_1;
    let v_2;
    // setlimit, line 55
    v_1 = this.limit - this.cursor;
    // tomark, line 55
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 55
    // [, line 56
    this.ket = this.cursor;
    // substring, line 56
    among_var = this.find_among_b(StemmerSv.a_2, 5);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 56
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        this.limit_backward = v_2;
        return false;
      case 1:
        // (, line 57
        // delete, line 57
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 58
        // <-, line 58
        if (!this.slice_from('l\u00F6s')) {
          return false;
        }
        break;
      case 3:
        // (, line 59
        // <-, line 59
        if (!this.slice_from('full')) {
          return false;
        }
        break;
    }
    this.limit_backward = v_2;
    return true;
  }

  innerStem() {
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    // (, line 64
    // do, line 66
    v_1 = this.cursor;
    let lab0 = true;
    while (lab0 == true) {
      lab0 = false;
      // call mark_regions, line 66
      if (!this.r_mark_regions()) {
        break;
      }
    }
    this.cursor = v_1;
    // backwards, line 67
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    // (, line 67
    // do, line 68
    v_2 = this.limit - this.cursor;
    let lab1 = true;
    while (lab1 == true) {
      lab1 = false;
      // call main_suffix, line 68
      if (!this.r_main_suffix()) {
        break;
      }
    }
    this.cursor = this.limit - v_2;
    // do, line 69
    v_3 = this.limit - this.cursor;
    let lab2 = true;
    while (lab2 == true) {
      lab2 = false;
      // call consonant_pair, line 69
      if (!this.r_consonant_pair()) {
        break;
      }
    }
    this.cursor = this.limit - v_3;
    // do, line 70
    v_4 = this.limit - this.cursor;
    let lab3 = true;
    while (lab3 == true) {
      lab3 = false;
      // call other_suffix, line 70
      if (!this.r_other_suffix()) {
        break;
      }
    }
    this.cursor = this.limit - v_4;
    this.cursor = this.limit_backward;
    return true;
  }
}

StemmerSv.methodObject = new StemmerSv();

StemmerSv.a_0 = [
  new Among('a', -1, 1),
  new Among('arna', 0, 1),
  new Among('erna', 0, 1),
  new Among('heterna', 2, 1),
  new Among('orna', 0, 1),
  new Among('ad', -1, 1),
  new Among('e', -1, 1),
  new Among('ade', 6, 1),
  new Among('ande', 6, 1),
  new Among('arne', 6, 1),
  new Among('are', 6, 1),
  new Among('aste', 6, 1),
  new Among('en', -1, 1),
  new Among('anden', 12, 1),
  new Among('aren', 12, 1),
  new Among('heten', 12, 1),
  new Among('ern', -1, 1),
  new Among('ar', -1, 1),
  new Among('er', -1, 1),
  new Among('heter', 18, 1),
  new Among('or', -1, 1),
  new Among('s', -1, 2),
  new Among('as', 21, 1),
  new Among('arnas', 22, 1),
  new Among('ernas', 22, 1),
  new Among('ornas', 22, 1),
  new Among('es', 21, 1),
  new Among('ades', 26, 1),
  new Among('andes', 26, 1),
  new Among('ens', 21, 1),
  new Among('arens', 29, 1),
  new Among('hetens', 29, 1),
  new Among('erns', 21, 1),
  new Among('at', -1, 1),
  new Among('andet', -1, 1),
  new Among('het', -1, 1),
  new Among('ast', -1, 1)
];

StemmerSv.a_1 = [
  new Among('dd', -1, -1),
  new Among('gd', -1, -1),
  new Among('nn', -1, -1),
  new Among('dt', -1, -1),
  new Among('gt', -1, -1),
  new Among('kt', -1, -1),
  new Among('tt', -1, -1)
];

StemmerSv.a_2 = [
  new Among('ig', -1, 1),
  new Among('lig', 0, 1),
  new Among('els', -1, 1),
  new Among('fullt', -1, 3),
  new Among('l\u00F6st', -1, 2)
];

StemmerSv.g_v = [
  17,
  65,
  16,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  32
];

StemmerSv.g_s_ending = [119, 127, 149];

module.exports = StemmerSv;
