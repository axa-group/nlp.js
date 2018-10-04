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

const BaseStemmer = require('./base-stemmer');
const Among = require('./among');

class SpanishStemmer extends BaseStemmer {
  constructor(tokenizer) {
    super(tokenizer);

    this.I_p2 = 0;
    this.I_p1 = 0;
    this.I_pV = 0;
  }

  copy_from(other) {
    this.I_p2 = other.I_p2;
    this.I_p1 = other.I_p1;
    this.I_pV = other.I_pV;
    super.copy_from(other);
  }

  r_mark_regions() {
    let v_1;
    let v_2;
    let v_3;
    let v_6;
    let v_8;
    // (, line 31
    this.I_pV = this.limit;
    this.I_p1 = this.limit;
    this.I_p2 = this.limit;
    // do, line 37
    v_1 = this.cursor;
    let lab0 = true;
    lab0: while (lab0 == true) {
      lab0 = false;
      // (, line 37
      // or, line 39
      let lab1 = true;
      lab1: while (lab1 == true) {
        lab1 = false;
        v_2 = this.cursor;
        let lab2 = true;
        lab2: while (lab2 == true) {
          lab2 = false;
          // (, line 38
          if (!this.in_grouping(SpanishStemmer.g_v, 97, 252)) {
            break;
          }
          // or, line 38
          let lab3 = true;
          lab3: while (lab3 == true) {
            lab3 = false;
            v_3 = this.cursor;
            let lab4 = true;
            lab4: while (lab4 == true) {
              lab4 = false;
              // (, line 38
              if (!this.out_grouping(SpanishStemmer.g_v, 97, 252)) {
                break;
              }
              // gopast, line 38
              golab5: while (true) {
                let lab6 = true;
                while (lab6 == true) {
                  lab6 = false;
                  if (!this.in_grouping(SpanishStemmer.g_v, 97, 252)) {
                    break;
                  }
                  break golab5;
                }
                if (this.cursor >= this.limit) {
                  break lab4;
                }
                this.cursor++;
              }
              break lab3;
            }
            this.cursor = v_3;
            // (, line 38
            if (!this.in_grouping(SpanishStemmer.g_v, 97, 252)) {
              break lab2;
            }
            // gopast, line 38
            golab7: while (true) {
              let lab8 = true;
              while (lab8 == true) {
                lab8 = false;
                if (!this.out_grouping(SpanishStemmer.g_v, 97, 252)) {
                  break;
                }
                break golab7;
              }
              if (this.cursor >= this.limit) {
                break lab2;
              }
              this.cursor++;
            }
          }
          break lab1;
        }
        this.cursor = v_2;
        // (, line 40
        if (!this.out_grouping(SpanishStemmer.g_v, 97, 252)) {
          break lab0;
        }
        // or, line 40
        let lab9 = true;
        lab9: while (lab9 == true) {
          lab9 = false;
          v_6 = this.cursor;
          let lab10 = true;
          lab10: while (lab10 == true) {
            lab10 = false;
            // (, line 40
            if (!this.out_grouping(SpanishStemmer.g_v, 97, 252)) {
              break;
            }
            // gopast, line 40
            golab11: while (true) {
              let lab12 = true;
              while (lab12 == true) {
                lab12 = false;
                if (!this.in_grouping(SpanishStemmer.g_v, 97, 252)) {
                  break;
                }
                break golab11;
              }
              if (this.cursor >= this.limit) {
                break lab10;
              }
              this.cursor++;
            }
            break lab9;
          }
          this.cursor = v_6;
          // (, line 40
          if (!this.in_grouping(SpanishStemmer.g_v, 97, 252)) {
            break lab0;
          }
          // next, line 40
          if (this.cursor >= this.limit) {
            break lab0;
          }
          this.cursor++;
        }
      }
      // setmark pV, line 41
      this.I_pV = this.cursor;
    }
    this.cursor = v_1;
    // do, line 43
    v_8 = this.cursor;
    let lab13 = true;
    lab13: while (lab13 == true) {
      lab13 = false;
      // (, line 43
      // gopast, line 44
      golab14: while (true) {
        let lab15 = true;
        while (lab15 == true) {
          lab15 = false;
          if (!this.in_grouping(SpanishStemmer.g_v, 97, 252)) {
            break;
          }
          break golab14;
        }
        if (this.cursor >= this.limit) {
          break lab13;
        }
        this.cursor++;
      }
      // gopast, line 44
      golab16: while (true) {
        let lab17 = true;
        while (lab17 == true) {
          lab17 = false;
          if (!this.out_grouping(SpanishStemmer.g_v, 97, 252)) {
            break;
          }
          break golab16;
        }
        if (this.cursor >= this.limit) {
          break lab13;
        }
        this.cursor++;
      }
      // setmark p1, line 44
      this.I_p1 = this.cursor;
      // gopast, line 45
      golab18: while (true) {
        let lab19 = true;
        while (lab19 == true) {
          lab19 = false;
          if (!this.in_grouping(SpanishStemmer.g_v, 97, 252)) {
            break;
          }
          break golab18;
        }
        if (this.cursor >= this.limit) {
          break lab13;
        }
        this.cursor++;
      }
      // gopast, line 45
      golab20: while (true) {
        let lab21 = true;
        while (lab21 == true) {
          lab21 = false;
          if (!this.out_grouping(SpanishStemmer.g_v, 97, 252)) {
            break;
          }
          break golab20;
        }
        if (this.cursor >= this.limit) {
          break lab13;
        }
        this.cursor++;
      }
      // setmark p2, line 45
      this.I_p2 = this.cursor;
    }
    this.cursor = v_8;
    return true;
  }

  r_postlude() {
    let among_var;
    let v_1;
    // repeat, line 49
    replab0: while (true) {
      v_1 = this.cursor;
      let lab1 = true;
      lab1: while (lab1 == true) {
        lab1 = false;
        // (, line 49
        // [, line 50
        this.bra = this.cursor;
        // substring, line 50
        among_var = this.find_among(SpanishStemmer.a_0, 6);
        if (among_var == 0) {
          break;
        }
        // ], line 50
        this.ket = this.cursor;
        switch (among_var) {
          case 0:
            break lab1;
          case 1:
            // (, line 51
            // <-, line 51
            if (!this.slice_from('a')) {
              return false;
            }
            break;
          case 2:
            // (, line 52
            // <-, line 52
            if (!this.slice_from('e')) {
              return false;
            }
            break;
          case 3:
            // (, line 53
            // <-, line 53
            if (!this.slice_from('i')) {
              return false;
            }
            break;
          case 4:
            // (, line 54
            // <-, line 54
            if (!this.slice_from('o')) {
              return false;
            }
            break;
          case 5:
            // (, line 55
            // <-, line 55
            if (!this.slice_from('u')) {
              return false;
            }
            break;
          case 6:
            // (, line 57
            // next, line 57
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

  r_RV() {
    if (!(this.I_pV <= this.cursor)) {
      return false;
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

  r_attached_pronoun() {
    let among_var;
    // (, line 67
    // [, line 68
    this.ket = this.cursor;
    // substring, line 68
    if (this.find_among_b(SpanishStemmer.a_1, 13) == 0) {
      return false;
    }
    // ], line 68
    this.bra = this.cursor;
    // substring, line 72
    among_var = this.find_among_b(SpanishStemmer.a_2, 11);
    if (among_var == 0) {
      return false;
    }
    // call RV, line 72
    if (!this.r_RV()) {
      return false;
    }
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 73
        // ], line 73
        this.bra = this.cursor;
        // <-, line 73
        if (!this.slice_from('iendo')) {
          return false;
        }
        break;
      case 2:
        // (, line 74
        // ], line 74
        this.bra = this.cursor;
        // <-, line 74
        if (!this.slice_from('ando')) {
          return false;
        }
        break;
      case 3:
        // (, line 75
        // ], line 75
        this.bra = this.cursor;
        // <-, line 75
        if (!this.slice_from('ar')) {
          return false;
        }
        break;
      case 4:
        // (, line 76
        // ], line 76
        this.bra = this.cursor;
        // <-, line 76
        if (!this.slice_from('er')) {
          return false;
        }
        break;
      case 5:
        // (, line 77
        // ], line 77
        this.bra = this.cursor;
        // <-, line 77
        if (!this.slice_from('ir')) {
          return false;
        }
        break;
      case 6:
        // (, line 81
        // delete, line 81
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 7:
        // (, line 82
        // literal, line 82
        if (!this.eq_s_b(1, 'u')) {
          return false;
        }
        // delete, line 82
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    return true;
  }

  r_standard_suffix() {
    let among_var;
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    let v_5;
    // (, line 86
    // [, line 87
    this.ket = this.cursor;
    // substring, line 87
    among_var = this.find_among_b(SpanishStemmer.a_6, 46);
    if (among_var == 0) {
      return false;
    }
    // ], line 87
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 98
        // call R2, line 99
        if (!this.r_R2()) {
          return false;
        }
        // delete, line 99
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 104
        // call R2, line 105
        if (!this.r_R2()) {
          return false;
        }
        // delete, line 105
        if (!this.slice_del()) {
          return false;
        }
        // try, line 106
        v_1 = this.limit - this.cursor;
        var lab0 = true;
        while (lab0 == true) {
          lab0 = false;
          // (, line 106
          // [, line 106
          this.ket = this.cursor;
          // literal, line 106
          if (!this.eq_s_b(2, 'ic')) {
            this.cursor = this.limit - v_1;
            break;
          }
          // ], line 106
          this.bra = this.cursor;
          // call R2, line 106
          if (!this.r_R2()) {
            this.cursor = this.limit - v_1;
            break;
          }
          // delete, line 106
          if (!this.slice_del()) {
            return false;
          }
        }
        break;
      case 3:
        // (, line 110
        // call R2, line 111
        if (!this.r_R2()) {
          return false;
        }
        // <-, line 111
        if (!this.slice_from('log')) {
          return false;
        }
        break;
      case 4:
        // (, line 114
        // call R2, line 115
        if (!this.r_R2()) {
          return false;
        }
        // <-, line 115
        if (!this.slice_from('u')) {
          return false;
        }
        break;
      case 5:
        // (, line 118
        // call R2, line 119
        if (!this.r_R2()) {
          return false;
        }
        // <-, line 119
        if (!this.slice_from('ente')) {
          return false;
        }
        break;
      case 6:
        // (, line 122
        // call R1, line 123
        if (!this.r_R1()) {
          return false;
        }
        // delete, line 123
        if (!this.slice_del()) {
          return false;
        }
        // try, line 124
        v_2 = this.limit - this.cursor;
        var lab1 = true;
        lab1: while (lab1 == true) {
          lab1 = false;
          // (, line 124
          // [, line 125
          this.ket = this.cursor;
          // substring, line 125
          among_var = this.find_among_b(SpanishStemmer.a_3, 4);
          if (among_var == 0) {
            this.cursor = this.limit - v_2;
            break;
          }
          // ], line 125
          this.bra = this.cursor;
          // call R2, line 125
          if (!this.r_R2()) {
            this.cursor = this.limit - v_2;
            break;
          }
          // delete, line 125
          if (!this.slice_del()) {
            return false;
          }
          switch (among_var) {
            case 0:
              this.cursor = this.limit - v_2;
              break lab1;
            case 1:
              // (, line 126
              // [, line 126
              this.ket = this.cursor;
              // literal, line 126
              if (!this.eq_s_b(2, 'at')) {
                this.cursor = this.limit - v_2;
                break lab1;
              }
              // ], line 126
              this.bra = this.cursor;
              // call R2, line 126
              if (!this.r_R2()) {
                this.cursor = this.limit - v_2;
                break lab1;
              }
              // delete, line 126
              if (!this.slice_del()) {
                return false;
              }
              break;
          }
        }
        break;
      case 7:
        // (, line 134
        // call R2, line 135
        if (!this.r_R2()) {
          return false;
        }
        // delete, line 135
        if (!this.slice_del()) {
          return false;
        }
        // try, line 136
        v_3 = this.limit - this.cursor;
        var lab2 = true;
        lab2: while (lab2 == true) {
          lab2 = false;
          // (, line 136
          // [, line 137
          this.ket = this.cursor;
          // substring, line 137
          among_var = this.find_among_b(SpanishStemmer.a_4, 3);
          if (among_var == 0) {
            this.cursor = this.limit - v_3;
            break;
          }
          // ], line 137
          this.bra = this.cursor;
          switch (among_var) {
            case 0:
              this.cursor = this.limit - v_3;
              break lab2;
            case 1:
              // (, line 140
              // call R2, line 140
              if (!this.r_R2()) {
                this.cursor = this.limit - v_3;
                break lab2;
              }
              // delete, line 140
              if (!this.slice_del()) {
                return false;
              }
              break;
          }
        }
        break;
      case 8:
        // (, line 146
        // call R2, line 147
        if (!this.r_R2()) {
          return false;
        }
        // delete, line 147
        if (!this.slice_del()) {
          return false;
        }
        // try, line 148
        v_4 = this.limit - this.cursor;
        var lab3 = true;
        lab3: while (lab3 == true) {
          lab3 = false;
          // (, line 148
          // [, line 149
          this.ket = this.cursor;
          // substring, line 149
          among_var = this.find_among_b(SpanishStemmer.a_5, 3);
          if (among_var == 0) {
            this.cursor = this.limit - v_4;
            break;
          }
          // ], line 149
          this.bra = this.cursor;
          switch (among_var) {
            case 0:
              this.cursor = this.limit - v_4;
              break lab3;
            case 1:
              // (, line 152
              // call R2, line 152
              if (!this.r_R2()) {
                this.cursor = this.limit - v_4;
                break lab3;
              }
              // delete, line 152
              if (!this.slice_del()) {
                return false;
              }
              break;
          }
        }
        break;
      case 9:
        // (, line 158
        // call R2, line 159
        if (!this.r_R2()) {
          return false;
        }
        // delete, line 159
        if (!this.slice_del()) {
          return false;
        }
        // try, line 160
        v_5 = this.limit - this.cursor;
        var lab4 = true;
        while (lab4 == true) {
          lab4 = false;
          // (, line 160
          // [, line 161
          this.ket = this.cursor;
          // literal, line 161
          if (!this.eq_s_b(2, 'at')) {
            this.cursor = this.limit - v_5;
            break;
          }
          // ], line 161
          this.bra = this.cursor;
          // call R2, line 161
          if (!this.r_R2()) {
            this.cursor = this.limit - v_5;
            break;
          }
          // delete, line 161
          if (!this.slice_del()) {
            return false;
          }
        }
        break;
    }
    return true;
  }

  r_y_verb_suffix() {
    let among_var;
    let v_1;
    let v_2;
    // (, line 167
    // setlimit, line 168
    v_1 = this.limit - this.cursor;
    // tomark, line 168
    if (this.cursor < this.I_pV) {
      return false;
    }
    this.cursor = this.I_pV;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 168
    // [, line 168
    this.ket = this.cursor;
    // substring, line 168
    among_var = this.find_among_b(SpanishStemmer.a_7, 12);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 168
    this.bra = this.cursor;
    this.limit_backward = v_2;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 171
        // literal, line 171
        if (!this.eq_s_b(1, 'u')) {
          return false;
        }
        // delete, line 171
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    return true;
  }

  r_verb_suffix() {
    let among_var;
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    // (, line 175
    // setlimit, line 176
    v_1 = this.limit - this.cursor;
    // tomark, line 176
    if (this.cursor < this.I_pV) {
      return false;
    }
    this.cursor = this.I_pV;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 176
    // [, line 176
    this.ket = this.cursor;
    // substring, line 176
    among_var = this.find_among_b(SpanishStemmer.a_8, 96);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 176
    this.bra = this.cursor;
    this.limit_backward = v_2;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 179
        // try, line 179
        v_3 = this.limit - this.cursor;
        var lab0 = true;
        while (lab0 == true) {
          lab0 = false;
          // (, line 179
          // literal, line 179
          if (!this.eq_s_b(1, 'u')) {
            this.cursor = this.limit - v_3;
            break;
          }
          // test, line 179
          v_4 = this.limit - this.cursor;
          // literal, line 179
          if (!this.eq_s_b(1, 'g')) {
            this.cursor = this.limit - v_3;
            break;
          }
          this.cursor = this.limit - v_4;
        }
        // ], line 179
        this.bra = this.cursor;
        // delete, line 179
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 200
        // delete, line 200
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    return true;
  }

  r_residual_suffix() {
    let among_var;
    let v_1;
    let v_2;
    // (, line 204
    // [, line 205
    this.ket = this.cursor;
    // substring, line 205
    among_var = this.find_among_b(SpanishStemmer.a_9, 8);
    if (among_var == 0) {
      return false;
    }
    // ], line 205
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 208
        // call RV, line 208
        if (!this.r_RV()) {
          return false;
        }
        // delete, line 208
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 210
        // call RV, line 210
        if (!this.r_RV()) {
          return false;
        }
        // delete, line 210
        if (!this.slice_del()) {
          return false;
        }
        // try, line 210
        v_1 = this.limit - this.cursor;
        var lab0 = true;
        while (lab0 == true) {
          lab0 = false;
          // (, line 210
          // [, line 210
          this.ket = this.cursor;
          // literal, line 210
          if (!this.eq_s_b(1, 'u')) {
            this.cursor = this.limit - v_1;
            break;
          }
          // ], line 210
          this.bra = this.cursor;
          // test, line 210
          v_2 = this.limit - this.cursor;
          // literal, line 210
          if (!this.eq_s_b(1, 'g')) {
            this.cursor = this.limit - v_1;
            break;
          }
          this.cursor = this.limit - v_2;
          // call RV, line 210
          if (!this.r_RV()) {
            this.cursor = this.limit - v_1;
            break;
          }
          // delete, line 210
          if (!this.slice_del()) {
            return false;
          }
        }
        break;
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
    // (, line 215
    // do, line 216
    v_1 = this.cursor;
    let lab0 = true;
    while (lab0 == true) {
      lab0 = false;
      // call mark_regions, line 216
      if (!this.r_mark_regions()) {
        break;
      }
    }
    this.cursor = v_1;
    // backwards, line 217
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    // (, line 217
    // do, line 218
    v_2 = this.limit - this.cursor;
    let lab1 = true;
    while (lab1 == true) {
      lab1 = false;
      // call attached_pronoun, line 218
      if (!this.r_attached_pronoun()) {
        break;
      }
    }
    this.cursor = this.limit - v_2;
    // do, line 219
    v_3 = this.limit - this.cursor;
    let lab2 = true;
    lab2: while (lab2 == true) {
      lab2 = false;
      // (, line 219
      // or, line 219
      let lab3 = true;
      lab3: while (lab3 == true) {
        lab3 = false;
        v_4 = this.limit - this.cursor;
        let lab4 = true;
        while (lab4 == true) {
          lab4 = false;
          // call standard_suffix, line 219
          if (!this.r_standard_suffix()) {
            break;
          }
          break lab3;
        }
        this.cursor = this.limit - v_4;
        let lab5 = true;
        while (lab5 == true) {
          lab5 = false;
          // call y_verb_suffix, line 220
          if (!this.r_y_verb_suffix()) {
            break;
          }
          break lab3;
        }
        this.cursor = this.limit - v_4;
        // call verb_suffix, line 221
        if (!this.r_verb_suffix()) {
          break lab2;
        }
      }
    }
    this.cursor = this.limit - v_3;
    // do, line 223
    v_5 = this.limit - this.cursor;
    let lab6 = true;
    while (lab6 == true) {
      lab6 = false;
      // call residual_suffix, line 223
      if (!this.r_residual_suffix()) {
        break;
      }
    }
    this.cursor = this.limit - v_5;
    this.cursor = this.limit_backward; // do, line 225
    v_6 = this.cursor;
    let lab7 = true;
    while (lab7 == true) {
      lab7 = false;
      // call postlude, line 225
      if (!this.r_postlude()) {
        break;
      }
    }
    this.cursor = v_6;
    return true;
  }
}
SpanishStemmer.a_0 = [
  new Among('', -1, 6),
  new Among('\u00E1', 0, 1),
  new Among('\u00E9', 0, 2),
  new Among('\u00ED', 0, 3),
  new Among('\u00F3', 0, 4),
  new Among('\u00FA', 0, 5)
];
SpanishStemmer.a_1 = [
  new Among('la', -1, -1),
  new Among('sela', 0, -1),
  new Among('le', -1, -1),
  new Among('me', -1, -1),
  new Among('se', -1, -1),
  new Among('lo', -1, -1),
  new Among('selo', 5, -1),
  new Among('las', -1, -1),
  new Among('selas', 7, -1),
  new Among('les', -1, -1),
  new Among('los', -1, -1),
  new Among('selos', 10, -1),
  new Among('nos', -1, -1)
];

SpanishStemmer.a_2 = [
  new Among('ando', -1, 6),
  new Among('iendo', -1, 6),
  new Among('yendo', -1, 7),
  new Among('\u00E1ndo', -1, 2),
  new Among('i\u00E9ndo', -1, 1),
  new Among('ar', -1, 6),
  new Among('er', -1, 6),
  new Among('ir', -1, 6),
  new Among('\u00E1r', -1, 3),
  new Among('\u00E9r', -1, 4),
  new Among('\u00EDr', -1, 5)
];

SpanishStemmer.a_3 = [
  new Among('ic', -1, -1),
  new Among('ad', -1, -1),
  new Among('os', -1, -1),
  new Among('iv', -1, 1)
];

SpanishStemmer.a_4 = [
  new Among('able', -1, 1),
  new Among('ible', -1, 1),
  new Among('ante', -1, 1)
];

SpanishStemmer.a_5 = [
  new Among('ic', -1, 1),
  new Among('abil', -1, 1),
  new Among('iv', -1, 1)
];

SpanishStemmer.a_6 = [
  new Among('ica', -1, 1),
  new Among('ancia', -1, 2),
  new Among('encia', -1, 5),
  new Among('adora', -1, 2),
  new Among('osa', -1, 1),
  new Among('ista', -1, 1),
  new Among('iva', -1, 9),
  new Among('anza', -1, 1),
  new Among('log\u00EDa', -1, 3),
  new Among('idad', -1, 8),
  new Among('able', -1, 1),
  new Among('ible', -1, 1),
  new Among('ante', -1, 2),
  new Among('mente', -1, 7),
  new Among('amente', 13, 6),
  new Among('aci\u00F3n', -1, 2),
  new Among('uci\u00F3n', -1, 4),
  new Among('ico', -1, 1),
  new Among('ismo', -1, 1),
  new Among('oso', -1, 1),
  new Among('amiento', -1, 1),
  new Among('imiento', -1, 1),
  new Among('ivo', -1, 9),
  new Among('ador', -1, 2),
  new Among('icas', -1, 1),
  new Among('ancias', -1, 2),
  new Among('encias', -1, 5),
  new Among('adoras', -1, 2),
  new Among('osas', -1, 1),
  new Among('istas', -1, 1),
  new Among('ivas', -1, 9),
  new Among('anzas', -1, 1),
  new Among('log\u00EDas', -1, 3),
  new Among('idades', -1, 8),
  new Among('ables', -1, 1),
  new Among('ibles', -1, 1),
  new Among('aciones', -1, 2),
  new Among('uciones', -1, 4),
  new Among('adores', -1, 2),
  new Among('antes', -1, 2),
  new Among('icos', -1, 1),
  new Among('ismos', -1, 1),
  new Among('osos', -1, 1),
  new Among('amientos', -1, 1),
  new Among('imientos', -1, 1),
  new Among('ivos', -1, 9)
];

SpanishStemmer.a_7 = [
  new Among('ya', -1, 1),
  new Among('ye', -1, 1),
  new Among('yan', -1, 1),
  new Among('yen', -1, 1),
  new Among('yeron', -1, 1),
  new Among('yendo', -1, 1),
  new Among('yo', -1, 1),
  new Among('yas', -1, 1),
  new Among('yes', -1, 1),
  new Among('yais', -1, 1),
  new Among('yamos', -1, 1),
  new Among('y\u00F3', -1, 1)
];

SpanishStemmer.a_8 = [
  new Among('aba', -1, 2),
  new Among('ada', -1, 2),
  new Among('ida', -1, 2),
  new Among('ara', -1, 2),
  new Among('iera', -1, 2),
  new Among('\u00EDa', -1, 2),
  new Among('ar\u00EDa', 5, 2),
  new Among('er\u00EDa', 5, 2),
  new Among('ir\u00EDa', 5, 2),
  new Among('ad', -1, 2),
  new Among('ed', -1, 2),
  new Among('id', -1, 2),
  new Among('ase', -1, 2),
  new Among('iese', -1, 2),
  new Among('aste', -1, 2),
  new Among('iste', -1, 2),
  new Among('an', -1, 2),
  new Among('aban', 16, 2),
  new Among('aran', 16, 2),
  new Among('ieran', 16, 2),
  new Among('\u00EDan', 16, 2),
  new Among('ar\u00EDan', 20, 2),
  new Among('er\u00EDan', 20, 2),
  new Among('ir\u00EDan', 20, 2),
  new Among('en', -1, 1),
  new Among('asen', 24, 2),
  new Among('iesen', 24, 2),
  new Among('aron', -1, 2),
  new Among('ieron', -1, 2),
  new Among('ar\u00E1n', -1, 2),
  new Among('er\u00E1n', -1, 2),
  new Among('ir\u00E1n', -1, 2),
  new Among('ado', -1, 2),
  new Among('ido', -1, 2),
  new Among('ando', -1, 2),
  new Among('iendo', -1, 2),
  new Among('ar', -1, 2),
  new Among('er', -1, 2),
  new Among('ir', -1, 2),
  new Among('as', -1, 2),
  new Among('abas', 39, 2),
  new Among('adas', 39, 2),
  new Among('idas', 39, 2),
  new Among('aras', 39, 2),
  new Among('ieras', 39, 2),
  new Among('\u00EDas', 39, 2),
  new Among('ar\u00EDas', 45, 2),
  new Among('er\u00EDas', 45, 2),
  new Among('ir\u00EDas', 45, 2),
  new Among('es', -1, 1),
  new Among('ases', 49, 2),
  new Among('ieses', 49, 2),
  new Among('abais', -1, 2),
  new Among('arais', -1, 2),
  new Among('ierais', -1, 2),
  new Among('\u00EDais', -1, 2),
  new Among('ar\u00EDais', 55, 2),
  new Among('er\u00EDais', 55, 2),
  new Among('ir\u00EDais', 55, 2),
  new Among('aseis', -1, 2),
  new Among('ieseis', -1, 2),
  new Among('asteis', -1, 2),
  new Among('isteis', -1, 2),
  new Among('\u00E1is', -1, 2),
  new Among('\u00E9is', -1, 1),
  new Among('ar\u00E9is', 64, 2),
  new Among('er\u00E9is', 64, 2),
  new Among('ir\u00E9is', 64, 2),
  new Among('ados', -1, 2),
  new Among('idos', -1, 2),
  new Among('amos', -1, 2),
  new Among('\u00E1bamos', 70, 2),
  new Among('\u00E1ramos', 70, 2),
  new Among('i\u00E9ramos', 70, 2),
  new Among('\u00EDamos', 70, 2),
  new Among('ar\u00EDamos', 74, 2),
  new Among('er\u00EDamos', 74, 2),
  new Among('ir\u00EDamos', 74, 2),
  new Among('emos', -1, 1),
  new Among('aremos', 78, 2),
  new Among('eremos', 78, 2),
  new Among('iremos', 78, 2),
  new Among('\u00E1semos', 78, 2),
  new Among('i\u00E9semos', 78, 2),
  new Among('imos', -1, 2),
  new Among('ar\u00E1s', -1, 2),
  new Among('er\u00E1s', -1, 2),
  new Among('ir\u00E1s', -1, 2),
  new Among('\u00EDs', -1, 2),
  new Among('ar\u00E1', -1, 2),
  new Among('er\u00E1', -1, 2),
  new Among('ir\u00E1', -1, 2),
  new Among('ar\u00E9', -1, 2),
  new Among('er\u00E9', -1, 2),
  new Among('ir\u00E9', -1, 2),
  new Among('i\u00F3', -1, 2)
];

SpanishStemmer.a_9 = [
  new Among('a', -1, 1),
  new Among('e', -1, 2),
  new Among('o', -1, 1),
  new Among('os', -1, 1),
  new Among('\u00E1', -1, 1),
  new Among('\u00E9', -1, 2),
  new Among('\u00ED', -1, 1),
  new Among('\u00F3', -1, 1)
];

SpanishStemmer.g_v = [
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
  1,
  17,
  4,
  10
];

module.exports = SpanishStemmer;
