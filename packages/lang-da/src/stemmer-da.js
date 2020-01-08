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
class StemmerDa extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-da';
    this.I_x = 0;
    this.I_p1 = 0;
    this.S_ch = '';
  }

  copy_from(other) {
    this.I_x = other.I_x;
    this.I_p1 = other.I_p1;
    this.S_ch = other.S_ch;
    super.copy_from(other);
  }

  r_mark_regions() {
    let v_1;
    let v_2;
    // (, line 29
    this.I_p1 = this.limit;
    // test, line 33
    v_1 = this.cursor;
    // (, line 33
    // hop, line 33
    {
      const c = this.cursor + 3;
      if (c < 0 || c > this.limit) {
        return false;
      }
      this.cursor = c;
    }
    // setmark x, line 33
    this.I_x = this.cursor;
    this.cursor = v_1;
    // goto, line 34
    golab0: while (true) {
      v_2 = this.cursor;
      let lab1 = true;
      while (lab1 == true) {
        lab1 = false;
        if (!this.in_grouping(StemmerDa.g_v, 97, 248)) {
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
    // gopast, line 34
    golab2: while (true) {
      let lab3 = true;
      while (lab3 == true) {
        lab3 = false;
        if (!this.out_grouping(StemmerDa.g_v, 97, 248)) {
          break;
        }
        break golab2;
      }
      if (this.cursor >= this.limit) {
        return false;
      }
      this.cursor++;
    }
    // setmark p1, line 34
    this.I_p1 = this.cursor;
    // try, line 35
    let lab4 = true;
    while (lab4 == true) {
      lab4 = false;
      // (, line 35
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
    // (, line 40
    // setlimit, line 41
    v_1 = this.limit - this.cursor;
    // tomark, line 41
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 41
    // [, line 41
    this.ket = this.cursor;
    // substring, line 41
    among_var = this.find_among_b(StemmerDa.a_0, 32);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 41
    this.bra = this.cursor;
    this.limit_backward = v_2;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 48
        // delete, line 48
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 50
        if (!this.in_grouping_b(StemmerDa.g_s_ending, 97, 229)) {
          return false;
        }
        // delete, line 50
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
    // (, line 54
    // test, line 55
    v_1 = this.limit - this.cursor;
    // (, line 55
    // setlimit, line 56
    v_2 = this.limit - this.cursor;
    // tomark, line 56
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_3 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_2;
    // (, line 56
    // [, line 56
    this.ket = this.cursor;
    // substring, line 56
    if (this.find_among_b(StemmerDa.a_1, 4) == 0) {
      this.limit_backward = v_3;
      return false;
    }
    // ], line 56
    this.bra = this.cursor;
    this.limit_backward = v_3;
    this.cursor = this.limit - v_1;
    // next, line 62
    if (this.cursor <= this.limit_backward) {
      return false;
    }
    this.cursor--;
    // ], line 62
    this.bra = this.cursor;
    // delete, line 62
    if (!this.slice_del()) {
      return false;
    }
    return true;
  }

  r_other_suffix() {
    let among_var;
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    // (, line 65
    // do, line 66
    v_1 = this.limit - this.cursor;
    let lab0 = true;
    while (lab0 == true) {
      lab0 = false;
      // (, line 66
      // [, line 66
      this.ket = this.cursor;
      // literal, line 66
      if (!this.eq_s_b(2, 'st')) {
        break;
      }
      // ], line 66
      this.bra = this.cursor;
      // literal, line 66
      if (!this.eq_s_b(2, 'ig')) {
        break;
      }
      // delete, line 66
      if (!this.slice_del()) {
        return false;
      }
    }
    this.cursor = this.limit - v_1;
    // setlimit, line 67
    v_2 = this.limit - this.cursor;
    // tomark, line 67
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_3 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_2;
    // (, line 67
    // [, line 67
    this.ket = this.cursor;
    // substring, line 67
    among_var = this.find_among_b(StemmerDa.a_2, 5);
    if (among_var == 0) {
      this.limit_backward = v_3;
      return false;
    }
    // ], line 67
    this.bra = this.cursor;
    this.limit_backward = v_3;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 70
        // delete, line 70
        if (!this.slice_del()) {
          return false;
        }
        // do, line 70
        v_4 = this.limit - this.cursor;
        var lab1 = true;
        while (lab1 == true) {
          lab1 = false;
          // call consonant_pair, line 70
          if (!this.r_consonant_pair()) {
            break;
          }
        }
        this.cursor = this.limit - v_4;
        break;
      case 2:
        // (, line 72
        // <-, line 72
        if (!this.slice_from('l\u00F8s')) {
          return false;
        }
        break;
    }
    return true;
  }

  r_undouble() {
    let v_1;
    let v_2;
    // (, line 75
    // setlimit, line 76
    v_1 = this.limit - this.cursor;
    // tomark, line 76
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 76
    // [, line 76
    this.ket = this.cursor;
    if (!this.out_grouping_b(StemmerDa.g_v, 97, 248)) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 76
    this.bra = this.cursor;
    // -> ch, line 76
    this.S_ch = this.slice_to(this.S_ch);
    if (this.S_ch == '') {
      return false;
    }
    this.limit_backward = v_2;
    // name ch, line 77
    if (!this.eq_s_b(this.S_ch)) {
      return false;
    }
    // delete, line 78
    if (!this.slice_del()) {
      return false;
    }
    return true;
  }

  innerStem() {
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    let v_5;
    // (, line 82
    // do, line 84
    v_1 = this.cursor;
    let lab0 = true;
    while (lab0 == true) {
      lab0 = false;
      // call mark_regions, line 84
      if (!this.r_mark_regions()) {
        break;
      }
    }
    this.cursor = v_1;
    // backwards, line 85
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    // (, line 85
    // do, line 86
    v_2 = this.limit - this.cursor;
    let lab1 = true;
    while (lab1 == true) {
      lab1 = false;
      // call main_suffix, line 86
      if (!this.r_main_suffix()) {
        break;
      }
    }
    this.cursor = this.limit - v_2;
    // do, line 87
    v_3 = this.limit - this.cursor;
    let lab2 = true;
    while (lab2 == true) {
      lab2 = false;
      // call consonant_pair, line 87
      if (!this.r_consonant_pair()) {
        break;
      }
    }
    this.cursor = this.limit - v_3;
    // do, line 88
    v_4 = this.limit - this.cursor;
    let lab3 = true;
    while (lab3 == true) {
      lab3 = false;
      // call other_suffix, line 88
      if (!this.r_other_suffix()) {
        break;
      }
    }
    this.cursor = this.limit - v_4;
    // do, line 89
    v_5 = this.limit - this.cursor;
    let lab4 = true;
    while (lab4 == true) {
      lab4 = false;
      // call undouble, line 89
      if (!this.r_undouble()) {
        break;
      }
    }
    this.cursor = this.limit - v_5;
    this.cursor = this.limit_backward;
    return true;
  }
}

StemmerDa.a_0 = [
  new Among('hed', -1, 1),
  new Among('ethed', 0, 1),
  new Among('ered', -1, 1),
  new Among('e', -1, 1),
  new Among('erede', 3, 1),
  new Among('ende', 3, 1),
  new Among('erende', 5, 1),
  new Among('ene', 3, 1),
  new Among('erne', 3, 1),
  new Among('ere', 3, 1),
  new Among('en', -1, 1),
  new Among('heden', 10, 1),
  new Among('eren', 10, 1),
  new Among('er', -1, 1),
  new Among('heder', 13, 1),
  new Among('erer', 13, 1),
  new Among('s', -1, 2),
  new Among('heds', 16, 1),
  new Among('es', 16, 1),
  new Among('endes', 18, 1),
  new Among('erendes', 19, 1),
  new Among('enes', 18, 1),
  new Among('ernes', 18, 1),
  new Among('eres', 18, 1),
  new Among('ens', 16, 1),
  new Among('hedens', 24, 1),
  new Among('erens', 24, 1),
  new Among('ers', 16, 1),
  new Among('ets', 16, 1),
  new Among('erets', 28, 1),
  new Among('et', -1, 1),
  new Among('eret', 30, 1)
];

StemmerDa.a_1 = [
  new Among('gd', -1, -1),
  new Among('dt', -1, -1),
  new Among('gt', -1, -1),
  new Among('kt', -1, -1)
];

StemmerDa.a_2 = [
  new Among('ig', -1, 1),
  new Among('lig', 0, 1),
  new Among('elig', 1, 1),
  new Among('els', -1, 1),
  new Among('l\u00F8st', -1, 2)
];

StemmerDa.g_v = [
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
  48,
  0,
  128
];

StemmerDa.g_s_ending = [
  239,
  254,
  42,
  3,
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
  16
];

module.exports = StemmerDa;
