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
class StemmerRo extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-ro';
    this.B_standard_suffix_removed = false;
    this.I_p2 = 0;
    this.I_p1 = 0;
    this.I_pV = 0;
  }

  copy_from(other) {
    this.B_standard_suffix_removed = other.B_standard_suffix_removed;
    this.I_p2 = other.I_p2;
    this.I_p1 = other.I_p1;
    this.I_pV = other.I_pV;
    super.copy_from(other);
  }

  r_prelude() {
    let v_1;
    let v_2;
    let v_3;
    // (, line 31
    // repeat, line 32
    replab0: while (true) {
      v_1 = this.cursor;
      let lab1 = true;
      lab1: while (lab1 == true) {
        lab1 = false;
        // goto, line 32
        golab2: while (true) {
          v_2 = this.cursor;
          let lab3 = true;
          lab3: while (lab3 == true) {
            lab3 = false;
            // (, line 32
            if (!this.in_grouping(StemmerRo.g_v, 97, 259)) {
              break;
            }
            // [, line 33
            this.bra = this.cursor;
            // or, line 33
            let lab4 = true;
            lab4: while (lab4 == true) {
              lab4 = false;
              v_3 = this.cursor;
              let lab5 = true;
              while (lab5 == true) {
                lab5 = false;
                // (, line 33
                // literal, line 33
                if (!this.eq_s(1, 'u')) {
                  break;
                }
                // ], line 33
                this.ket = this.cursor;
                if (!this.in_grouping(StemmerRo.g_v, 97, 259)) {
                  break;
                }
                // <-, line 33
                if (!this.slice_from('U')) {
                  return false;
                }
                break lab4;
              }
              this.cursor = v_3;
              // (, line 34
              // literal, line 34
              if (!this.eq_s(1, 'i')) {
                break lab3;
              }
              // ], line 34
              this.ket = this.cursor;
              if (!this.in_grouping(StemmerRo.g_v, 97, 259)) {
                break lab3;
              }
              // <-, line 34
              if (!this.slice_from('I')) {
                return false;
              }
            }
            this.cursor = v_2;
            break golab2;
          }
          this.cursor = v_2;
          if (this.cursor >= this.limit) {
            break lab1;
          }
          this.cursor++;
        }
        continue replab0;
      }
      this.cursor = v_1;
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
    // (, line 38
    this.I_pV = this.limit;
    this.I_p1 = this.limit;
    this.I_p2 = this.limit;
    // do, line 44
    v_1 = this.cursor;
    let lab0 = true;
    lab0: while (lab0 == true) {
      lab0 = false;
      // (, line 44
      // or, line 46
      let lab1 = true;
      lab1: while (lab1 == true) {
        lab1 = false;
        v_2 = this.cursor;
        let lab2 = true;
        lab2: while (lab2 == true) {
          lab2 = false;
          // (, line 45
          if (!this.in_grouping(StemmerRo.g_v, 97, 259)) {
            break;
          }
          // or, line 45
          let lab3 = true;
          lab3: while (lab3 == true) {
            lab3 = false;
            v_3 = this.cursor;
            let lab4 = true;
            lab4: while (lab4 == true) {
              lab4 = false;
              // (, line 45
              if (!this.out_grouping(StemmerRo.g_v, 97, 259)) {
                break;
              }
              // gopast, line 45
              golab5: while (true) {
                let lab6 = true;
                while (lab6 == true) {
                  lab6 = false;
                  if (!this.in_grouping(StemmerRo.g_v, 97, 259)) {
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
            // (, line 45
            if (!this.in_grouping(StemmerRo.g_v, 97, 259)) {
              break lab2;
            }
            // gopast, line 45
            golab7: while (true) {
              let lab8 = true;
              while (lab8 == true) {
                lab8 = false;
                if (!this.out_grouping(StemmerRo.g_v, 97, 259)) {
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
        // (, line 47
        if (!this.out_grouping(StemmerRo.g_v, 97, 259)) {
          break lab0;
        }
        // or, line 47
        let lab9 = true;
        lab9: while (lab9 == true) {
          lab9 = false;
          v_6 = this.cursor;
          let lab10 = true;
          lab10: while (lab10 == true) {
            lab10 = false;
            // (, line 47
            if (!this.out_grouping(StemmerRo.g_v, 97, 259)) {
              break;
            }
            // gopast, line 47
            golab11: while (true) {
              let lab12 = true;
              while (lab12 == true) {
                lab12 = false;
                if (!this.in_grouping(StemmerRo.g_v, 97, 259)) {
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
          // (, line 47
          if (!this.in_grouping(StemmerRo.g_v, 97, 259)) {
            break lab0;
          }
          // next, line 47
          if (this.cursor >= this.limit) {
            break lab0;
          }
          this.cursor++;
        }
      }
      // setmark pV, line 48
      this.I_pV = this.cursor;
    }
    this.cursor = v_1;
    // do, line 50
    v_8 = this.cursor;
    let lab13 = true;
    lab13: while (lab13 == true) {
      lab13 = false;
      // (, line 50
      // gopast, line 51
      golab14: while (true) {
        let lab15 = true;
        while (lab15 == true) {
          lab15 = false;
          if (!this.in_grouping(StemmerRo.g_v, 97, 259)) {
            break;
          }
          break golab14;
        }
        if (this.cursor >= this.limit) {
          break lab13;
        }
        this.cursor++;
      }
      // gopast, line 51
      golab16: while (true) {
        let lab17 = true;
        while (lab17 == true) {
          lab17 = false;
          if (!this.out_grouping(StemmerRo.g_v, 97, 259)) {
            break;
          }
          break golab16;
        }
        if (this.cursor >= this.limit) {
          break lab13;
        }
        this.cursor++;
      }
      // setmark p1, line 51
      this.I_p1 = this.cursor;
      // gopast, line 52
      golab18: while (true) {
        let lab19 = true;
        while (lab19 == true) {
          lab19 = false;
          if (!this.in_grouping(StemmerRo.g_v, 97, 259)) {
            break;
          }
          break golab18;
        }
        if (this.cursor >= this.limit) {
          break lab13;
        }
        this.cursor++;
      }
      // gopast, line 52
      golab20: while (true) {
        let lab21 = true;
        while (lab21 == true) {
          lab21 = false;
          if (!this.out_grouping(StemmerRo.g_v, 97, 259)) {
            break;
          }
          break golab20;
        }
        if (this.cursor >= this.limit) {
          break lab13;
        }
        this.cursor++;
      }
      // setmark p2, line 52
      this.I_p2 = this.cursor;
    }
    this.cursor = v_8;
    return true;
  }

  r_postlude() {
    let among_var;
    let v_1;
    // repeat, line 56
    replab0: while (true) {
      v_1 = this.cursor;
      let lab1 = true;
      lab1: while (lab1 == true) {
        lab1 = false;
        // (, line 56
        // [, line 58
        this.bra = this.cursor;
        // substring, line 58
        among_var = this.find_among(StemmerRo.a_0, 3);
        if (among_var == 0) {
          break;
        }
        // ], line 58
        this.ket = this.cursor;
        switch (among_var) {
          case 0:
            break lab1;
          case 1:
            // (, line 59
            // <-, line 59
            if (!this.slice_from('i')) {
              return false;
            }
            break;
          case 2:
            // (, line 60
            // <-, line 60
            if (!this.slice_from('u')) {
              return false;
            }
            break;
          case 3:
            // (, line 61
            // next, line 61
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

  r_step_0() {
    let among_var;
    let v_1;
    // (, line 72
    // [, line 73
    this.ket = this.cursor;
    // substring, line 73
    among_var = this.find_among_b(StemmerRo.a_1, 16);
    if (among_var == 0) {
      return false;
    }
    // ], line 73
    this.bra = this.cursor;
    // call R1, line 73
    if (!this.r_R1()) {
      return false;
    }
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 75
        // delete, line 75
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 77
        // <-, line 77
        if (!this.slice_from('a')) {
          return false;
        }
        break;
      case 3:
        // (, line 79
        // <-, line 79
        if (!this.slice_from('e')) {
          return false;
        }
        break;
      case 4:
        // (, line 81
        // <-, line 81
        if (!this.slice_from('i')) {
          return false;
        }
        break;
      case 5:
        // (, line 83
        // not, line 83
        {
          v_1 = this.limit - this.cursor;
          let lab0 = true;
          while (lab0 == true) {
            lab0 = false;
            // literal, line 83
            if (!this.eq_s_b(2, 'ab')) {
              break;
            }
            return false;
          }
          this.cursor = this.limit - v_1;
        }
        // <-, line 83
        if (!this.slice_from('i')) {
          return false;
        }
        break;
      case 6:
        // (, line 85
        // <-, line 85
        if (!this.slice_from('at')) {
          return false;
        }
        break;
      case 7:
        // (, line 87
        // <-, line 87
        if (!this.slice_from('a\u0163i')) {
          return false;
        }
        break;
    }
    return true;
  }

  r_combo_suffix() {
    let among_var;
    let v_1;
    // test, line 91
    v_1 = this.limit - this.cursor;
    // (, line 91
    // [, line 92
    this.ket = this.cursor;
    // substring, line 92
    among_var = this.find_among_b(StemmerRo.a_2, 46);
    if (among_var == 0) {
      return false;
    }
    // ], line 92
    this.bra = this.cursor;
    // call R1, line 92
    if (!this.r_R1()) {
      return false;
    }
    // (, line 92
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 100
        // <-, line 101
        if (!this.slice_from('abil')) {
          return false;
        }
        break;
      case 2:
        // (, line 103
        // <-, line 104
        if (!this.slice_from('ibil')) {
          return false;
        }
        break;
      case 3:
        // (, line 106
        // <-, line 107
        if (!this.slice_from('iv')) {
          return false;
        }
        break;
      case 4:
        // (, line 112
        // <-, line 113
        if (!this.slice_from('ic')) {
          return false;
        }
        break;
      case 5:
        // (, line 117
        // <-, line 118
        if (!this.slice_from('at')) {
          return false;
        }
        break;
      case 6:
        // (, line 121
        // <-, line 122
        if (!this.slice_from('it')) {
          return false;
        }
        break;
    }
    // set standard_suffix_removed, line 125
    this.B_standard_suffix_removed = true;
    this.cursor = this.limit - v_1;
    return true;
  }

  r_standard_suffix() {
    let among_var;
    let v_1;
    // (, line 129
    // unset standard_suffix_removed, line 130
    this.B_standard_suffix_removed = false;
    // repeat, line 131
    replab0: while (true) {
      v_1 = this.limit - this.cursor;
      let lab1 = true;
      while (lab1 == true) {
        lab1 = false;
        // call combo_suffix, line 131
        if (!this.r_combo_suffix()) {
          break;
        }
        continue replab0;
      }
      this.cursor = this.limit - v_1;
      break;
    }
    // [, line 132
    this.ket = this.cursor;
    // substring, line 132
    among_var = this.find_among_b(StemmerRo.a_3, 62);
    if (among_var == 0) {
      return false;
    }
    // ], line 132
    this.bra = this.cursor;
    // call R2, line 132
    if (!this.r_R2()) {
      return false;
    }
    // (, line 132
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 148
        // delete, line 149
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 151
        // literal, line 152
        if (!this.eq_s_b(1, '\u0163')) {
          return false;
        }
        // ], line 152
        this.bra = this.cursor;
        // <-, line 152
        if (!this.slice_from('t')) {
          return false;
        }
        break;
      case 3:
        // (, line 155
        // <-, line 156
        if (!this.slice_from('ist')) {
          return false;
        }
        break;
    }
    // set standard_suffix_removed, line 160
    this.B_standard_suffix_removed = true;
    return true;
  }

  r_verb_suffix() {
    let among_var;
    let v_1;
    let v_2;
    let v_3;
    // setlimit, line 164
    v_1 = this.limit - this.cursor;
    // tomark, line 164
    if (this.cursor < this.I_pV) {
      return false;
    }
    this.cursor = this.I_pV;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 164
    // [, line 165
    this.ket = this.cursor;
    // substring, line 165
    among_var = this.find_among_b(StemmerRo.a_4, 94);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 165
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        this.limit_backward = v_2;
        return false;
      case 1:
        // (, line 200
        // or, line 200
        var lab0 = true;
        lab0: while (lab0 == true) {
          lab0 = false;
          v_3 = this.limit - this.cursor;
          let lab1 = true;
          while (lab1 == true) {
            lab1 = false;
            if (!this.out_grouping_b(StemmerRo.g_v, 97, 259)) {
              break;
            }
            break lab0;
          }
          this.cursor = this.limit - v_3;
          // literal, line 200
          if (!this.eq_s_b(1, 'u')) {
            this.limit_backward = v_2;
            return false;
          }
        }
        // delete, line 200
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 214
        // delete, line 214
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    this.limit_backward = v_2;
    return true;
  }

  r_vowel_suffix() {
    let among_var;
    // (, line 218
    // [, line 219
    this.ket = this.cursor;
    // substring, line 219
    among_var = this.find_among_b(StemmerRo.a_5, 5);
    if (among_var == 0) {
      return false;
    }
    // ], line 219
    this.bra = this.cursor;
    // call RV, line 219
    if (!this.r_RV()) {
      return false;
    }
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 220
        // delete, line 220
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
    // (, line 225
    // do, line 226
    v_1 = this.cursor;
    let lab0 = true;
    while (lab0 == true) {
      lab0 = false;
      // call prelude, line 226
      if (!this.r_prelude()) {
        break;
      }
    }
    this.cursor = v_1;
    // do, line 227
    v_2 = this.cursor;
    let lab1 = true;
    while (lab1 == true) {
      lab1 = false;
      // call mark_regions, line 227
      if (!this.r_mark_regions()) {
        break;
      }
    }
    this.cursor = v_2;
    // backwards, line 228
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    // (, line 228
    // do, line 229
    v_3 = this.limit - this.cursor;
    let lab2 = true;
    while (lab2 == true) {
      lab2 = false;
      // call step_0, line 229
      if (!this.r_step_0()) {
        break;
      }
    }
    this.cursor = this.limit - v_3;
    // do, line 230
    v_4 = this.limit - this.cursor;
    let lab3 = true;
    while (lab3 == true) {
      lab3 = false;
      // call standard_suffix, line 230
      if (!this.r_standard_suffix()) {
        break;
      }
    }
    this.cursor = this.limit - v_4;
    // do, line 231
    v_5 = this.limit - this.cursor;
    let lab4 = true;
    lab4: while (lab4 == true) {
      lab4 = false;
      // (, line 231
      // or, line 231
      let lab5 = true;
      lab5: while (lab5 == true) {
        lab5 = false;
        v_6 = this.limit - this.cursor;
        let lab6 = true;
        while (lab6 == true) {
          lab6 = false;
          // Boolean test standard_suffix_removed, line 231
          if (!this.B_standard_suffix_removed) {
            break;
          }
          break lab5;
        }
        this.cursor = this.limit - v_6;
        // call verb_suffix, line 231
        if (!this.r_verb_suffix()) {
          break lab4;
        }
      }
    }
    this.cursor = this.limit - v_5;
    // do, line 232
    v_7 = this.limit - this.cursor;
    let lab7 = true;
    while (lab7 == true) {
      lab7 = false;
      // call vowel_suffix, line 232
      if (!this.r_vowel_suffix()) {
        break;
      }
    }
    this.cursor = this.limit - v_7;
    this.cursor = this.limit_backward; // do, line 234
    v_8 = this.cursor;
    let lab8 = true;
    while (lab8 == true) {
      lab8 = false;
      // call postlude, line 234
      if (!this.r_postlude()) {
        break;
      }
    }
    this.cursor = v_8;
    return true;
  }
}

StemmerRo.methodObject = new StemmerRo();

StemmerRo.a_0 = [
  new Among('', -1, 3),
  new Among('I', 0, 1),
  new Among('U', 0, 2)
];

StemmerRo.a_1 = [
  new Among('ea', -1, 3),
  new Among('a\u0163ia', -1, 7),
  new Among('aua', -1, 2),
  new Among('iua', -1, 4),
  new Among('a\u0163ie', -1, 7),
  new Among('ele', -1, 3),
  new Among('ile', -1, 5),
  new Among('iile', 6, 4),
  new Among('iei', -1, 4),
  new Among('atei', -1, 6),
  new Among('ii', -1, 4),
  new Among('ului', -1, 1),
  new Among('ul', -1, 1),
  new Among('elor', -1, 3),
  new Among('ilor', -1, 4),
  new Among('iilor', 14, 4)
];

StemmerRo.a_2 = [
  new Among('icala', -1, 4),
  new Among('iciva', -1, 4),
  new Among('ativa', -1, 5),
  new Among('itiva', -1, 6),
  new Among('icale', -1, 4),
  new Among('a\u0163iune', -1, 5),
  new Among('i\u0163iune', -1, 6),
  new Among('atoare', -1, 5),
  new Among('itoare', -1, 6),
  new Among('\u0103toare', -1, 5),
  new Among('icitate', -1, 4),
  new Among('abilitate', -1, 1),
  new Among('ibilitate', -1, 2),
  new Among('ivitate', -1, 3),
  new Among('icive', -1, 4),
  new Among('ative', -1, 5),
  new Among('itive', -1, 6),
  new Among('icali', -1, 4),
  new Among('atori', -1, 5),
  new Among('icatori', 18, 4),
  new Among('itori', -1, 6),
  new Among('\u0103tori', -1, 5),
  new Among('icitati', -1, 4),
  new Among('abilitati', -1, 1),
  new Among('ivitati', -1, 3),
  new Among('icivi', -1, 4),
  new Among('ativi', -1, 5),
  new Among('itivi', -1, 6),
  new Among('icit\u0103i', -1, 4),
  new Among('abilit\u0103i', -1, 1),
  new Among('ivit\u0103i', -1, 3),
  new Among('icit\u0103\u0163i', -1, 4),
  new Among('abilit\u0103\u0163i', -1, 1),
  new Among('ivit\u0103\u0163i', -1, 3),
  new Among('ical', -1, 4),
  new Among('ator', -1, 5),
  new Among('icator', 35, 4),
  new Among('itor', -1, 6),
  new Among('\u0103tor', -1, 5),
  new Among('iciv', -1, 4),
  new Among('ativ', -1, 5),
  new Among('itiv', -1, 6),
  new Among('ical\u0103', -1, 4),
  new Among('iciv\u0103', -1, 4),
  new Among('ativ\u0103', -1, 5),
  new Among('itiv\u0103', -1, 6)
];

StemmerRo.a_3 = [
  new Among('ica', -1, 1),
  new Among('abila', -1, 1),
  new Among('ibila', -1, 1),
  new Among('oasa', -1, 1),
  new Among('ata', -1, 1),
  new Among('ita', -1, 1),
  new Among('anta', -1, 1),
  new Among('ista', -1, 3),
  new Among('uta', -1, 1),
  new Among('iva', -1, 1),
  new Among('ic', -1, 1),
  new Among('ice', -1, 1),
  new Among('abile', -1, 1),
  new Among('ibile', -1, 1),
  new Among('isme', -1, 3),
  new Among('iune', -1, 2),
  new Among('oase', -1, 1),
  new Among('ate', -1, 1),
  new Among('itate', 17, 1),
  new Among('ite', -1, 1),
  new Among('ante', -1, 1),
  new Among('iste', -1, 3),
  new Among('ute', -1, 1),
  new Among('ive', -1, 1),
  new Among('ici', -1, 1),
  new Among('abili', -1, 1),
  new Among('ibili', -1, 1),
  new Among('iuni', -1, 2),
  new Among('atori', -1, 1),
  new Among('osi', -1, 1),
  new Among('ati', -1, 1),
  new Among('itati', 30, 1),
  new Among('iti', -1, 1),
  new Among('anti', -1, 1),
  new Among('isti', -1, 3),
  new Among('uti', -1, 1),
  new Among('i\u015Fti', -1, 3),
  new Among('ivi', -1, 1),
  new Among('it\u0103i', -1, 1),
  new Among('o\u015Fi', -1, 1),
  new Among('it\u0103\u0163i', -1, 1),
  new Among('abil', -1, 1),
  new Among('ibil', -1, 1),
  new Among('ism', -1, 3),
  new Among('ator', -1, 1),
  new Among('os', -1, 1),
  new Among('at', -1, 1),
  new Among('it', -1, 1),
  new Among('ant', -1, 1),
  new Among('ist', -1, 3),
  new Among('ut', -1, 1),
  new Among('iv', -1, 1),
  new Among('ic\u0103', -1, 1),
  new Among('abil\u0103', -1, 1),
  new Among('ibil\u0103', -1, 1),
  new Among('oas\u0103', -1, 1),
  new Among('at\u0103', -1, 1),
  new Among('it\u0103', -1, 1),
  new Among('ant\u0103', -1, 1),
  new Among('ist\u0103', -1, 3),
  new Among('ut\u0103', -1, 1),
  new Among('iv\u0103', -1, 1)
];

StemmerRo.a_4 = [
  new Among('ea', -1, 1),
  new Among('ia', -1, 1),
  new Among('esc', -1, 1),
  new Among('\u0103sc', -1, 1),
  new Among('ind', -1, 1),
  new Among('\u00E2nd', -1, 1),
  new Among('are', -1, 1),
  new Among('ere', -1, 1),
  new Among('ire', -1, 1),
  new Among('\u00E2re', -1, 1),
  new Among('se', -1, 2),
  new Among('ase', 10, 1),
  new Among('sese', 10, 2),
  new Among('ise', 10, 1),
  new Among('use', 10, 1),
  new Among('\u00E2se', 10, 1),
  new Among('e\u015Fte', -1, 1),
  new Among('\u0103\u015Fte', -1, 1),
  new Among('eze', -1, 1),
  new Among('ai', -1, 1),
  new Among('eai', 19, 1),
  new Among('iai', 19, 1),
  new Among('sei', -1, 2),
  new Among('e\u015Fti', -1, 1),
  new Among('\u0103\u015Fti', -1, 1),
  new Among('ui', -1, 1),
  new Among('ezi', -1, 1),
  new Among('\u00E2i', -1, 1),
  new Among('a\u015Fi', -1, 1),
  new Among('se\u015Fi', -1, 2),
  new Among('ase\u015Fi', 29, 1),
  new Among('sese\u015Fi', 29, 2),
  new Among('ise\u015Fi', 29, 1),
  new Among('use\u015Fi', 29, 1),
  new Among('\u00E2se\u015Fi', 29, 1),
  new Among('i\u015Fi', -1, 1),
  new Among('u\u015Fi', -1, 1),
  new Among('\u00E2\u015Fi', -1, 1),
  new Among('a\u0163i', -1, 2),
  new Among('ea\u0163i', 38, 1),
  new Among('ia\u0163i', 38, 1),
  new Among('e\u0163i', -1, 2),
  new Among('i\u0163i', -1, 2),
  new Among('\u00E2\u0163i', -1, 2),
  new Among('ar\u0103\u0163i', -1, 1),
  new Among('ser\u0103\u0163i', -1, 2),
  new Among('aser\u0103\u0163i', 45, 1),
  new Among('seser\u0103\u0163i', 45, 2),
  new Among('iser\u0103\u0163i', 45, 1),
  new Among('user\u0103\u0163i', 45, 1),
  new Among('\u00E2ser\u0103\u0163i', 45, 1),
  new Among('ir\u0103\u0163i', -1, 1),
  new Among('ur\u0103\u0163i', -1, 1),
  new Among('\u00E2r\u0103\u0163i', -1, 1),
  new Among('am', -1, 1),
  new Among('eam', 54, 1),
  new Among('iam', 54, 1),
  new Among('em', -1, 2),
  new Among('asem', 57, 1),
  new Among('sesem', 57, 2),
  new Among('isem', 57, 1),
  new Among('usem', 57, 1),
  new Among('\u00E2sem', 57, 1),
  new Among('im', -1, 2),
  new Among('\u00E2m', -1, 2),
  new Among('\u0103m', -1, 2),
  new Among('ar\u0103m', 65, 1),
  new Among('ser\u0103m', 65, 2),
  new Among('aser\u0103m', 67, 1),
  new Among('seser\u0103m', 67, 2),
  new Among('iser\u0103m', 67, 1),
  new Among('user\u0103m', 67, 1),
  new Among('\u00E2ser\u0103m', 67, 1),
  new Among('ir\u0103m', 65, 1),
  new Among('ur\u0103m', 65, 1),
  new Among('\u00E2r\u0103m', 65, 1),
  new Among('au', -1, 1),
  new Among('eau', 76, 1),
  new Among('iau', 76, 1),
  new Among('indu', -1, 1),
  new Among('\u00E2ndu', -1, 1),
  new Among('ez', -1, 1),
  new Among('easc\u0103', -1, 1),
  new Among('ar\u0103', -1, 1),
  new Among('ser\u0103', -1, 2),
  new Among('aser\u0103', 84, 1),
  new Among('seser\u0103', 84, 2),
  new Among('iser\u0103', 84, 1),
  new Among('user\u0103', 84, 1),
  new Among('\u00E2ser\u0103', 84, 1),
  new Among('ir\u0103', -1, 1),
  new Among('ur\u0103', -1, 1),
  new Among('\u00E2r\u0103', -1, 1),
  new Among('eaz\u0103', -1, 1)
];

StemmerRo.a_5 = [
  new Among('a', -1, 1),
  new Among('e', -1, 1),
  new Among('ie', 1, 1),
  new Among('i', -1, 1),
  new Among('\u0103', -1, 1)
];

StemmerRo.g_v = [
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
  2,
  32,
  0,
  0,
  4
];

module.exports = StemmerRo;
