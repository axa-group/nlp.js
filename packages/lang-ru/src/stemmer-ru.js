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
class StemmerRu extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-ru';
    this.I_p2 = 0;
    this.I_pV = 0;
  }

  copy_from(other) {
    this.I_p2 = other.I_p2;
    this.I_pV = other.I_pV;
    super.copy_from(other);
  }

  r_mark_regions() {
    let v_1;
    // (, line 57
    this.I_pV = this.limit;
    this.I_p2 = this.limit;
    // do, line 61
    v_1 = this.cursor;
    let lab0 = true;
    lab0: while (lab0 == true) {
      lab0 = false;
      // (, line 61
      // gopast, line 62
      golab1: while (true) {
        let lab2 = true;
        while (lab2 == true) {
          lab2 = false;
          if (!this.in_grouping(StemmerRu.g_v, 1072, 1103)) {
            break;
          }
          break golab1;
        }
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      // setmark pV, line 62
      this.I_pV = this.cursor;
      // gopast, line 62
      golab3: while (true) {
        let lab4 = true;
        while (lab4 == true) {
          lab4 = false;
          if (!this.out_grouping(StemmerRu.g_v, 1072, 1103)) {
            break;
          }
          break golab3;
        }
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      // gopast, line 63
      golab5: while (true) {
        let lab6 = true;
        while (lab6 == true) {
          lab6 = false;
          if (!this.in_grouping(StemmerRu.g_v, 1072, 1103)) {
            break;
          }
          break golab5;
        }
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      // gopast, line 63
      golab7: while (true) {
        let lab8 = true;
        while (lab8 == true) {
          lab8 = false;
          if (!this.out_grouping(StemmerRu.g_v, 1072, 1103)) {
            break;
          }
          break golab7;
        }
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      // setmark p2, line 63
      this.I_p2 = this.cursor;
    }
    this.cursor = v_1;
    return true;
  }

  r_R2() {
    if (!(this.I_p2 <= this.cursor)) {
      return false;
    }
    return true;
  }

  r_perfective_gerund() {
    let among_var;
    let v_1;
    // (, line 71
    // [, line 72
    this.ket = this.cursor;
    // substring, line 72
    among_var = this.find_among_b(StemmerRu.a_0, 9);
    if (among_var == 0) {
      return false;
    }
    // ], line 72
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 76
        // or, line 76
        var lab0 = true;
        lab0: while (lab0 == true) {
          lab0 = false;
          v_1 = this.limit - this.cursor;
          let lab1 = true;
          while (lab1 == true) {
            lab1 = false;
            // literal, line 76
            if (!this.eq_s_b(1, '\u0430')) {
              break;
            }
            break lab0;
          }
          this.cursor = this.limit - v_1;
          // literal, line 76
          if (!this.eq_s_b(1, '\u044F')) {
            return false;
          }
        }
        // delete, line 76
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 83
        // delete, line 83
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    return true;
  }

  r_adjective() {
    let among_var;
    // (, line 87
    // [, line 88
    this.ket = this.cursor;
    // substring, line 88
    among_var = this.find_among_b(StemmerRu.a_1, 26);
    if (among_var == 0) {
      return false;
    }
    // ], line 88
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 97
        // delete, line 97
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    return true;
  }

  r_adjectival() {
    let among_var;
    let v_1;
    let v_2;
    // (, line 101
    // call adjective, line 102
    if (!this.r_adjective()) {
      return false;
    }
    // try, line 109
    v_1 = this.limit - this.cursor;
    let lab0 = true;
    lab0: while (lab0 == true) {
      lab0 = false;
      // (, line 109
      // [, line 110
      this.ket = this.cursor;
      // substring, line 110
      among_var = this.find_among_b(StemmerRu.a_2, 8);
      if (among_var == 0) {
        this.cursor = this.limit - v_1;
        break;
      }
      // ], line 110
      this.bra = this.cursor;
      switch (among_var) {
        case 0:
          this.cursor = this.limit - v_1;
          break lab0;
        case 1:
          // (, line 115
          // or, line 115
          var lab1 = true;
          lab1: while (lab1 == true) {
            lab1 = false;
            v_2 = this.limit - this.cursor;
            let lab2 = true;
            while (lab2 == true) {
              lab2 = false;
              // literal, line 115
              if (!this.eq_s_b(1, '\u0430')) {
                break;
              }
              break lab1;
            }
            this.cursor = this.limit - v_2;
            // literal, line 115
            if (!this.eq_s_b(1, '\u044F')) {
              this.cursor = this.limit - v_1;
              break lab0;
            }
          }
          // delete, line 115
          if (!this.slice_del()) {
            return false;
          }
          break;
        case 2:
          // (, line 122
          // delete, line 122
          if (!this.slice_del()) {
            return false;
          }
          break;
      }
    }
    return true;
  }

  r_reflexive() {
    let among_var;
    // (, line 128
    // [, line 129
    this.ket = this.cursor;
    // substring, line 129
    among_var = this.find_among_b(StemmerRu.a_3, 2);
    if (among_var == 0) {
      return false;
    }
    // ], line 129
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 132
        // delete, line 132
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    return true;
  }

  r_verb() {
    let among_var;
    let v_1;
    // (, line 136
    // [, line 137
    this.ket = this.cursor;
    // substring, line 137
    among_var = this.find_among_b(StemmerRu.a_4, 46);
    if (among_var == 0) {
      return false;
    }
    // ], line 137
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 143
        // or, line 143
        var lab0 = true;
        lab0: while (lab0 == true) {
          lab0 = false;
          v_1 = this.limit - this.cursor;
          let lab1 = true;
          while (lab1 == true) {
            lab1 = false;
            // literal, line 143
            if (!this.eq_s_b(1, '\u0430')) {
              break;
            }
            break lab0;
          }
          this.cursor = this.limit - v_1;
          // literal, line 143
          if (!this.eq_s_b(1, '\u044F')) {
            return false;
          }
        }
        // delete, line 143
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 151
        // delete, line 151
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    return true;
  }

  r_noun() {
    let among_var;
    // (, line 159
    // [, line 160
    this.ket = this.cursor;
    // substring, line 160
    among_var = this.find_among_b(StemmerRu.a_5, 36);
    if (among_var == 0) {
      return false;
    }
    // ], line 160
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 167
        // delete, line 167
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    return true;
  }

  r_derivational() {
    let among_var;
    // (, line 175
    // [, line 176
    this.ket = this.cursor;
    // substring, line 176
    among_var = this.find_among_b(StemmerRu.a_6, 2);
    if (among_var == 0) {
      return false;
    }
    // ], line 176
    this.bra = this.cursor;
    // call R2, line 176
    if (!this.r_R2()) {
      return false;
    }
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 179
        // delete, line 179
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    return true;
  }

  r_tidy_up() {
    let among_var;
    // (, line 183
    // [, line 184
    this.ket = this.cursor;
    // substring, line 184
    among_var = this.find_among_b(StemmerRu.a_7, 4);
    if (among_var == 0) {
      return false;
    }
    // ], line 184
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 188
        // delete, line 188
        if (!this.slice_del()) {
          return false;
        }
        // [, line 189
        this.ket = this.cursor;
        // literal, line 189
        if (!this.eq_s_b(1, '\u043D')) {
          return false;
        }
        // ], line 189
        this.bra = this.cursor;
        // literal, line 189
        if (!this.eq_s_b(1, '\u043D')) {
          return false;
        }
        // delete, line 189
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 192
        // literal, line 192
        if (!this.eq_s_b(1, '\u043D')) {
          return false;
        }
        // delete, line 192
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 3:
        // (, line 194
        // delete, line 194
        if (!this.slice_del()) {
          return false;
        }
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
    let v_8;
    let v_9;
    let v_10;
    // (, line 199
    // do, line 201
    v_1 = this.cursor;
    let lab0 = true;
    while (lab0 == true) {
      lab0 = false;
      // call mark_regions, line 201
      if (!this.r_mark_regions()) {
        break;
      }
    }
    this.cursor = v_1;
    // backwards, line 202
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    // setlimit, line 202
    v_2 = this.limit - this.cursor;
    // tomark, line 202
    if (this.cursor < this.I_pV) {
      return false;
    }
    this.cursor = this.I_pV;
    v_3 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_2;
    // (, line 202
    // do, line 203
    v_4 = this.limit - this.cursor;
    let lab1 = true;
    lab1: while (lab1 == true) {
      lab1 = false;
      // (, line 203
      // or, line 204
      let lab2 = true;
      lab2: while (lab2 == true) {
        lab2 = false;
        v_5 = this.limit - this.cursor;
        let lab3 = true;
        while (lab3 == true) {
          lab3 = false;
          // call perfective_gerund, line 204
          if (!this.r_perfective_gerund()) {
            break;
          }
          break lab2;
        }
        this.cursor = this.limit - v_5;
        // (, line 205
        // try, line 205
        v_6 = this.limit - this.cursor;
        let lab4 = true;
        while (lab4 == true) {
          lab4 = false;
          // call reflexive, line 205
          if (!this.r_reflexive()) {
            this.cursor = this.limit - v_6;
            break;
          }
        }
        // or, line 206
        let lab5 = true;
        lab5: while (lab5 == true) {
          lab5 = false;
          v_7 = this.limit - this.cursor;
          let lab6 = true;
          while (lab6 == true) {
            lab6 = false;
            // call adjectival, line 206
            if (!this.r_adjectival()) {
              break;
            }
            break lab5;
          }
          this.cursor = this.limit - v_7;
          let lab7 = true;
          while (lab7 == true) {
            lab7 = false;
            // call verb, line 206
            if (!this.r_verb()) {
              break;
            }
            break lab5;
          }
          this.cursor = this.limit - v_7;
          // call noun, line 206
          if (!this.r_noun()) {
            break lab1;
          }
        }
      }
    }
    this.cursor = this.limit - v_4;
    // try, line 209
    v_8 = this.limit - this.cursor;
    let lab8 = true;
    while (lab8 == true) {
      lab8 = false;
      // (, line 209
      // [, line 209
      this.ket = this.cursor;
      // literal, line 209
      if (!this.eq_s_b(1, '\u0438')) {
        this.cursor = this.limit - v_8;
        break;
      }
      // ], line 209
      this.bra = this.cursor;
      // delete, line 209
      if (!this.slice_del()) {
        return false;
      }
    }
    // do, line 212
    v_9 = this.limit - this.cursor;
    let lab9 = true;
    while (lab9 == true) {
      lab9 = false;
      // call derivational, line 212
      if (!this.r_derivational()) {
        break;
      }
    }
    this.cursor = this.limit - v_9;
    // do, line 213
    v_10 = this.limit - this.cursor;
    let lab10 = true;
    while (lab10 == true) {
      lab10 = false;
      // call tidy_up, line 213
      if (!this.r_tidy_up()) {
        break;
      }
    }
    this.cursor = this.limit - v_10;
    this.limit_backward = v_3;
    this.cursor = this.limit_backward;
    return true;
  }
}

StemmerRu.methodObject = new StemmerRu();

StemmerRu.a_0 = [
  new Among('\u0432', -1, 1),
  new Among('\u0438\u0432', 0, 2),
  new Among('\u044B\u0432', 0, 2),
  new Among('\u0432\u0448\u0438', -1, 1),
  new Among('\u0438\u0432\u0448\u0438', 3, 2),
  new Among('\u044B\u0432\u0448\u0438', 3, 2),
  new Among('\u0432\u0448\u0438\u0441\u044C', -1, 1),
  new Among('\u0438\u0432\u0448\u0438\u0441\u044C', 6, 2),
  new Among('\u044B\u0432\u0448\u0438\u0441\u044C', 6, 2)
];

StemmerRu.a_1 = [
  new Among('\u0435\u0435', -1, 1),
  new Among('\u0438\u0435', -1, 1),
  new Among('\u043E\u0435', -1, 1),
  new Among('\u044B\u0435', -1, 1),
  new Among('\u0438\u043C\u0438', -1, 1),
  new Among('\u044B\u043C\u0438', -1, 1),
  new Among('\u0435\u0439', -1, 1),
  new Among('\u0438\u0439', -1, 1),
  new Among('\u043E\u0439', -1, 1),
  new Among('\u044B\u0439', -1, 1),
  new Among('\u0435\u043C', -1, 1),
  new Among('\u0438\u043C', -1, 1),
  new Among('\u043E\u043C', -1, 1),
  new Among('\u044B\u043C', -1, 1),
  new Among('\u0435\u0433\u043E', -1, 1),
  new Among('\u043E\u0433\u043E', -1, 1),
  new Among('\u0435\u043C\u0443', -1, 1),
  new Among('\u043E\u043C\u0443', -1, 1),
  new Among('\u0438\u0445', -1, 1),
  new Among('\u044B\u0445', -1, 1),
  new Among('\u0435\u044E', -1, 1),
  new Among('\u043E\u044E', -1, 1),
  new Among('\u0443\u044E', -1, 1),
  new Among('\u044E\u044E', -1, 1),
  new Among('\u0430\u044F', -1, 1),
  new Among('\u044F\u044F', -1, 1)
];

StemmerRu.a_2 = [
  new Among('\u0435\u043C', -1, 1),
  new Among('\u043D\u043D', -1, 1),
  new Among('\u0432\u0448', -1, 1),
  new Among('\u0438\u0432\u0448', 2, 2),
  new Among('\u044B\u0432\u0448', 2, 2),
  new Among('\u0449', -1, 1),
  new Among('\u044E\u0449', 5, 1),
  new Among('\u0443\u044E\u0449', 6, 2)
];

StemmerRu.a_3 = [
  new Among('\u0441\u044C', -1, 1),
  new Among('\u0441\u044F', -1, 1)
];

StemmerRu.a_4 = [
  new Among('\u043B\u0430', -1, 1),
  new Among('\u0438\u043B\u0430', 0, 2),
  new Among('\u044B\u043B\u0430', 0, 2),
  new Among('\u043D\u0430', -1, 1),
  new Among('\u0435\u043D\u0430', 3, 2),
  new Among('\u0435\u0442\u0435', -1, 1),
  new Among('\u0438\u0442\u0435', -1, 2),
  new Among('\u0439\u0442\u0435', -1, 1),
  new Among('\u0435\u0439\u0442\u0435', 7, 2),
  new Among('\u0443\u0439\u0442\u0435', 7, 2),
  new Among('\u043B\u0438', -1, 1),
  new Among('\u0438\u043B\u0438', 10, 2),
  new Among('\u044B\u043B\u0438', 10, 2),
  new Among('\u0439', -1, 1),
  new Among('\u0435\u0439', 13, 2),
  new Among('\u0443\u0439', 13, 2),
  new Among('\u043B', -1, 1),
  new Among('\u0438\u043B', 16, 2),
  new Among('\u044B\u043B', 16, 2),
  new Among('\u0435\u043C', -1, 1),
  new Among('\u0438\u043C', -1, 2),
  new Among('\u044B\u043C', -1, 2),
  new Among('\u043D', -1, 1),
  new Among('\u0435\u043D', 22, 2),
  new Among('\u043B\u043E', -1, 1),
  new Among('\u0438\u043B\u043E', 24, 2),
  new Among('\u044B\u043B\u043E', 24, 2),
  new Among('\u043D\u043E', -1, 1),
  new Among('\u0435\u043D\u043E', 27, 2),
  new Among('\u043D\u043D\u043E', 27, 1),
  new Among('\u0435\u0442', -1, 1),
  new Among('\u0443\u0435\u0442', 30, 2),
  new Among('\u0438\u0442', -1, 2),
  new Among('\u044B\u0442', -1, 2),
  new Among('\u044E\u0442', -1, 1),
  new Among('\u0443\u044E\u0442', 34, 2),
  new Among('\u044F\u0442', -1, 2),
  new Among('\u043D\u044B', -1, 1),
  new Among('\u0435\u043D\u044B', 37, 2),
  new Among('\u0442\u044C', -1, 1),
  new Among('\u0438\u0442\u044C', 39, 2),
  new Among('\u044B\u0442\u044C', 39, 2),
  new Among('\u0435\u0448\u044C', -1, 1),
  new Among('\u0438\u0448\u044C', -1, 2),
  new Among('\u044E', -1, 2),
  new Among('\u0443\u044E', 44, 2)
];

StemmerRu.a_5 = [
  new Among('\u0430', -1, 1),
  new Among('\u0435\u0432', -1, 1),
  new Among('\u043E\u0432', -1, 1),
  new Among('\u0435', -1, 1),
  new Among('\u0438\u0435', 3, 1),
  new Among('\u044C\u0435', 3, 1),
  new Among('\u0438', -1, 1),
  new Among('\u0435\u0438', 6, 1),
  new Among('\u0438\u0438', 6, 1),
  new Among('\u0430\u043C\u0438', 6, 1),
  new Among('\u044F\u043C\u0438', 6, 1),
  new Among('\u0438\u044F\u043C\u0438', 10, 1),
  new Among('\u0439', -1, 1),
  new Among('\u0435\u0439', 12, 1),
  new Among('\u0438\u0435\u0439', 13, 1),
  new Among('\u0438\u0439', 12, 1),
  new Among('\u043E\u0439', 12, 1),
  new Among('\u0430\u043C', -1, 1),
  new Among('\u0435\u043C', -1, 1),
  new Among('\u0438\u0435\u043C', 18, 1),
  new Among('\u043E\u043C', -1, 1),
  new Among('\u044F\u043C', -1, 1),
  new Among('\u0438\u044F\u043C', 21, 1),
  new Among('\u043E', -1, 1),
  new Among('\u0443', -1, 1),
  new Among('\u0430\u0445', -1, 1),
  new Among('\u044F\u0445', -1, 1),
  new Among('\u0438\u044F\u0445', 26, 1),
  new Among('\u044B', -1, 1),
  new Among('\u044C', -1, 1),
  new Among('\u044E', -1, 1),
  new Among('\u0438\u044E', 30, 1),
  new Among('\u044C\u044E', 30, 1),
  new Among('\u044F', -1, 1),
  new Among('\u0438\u044F', 33, 1),
  new Among('\u044C\u044F', 33, 1)
];

StemmerRu.a_6 = [
  new Among('\u043E\u0441\u0442', -1, 1),
  new Among('\u043E\u0441\u0442\u044C', -1, 1)
];

StemmerRu.a_7 = [
  new Among('\u0435\u0439\u0448\u0435', -1, 1),
  new Among('\u043D', -1, 2),
  new Among('\u0435\u0439\u0448', -1, 1),
  new Among('\u044C', -1, 3)
];

StemmerRu.g_v = [33, 65, 8, 232];

module.exports = StemmerRu;

