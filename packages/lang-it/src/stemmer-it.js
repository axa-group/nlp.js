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
class StemmerIt extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-it';
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

  r_prelude() {
    let among_var;
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    let v_5;
    // (, line 34
    // test, line 35
    v_1 = this.cursor;
    // repeat, line 35
    replab0: while (true) {
      v_2 = this.cursor;
      let lab1 = true;
      lab1: while (lab1 == true) {
        lab1 = false;
        // (, line 35
        // [, line 36
        this.bra = this.cursor;
        // substring, line 36
        among_var = this.find_among(StemmerIt.a_0, 7);
        if (among_var == 0) {
          break;
        }
        // ], line 36
        this.ket = this.cursor;
        switch (among_var) {
          case 0:
            break lab1;
          case 1:
            // (, line 37
            // <-, line 37
            if (!this.slice_from('\u00E0')) {
              return false;
            }
            break;
          case 2:
            // (, line 38
            // <-, line 38
            if (!this.slice_from('\u00E8')) {
              return false;
            }
            break;
          case 3:
            // (, line 39
            // <-, line 39
            if (!this.slice_from('\u00EC')) {
              return false;
            }
            break;
          case 4:
            // (, line 40
            // <-, line 40
            if (!this.slice_from('\u00F2')) {
              return false;
            }
            break;
          case 5:
            // (, line 41
            // <-, line 41
            if (!this.slice_from('\u00F9')) {
              return false;
            }
            break;
          case 6:
            // (, line 42
            // <-, line 42
            if (!this.slice_from('qU')) {
              return false;
            }
            break;
          case 7:
            // (, line 43
            // next, line 43
            if (this.cursor >= this.limit) {
              break lab1;
            }
            this.cursor++;
            break;
        }
        continue replab0;
      }
      this.cursor = v_2;
      break;
    }
    this.cursor = v_1;
    // repeat, line 46
    replab2: while (true) {
      v_3 = this.cursor;
      let lab3 = true;
      lab3: while (lab3 == true) {
        lab3 = false;
        // goto, line 46
        golab4: while (true) {
          v_4 = this.cursor;
          let lab5 = true;
          lab5: while (lab5 == true) {
            lab5 = false;
            // (, line 46
            if (!this.in_grouping(StemmerIt.g_v, 97, 249)) {
              break;
            }
            // [, line 47
            this.bra = this.cursor;
            // or, line 47
            let lab6 = true;
            lab6: while (lab6 == true) {
              lab6 = false;
              v_5 = this.cursor;
              let lab7 = true;
              while (lab7 == true) {
                lab7 = false;
                // (, line 47
                // literal, line 47
                if (!this.eq_s(1, 'u')) {
                  break;
                }
                // ], line 47
                this.ket = this.cursor;
                if (!this.in_grouping(StemmerIt.g_v, 97, 249)) {
                  break;
                }
                // <-, line 47
                if (!this.slice_from('U')) {
                  return false;
                }
                break lab6;
              }
              this.cursor = v_5;
              // (, line 48
              // literal, line 48
              if (!this.eq_s(1, 'i')) {
                break lab5;
              }
              // ], line 48
              this.ket = this.cursor;
              if (!this.in_grouping(StemmerIt.g_v, 97, 249)) {
                break lab5;
              }
              // <-, line 48
              if (!this.slice_from('I')) {
                return false;
              }
            }
            this.cursor = v_4;
            break golab4;
          }
          this.cursor = v_4;
          if (this.cursor >= this.limit) {
            break lab3;
          }
          this.cursor++;
        }
        continue replab2;
      }
      this.cursor = v_3;
      break;
    }
    return true;
  }

  r_mark_regions() {
    let v_1;
    let v_2;
    let v_3;
    let v_6;
    let v_8;
    // (, line 52
    this.I_pV = this.limit;
    this.I_p1 = this.limit;
    this.I_p2 = this.limit;
    // do, line 58
    v_1 = this.cursor;
    let lab0 = true;
    lab0: while (lab0 == true) {
      lab0 = false;
      // (, line 58
      // or, line 60
      let lab1 = true;
      lab1: while (lab1 == true) {
        lab1 = false;
        v_2 = this.cursor;
        let lab2 = true;
        lab2: while (lab2 == true) {
          lab2 = false;
          // (, line 59
          if (!this.in_grouping(StemmerIt.g_v, 97, 249)) {
            break;
          }
          // or, line 59
          let lab3 = true;
          lab3: while (lab3 == true) {
            lab3 = false;
            v_3 = this.cursor;
            let lab4 = true;
            lab4: while (lab4 == true) {
              lab4 = false;
              // (, line 59
              if (!this.out_grouping(StemmerIt.g_v, 97, 249)) {
                break;
              }
              // gopast, line 59
              golab5: while (true) {
                let lab6 = true;
                while (lab6 == true) {
                  lab6 = false;
                  if (!this.in_grouping(StemmerIt.g_v, 97, 249)) {
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
            // (, line 59
            if (!this.in_grouping(StemmerIt.g_v, 97, 249)) {
              break lab2;
            }
            // gopast, line 59
            golab7: while (true) {
              let lab8 = true;
              while (lab8 == true) {
                lab8 = false;
                if (!this.out_grouping(StemmerIt.g_v, 97, 249)) {
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
        // (, line 61
        if (!this.out_grouping(StemmerIt.g_v, 97, 249)) {
          break lab0;
        }
        // or, line 61
        let lab9 = true;
        lab9: while (lab9 == true) {
          lab9 = false;
          v_6 = this.cursor;
          let lab10 = true;
          lab10: while (lab10 == true) {
            lab10 = false;
            // (, line 61
            if (!this.out_grouping(StemmerIt.g_v, 97, 249)) {
              break;
            }
            // gopast, line 61
            golab11: while (true) {
              let lab12 = true;
              while (lab12 == true) {
                lab12 = false;
                if (!this.in_grouping(StemmerIt.g_v, 97, 249)) {
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
          // (, line 61
          if (!this.in_grouping(StemmerIt.g_v, 97, 249)) {
            break lab0;
          }
          // next, line 61
          if (this.cursor >= this.limit) {
            break lab0;
          }
          this.cursor++;
        }
      }
      // setmark pV, line 62
      this.I_pV = this.cursor;
    }
    this.cursor = v_1;
    // do, line 64
    v_8 = this.cursor;
    let lab13 = true;
    lab13: while (lab13 == true) {
      lab13 = false;
      // (, line 64
      // gopast, line 65
      golab14: while (true) {
        let lab15 = true;
        while (lab15 == true) {
          lab15 = false;
          if (!this.in_grouping(StemmerIt.g_v, 97, 249)) {
            break;
          }
          break golab14;
        }
        if (this.cursor >= this.limit) {
          break lab13;
        }
        this.cursor++;
      }
      // gopast, line 65
      golab16: while (true) {
        let lab17 = true;
        while (lab17 == true) {
          lab17 = false;
          if (!this.out_grouping(StemmerIt.g_v, 97, 249)) {
            break;
          }
          break golab16;
        }
        if (this.cursor >= this.limit) {
          break lab13;
        }
        this.cursor++;
      }
      // setmark p1, line 65
      this.I_p1 = this.cursor;
      // gopast, line 66
      golab18: while (true) {
        let lab19 = true;
        while (lab19 == true) {
          lab19 = false;
          if (!this.in_grouping(StemmerIt.g_v, 97, 249)) {
            break;
          }
          break golab18;
        }
        if (this.cursor >= this.limit) {
          break lab13;
        }
        this.cursor++;
      }
      // gopast, line 66
      golab20: while (true) {
        let lab21 = true;
        while (lab21 == true) {
          lab21 = false;
          if (!this.out_grouping(StemmerIt.g_v, 97, 249)) {
            break;
          }
          break golab20;
        }
        if (this.cursor >= this.limit) {
          break lab13;
        }
        this.cursor++;
      }
      // setmark p2, line 66
      this.I_p2 = this.cursor;
    }
    this.cursor = v_8;
    return true;
  }

  r_postlude() {
    let among_var;
    let v_1;
    // repeat, line 70
    replab0: while (true) {
      v_1 = this.cursor;
      let lab1 = true;
      lab1: while (lab1 == true) {
        lab1 = false;
        // (, line 70
        // [, line 72
        this.bra = this.cursor;
        // substring, line 72
        among_var = this.find_among(StemmerIt.a_1, 3);
        if (among_var == 0) {
          break;
        }
        // ], line 72
        this.ket = this.cursor;
        switch (among_var) {
          case 0:
            break lab1;
          case 1:
            // (, line 73
            // <-, line 73
            if (!this.slice_from('i')) {
              return false;
            }
            break;
          case 2:
            // (, line 74
            // <-, line 74
            if (!this.slice_from('u')) {
              return false;
            }
            break;
          case 3:
            // (, line 75
            // next, line 75
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
    // (, line 86
    // [, line 87
    this.ket = this.cursor;
    // substring, line 87
    if (this.find_among_b(StemmerIt.a_2, 37) == 0) {
      return false;
    }
    // ], line 87
    this.bra = this.cursor;
    // among, line 97
    among_var = this.find_among_b(StemmerIt.a_3, 5);
    if (among_var == 0) {
      return false;
    }
    // (, line 97
    // call RV, line 97
    if (!this.r_RV()) {
      return false;
    }
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 98
        // delete, line 98
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 99
        // <-, line 99
        if (!this.slice_from('e')) {
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
    // (, line 103
    // [, line 104
    this.ket = this.cursor;
    // substring, line 104
    among_var = this.find_among_b(StemmerIt.a_6, 51);
    if (among_var == 0) {
      return false;
    }
    // ], line 104
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 111
        // call R2, line 111
        if (!this.r_R2()) {
          return false;
        }
        // delete, line 111
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 113
        // call R2, line 113
        if (!this.r_R2()) {
          return false;
        }
        // delete, line 113
        if (!this.slice_del()) {
          return false;
        }
        // try, line 114
        v_1 = this.limit - this.cursor;
        var lab0 = true;
        while (lab0 == true) {
          lab0 = false;
          // (, line 114
          // [, line 114
          this.ket = this.cursor;
          // literal, line 114
          if (!this.eq_s_b(2, 'ic')) {
            this.cursor = this.limit - v_1;
            break;
          }
          // ], line 114
          this.bra = this.cursor;
          // call R2, line 114
          if (!this.r_R2()) {
            this.cursor = this.limit - v_1;
            break;
          }
          // delete, line 114
          if (!this.slice_del()) {
            return false;
          }
        }
        break;
      case 3:
        // (, line 117
        // call R2, line 117
        if (!this.r_R2()) {
          return false;
        }
        // <-, line 117
        if (!this.slice_from('log')) {
          return false;
        }
        break;
      case 4:
        // (, line 119
        // call R2, line 119
        if (!this.r_R2()) {
          return false;
        }
        // <-, line 119
        if (!this.slice_from('u')) {
          return false;
        }
        break;
      case 5:
        // (, line 121
        // call R2, line 121
        if (!this.r_R2()) {
          return false;
        }
        // <-, line 121
        if (!this.slice_from('ente')) {
          return false;
        }
        break;
      case 6:
        // (, line 123
        // call RV, line 123
        if (!this.r_RV()) {
          return false;
        }
        // delete, line 123
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 7:
        // (, line 124
        // call R1, line 125
        if (!this.r_R1()) {
          return false;
        }
        // delete, line 125
        if (!this.slice_del()) {
          return false;
        }
        // try, line 126
        v_2 = this.limit - this.cursor;
        var lab1 = true;
        lab1: while (lab1 == true) {
          lab1 = false;
          // (, line 126
          // [, line 127
          this.ket = this.cursor;
          // substring, line 127
          among_var = this.find_among_b(StemmerIt.a_4, 4);
          if (among_var == 0) {
            this.cursor = this.limit - v_2;
            break;
          }
          // ], line 127
          this.bra = this.cursor;
          // call R2, line 127
          if (!this.r_R2()) {
            this.cursor = this.limit - v_2;
            break;
          }
          // delete, line 127
          if (!this.slice_del()) {
            return false;
          }
          switch (among_var) {
            case 0:
              this.cursor = this.limit - v_2;
              break lab1;
            case 1:
              // (, line 128
              // [, line 128
              this.ket = this.cursor;
              // literal, line 128
              if (!this.eq_s_b(2, 'at')) {
                this.cursor = this.limit - v_2;
                break lab1;
              }
              // ], line 128
              this.bra = this.cursor;
              // call R2, line 128
              if (!this.r_R2()) {
                this.cursor = this.limit - v_2;
                break lab1;
              }
              // delete, line 128
              if (!this.slice_del()) {
                return false;
              }
              break;
          }
        }
        break;
      case 8:
        // (, line 133
        // call R2, line 134
        if (!this.r_R2()) {
          return false;
        }
        // delete, line 134
        if (!this.slice_del()) {
          return false;
        }
        // try, line 135
        v_3 = this.limit - this.cursor;
        var lab2 = true;
        lab2: while (lab2 == true) {
          lab2 = false;
          // (, line 135
          // [, line 136
          this.ket = this.cursor;
          // substring, line 136
          among_var = this.find_among_b(StemmerIt.a_5, 3);
          if (among_var == 0) {
            this.cursor = this.limit - v_3;
            break;
          }
          // ], line 136
          this.bra = this.cursor;
          switch (among_var) {
            case 0:
              this.cursor = this.limit - v_3;
              break lab2;
            case 1:
              // (, line 137
              // call R2, line 137
              if (!this.r_R2()) {
                this.cursor = this.limit - v_3;
                break lab2;
              }
              // delete, line 137
              if (!this.slice_del()) {
                return false;
              }
              break;
          }
        }
        break;
      case 9:
        // (, line 141
        // call R2, line 142
        if (!this.r_R2()) {
          return false;
        }
        // delete, line 142
        if (!this.slice_del()) {
          return false;
        }
        // try, line 143
        v_4 = this.limit - this.cursor;
        var lab3 = true;
        while (lab3 == true) {
          lab3 = false;
          // (, line 143
          // [, line 143
          this.ket = this.cursor;
          // literal, line 143
          if (!this.eq_s_b(2, 'at')) {
            this.cursor = this.limit - v_4;
            break;
          }
          // ], line 143
          this.bra = this.cursor;
          // call R2, line 143
          if (!this.r_R2()) {
            this.cursor = this.limit - v_4;
            break;
          }
          // delete, line 143
          if (!this.slice_del()) {
            return false;
          }
          // [, line 143
          this.ket = this.cursor;
          // literal, line 143
          if (!this.eq_s_b(2, 'ic')) {
            this.cursor = this.limit - v_4;
            break;
          }
          // ], line 143
          this.bra = this.cursor;
          // call R2, line 143
          if (!this.r_R2()) {
            this.cursor = this.limit - v_4;
            break;
          }
          // delete, line 143
          if (!this.slice_del()) {
            return false;
          }
        }
        break;
    }
    return true;
  }

  r_verb_suffix() {
    let among_var;
    let v_1;
    let v_2;
    // setlimit, line 148
    v_1 = this.limit - this.cursor;
    // tomark, line 148
    if (this.cursor < this.I_pV) {
      return false;
    }
    this.cursor = this.I_pV;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 148
    // [, line 149
    this.ket = this.cursor;
    // substring, line 149
    among_var = this.find_among_b(StemmerIt.a_7, 87);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 149
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        this.limit_backward = v_2;
        return false;
      case 1:
        // (, line 163
        // delete, line 163
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    this.limit_backward = v_2;
    return true;
  }

  r_vowel_suffix() {
    let v_1;
    let v_2;
    // (, line 170
    // try, line 171
    v_1 = this.limit - this.cursor;
    let lab0 = true;
    while (lab0 == true) {
      lab0 = false;
      // (, line 171
      // [, line 172
      this.ket = this.cursor;
      if (!this.in_grouping_b(StemmerIt.g_AEIO, 97, 242)) {
        this.cursor = this.limit - v_1;
        break;
      }
      // ], line 172
      this.bra = this.cursor;
      // call RV, line 172
      if (!this.r_RV()) {
        this.cursor = this.limit - v_1;
        break;
      }
      // delete, line 172
      if (!this.slice_del()) {
        return false;
      }
      // [, line 173
      this.ket = this.cursor;
      // literal, line 173
      if (!this.eq_s_b(1, 'i')) {
        this.cursor = this.limit - v_1;
        break;
      }
      // ], line 173
      this.bra = this.cursor;
      // call RV, line 173
      if (!this.r_RV()) {
        this.cursor = this.limit - v_1;
        break;
      }
      // delete, line 173
      if (!this.slice_del()) {
        return false;
      }
    }
    // try, line 175
    v_2 = this.limit - this.cursor;
    let lab1 = true;
    while (lab1 == true) {
      lab1 = false;
      // (, line 175
      // [, line 176
      this.ket = this.cursor;
      // literal, line 176
      if (!this.eq_s_b(1, 'h')) {
        this.cursor = this.limit - v_2;
        break;
      }
      // ], line 176
      this.bra = this.cursor;
      if (!this.in_grouping_b(StemmerIt.g_CG, 99, 103)) {
        this.cursor = this.limit - v_2;
        break;
      }
      // call RV, line 176
      if (!this.r_RV()) {
        this.cursor = this.limit - v_2;
        break;
      }
      // delete, line 176
      if (!this.slice_del()) {
        return false;
      }
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
    // (, line 181
    // do, line 182
    v_1 = this.cursor;
    let lab0 = true;
    while (lab0 == true) {
      lab0 = false;
      // call prelude, line 182
      if (!this.r_prelude()) {
        break;
      }
    }
    this.cursor = v_1;
    // do, line 183
    v_2 = this.cursor;
    let lab1 = true;
    while (lab1 == true) {
      lab1 = false;
      // call mark_regions, line 183
      if (!this.r_mark_regions()) {
        break;
      }
    }
    this.cursor = v_2;
    // backwards, line 184
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    // (, line 184
    // do, line 185
    v_3 = this.limit - this.cursor;
    let lab2 = true;
    while (lab2 == true) {
      lab2 = false;
      // call attached_pronoun, line 185
      if (!this.r_attached_pronoun()) {
        break;
      }
    }
    this.cursor = this.limit - v_3;
    // do, line 186
    v_4 = this.limit - this.cursor;
    let lab3 = true;
    lab3: while (lab3 == true) {
      lab3 = false;
      // (, line 186
      // or, line 186
      let lab4 = true;
      lab4: while (lab4 == true) {
        lab4 = false;
        v_5 = this.limit - this.cursor;
        let lab5 = true;
        while (lab5 == true) {
          lab5 = false;
          // call standard_suffix, line 186
          if (!this.r_standard_suffix()) {
            break;
          }
          break lab4;
        }
        this.cursor = this.limit - v_5;
        // call verb_suffix, line 186
        if (!this.r_verb_suffix()) {
          break lab3;
        }
      }
    }
    this.cursor = this.limit - v_4;
    // do, line 187
    v_6 = this.limit - this.cursor;
    let lab6 = true;
    while (lab6 == true) {
      lab6 = false;
      // call vowel_suffix, line 187
      if (!this.r_vowel_suffix()) {
        break;
      }
    }
    this.cursor = this.limit - v_6;
    this.cursor = this.limit_backward; // do, line 189
    v_7 = this.cursor;
    let lab7 = true;
    while (lab7 == true) {
      lab7 = false;
      // call postlude, line 189
      if (!this.r_postlude()) {
        break;
      }
    }
    this.cursor = v_7;
    return true;
  }
}

StemmerIt.methodObject = new StemmerIt();

StemmerIt.a_0 = [
  new Among('', -1, 7),
  new Among('qu', 0, 6),
  new Among('\u00E1', 0, 1),
  new Among('\u00E9', 0, 2),
  new Among('\u00ED', 0, 3),
  new Among('\u00F3', 0, 4),
  new Among('\u00FA', 0, 5)
];

StemmerIt.a_1 = [
  new Among('', -1, 3),
  new Among('I', 0, 1),
  new Among('U', 0, 2)
];

StemmerIt.a_2 = [
  new Among('la', -1, -1),
  new Among('cela', 0, -1),
  new Among('gliela', 0, -1),
  new Among('mela', 0, -1),
  new Among('tela', 0, -1),
  new Among('vela', 0, -1),
  new Among('le', -1, -1),
  new Among('cele', 6, -1),
  new Among('gliele', 6, -1),
  new Among('mele', 6, -1),
  new Among('tele', 6, -1),
  new Among('vele', 6, -1),
  new Among('ne', -1, -1),
  new Among('cene', 12, -1),
  new Among('gliene', 12, -1),
  new Among('mene', 12, -1),
  new Among('sene', 12, -1),
  new Among('tene', 12, -1),
  new Among('vene', 12, -1),
  new Among('ci', -1, -1),
  new Among('li', -1, -1),
  new Among('celi', 20, -1),
  new Among('glieli', 20, -1),
  new Among('meli', 20, -1),
  new Among('teli', 20, -1),
  new Among('veli', 20, -1),
  new Among('gli', 20, -1),
  new Among('mi', -1, -1),
  new Among('si', -1, -1),
  new Among('ti', -1, -1),
  new Among('vi', -1, -1),
  new Among('lo', -1, -1),
  new Among('celo', 31, -1),
  new Among('glielo', 31, -1),
  new Among('melo', 31, -1),
  new Among('telo', 31, -1),
  new Among('velo', 31, -1)
];

StemmerIt.a_3 = [
  new Among('ando', -1, 1),
  new Among('endo', -1, 1),
  new Among('ar', -1, 2),
  new Among('er', -1, 2),
  new Among('ir', -1, 2)
];

StemmerIt.a_4 = [
  new Among('ic', -1, -1),
  new Among('abil', -1, -1),
  new Among('os', -1, -1),
  new Among('iv', -1, 1)
];

StemmerIt.a_5 = [
  new Among('ic', -1, 1),
  new Among('abil', -1, 1),
  new Among('iv', -1, 1)
];

StemmerIt.a_6 = [
  new Among('ica', -1, 1),
  new Among('logia', -1, 3),
  new Among('osa', -1, 1),
  new Among('ista', -1, 1),
  new Among('iva', -1, 9),
  new Among('anza', -1, 1),
  new Among('enza', -1, 5),
  new Among('ice', -1, 1),
  new Among('atrice', 7, 1),
  new Among('iche', -1, 1),
  new Among('logie', -1, 3),
  new Among('abile', -1, 1),
  new Among('ibile', -1, 1),
  new Among('usione', -1, 4),
  new Among('azione', -1, 2),
  new Among('uzione', -1, 4),
  new Among('atore', -1, 2),
  new Among('ose', -1, 1),
  new Among('ante', -1, 1),
  new Among('mente', -1, 1),
  new Among('amente', 19, 7),
  new Among('iste', -1, 1),
  new Among('ive', -1, 9),
  new Among('anze', -1, 1),
  new Among('enze', -1, 5),
  new Among('ici', -1, 1),
  new Among('atrici', 25, 1),
  new Among('ichi', -1, 1),
  new Among('abili', -1, 1),
  new Among('ibili', -1, 1),
  new Among('ismi', -1, 1),
  new Among('usioni', -1, 4),
  new Among('azioni', -1, 2),
  new Among('uzioni', -1, 4),
  new Among('atori', -1, 2),
  new Among('osi', -1, 1),
  new Among('anti', -1, 1),
  new Among('amenti', -1, 6),
  new Among('imenti', -1, 6),
  new Among('isti', -1, 1),
  new Among('ivi', -1, 9),
  new Among('ico', -1, 1),
  new Among('ismo', -1, 1),
  new Among('oso', -1, 1),
  new Among('amento', -1, 6),
  new Among('imento', -1, 6),
  new Among('ivo', -1, 9),
  new Among('it\u00E0', -1, 8),
  new Among('ist\u00E0', -1, 1),
  new Among('ist\u00E8', -1, 1),
  new Among('ist\u00EC', -1, 1)
];

StemmerIt.a_7 = [
  new Among('isca', -1, 1),
  new Among('enda', -1, 1),
  new Among('ata', -1, 1),
  new Among('ita', -1, 1),
  new Among('uta', -1, 1),
  new Among('ava', -1, 1),
  new Among('eva', -1, 1),
  new Among('iva', -1, 1),
  new Among('erebbe', -1, 1),
  new Among('irebbe', -1, 1),
  new Among('isce', -1, 1),
  new Among('ende', -1, 1),
  new Among('are', -1, 1),
  new Among('ere', -1, 1),
  new Among('ire', -1, 1),
  new Among('asse', -1, 1),
  new Among('ate', -1, 1),
  new Among('avate', 16, 1),
  new Among('evate', 16, 1),
  new Among('ivate', 16, 1),
  new Among('ete', -1, 1),
  new Among('erete', 20, 1),
  new Among('irete', 20, 1),
  new Among('ite', -1, 1),
  new Among('ereste', -1, 1),
  new Among('ireste', -1, 1),
  new Among('ute', -1, 1),
  new Among('erai', -1, 1),
  new Among('irai', -1, 1),
  new Among('isci', -1, 1),
  new Among('endi', -1, 1),
  new Among('erei', -1, 1),
  new Among('irei', -1, 1),
  new Among('assi', -1, 1),
  new Among('ati', -1, 1),
  new Among('iti', -1, 1),
  new Among('eresti', -1, 1),
  new Among('iresti', -1, 1),
  new Among('uti', -1, 1),
  new Among('avi', -1, 1),
  new Among('evi', -1, 1),
  new Among('ivi', -1, 1),
  new Among('isco', -1, 1),
  new Among('ando', -1, 1),
  new Among('endo', -1, 1),
  new Among('Yamo', -1, 1),
  new Among('iamo', -1, 1),
  new Among('avamo', -1, 1),
  new Among('evamo', -1, 1),
  new Among('ivamo', -1, 1),
  new Among('eremo', -1, 1),
  new Among('iremo', -1, 1),
  new Among('assimo', -1, 1),
  new Among('ammo', -1, 1),
  new Among('emmo', -1, 1),
  new Among('eremmo', 54, 1),
  new Among('iremmo', 54, 1),
  new Among('immo', -1, 1),
  new Among('ano', -1, 1),
  new Among('iscano', 58, 1),
  new Among('avano', 58, 1),
  new Among('evano', 58, 1),
  new Among('ivano', 58, 1),
  new Among('eranno', -1, 1),
  new Among('iranno', -1, 1),
  new Among('ono', -1, 1),
  new Among('iscono', 65, 1),
  new Among('arono', 65, 1),
  new Among('erono', 65, 1),
  new Among('irono', 65, 1),
  new Among('erebbero', -1, 1),
  new Among('irebbero', -1, 1),
  new Among('assero', -1, 1),
  new Among('essero', -1, 1),
  new Among('issero', -1, 1),
  new Among('ato', -1, 1),
  new Among('ito', -1, 1),
  new Among('uto', -1, 1),
  new Among('avo', -1, 1),
  new Among('evo', -1, 1),
  new Among('ivo', -1, 1),
  new Among('ar', -1, 1),
  new Among('ir', -1, 1),
  new Among('er\u00E0', -1, 1),
  new Among('ir\u00E0', -1, 1),
  new Among('er\u00F2', -1, 1),
  new Among('ir\u00F2', -1, 1)
];

StemmerIt.g_v = [
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
  128,
  128,
  8,
  2,
  1
];

StemmerIt.g_AEIO = [
  17,
  65,
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
  128,
  128,
  8,
  2
];

StemmerIt.g_CG = [17];

module.exports = StemmerIt;
