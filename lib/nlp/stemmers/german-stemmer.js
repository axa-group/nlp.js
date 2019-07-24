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

class GermanStemmer extends BaseStemmer {
  constructor(tokenizer) {
    super(tokenizer);

    this.I_x = 0;
    this.I_p2 = 0;
    this.I_p1 = 0;
  }

  copy_from(other) {
    this.I_x = other.I_x;
    this.I_p2 = other.I_p2;
    this.I_p1 = other.I_p1;
    super.copy_from(other);
  }

  r_prelude() {
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    let v_5;
    let v_6;
    // (, line 33
    // test, line 35
    v_1 = this.cursor;
    // repeat, line 35
    replab0: while (true) {
      v_2 = this.cursor;
      let lab1 = true;
      lab1: while (lab1 == true) {
        lab1 = false;
        // (, line 35
        // or, line 38
        let lab2 = true;
        lab2: while (lab2 == true) {
          lab2 = false;
          v_3 = this.cursor;
          let lab3 = true;
          while (lab3 == true) {
            lab3 = false;
            // (, line 36
            // [, line 37
            this.bra = this.cursor;
            // literal, line 37
            if (!this.eq_s(1, '\u00DF')) {
              break;
            }
            // ], line 37
            this.ket = this.cursor;
            // <-, line 37
            if (!this.slice_from('ss')) {
              return false;
            }
            break lab2;
          }
          this.cursor = v_3;
          // next, line 38
          if (this.cursor >= this.limit) {
            break lab1;
          }
          this.cursor++;
        }
        continue replab0;
      }
      this.cursor = v_2;
      break;
    }
    this.cursor = v_1;
    // repeat, line 41
    replab4: while (true) {
      v_4 = this.cursor;
      let lab5 = true;
      lab5: while (lab5 == true) {
        lab5 = false;
        // goto, line 41
        golab6: while (true) {
          v_5 = this.cursor;
          let lab7 = true;
          lab7: while (lab7 == true) {
            lab7 = false;
            // (, line 41
            if (!this.in_grouping(GermanStemmer.g_v, 97, 252)) {
              break;
            }
            // [, line 42
            this.bra = this.cursor;
            // or, line 42
            let lab8 = true;
            lab8: while (lab8 == true) {
              lab8 = false;
              v_6 = this.cursor;
              let lab9 = true;
              while (lab9 == true) {
                lab9 = false;
                // (, line 42
                // literal, line 42
                if (!this.eq_s(1, 'u')) {
                  break;
                }
                // ], line 42
                this.ket = this.cursor;
                if (!this.in_grouping(GermanStemmer.g_v, 97, 252)) {
                  break;
                }
                // <-, line 42
                if (!this.slice_from('U')) {
                  return false;
                }
                break lab8;
              }
              this.cursor = v_6;
              // (, line 43
              // literal, line 43
              if (!this.eq_s(1, 'y')) {
                break lab7;
              }
              // ], line 43
              this.ket = this.cursor;
              if (!this.in_grouping(GermanStemmer.g_v, 97, 252)) {
                break lab7;
              }
              // <-, line 43
              if (!this.slice_from('Y')) {
                return false;
              }
            }
            this.cursor = v_5;
            break golab6;
          }
          this.cursor = v_5;
          if (this.cursor >= this.limit) {
            break lab5;
          }
          this.cursor++;
        }
        continue replab4;
      }
      this.cursor = v_4;
      break;
    }
    return true;
  }

  r_mark_regions() {
    let v_1;
    // (, line 47
    this.I_p1 = this.limit;
    this.I_p2 = this.limit;
    // test, line 52
    v_1 = this.cursor;
    // (, line 52
    // hop, line 52
    {
      const c = this.cursor + 3;
      if (c < 0 || c > this.limit) {
        return false;
      }
      this.cursor = c;
    }
    // setmark x, line 52
    this.I_x = this.cursor;
    this.cursor = v_1;
    // gopast, line 54
    golab0: while (true) {
      let lab1 = true;
      while (lab1 == true) {
        lab1 = false;
        if (!this.in_grouping(GermanStemmer.g_v, 97, 252)) {
          break;
        }
        break golab0;
      }
      if (this.cursor >= this.limit) {
        return false;
      }
      this.cursor++;
    }
    // gopast, line 54
    golab2: while (true) {
      let lab3 = true;
      while (lab3 == true) {
        lab3 = false;
        if (!this.out_grouping(GermanStemmer.g_v, 97, 252)) {
          break;
        }
        break golab2;
      }
      if (this.cursor >= this.limit) {
        return false;
      }
      this.cursor++;
    }
    // setmark p1, line 54
    this.I_p1 = this.cursor;
    // try, line 55
    let lab4 = true;
    while (lab4 == true) {
      lab4 = false;
      // (, line 55
      if (!(this.I_p1 < this.I_x)) {
        break;
      }
      this.I_p1 = this.I_x;
    }
    // gopast, line 56
    golab5: while (true) {
      let lab6 = true;
      while (lab6 == true) {
        lab6 = false;
        if (!this.in_grouping(GermanStemmer.g_v, 97, 252)) {
          break;
        }
        break golab5;
      }
      if (this.cursor >= this.limit) {
        return false;
      }
      this.cursor++;
    }
    // gopast, line 56
    golab7: while (true) {
      let lab8 = true;
      while (lab8 == true) {
        lab8 = false;
        if (!this.out_grouping(GermanStemmer.g_v, 97, 252)) {
          break;
        }
        break golab7;
      }
      if (this.cursor >= this.limit) {
        return false;
      }
      this.cursor++;
    }
    // setmark p2, line 56
    this.I_p2 = this.cursor;
    return true;
  }

  r_postlude() {
    let among_var;
    let v_1;
    // repeat, line 60
    replab0: while (true) {
      v_1 = this.cursor;
      let lab1 = true;
      lab1: while (lab1 == true) {
        lab1 = false;
        // (, line 60
        // [, line 62
        this.bra = this.cursor;
        // substring, line 62
        among_var = this.find_among(GermanStemmer.a_0, 6);
        if (among_var == 0) {
          break;
        }
        // ], line 62
        this.ket = this.cursor;
        switch (among_var) {
          case 0:
            break lab1;
          case 1:
            // (, line 63
            // <-, line 63
            if (!this.slice_from('y')) {
              return false;
            }
            break;
          case 2:
            // (, line 64
            // <-, line 64
            if (!this.slice_from('u')) {
              return false;
            }
            break;
          case 3:
            // (, line 65
            // <-, line 65
            if (!this.slice_from('a')) {
              return false;
            }
            break;
          case 4:
            // (, line 66
            // <-, line 66
            if (!this.slice_from('o')) {
              return false;
            }
            break;
          case 5:
            // (, line 67
            // <-, line 67
            if (!this.slice_from('u')) {
              return false;
            }
            break;
          case 6:
            // (, line 68
            // next, line 68
            if (this.cursor >= this.limit) {
              break lab1;
            }
            this.cursor++;
            break;
        }
        continue replab0;
      }
      this.cursor = v_1;
      break;
    }
    return true;
  }

  r_R1() {
    if (!(this.I_p1 <= this.cursor)) {
      return false;
    }
    return true;
  }

  r_R2() {
    if (!(this.I_p2 <= this.cursor)) {
      return false;
    }
    return true;
  }

  r_standard_suffix() {
    let among_var;
    var v_1;
    let v_2;
    let v_3;
    let v_4;
    let v_5;
    let v_6;
    let v_7;
    let v_8;
    let v_9;
    var v_1;
    // (, line 78
    // do, line 79
    v_1 = this.limit - this.cursor;
    let lab0 = true;
    lab0: while (lab0 == true) {
      lab0 = false;
      // (, line 79
      // [, line 80
      this.ket = this.cursor;
      // substring, line 80
      among_var = this.find_among_b(GermanStemmer.a_1, 7);
      if (among_var == 0) {
        break;
      }
      // ], line 80
      this.bra = this.cursor;
      // call R1, line 80
      if (!this.r_R1()) {
        break;
      }
      switch (among_var) {
        case 0:
          break lab0;
        case 1:
          // (, line 82
          // delete, line 82
          if (!this.slice_del()) {
            return false;
          }
          break;
        case 2:
          // (, line 85
          // delete, line 85
          if (!this.slice_del()) {
            return false;
          }
          // try, line 86
          v_2 = this.limit - this.cursor;
          var lab1 = true;
          while (lab1 == true) {
            lab1 = false;
            // (, line 86
            // [, line 86
            this.ket = this.cursor;
            // literal, line 86
            if (!this.eq_s_b(1, 's')) {
              this.cursor = this.limit - v_2;
              break;
            }
            // ], line 86
            this.bra = this.cursor;
            // literal, line 86
            if (!this.eq_s_b(3, 'nis')) {
              this.cursor = this.limit - v_2;
              break;
            }
            // delete, line 86
            if (!this.slice_del()) {
              return false;
            }
          }
          break;
        case 3:
          // (, line 89
          if (!this.in_grouping_b(GermanStemmer.g_s_ending, 98, 116)) {
            break lab0;
          }
          // delete, line 89
          if (!this.slice_del()) {
            return false;
          }
          break;
      }
    }
    this.cursor = this.limit - v_1;
    // do, line 93
    v_3 = this.limit - this.cursor;
    let lab2 = true;
    lab2: while (lab2 == true) {
      lab2 = false;
      // (, line 93
      // [, line 94
      this.ket = this.cursor;
      // substring, line 94
      among_var = this.find_among_b(GermanStemmer.a_2, 4);
      if (among_var == 0) {
        break;
      }
      // ], line 94
      this.bra = this.cursor;
      // call R1, line 94
      if (!this.r_R1()) {
        break;
      }
      switch (among_var) {
        case 0:
          break lab2;
        case 1:
          // (, line 96
          // delete, line 96
          if (!this.slice_del()) {
            return false;
          }
          break;
        case 2:
          // (, line 99
          if (!this.in_grouping_b(GermanStemmer.g_st_ending, 98, 116)) {
            break lab2;
          }
          // hop, line 99
          {
            const c = this.cursor - 3;
            if (this.limit_backward > c || c > this.limit) {
              break lab2;
            }
            this.cursor = c;
          }
          // delete, line 99
          if (!this.slice_del()) {
            return false;
          }
          break;
      }
    }
    this.cursor = this.limit - v_3;
    // do, line 103
    v_4 = this.limit - this.cursor;
    let lab3 = true;
    lab3: while (lab3 == true) {
      lab3 = false;
      // (, line 103
      // [, line 104
      this.ket = this.cursor;
      // substring, line 104
      among_var = this.find_among_b(GermanStemmer.a_4, 8);
      if (among_var == 0) {
        break;
      }
      // ], line 104
      this.bra = this.cursor;
      // call R2, line 104
      if (!this.r_R2()) {
        break;
      }
      switch (among_var) {
        case 0:
          break lab3;
        case 1:
          // (, line 106
          // delete, line 106
          if (!this.slice_del()) {
            return false;
          }
          // try, line 107
          v_5 = this.limit - this.cursor;
          var lab4 = true;
          lab4: while (lab4 == true) {
            lab4 = false;
            // (, line 107
            // [, line 107
            this.ket = this.cursor;
            // literal, line 107
            if (!this.eq_s_b(2, 'ig')) {
              this.cursor = this.limit - v_5;
              break;
            }
            // ], line 107
            this.bra = this.cursor;
            // not, line 107
            {
              v_6 = this.limit - this.cursor;
              let lab5 = true;
              while (lab5 == true) {
                lab5 = false;
                // literal, line 107
                if (!this.eq_s_b(1, 'e')) {
                  break;
                }
                this.cursor = this.limit - v_5;
                break lab4;
              }
              this.cursor = this.limit - v_6;
            }
            // call R2, line 107
            if (!this.r_R2()) {
              this.cursor = this.limit - v_5;
              break;
            }
            // delete, line 107
            if (!this.slice_del()) {
              return false;
            }
          }
          break;
        case 2:
          // (, line 110
          // not, line 110
          {
            v_7 = this.limit - this.cursor;
            let lab6 = true;
            while (lab6 == true) {
              lab6 = false;
              // literal, line 110
              if (!this.eq_s_b(1, 'e')) {
                break;
              }
              break lab3;
            }
            this.cursor = this.limit - v_7;
          }
          // delete, line 110
          if (!this.slice_del()) {
            return false;
          }
          break;
        case 3:
          // (, line 113
          // delete, line 113
          if (!this.slice_del()) {
            return false;
          }
          // try, line 114
          v_8 = this.limit - this.cursor;
          var lab7 = true;
          lab7: while (lab7 == true) {
            lab7 = false;
            // (, line 114
            // [, line 115
            this.ket = this.cursor;
            // or, line 115
            let lab8 = true;
            lab8: while (lab8 == true) {
              lab8 = false;
              v_9 = this.limit - this.cursor;
              let lab9 = true;
              while (lab9 == true) {
                lab9 = false;
                // literal, line 115
                if (!this.eq_s_b(2, 'er')) {
                  break;
                }
                break lab8;
              }
              this.cursor = this.limit - v_9;
              // literal, line 115
              if (!this.eq_s_b(2, 'en')) {
                this.cursor = this.limit - v_8;
                break lab7;
              }
            }
            // ], line 115
            this.bra = this.cursor;
            // call R1, line 115
            if (!this.r_R1()) {
              this.cursor = this.limit - v_8;
              break;
            }
            // delete, line 115
            if (!this.slice_del()) {
              return false;
            }
          }
          break;
        case 4:
          // (, line 119
          // delete, line 119
          if (!this.slice_del()) {
            return false;
          }
          // try, line 120
          var v_10 = this.limit - this.cursor;
          var lab10 = true;
          lab10: while (lab10 == true) {
            lab10 = false;
            // (, line 120
            // [, line 121
            this.ket = this.cursor;
            // substring, line 121
            among_var = this.find_among_b(GermanStemmer.a_3, 2);
            if (among_var == 0) {
              this.cursor = this.limit - v_10;
              break;
            }
            // ], line 121
            this.bra = this.cursor;
            // call R2, line 121
            if (!this.r_R2()) {
              this.cursor = this.limit - v_10;
              break;
            }
            switch (among_var) {
              case 0:
                this.cursor = this.limit - v_10;
                break lab10;
              case 1:
                // (, line 123
                // delete, line 123
                if (!this.slice_del()) {
                  return false;
                }
                break;
            }
          }
          break;
      }
    }
    this.cursor = this.limit - v_4;
    return true;
  }

  stem() {
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    // (, line 133
    // do, line 134
    v_1 = this.cursor;
    let lab0 = true;
    while (lab0 == true) {
      lab0 = false;
      // call prelude, line 134
      if (!this.r_prelude()) {
        break;
      }
    }
    this.cursor = v_1;
    // do, line 135
    v_2 = this.cursor;
    let lab1 = true;
    while (lab1 == true) {
      lab1 = false;
      // call mark_regions, line 135
      if (!this.r_mark_regions()) {
        break;
      }
    }
    this.cursor = v_2;
    // backwards, line 136
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    // do, line 137
    v_3 = this.limit - this.cursor;
    let lab2 = true;
    while (lab2 == true) {
      lab2 = false;
      // call standard_suffix, line 137
      if (!this.r_standard_suffix()) {
        break;
      }
    }
    this.cursor = this.limit - v_3;
    this.cursor = this.limit_backward; // do, line 138
    v_4 = this.cursor;
    let lab3 = true;
    while (lab3 == true) {
      lab3 = false;
      // call postlude, line 138
      if (!this.r_postlude()) {
        break;
      }
    }
    this.cursor = v_4;
    return true;
  }
}

GermanStemmer.a_0 = [
  new Among('', -1, 6),
  new Among('U', 0, 2),
  new Among('Y', 0, 1),
  new Among('\u00E4', 0, 3),
  new Among('\u00F6', 0, 4),
  new Among('\u00FC', 0, 5)
];

GermanStemmer.a_1 = [
  new Among('e', -1, 2),
  new Among('em', -1, 1),
  new Among('en', -1, 2),
  new Among('ern', -1, 1),
  new Among('er', -1, 1),
  new Among('s', -1, 3),
  new Among('es', 5, 2)
];

GermanStemmer.a_2 = [
  new Among('en', -1, 1),
  new Among('er', -1, 1),
  new Among('st', -1, 2),
  new Among('est', 2, 1)
];

GermanStemmer.a_3 = [new Among('ig', -1, 1), new Among('lich', -1, 1)];

GermanStemmer.a_4 = [
  new Among('end', -1, 1),
  new Among('ig', -1, 2),
  new Among('ung', -1, 1),
  new Among('lich', -1, 3),
  new Among('isch', -1, 2),
  new Among('ik', -1, 2),
  new Among('heit', -1, 3),
  new Among('keit', -1, 4)
];

GermanStemmer.g_v = [
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
  32,
  8
];
GermanStemmer.g_s_ending = [117, 30, 5];
GermanStemmer.g_st_ending = [117, 30, 4];

module.exports = GermanStemmer;
