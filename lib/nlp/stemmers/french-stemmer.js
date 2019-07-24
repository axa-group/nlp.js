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
const stopwords = require('../stopwords/stopwords_fr.json');

class FrenchStemmer extends BaseStemmer {
  constructor(tokenizer) {
    super(tokenizer, stopwords.words);

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
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    // repeat, line 38
    replab0: while (true) {
      v_1 = this.cursor;
      let lab1 = true;
      lab1: while (lab1 == true) {
        lab1 = false;
        // goto, line 38
        golab2: while (true) {
          v_2 = this.cursor;
          let lab3 = true;
          lab3: while (lab3 == true) {
            lab3 = false;
            // (, line 38
            // or, line 44
            let lab4 = true;
            lab4: while (lab4 == true) {
              lab4 = false;
              v_3 = this.cursor;
              let lab5 = true;
              lab5: while (lab5 == true) {
                lab5 = false;
                // (, line 40
                if (!this.in_grouping(FrenchStemmer.g_v, 97, 251)) {
                  break;
                }
                // [, line 40
                this.bra = this.cursor;
                // or, line 40
                let lab6 = true;
                lab6: while (lab6 == true) {
                  lab6 = false;
                  v_4 = this.cursor;
                  let lab7 = true;
                  while (lab7 == true) {
                    lab7 = false;
                    // (, line 40
                    // literal, line 40
                    if (!this.eq_s(1, 'u')) {
                      break;
                    }
                    // ], line 40
                    this.ket = this.cursor;
                    if (!this.in_grouping(FrenchStemmer.g_v, 97, 251)) {
                      break;
                    }
                    // <-, line 40
                    if (!this.slice_from('U')) {
                      return false;
                    }
                    break lab6;
                  }
                  this.cursor = v_4;
                  let lab8 = true;
                  while (lab8 == true) {
                    lab8 = false;
                    // (, line 41
                    // literal, line 41
                    if (!this.eq_s(1, 'i')) {
                      break;
                    }
                    // ], line 41
                    this.ket = this.cursor;
                    if (!this.in_grouping(FrenchStemmer.g_v, 97, 251)) {
                      break;
                    }
                    // <-, line 41
                    if (!this.slice_from('I')) {
                      return false;
                    }
                    break lab6;
                  }
                  this.cursor = v_4;
                  // (, line 42
                  // literal, line 42
                  if (!this.eq_s(1, 'y')) {
                    break lab5;
                  }
                  // ], line 42
                  this.ket = this.cursor;
                  // <-, line 42
                  if (!this.slice_from('Y')) {
                    return false;
                  }
                }
                break lab4;
              }
              this.cursor = v_3;
              let lab9 = true;
              while (lab9 == true) {
                lab9 = false;
                // (, line 45
                // [, line 45
                this.bra = this.cursor;
                // literal, line 45
                if (!this.eq_s(1, 'y')) {
                  break;
                }
                // ], line 45
                this.ket = this.cursor;
                if (!this.in_grouping(FrenchStemmer.g_v, 97, 251)) {
                  break;
                }
                // <-, line 45
                if (!this.slice_from('Y')) {
                  return false;
                }
                break lab4;
              }
              this.cursor = v_3;
              // (, line 47
              // literal, line 47
              if (!this.eq_s(1, 'q')) {
                break lab3;
              }
              // [, line 47
              this.bra = this.cursor;
              // literal, line 47
              if (!this.eq_s(1, 'u')) {
                break lab3;
              }
              // ], line 47
              this.ket = this.cursor;
              // <-, line 47
              if (!this.slice_from('U')) {
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
    let v_4;
    // (, line 50
    this.I_pV = this.limit;
    this.I_p1 = this.limit;
    this.I_p2 = this.limit;
    // do, line 56
    v_1 = this.cursor;
    let lab0 = true;
    lab0: while (lab0 == true) {
      lab0 = false;
      // (, line 56
      // or, line 58
      let lab1 = true;
      lab1: while (lab1 == true) {
        lab1 = false;
        v_2 = this.cursor;
        let lab2 = true;
        while (lab2 == true) {
          lab2 = false;
          // (, line 57
          if (!this.in_grouping(FrenchStemmer.g_v, 97, 251)) {
            break;
          }
          if (!this.in_grouping(FrenchStemmer.g_v, 97, 251)) {
            break;
          }
          // next, line 57
          if (this.cursor >= this.limit) {
            break;
          }
          this.cursor++;
          break lab1;
        }
        this.cursor = v_2;
        let lab3 = true;
        while (lab3 == true) {
          lab3 = false;
          // among, line 59
          if (this.find_among(FrenchStemmer.a_0, 3) == 0) {
            break;
          }
          break lab1;
        }
        this.cursor = v_2;
        // (, line 66
        // next, line 66
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
        // gopast, line 66
        golab4: while (true) {
          let lab5 = true;
          while (lab5 == true) {
            lab5 = false;
            if (!this.in_grouping(FrenchStemmer.g_v, 97, 251)) {
              break;
            }
            break golab4;
          }
          if (this.cursor >= this.limit) {
            break lab0;
          }
          this.cursor++;
        }
      }
      // setmark pV, line 67
      this.I_pV = this.cursor;
    }
    this.cursor = v_1;
    // do, line 69
    v_4 = this.cursor;
    let lab6 = true;
    lab6: while (lab6 == true) {
      lab6 = false;
      // (, line 69
      // gopast, line 70
      golab7: while (true) {
        let lab8 = true;
        while (lab8 == true) {
          lab8 = false;
          if (!this.in_grouping(FrenchStemmer.g_v, 97, 251)) {
            break;
          }
          break golab7;
        }
        if (this.cursor >= this.limit) {
          break lab6;
        }
        this.cursor++;
      }
      // gopast, line 70
      golab9: while (true) {
        let lab10 = true;
        while (lab10 == true) {
          lab10 = false;
          if (!this.out_grouping(FrenchStemmer.g_v, 97, 251)) {
            break;
          }
          break golab9;
        }
        if (this.cursor >= this.limit) {
          break lab6;
        }
        this.cursor++;
      }
      // setmark p1, line 70
      this.I_p1 = this.cursor;
      // gopast, line 71
      golab11: while (true) {
        let lab12 = true;
        while (lab12 == true) {
          lab12 = false;
          if (!this.in_grouping(FrenchStemmer.g_v, 97, 251)) {
            break;
          }
          break golab11;
        }
        if (this.cursor >= this.limit) {
          break lab6;
        }
        this.cursor++;
      }
      // gopast, line 71
      golab13: while (true) {
        let lab14 = true;
        while (lab14 == true) {
          lab14 = false;
          if (!this.out_grouping(FrenchStemmer.g_v, 97, 251)) {
            break;
          }
          break golab13;
        }
        if (this.cursor >= this.limit) {
          break lab6;
        }
        this.cursor++;
      }
      // setmark p2, line 71
      this.I_p2 = this.cursor;
    }
    this.cursor = v_4;
    return true;
  }

  r_postlude() {
    let among_var;
    let v_1;
    // repeat, line 75
    replab0: while (true) {
      v_1 = this.cursor;
      let lab1 = true;
      lab1: while (lab1 == true) {
        lab1 = false;
        // (, line 75
        // [, line 77
        this.bra = this.cursor;
        // substring, line 77
        among_var = this.find_among(FrenchStemmer.a_1, 4);
        if (among_var == 0) {
          break;
        }
        // ], line 77
        this.ket = this.cursor;
        switch (among_var) {
          case 0:
            break lab1;
          case 1:
            // (, line 78
            // <-, line 78
            if (!this.slice_from('i')) {
              return false;
            }
            break;
          case 2:
            // (, line 79
            // <-, line 79
            if (!this.slice_from('u')) {
              return false;
            }
            break;
          case 3:
            // (, line 80
            // <-, line 80
            if (!this.slice_from('y')) {
              return false;
            }
            break;
          case 4:
            // (, line 81
            // next, line 81
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

  r_standard_suffix() {
    let among_var;
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
    let v_11;
    // (, line 91
    // [, line 92
    this.ket = this.cursor;
    // substring, line 92
    among_var = this.find_among_b(FrenchStemmer.a_4, 43);
    if (among_var == 0) {
      return false;
    }
    // ], line 92
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        // (, line 96
        // call R2, line 96
        if (!this.r_R2()) {
          return false;
        }
        // delete, line 96
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 99
        // call R2, line 99
        if (!this.r_R2()) {
          return false;
        }
        // delete, line 99
        if (!this.slice_del()) {
          return false;
        }
        // try, line 100
        v_1 = this.limit - this.cursor;
        var lab0 = true;
        while (lab0 == true) {
          lab0 = false;
          // (, line 100
          // [, line 100
          this.ket = this.cursor;
          // literal, line 100
          if (!this.eq_s_b(2, 'ic')) {
            this.cursor = this.limit - v_1;
            break;
          }
          // ], line 100
          this.bra = this.cursor;
          // or, line 100
          let lab1 = true;
          lab1: while (lab1 == true) {
            lab1 = false;
            v_2 = this.limit - this.cursor;
            let lab2 = true;
            while (lab2 == true) {
              lab2 = false;
              // (, line 100
              // call R2, line 100
              if (!this.r_R2()) {
                break;
              }
              // delete, line 100
              if (!this.slice_del()) {
                return false;
              }
              break lab1;
            }
            this.cursor = this.limit - v_2;
            // <-, line 100
            if (!this.slice_from('iqU')) {
              return false;
            }
          }
        }
        break;
      case 3:
        // (, line 104
        // call R2, line 104
        if (!this.r_R2()) {
          return false;
        }
        // <-, line 104
        if (!this.slice_from('log')) {
          return false;
        }
        break;
      case 4:
        // (, line 107
        // call R2, line 107
        if (!this.r_R2()) {
          return false;
        }
        // <-, line 107
        if (!this.slice_from('u')) {
          return false;
        }
        break;
      case 5:
        // (, line 110
        // call R2, line 110
        if (!this.r_R2()) {
          return false;
        }
        // <-, line 110
        if (!this.slice_from('ent')) {
          return false;
        }
        break;
      case 6:
        // (, line 113
        // call RV, line 114
        if (!this.r_RV()) {
          return false;
        }
        // delete, line 114
        if (!this.slice_del()) {
          return false;
        }
        // try, line 115
        v_3 = this.limit - this.cursor;
        var lab3 = true;
        lab3: while (lab3 == true) {
          lab3 = false;
          // (, line 115
          // [, line 116
          this.ket = this.cursor;
          // substring, line 116
          among_var = this.find_among_b(FrenchStemmer.a_2, 6);
          if (among_var == 0) {
            this.cursor = this.limit - v_3;
            break;
          }
          // ], line 116
          this.bra = this.cursor;
          switch (among_var) {
            case 0:
              this.cursor = this.limit - v_3;
              break lab3;
            case 1:
              // (, line 117
              // call R2, line 117
              if (!this.r_R2()) {
                this.cursor = this.limit - v_3;
                break lab3;
              }
              // delete, line 117
              if (!this.slice_del()) {
                return false;
              }
              // [, line 117
              this.ket = this.cursor;
              // literal, line 117
              if (!this.eq_s_b(2, 'at')) {
                this.cursor = this.limit - v_3;
                break lab3;
              }
              // ], line 117
              this.bra = this.cursor;
              // call R2, line 117
              if (!this.r_R2()) {
                this.cursor = this.limit - v_3;
                break lab3;
              }
              // delete, line 117
              if (!this.slice_del()) {
                return false;
              }
              break;
            case 2:
              // (, line 118
              // or, line 118
              var lab4 = true;
              lab4: while (lab4 == true) {
                lab4 = false;
                v_4 = this.limit - this.cursor;
                let lab5 = true;
                while (lab5 == true) {
                  lab5 = false;
                  // (, line 118
                  // call R2, line 118
                  if (!this.r_R2()) {
                    break;
                  }
                  // delete, line 118
                  if (!this.slice_del()) {
                    return false;
                  }
                  break lab4;
                }
                this.cursor = this.limit - v_4;
                // (, line 118
                // call R1, line 118
                if (!this.r_R1()) {
                  this.cursor = this.limit - v_3;
                  break lab3;
                }
                // <-, line 118
                if (!this.slice_from('eux')) {
                  return false;
                }
              }
              break;
            case 3:
              // (, line 120
              // call R2, line 120
              if (!this.r_R2()) {
                this.cursor = this.limit - v_3;
                break lab3;
              }
              // delete, line 120
              if (!this.slice_del()) {
                return false;
              }
              break;
            case 4:
              // (, line 122
              // call RV, line 122
              if (!this.r_RV()) {
                this.cursor = this.limit - v_3;
                break lab3;
              }
              // <-, line 122
              if (!this.slice_from('i')) {
                return false;
              }
              break;
          }
        }
        break;
      case 7:
        // (, line 128
        // call R2, line 129
        if (!this.r_R2()) {
          return false;
        }
        // delete, line 129
        if (!this.slice_del()) {
          return false;
        }
        // try, line 130
        v_5 = this.limit - this.cursor;
        var lab6 = true;
        lab6: while (lab6 == true) {
          lab6 = false;
          // (, line 130
          // [, line 131
          this.ket = this.cursor;
          // substring, line 131
          among_var = this.find_among_b(FrenchStemmer.a_3, 3);
          if (among_var == 0) {
            this.cursor = this.limit - v_5;
            break;
          }
          // ], line 131
          this.bra = this.cursor;
          switch (among_var) {
            case 0:
              this.cursor = this.limit - v_5;
              break lab6;
            case 1:
              // (, line 132
              // or, line 132
              var lab7 = true;
              lab7: while (lab7 == true) {
                lab7 = false;
                v_6 = this.limit - this.cursor;
                let lab8 = true;
                while (lab8 == true) {
                  lab8 = false;
                  // (, line 132
                  // call R2, line 132
                  if (!this.r_R2()) {
                    break;
                  }
                  // delete, line 132
                  if (!this.slice_del()) {
                    return false;
                  }
                  break lab7;
                }
                this.cursor = this.limit - v_6;
                // <-, line 132
                if (!this.slice_from('abl')) {
                  return false;
                }
              }
              break;
            case 2:
              // (, line 133
              // or, line 133
              var lab9 = true;
              lab9: while (lab9 == true) {
                lab9 = false;
                v_7 = this.limit - this.cursor;
                let lab10 = true;
                while (lab10 == true) {
                  lab10 = false;
                  // (, line 133
                  // call R2, line 133
                  if (!this.r_R2()) {
                    break;
                  }
                  // delete, line 133
                  if (!this.slice_del()) {
                    return false;
                  }
                  break lab9;
                }
                this.cursor = this.limit - v_7;
                // <-, line 133
                if (!this.slice_from('iqU')) {
                  return false;
                }
              }
              break;
            case 3:
              // (, line 134
              // call R2, line 134
              if (!this.r_R2()) {
                this.cursor = this.limit - v_5;
                break lab6;
              }
              // delete, line 134
              if (!this.slice_del()) {
                return false;
              }
              break;
          }
        }
        break;
      case 8:
        // (, line 140
        // call R2, line 141
        if (!this.r_R2()) {
          return false;
        }
        // delete, line 141
        if (!this.slice_del()) {
          return false;
        }
        // try, line 142
        v_8 = this.limit - this.cursor;
        var lab11 = true;
        while (lab11 == true) {
          lab11 = false;
          // (, line 142
          // [, line 142
          this.ket = this.cursor;
          // literal, line 142
          if (!this.eq_s_b(2, 'at')) {
            this.cursor = this.limit - v_8;
            break;
          }
          // ], line 142
          this.bra = this.cursor;
          // call R2, line 142
          if (!this.r_R2()) {
            this.cursor = this.limit - v_8;
            break;
          }
          // delete, line 142
          if (!this.slice_del()) {
            return false;
          }
          // [, line 142
          this.ket = this.cursor;
          // literal, line 142
          if (!this.eq_s_b(2, 'ic')) {
            this.cursor = this.limit - v_8;
            break;
          }
          // ], line 142
          this.bra = this.cursor;
          // or, line 142
          let lab12 = true;
          lab12: while (lab12 == true) {
            lab12 = false;
            v_9 = this.limit - this.cursor;
            let lab13 = true;
            while (lab13 == true) {
              lab13 = false;
              // (, line 142
              // call R2, line 142
              if (!this.r_R2()) {
                break;
              }
              // delete, line 142
              if (!this.slice_del()) {
                return false;
              }
              break lab12;
            }
            this.cursor = this.limit - v_9;
            // <-, line 142
            if (!this.slice_from('iqU')) {
              return false;
            }
          }
        }
        break;
      case 9:
        // (, line 144
        // <-, line 144
        if (!this.slice_from('eau')) {
          return false;
        }
        break;
      case 10:
        // (, line 145
        // call R1, line 145
        if (!this.r_R1()) {
          return false;
        }
        // <-, line 145
        if (!this.slice_from('al')) {
          return false;
        }
        break;
      case 11:
        // (, line 147
        // or, line 147
        var lab14 = true;
        lab14: while (lab14 == true) {
          lab14 = false;
          v_10 = this.limit - this.cursor;
          let lab15 = true;
          while (lab15 == true) {
            lab15 = false;
            // (, line 147
            // call R2, line 147
            if (!this.r_R2()) {
              break;
            }
            // delete, line 147
            if (!this.slice_del()) {
              return false;
            }
            break lab14;
          }
          this.cursor = this.limit - v_10;
          // (, line 147
          // call R1, line 147
          if (!this.r_R1()) {
            return false;
          }
          // <-, line 147
          if (!this.slice_from('eux')) {
            return false;
          }
        }
        break;
      case 12:
        // (, line 150
        // call R1, line 150
        if (!this.r_R1()) {
          return false;
        }
        if (!this.out_grouping_b(FrenchStemmer.g_v, 97, 251)) {
          return false;
        }
        // delete, line 150
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 13:
        // (, line 155
        // call RV, line 155
        if (!this.r_RV()) {
          return false;
        }
        // fail, line 155
        // (, line 155
        // <-, line 155
        if (!this.slice_from('ant')) {
          return false;
        }
        return false;
      case 14:
        // (, line 156
        // call RV, line 156
        if (!this.r_RV()) {
          return false;
        }
        // fail, line 156
        // (, line 156
        // <-, line 156
        if (!this.slice_from('ent')) {
          return false;
        }
        return false;
      case 15:
        // (, line 158
        // test, line 158
        v_11 = this.limit - this.cursor;
        // (, line 158
        if (!this.in_grouping_b(FrenchStemmer.g_v, 97, 251)) {
          return false;
        }
        // call RV, line 158
        if (!this.r_RV()) {
          return false;
        }
        this.cursor = this.limit - v_11;
        // fail, line 158
        // (, line 158
        // delete, line 158
        if (!this.slice_del()) {
          return false;
        }
        return false;
    }
    return true;
  }

  r_i_verb_suffix() {
    let among_var;
    let v_1;
    let v_2;
    // setlimit, line 163
    v_1 = this.limit - this.cursor;
    // tomark, line 163
    if (this.cursor < this.I_pV) {
      return false;
    }
    this.cursor = this.I_pV;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 163
    // [, line 164
    this.ket = this.cursor;
    // substring, line 164
    among_var = this.find_among_b(FrenchStemmer.a_5, 35);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 164
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        this.limit_backward = v_2;
        return false;
      case 1:
        // (, line 170
        if (!this.out_grouping_b(FrenchStemmer.g_v, 97, 251)) {
          this.limit_backward = v_2;
          return false;
        }
        // delete, line 170
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    this.limit_backward = v_2;
    return true;
  }

  r_verb_suffix() {
    let among_var;
    let v_1;
    let v_2;
    let v_3;
    // setlimit, line 174
    v_1 = this.limit - this.cursor;
    // tomark, line 174
    if (this.cursor < this.I_pV) {
      return false;
    }
    this.cursor = this.I_pV;
    v_2 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_1;
    // (, line 174
    // [, line 175
    this.ket = this.cursor;
    // substring, line 175
    among_var = this.find_among_b(FrenchStemmer.a_6, 38);
    if (among_var == 0) {
      this.limit_backward = v_2;
      return false;
    }
    // ], line 175
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        this.limit_backward = v_2;
        return false;
      case 1:
        // (, line 177
        // call R2, line 177
        if (!this.r_R2()) {
          this.limit_backward = v_2;
          return false;
        }
        // delete, line 177
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 185
        // delete, line 185
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 3:
        // (, line 190
        // delete, line 190
        if (!this.slice_del()) {
          return false;
        }
        // try, line 191
        v_3 = this.limit - this.cursor;
        var lab0 = true;
        while (lab0 == true) {
          lab0 = false;
          // (, line 191
          // [, line 191
          this.ket = this.cursor;
          // literal, line 191
          if (!this.eq_s_b(1, 'e')) {
            this.cursor = this.limit - v_3;
            break;
          }
          // ], line 191
          this.bra = this.cursor;
          // delete, line 191
          if (!this.slice_del()) {
            return false;
          }
        }
        break;
    }
    this.limit_backward = v_2;
    return true;
  }

  r_residual_suffix() {
    let among_var;
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    let v_5;
    // (, line 198
    // try, line 199
    v_1 = this.limit - this.cursor;
    let lab0 = true;
    while (lab0 == true) {
      lab0 = false;
      // (, line 199
      // [, line 199
      this.ket = this.cursor;
      // literal, line 199
      if (!this.eq_s_b(1, 's')) {
        this.cursor = this.limit - v_1;
        break;
      }
      // ], line 199
      this.bra = this.cursor;
      // test, line 199
      v_2 = this.limit - this.cursor;
      if (!this.out_grouping_b(FrenchStemmer.g_keep_with_s, 97, 232)) {
        this.cursor = this.limit - v_1;
        break;
      }
      this.cursor = this.limit - v_2;
      // delete, line 199
      if (!this.slice_del()) {
        return false;
      }
    }
    // setlimit, line 200
    v_3 = this.limit - this.cursor;
    // tomark, line 200
    if (this.cursor < this.I_pV) {
      return false;
    }
    this.cursor = this.I_pV;
    v_4 = this.limit_backward;
    this.limit_backward = this.cursor;
    this.cursor = this.limit - v_3;
    // (, line 200
    // [, line 201
    this.ket = this.cursor;
    // substring, line 201
    among_var = this.find_among_b(FrenchStemmer.a_7, 7);
    if (among_var == 0) {
      this.limit_backward = v_4;
      return false;
    }
    // ], line 201
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        this.limit_backward = v_4;
        return false;
      case 1:
        // (, line 202
        // call R2, line 202
        if (!this.r_R2()) {
          this.limit_backward = v_4;
          return false;
        }
        // or, line 202
        var lab1 = true;
        lab1: while (lab1 == true) {
          lab1 = false;
          v_5 = this.limit - this.cursor;
          let lab2 = true;
          while (lab2 == true) {
            lab2 = false;
            // literal, line 202
            if (!this.eq_s_b(1, 's')) {
              break;
            }
            break lab1;
          }
          this.cursor = this.limit - v_5;
          // literal, line 202
          if (!this.eq_s_b(1, 't')) {
            this.limit_backward = v_4;
            return false;
          }
        }
        // delete, line 202
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        // (, line 204
        // <-, line 204
        if (!this.slice_from('i')) {
          return false;
        }
        break;
      case 3:
        // (, line 205
        // delete, line 205
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 4:
        // (, line 206
        // literal, line 206
        if (!this.eq_s_b(2, 'gu')) {
          this.limit_backward = v_4;
          return false;
        }
        // delete, line 206
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    this.limit_backward = v_4;
    return true;
  }

  r_un_double() {
    let v_1;
    // (, line 211
    // test, line 212
    v_1 = this.limit - this.cursor;
    // among, line 212
    if (this.find_among_b(FrenchStemmer.a_8, 5) == 0) {
      return false;
    }
    this.cursor = this.limit - v_1;
    // [, line 212
    this.ket = this.cursor;
    // next, line 212
    if (this.cursor <= this.limit_backward) {
      return false;
    }
    this.cursor--;
    // ], line 212
    this.bra = this.cursor;
    // delete, line 212
    if (!this.slice_del()) {
      return false;
    }
    return true;
  }

  r_un_accent() {
    let v_3;
    // (, line 215
    // atleast, line 216
    {
      let v_1 = 1;
      // atleast, line 216
      replab0: while (true) {
        let lab1 = true;
        while (lab1 == true) {
          lab1 = false;
          if (!this.out_grouping_b(FrenchStemmer.g_v, 97, 251)) {
            break;
          }
          v_1--;
          continue replab0;
        }
        break;
      }
      if (v_1 > 0) {
        return false;
      }
    }
    // [, line 217
    this.ket = this.cursor;
    // or, line 217
    let lab2 = true;
    lab2: while (lab2 == true) {
      lab2 = false;
      v_3 = this.limit - this.cursor;
      let lab3 = true;
      while (lab3 == true) {
        lab3 = false;
        // literal, line 217
        if (!this.eq_s_b(1, '\u00E9')) {
          break;
        }
        break lab2;
      }
      this.cursor = this.limit - v_3;
      // literal, line 217
      if (!this.eq_s_b(1, '\u00E8')) {
        return false;
      }
    }
    // ], line 217
    this.bra = this.cursor;
    // <-, line 217
    if (!this.slice_from('e')) {
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
    let v_10;
    let v_11;
    // (, line 221
    // do, line 223
    v_1 = this.cursor;
    let lab0 = true;
    while (lab0 == true) {
      lab0 = false;
      // call prelude, line 223
      if (!this.r_prelude()) {
        break;
      }
    }
    this.cursor = v_1;
    // do, line 224
    v_2 = this.cursor;
    let lab1 = true;
    while (lab1 == true) {
      lab1 = false;
      // call mark_regions, line 224
      if (!this.r_mark_regions()) {
        break;
      }
    }
    this.cursor = v_2;
    // backwards, line 225
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    // (, line 225
    // do, line 227
    v_3 = this.limit - this.cursor;
    let lab2 = true;
    lab2: while (lab2 == true) {
      lab2 = false;
      // (, line 227
      // or, line 237
      let lab3 = true;
      lab3: while (lab3 == true) {
        lab3 = false;
        v_4 = this.limit - this.cursor;
        let lab4 = true;
        lab4: while (lab4 == true) {
          lab4 = false;
          // (, line 228
          // and, line 233
          v_5 = this.limit - this.cursor;
          // (, line 229
          // or, line 229
          let lab5 = true;
          lab5: while (lab5 == true) {
            lab5 = false;
            v_6 = this.limit - this.cursor;
            let lab6 = true;
            while (lab6 == true) {
              lab6 = false;
              // call standard_suffix, line 229
              if (!this.r_standard_suffix()) {
                break;
              }
              break lab5;
            }
            this.cursor = this.limit - v_6;
            let lab7 = true;
            while (lab7 == true) {
              lab7 = false;
              // call i_verb_suffix, line 230
              if (!this.r_i_verb_suffix()) {
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
          this.cursor = this.limit - v_5;
          // try, line 234
          v_7 = this.limit - this.cursor;
          let lab8 = true;
          lab8: while (lab8 == true) {
            lab8 = false;
            // (, line 234
            // [, line 234
            this.ket = this.cursor;
            // or, line 234
            let lab9 = true;
            lab9: while (lab9 == true) {
              lab9 = false;
              v_8 = this.limit - this.cursor;
              let lab10 = true;
              while (lab10 == true) {
                lab10 = false;
                // (, line 234
                // literal, line 234
                if (!this.eq_s_b(1, 'Y')) {
                  break;
                }
                // ], line 234
                this.bra = this.cursor;
                // <-, line 234
                if (!this.slice_from('i')) {
                  return false;
                }
                break lab9;
              }
              this.cursor = this.limit - v_8;
              // (, line 235
              // literal, line 235
              if (!this.eq_s_b(1, '\u00E7')) {
                this.cursor = this.limit - v_7;
                break lab8;
              }
              // ], line 235
              this.bra = this.cursor;
              // <-, line 235
              if (!this.slice_from('c')) {
                return false;
              }
            }
          }
          break lab3;
        }
        this.cursor = this.limit - v_4;
        // call residual_suffix, line 238
        if (!this.r_residual_suffix()) {
          break lab2;
        }
      }
    }
    this.cursor = this.limit - v_3;
    // do, line 243
    v_9 = this.limit - this.cursor;
    let lab11 = true;
    while (lab11 == true) {
      lab11 = false;
      // call un_double, line 243
      if (!this.r_un_double()) {
        break;
      }
    }
    this.cursor = this.limit - v_9;
    // do, line 244
    v_10 = this.limit - this.cursor;
    let lab12 = true;
    while (lab12 == true) {
      lab12 = false;
      // call un_accent, line 244
      if (!this.r_un_accent()) {
        break;
      }
    }
    this.cursor = this.limit - v_10;
    this.cursor = this.limit_backward; // do, line 246
    v_11 = this.cursor;
    let lab13 = true;
    while (lab13 == true) {
      lab13 = false;
      // call postlude, line 246
      if (!this.r_postlude()) {
        break;
      }
    }
    this.cursor = v_11;
    return true;
  }
}

FrenchStemmer.methodObject = new FrenchStemmer();

FrenchStemmer.a_0 = [
  new Among('col', -1, -1),
  new Among('par', -1, -1),
  new Among('tap', -1, -1)
];

FrenchStemmer.a_1 = [
  new Among('', -1, 4),
  new Among('I', 0, 1),
  new Among('U', 0, 2),
  new Among('Y', 0, 3)
];

FrenchStemmer.a_2 = [
  new Among('iqU', -1, 3),
  new Among('abl', -1, 3),
  new Among('I\u00E8r', -1, 4),
  new Among('i\u00E8r', -1, 4),
  new Among('eus', -1, 2),
  new Among('iv', -1, 1)
];

FrenchStemmer.a_3 = [
  new Among('ic', -1, 2),
  new Among('abil', -1, 1),
  new Among('iv', -1, 3)
];

FrenchStemmer.a_4 = [
  new Among('iqUe', -1, 1),
  new Among('atrice', -1, 2),
  new Among('ance', -1, 1),
  new Among('ence', -1, 5),
  new Among('logie', -1, 3),
  new Among('able', -1, 1),
  new Among('isme', -1, 1),
  new Among('euse', -1, 11),
  new Among('iste', -1, 1),
  new Among('ive', -1, 8),
  new Among('if', -1, 8),
  new Among('usion', -1, 4),
  new Among('ation', -1, 2),
  new Among('ution', -1, 4),
  new Among('ateur', -1, 2),
  new Among('iqUes', -1, 1),
  new Among('atrices', -1, 2),
  new Among('ances', -1, 1),
  new Among('ences', -1, 5),
  new Among('logies', -1, 3),
  new Among('ables', -1, 1),
  new Among('ismes', -1, 1),
  new Among('euses', -1, 11),
  new Among('istes', -1, 1),
  new Among('ives', -1, 8),
  new Among('ifs', -1, 8),
  new Among('usions', -1, 4),
  new Among('ations', -1, 2),
  new Among('utions', -1, 4),
  new Among('ateurs', -1, 2),
  new Among('ments', -1, 15),
  new Among('ements', 30, 6),
  new Among('issements', 31, 12),
  new Among('it\u00E9s', -1, 7),
  new Among('ment', -1, 15),
  new Among('ement', 34, 6),
  new Among('issement', 35, 12),
  new Among('amment', 34, 13),
  new Among('emment', 34, 14),
  new Among('aux', -1, 10),
  new Among('eaux', 39, 9),
  new Among('eux', -1, 1),
  new Among('it\u00E9', -1, 7)
];

FrenchStemmer.a_5 = [
  new Among('ira', -1, 1),
  new Among('ie', -1, 1),
  new Among('isse', -1, 1),
  new Among('issante', -1, 1),
  new Among('i', -1, 1),
  new Among('irai', 4, 1),
  new Among('ir', -1, 1),
  new Among('iras', -1, 1),
  new Among('ies', -1, 1),
  new Among('\u00EEmes', -1, 1),
  new Among('isses', -1, 1),
  new Among('issantes', -1, 1),
  new Among('\u00EEtes', -1, 1),
  new Among('is', -1, 1),
  new Among('irais', 13, 1),
  new Among('issais', 13, 1),
  new Among('irions', -1, 1),
  new Among('issions', -1, 1),
  new Among('irons', -1, 1),
  new Among('issons', -1, 1),
  new Among('issants', -1, 1),
  new Among('it', -1, 1),
  new Among('irait', 21, 1),
  new Among('issait', 21, 1),
  new Among('issant', -1, 1),
  new Among('iraIent', -1, 1),
  new Among('issaIent', -1, 1),
  new Among('irent', -1, 1),
  new Among('issent', -1, 1),
  new Among('iront', -1, 1),
  new Among('\u00EEt', -1, 1),
  new Among('iriez', -1, 1),
  new Among('issiez', -1, 1),
  new Among('irez', -1, 1),
  new Among('issez', -1, 1)
];

FrenchStemmer.a_6 = [
  new Among('a', -1, 3),
  new Among('era', 0, 2),
  new Among('asse', -1, 3),
  new Among('ante', -1, 3),
  new Among('\u00E9e', -1, 2),
  new Among('ai', -1, 3),
  new Among('erai', 5, 2),
  new Among('er', -1, 2),
  new Among('as', -1, 3),
  new Among('eras', 8, 2),
  new Among('\u00E2mes', -1, 3),
  new Among('asses', -1, 3),
  new Among('antes', -1, 3),
  new Among('\u00E2tes', -1, 3),
  new Among('\u00E9es', -1, 2),
  new Among('ais', -1, 3),
  new Among('erais', 15, 2),
  new Among('ions', -1, 1),
  new Among('erions', 17, 2),
  new Among('assions', 17, 3),
  new Among('erons', -1, 2),
  new Among('ants', -1, 3),
  new Among('\u00E9s', -1, 2),
  new Among('ait', -1, 3),
  new Among('erait', 23, 2),
  new Among('ant', -1, 3),
  new Among('aIent', -1, 3),
  new Among('eraIent', 26, 2),
  new Among('\u00E8rent', -1, 2),
  new Among('assent', -1, 3),
  new Among('eront', -1, 2),
  new Among('\u00E2t', -1, 3),
  new Among('ez', -1, 2),
  new Among('iez', 32, 2),
  new Among('eriez', 33, 2),
  new Among('assiez', 33, 3),
  new Among('erez', 32, 2),
  new Among('\u00E9', -1, 2)
];

FrenchStemmer.a_7 = [
  new Among('e', -1, 3),
  new Among('I\u00E8re', 0, 2),
  new Among('i\u00E8re', 0, 2),
  new Among('ion', -1, 1),
  new Among('Ier', -1, 2),
  new Among('ier', -1, 2),
  new Among('\u00EB', -1, 4)
];

FrenchStemmer.a_8 = [
  new Among('ell', -1, -1),
  new Among('eill', -1, -1),
  new Among('enn', -1, -1),
  new Among('onn', -1, -1),
  new Among('ett', -1, -1)
];

FrenchStemmer.g_v = [
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
  128,
  130,
  103,
  8,
  5
];

FrenchStemmer.g_keep_with_s = [
  1,
  65,
  20,
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
  128
];

module.exports = FrenchStemmer;
