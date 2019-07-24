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

const BaseStemmer = require('./base-stemmer');
const Among = require('./among');

class FinnishStemmer extends BaseStemmer {
  constructor(tokenizer) {
    super(tokenizer);
    this.B_ending_removed = false;
    this.S_x = '';
    this.I_p2 = 0;
    this.I_p1 = 0;
  }

  copy_from(other) {
    this.B_ending_removed = other.B_ending_removed;
    this.S_x = other.S_x;
    this.I_p2 = other.I_p2;
    this.I_p1 = other.I_p1;
    super.copy_from(other);
  }

  r_mark_regions() {
    let v_1;
    let v_3;
    // (, line 41
    this.I_p1 = this.limit;
    this.I_p2 = this.limit;
    // goto, line 46
    golab0: while (true) {
      v_1 = this.cursor;
      let lab1 = true;
      while (lab1 == true) {
        lab1 = false;
        if (!this.in_grouping(FinnishStemmer.g_V1, 97, 246)) {
          break;
        }
        this.cursor = v_1;
        break golab0;
      }
      this.cursor = v_1;
      if (this.cursor >= this.limit) {
        return false;
      }
      this.cursor++;
    }
    // gopast, line 46
    golab2: while (true) {
      let lab3 = true;
      while (lab3 == true) {
        lab3 = false;
        if (!this.out_grouping(FinnishStemmer.g_V1, 97, 246)) {
          break;
        }
        break golab2;
      }
      if (this.cursor >= this.limit) {
        return false;
      }
      this.cursor++;
    }
    // setmark p1, line 46
    this.I_p1 = this.cursor;
    // goto, line 47
    golab4: while (true) {
      v_3 = this.cursor;
      let lab5 = true;
      while (lab5 == true) {
        lab5 = false;
        if (!this.in_grouping(FinnishStemmer.g_V1, 97, 246)) {
          break;
        }
        this.cursor = v_3;
        break golab4;
      }
      this.cursor = v_3;
      if (this.cursor >= this.limit) {
        return false;
      }
      this.cursor++;
    }
    // gopast, line 47
    golab6: while (true) {
      let lab7 = true;
      while (lab7 == true) {
        lab7 = false;
        if (!this.out_grouping(FinnishStemmer.g_V1, 97, 246)) {
          break;
        }
        break golab6;
      }
      if (this.cursor >= this.limit) {
        return false;
      }
      this.cursor++;
    }
    // setmark p2, line 47
    this.I_p2 = this.cursor;
    return true;
  }

  r_R2() {
    if (!(this.I_p2 <= this.cursor)) {
      return false;
    }
    return true;
  }

  r_particle_etc() {
    let among_var;
    let v_1;
    let v_2;
    // (, line 54
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
    // [, line 55
    this.ket = this.cursor;
    // substring, line 55
    among_var = this.find_among_b(FinnishStemmer.a_0, 10);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 55
    this.bra = this.cursor;
    this.limit_backward = v_2;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 62
        if (!this.in_grouping_b(FinnishStemmer.g_particle_end, 97, 246)) {
          return false;
        }
        break;
      case 2:
        // (, line 64
        // call R2, line 64
        if (!this.r_R2()) {
          return false;
        }
        break;
    }
    // delete, line 66
    if (!this.slice_del()) {
      return false;
    }
    return true;
  }

  r_possessive() {
    let among_var;
    let v_1;
    let v_2;
    let v_3;
    // (, line 68
    // setlimit, line 69
    v_1 = this.limit - this.cursor;
    // tomark, line 69
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 69
    // [, line 69
    this.ket = this.cursor;
    // substring, line 69
    among_var = this.find_among_b(FinnishStemmer.a_4, 9);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 69
    this.bra = this.cursor;
    this.limit_backward = v_2;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 72
        // not, line 72
        {
          v_3 = this.limit - this.cursor;
          let lab0 = true;
          while (lab0 == true) {
            lab0 = false;
            // literal, line 72
            if (!this.eq_s_b(1, 'k')) {
              break;
            }
            return false;
          }
          this.cursor = this.limit - v_3;
        }
        // delete, line 72
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 74
        // delete, line 74
        if (!this.slice_del()) {
          return false;
        }
        // [, line 74
        this.ket = this.cursor;
        // literal, line 74
        if (!this.eq_s_b(3, 'kse')) {
          return false;
        }
        // ], line 74
        this.bra = this.cursor;
        // <-, line 74
        if (!this.slice_from('ksi')) {
          return false;
        }
        break;
      case 3:
        // (, line 78
        // delete, line 78
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 4:
        // (, line 81
        // among, line 81
        if (this.find_among_b(FinnishStemmer.a_1, 6) == 0) {
          return false;
        }
        // delete, line 81
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 5:
        // (, line 83
        // among, line 83
        if (this.find_among_b(FinnishStemmer.a_2, 6) == 0) {
          return false;
        }
        // delete, line 84
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 6:
        // (, line 86
        // among, line 86
        if (this.find_among_b(FinnishStemmer.a_3, 2) == 0) {
          return false;
        }
        // delete, line 86
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    return true;
  }

  r_LONG() {
    // among, line 91
    if (this.find_among_b(FinnishStemmer.a_5, 7) == 0) {
      return false;
    }
    return true;
  }

  r_VI() {
    // (, line 93
    // literal, line 93
    if (!this.eq_s_b(1, 'i')) {
      return false;
    }
    if (!this.in_grouping_b(FinnishStemmer.g_V2, 97, 246)) {
      return false;
    }
    return true;
  }

  r_case_ending() {
    let among_var;
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    let v_5;
    // (, line 95
    // setlimit, line 96
    v_1 = this.limit - this.cursor;
    // tomark, line 96
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 96
    // [, line 96
    this.ket = this.cursor;
    // substring, line 96
    among_var = this.find_among_b(FinnishStemmer.a_6, 30);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 96
    this.bra = this.cursor;
    this.limit_backward = v_2;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 98
        // literal, line 98
        if (!this.eq_s_b(1, 'a')) {
          return false;
        }
        break;
      case 2:
        // (, line 99
        // literal, line 99
        if (!this.eq_s_b(1, 'e')) {
          return false;
        }
        break;
      case 3:
        // (, line 100
        // literal, line 100
        if (!this.eq_s_b(1, 'i')) {
          return false;
        }
        break;
      case 4:
        // (, line 101
        // literal, line 101
        if (!this.eq_s_b(1, 'o')) {
          return false;
        }
        break;
      case 5:
        // (, line 102
        // literal, line 102
        if (!this.eq_s_b(1, '\u00E4')) {
          return false;
        }
        break;
      case 6:
        // (, line 103
        // literal, line 103
        if (!this.eq_s_b(1, '\u00F6')) {
          return false;
        }
        break;
      case 7:
        // (, line 111
        // try, line 111
        v_3 = this.limit - this.cursor;
        var lab0 = true;
        lab0: while (lab0 == true) {
          lab0 = false;
          // (, line 111
          // and, line 113
          v_4 = this.limit - this.cursor;
          // or, line 112
          let lab1 = true;
          lab1: while (lab1 == true) {
            lab1 = false;
            v_5 = this.limit - this.cursor;
            let lab2 = true;
            while (lab2 == true) {
              lab2 = false;
              // call LONG, line 111
              if (!this.r_LONG()) {
                break;
              }
              break lab1;
            }
            this.cursor = this.limit - v_5;
            // literal, line 112
            if (!this.eq_s_b(2, 'ie')) {
              this.cursor = this.limit - v_3;
              break lab0;
            }
          }
          this.cursor = this.limit - v_4;
          // next, line 113
          if (this.cursor <= this.limit_backward) {
            this.cursor = this.limit - v_3;
            break;
          }
          this.cursor--;
          // ], line 113
          this.bra = this.cursor;
        }
        break;
      case 8:
        // (, line 119
        if (!this.in_grouping_b(FinnishStemmer.g_V1, 97, 246)) {
          return false;
        }
        if (!this.out_grouping_b(FinnishStemmer.g_V1, 97, 246)) {
          return false;
        }
        break;
      case 9:
        // (, line 121
        // literal, line 121
        if (!this.eq_s_b(1, 'e')) {
          return false;
        }
        break;
    }
    // delete, line 138
    if (!this.slice_del()) {
      return false;
    }
    // set ending_removed, line 139
    this.B_ending_removed = true;
    return true;
  }

  r_other_endings() {
    let among_var;
    let v_1;
    let v_2;
    let v_3;
    // (, line 141
    // setlimit, line 142
    v_1 = this.limit - this.cursor;
    // tomark, line 142
    if (this.cursor < this.I_p2) {
      return false;
    }
    this.cursor = this.I_p2;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 142
    // [, line 142
    this.ket = this.cursor;
    // substring, line 142
    among_var = this.find_among_b(FinnishStemmer.a_7, 14);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 142
    this.bra = this.cursor;
    this.limit_backward = v_2;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 146
        // not, line 146
        {
          v_3 = this.limit - this.cursor;
          let lab0 = true;
          while (lab0 == true) {
            lab0 = false;
            // literal, line 146
            if (!this.eq_s_b(2, 'po')) {
              break;
            }
            return false;
          }
          this.cursor = this.limit - v_3;
        }
        break;
    }
    // delete, line 151
    if (!this.slice_del()) {
      return false;
    }
    return true;
  }

  r_i_plural() {
    let v_1;
    let v_2;
    // (, line 153
    // setlimit, line 154
    v_1 = this.limit - this.cursor;
    // tomark, line 154
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 154
    // [, line 154
    this.ket = this.cursor;
    // substring, line 154
    if (this.find_among_b(FinnishStemmer.a_8, 2) == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 154
    this.bra = this.cursor;
    this.limit_backward = v_2;
    // delete, line 158
    if (!this.slice_del()) {
      return false;
    }
    return true;
  }

  r_t_plural() {
    let among_var;
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    let v_5;
    let v_6;
    // (, line 160
    // setlimit, line 161
    v_1 = this.limit - this.cursor;
    // tomark, line 161
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 161
    // [, line 162
    this.ket = this.cursor;
    // literal, line 162
    if (!this.eq_s_b(1, 't')) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 162
    this.bra = this.cursor;
    // test, line 162
    v_3 = this.limit - this.cursor;
    if (!this.in_grouping_b(FinnishStemmer.g_V1, 97, 246)) {
      this.limit_backward = v_2;
      return false;
    }
    this.cursor = this.limit - v_3;
    // delete, line 163
    if (!this.slice_del()) {
      return false;
    }
    this.limit_backward = v_2;
    // setlimit, line 165
    v_4 = this.limit - this.cursor;
    // tomark, line 165
    if (this.cursor < this.I_p2) {
      return false;
    }
    this.cursor = this.I_p2;
    v_5 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_4;
    // (, line 165
    // [, line 165
    this.ket = this.cursor;
    // substring, line 165
    among_var = this.find_among_b(FinnishStemmer.a_9, 2);
    if (among_var == 0) {
      this.limit_backward = v_5;
      return false;
    }
    // ], line 165
    this.bra = this.cursor;
    this.limit_backward = v_5;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 167
        // not, line 167
        {
          v_6 = this.limit - this.cursor;
          let lab0 = true;
          while (lab0 == true) {
            lab0 = false;
            // literal, line 167
            if (!this.eq_s_b(2, 'po')) {
              break;
            }
            return false;
          }
          this.cursor = this.limit - v_6;
        }
        break;
    }
    // delete, line 170
    if (!this.slice_del()) {
      return false;
    }
    return true;
  }

  r_tidy() {
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    let v_5;
    let v_6;
    let v_7;
    let v_8;
    let v_9;
    // (, line 172
    // setlimit, line 173
    v_1 = this.limit - this.cursor;
    // tomark, line 173
    if (this.cursor < this.I_p1) {
      return false;
    }
    this.cursor = this.I_p1;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 173
    // do, line 174
    v_3 = this.limit - this.cursor;
    let lab0 = true;
    while (lab0 == true) {
      lab0 = false;
      // (, line 174
      // and, line 174
      v_4 = this.limit - this.cursor;
      // call LONG, line 174
      if (!this.r_LONG()) {
        break;
      }
      this.cursor = this.limit - v_4;
      // (, line 174
      // [, line 174
      this.ket = this.cursor;
      // next, line 174
      if (this.cursor <= this.limit_backward) {
        break;
      }
      this.cursor--;
      // ], line 174
      this.bra = this.cursor;
      // delete, line 174
      if (!this.slice_del()) {
        return false;
      }
    }
    this.cursor = this.limit - v_3;
    // do, line 175
    v_5 = this.limit - this.cursor;
    let lab1 = true;
    while (lab1 == true) {
      lab1 = false;
      // (, line 175
      // [, line 175
      this.ket = this.cursor;
      if (!this.in_grouping_b(FinnishStemmer.g_AEI, 97, 228)) {
        break;
      }
      // ], line 175
      this.bra = this.cursor;
      if (!this.out_grouping_b(FinnishStemmer.g_V1, 97, 246)) {
        break;
      }
      // delete, line 175
      if (!this.slice_del()) {
        return false;
      }
    }
    this.cursor = this.limit - v_5;
    // do, line 176
    v_6 = this.limit - this.cursor;
    let lab2 = true;
    lab2: while (lab2 == true) {
      lab2 = false;
      // (, line 176
      // [, line 176
      this.ket = this.cursor;
      // literal, line 176
      if (!this.eq_s_b(1, 'j')) {
        break;
      }
      // ], line 176
      this.bra = this.cursor;
      // or, line 176
      let lab3 = true;
      lab3: while (lab3 == true) {
        lab3 = false;
        v_7 = this.limit - this.cursor;
        let lab4 = true;
        while (lab4 == true) {
          lab4 = false;
          // literal, line 176
          if (!this.eq_s_b(1, 'o')) {
            break;
          }
          break lab3;
        }
        this.cursor = this.limit - v_7;
        // literal, line 176
        if (!this.eq_s_b(1, 'u')) {
          break lab2;
        }
      }
      // delete, line 176
      if (!this.slice_del()) {
        return false;
      }
    }
    this.cursor = this.limit - v_6;
    // do, line 177
    v_8 = this.limit - this.cursor;
    let lab5 = true;
    while (lab5 == true) {
      lab5 = false;
      // (, line 177
      // [, line 177
      this.ket = this.cursor;
      // literal, line 177
      if (!this.eq_s_b(1, 'o')) {
        break;
      }
      // ], line 177
      this.bra = this.cursor;
      // literal, line 177
      if (!this.eq_s_b(1, 'j')) {
        break;
      }
      // delete, line 177
      if (!this.slice_del()) {
        return false;
      }
    }
    this.cursor = this.limit - v_8;
    this.limit_backward = v_2;
    // goto, line 179
    golab6: while (true) {
      v_9 = this.limit - this.cursor;
      let lab7 = true;
      while (lab7 == true) {
        lab7 = false;
        if (!this.out_grouping_b(FinnishStemmer.g_V1, 97, 246)) {
          break;
        }
        this.cursor = this.limit - v_9;
        break golab6;
      }
      this.cursor = this.limit - v_9;
      if (this.cursor <= this.limit_backward) {
        return false;
      }
      this.cursor--;
    }
    // [, line 179
    this.ket = this.cursor;
    // next, line 179
    if (this.cursor <= this.limit_backward) {
      return false;
    }
    this.cursor--;
    // ], line 179
    this.bra = this.cursor;
    // -> x, line 179
    this.S_x = this.slice_to(this.S_x);
    if (this.S_x == '') {
      return false;
    }
    // name x, line 179
    if (!this.eq_v_b(this.S_x)) {
      return false;
    }
    // delete, line 179
    if (!this.slice_del()) {
      return false;
    }
    return true;
  }

  stem() {
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    let v_5;
    let v_6;
    let v_7;
    let v_8;
    let v_9;
    // (, line 183
    // do, line 185
    v_1 = this.cursor;
    let lab0 = true;
    while (lab0 == true) {
      lab0 = false;
      // call mark_regions, line 185
      if (!this.r_mark_regions()) {
        break;
      }
    }
    this.cursor = v_1;
    // unset ending_removed, line 186
    this.B_ending_removed = false;
    // backwards, line 187
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    // (, line 187
    // do, line 188
    v_2 = this.limit - this.cursor;
    let lab1 = true;
    while (lab1 == true) {
      lab1 = false;
      // call particle_etc, line 188
      if (!this.r_particle_etc()) {
        break;
      }
    }
    this.cursor = this.limit - v_2;
    // do, line 189
    v_3 = this.limit - this.cursor;
    let lab2 = true;
    while (lab2 == true) {
      lab2 = false;
      // call possessive, line 189
      if (!this.r_possessive()) {
        break;
      }
    }
    this.cursor = this.limit - v_3;
    // do, line 190
    v_4 = this.limit - this.cursor;
    let lab3 = true;
    while (lab3 == true) {
      lab3 = false;
      // call case_ending, line 190
      if (!this.r_case_ending()) {
        break;
      }
    }
    this.cursor = this.limit - v_4;
    // do, line 191
    v_5 = this.limit - this.cursor;
    let lab4 = true;
    while (lab4 == true) {
      lab4 = false;
      // call other_endings, line 191
      if (!this.r_other_endings()) {
        break;
      }
    }
    this.cursor = this.limit - v_5;
    // or, line 192
    let lab5 = true;
    lab5: while (lab5 == true) {
      lab5 = false;
      v_6 = this.limit - this.cursor;
      let lab6 = true;
      while (lab6 == true) {
        lab6 = false;
        // (, line 192
        // Boolean test ending_removed, line 192
        if (!this.B_ending_removed) {
          break;
        }
        // do, line 192
        v_7 = this.limit - this.cursor;
        let lab7 = true;
        while (lab7 == true) {
          lab7 = false;
          // call i_plural, line 192
          if (!this.r_i_plural()) {
            break;
          }
        }
        this.cursor = this.limit - v_7;
        break lab5;
      }
      this.cursor = this.limit - v_6;
      // do, line 192
      v_8 = this.limit - this.cursor;
      let lab8 = true;
      while (lab8 == true) {
        lab8 = false;
        // call t_plural, line 192
        if (!this.r_t_plural()) {
          break;
        }
      }
      this.cursor = this.limit - v_8;
    }
    // do, line 193
    v_9 = this.limit - this.cursor;
    let lab9 = true;
    while (lab9 == true) {
      lab9 = false;
      // call tidy, line 193
      if (!this.r_tidy()) {
        break;
      }
    }
    this.cursor = this.limit - v_9;
    this.cursor = this.limit_backward;
    return true;
  }
}

FinnishStemmer.methodObject = new FinnishStemmer();
FinnishStemmer.a_0 = [
  new Among('pa', -1, 1),
  new Among('sti', -1, 2),
  new Among('kaan', -1, 1),
  new Among('han', -1, 1),
  new Among('kin', -1, 1),
  new Among('h\u00E4n', -1, 1),
  new Among('k\u00E4\u00E4n', -1, 1),
  new Among('ko', -1, 1),
  new Among('p\u00E4', -1, 1),
  new Among('k\u00F6', -1, 1)
];

FinnishStemmer.a_1 = [
  new Among('lla', -1, -1),
  new Among('na', -1, -1),
  new Among('ssa', -1, -1),
  new Among('ta', -1, -1),
  new Among('lta', 3, -1),
  new Among('sta', 3, -1)
];

FinnishStemmer.a_2 = [
  new Among('ll\u00E4', -1, -1),
  new Among('n\u00E4', -1, -1),
  new Among('ss\u00E4', -1, -1),
  new Among('t\u00E4', -1, -1),
  new Among('lt\u00E4', 3, -1),
  new Among('st\u00E4', 3, -1)
];

FinnishStemmer.a_3 = [new Among('lle', -1, -1), new Among('ine', -1, -1)];

FinnishStemmer.a_4 = [
  new Among('nsa', -1, 3),
  new Among('mme', -1, 3),
  new Among('nne', -1, 3),
  new Among('ni', -1, 2),
  new Among('si', -1, 1),
  new Among('an', -1, 4),
  new Among('en', -1, 6),
  new Among('\u00E4n', -1, 5),
  new Among('ns\u00E4', -1, 3)
];

FinnishStemmer.a_5 = [
  new Among('aa', -1, -1),
  new Among('ee', -1, -1),
  new Among('ii', -1, -1),
  new Among('oo', -1, -1),
  new Among('uu', -1, -1),
  new Among('\u00E4\u00E4', -1, -1),
  new Among('\u00F6\u00F6', -1, -1)
];

FinnishStemmer.a_6 = [
  new Among('a', -1, 8),
  new Among('lla', 0, -1),
  new Among('na', 0, -1),
  new Among('ssa', 0, -1),
  new Among('ta', 0, -1),
  new Among('lta', 4, -1),
  new Among('sta', 4, -1),
  new Among('tta', 4, 9),
  new Among('lle', -1, -1),
  new Among('ine', -1, -1),
  new Among('ksi', -1, -1),
  new Among('n', -1, 7),
  new Among('han', 11, 1),
  new Among(
    'den',
    11,
    -1,
    instance => instance.r_VI(),
    FinnishStemmer.methodObject
  ),
  new Among(
    'seen',
    11,
    -1,
    instance => instance.r_LONG(),
    FinnishStemmer.methodObject
  ),
  new Among('hen', 11, 2),
  new Among(
    'tten',
    11,
    -1,
    instance => instance.r_VI(),
    FinnishStemmer.methodObject
  ),
  new Among('hin', 11, 3),
  new Among(
    'siin',
    11,
    -1,
    instance => instance.r_VI(),
    FinnishStemmer.methodObject
  ),
  new Among('hon', 11, 4),
  new Among('h\u00E4n', 11, 5),
  new Among('h\u00F6n', 11, 6),
  new Among('\u00E4', -1, 8),
  new Among('ll\u00E4', 22, -1),
  new Among('n\u00E4', 22, -1),
  new Among('ss\u00E4', 22, -1),
  new Among('t\u00E4', 22, -1),
  new Among('lt\u00E4', 26, -1),
  new Among('st\u00E4', 26, -1),
  new Among('tt\u00E4', 26, 9)
];

FinnishStemmer.a_7 = [
  new Among('eja', -1, -1),
  new Among('mma', -1, 1),
  new Among('imma', 1, -1),
  new Among('mpa', -1, 1),
  new Among('impa', 3, -1),
  new Among('mmi', -1, 1),
  new Among('immi', 5, -1),
  new Among('mpi', -1, 1),
  new Among('impi', 7, -1),
  new Among('ej\u00E4', -1, -1),
  new Among('mm\u00E4', -1, 1),
  new Among('imm\u00E4', 10, -1),
  new Among('mp\u00E4', -1, 1),
  new Among('imp\u00E4', 12, -1)
];

FinnishStemmer.a_8 = [new Among('i', -1, -1), new Among('j', -1, -1)];

FinnishStemmer.a_9 = [new Among('mma', -1, 1), new Among('imma', 0, -1)];

FinnishStemmer.g_AEI = [17, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8];

FinnishStemmer.g_V1 = [
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
  8,
  0,
  32
];

FinnishStemmer.g_V2 = [
  17,
  65,
  16,
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
  0,
  8,
  0,
  32
];

FinnishStemmer.g_particle_end = [
  17,
  97,
  24,
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
  8,
  0,
  32
];

module.exports = FinnishStemmer;
