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

class StemmerTa extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-ta';
    this.I_length = 0;
    this.B_found_wrong_ending = false;
    this.B_found_vetrumai_urupu = false;
    this.B_found_a_match = false;
  }

  r_has_min_length() {
    this.I_length = this.current.length;
    if (!(this.I_length > 4)) {
      return false;
    }
    return true;
  }
  r_fix_va_start() {
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    let v_5;
    let v_6;
    let v_7;
    let v_8;
    let v_9;
    lab0: do {
      v_1 = this.cursor;
      lab1: do {
        v_2 = this.cursor;
        v_3 = this.cursor;
        lab2: do {
          if (!this.eq_s("\u0BB5\u0BCB")) {
            this.cursor = v_3;
            break lab2;
          }
        } while (false);
        this.cursor = v_2;
        this.bra = this.cursor;
        if (!this.eq_s("\u0BB5\u0BCB")) {
          break lab1;
        }
        this.ket = this.cursor;
        this.slice_from("\u0B93");
        break lab0;
      } while (false);
      this.cursor = v_1;
      lab3: do {
        v_4 = this.cursor;
        v_5 = this.cursor;
        lab4: do {
          if (!this.eq_s("\u0BB5\u0BCA")) {
            this.cursor = v_5;
            break lab4;
          }
        } while (false);
        this.cursor = v_4;
        this.bra = this.cursor;
        if (!this.eq_s("\u0BB5\u0BCA")) {
          break lab3;
        }
        this.ket = this.cursor;
        this.slice_from("\u0B92");
        break lab0;
      } while (false);
      this.cursor = v_1;
      lab5: do {
        v_6 = this.cursor;
        v_7 = this.cursor;
        lab6: do {
          if (!this.eq_s("\u0BB5\u0BC1")) {
            this.cursor = v_7;
            break lab6;
          }
        } while (false);
        this.cursor = v_6;
        this.bra = this.cursor;
        if (!this.eq_s("\u0BB5\u0BC1")) {
          break lab5;
        }
        this.ket = this.cursor;
        this.slice_from("\u0B89");
        break lab0;
      } while (false);
      this.cursor = v_1;
      v_8 = this.cursor;
      v_9 = this.cursor;
      lab7: do {
        if (!this.eq_s("\u0BB5\u0BC2")) {
          this.cursor = v_9;
          break lab7;
        }
      } while (false);
      this.cursor = v_8;
      this.bra = this.cursor;
      if (!this.eq_s("\u0BB5\u0BC2")) {
        return false;
      }
      this.ket = this.cursor;
      this.slice_from("\u0B8A");
    } while (false);
    return true;
  }
  r_fix_endings() {
    let v_1;
    let v_2;
    this.B_found_wrong_ending = true;
    replab0: while (true) {
      v_1 = this.cursor;
      lab1: do {
        if (!this.B_found_wrong_ending) {
          break lab1;
        }
        v_2 = this.cursor;
        lab2: do {
          if (!this.r_fix_ending()) {
            break lab2;
          }
        } while (false);
        this.cursor = v_2;
        continue replab0;
      } while (false);
      this.cursor = v_1;
      break replab0;
    }
    return true;
  }
  r_remove_question_prefixes() {
    let v_1;
    this.bra = this.cursor;
    if (!this.eq_s("\u0B8E")) {
      return false;
    }
    if (this.find_among(StemmerTa.a_0) === 0) {
      return false;
    }
    if (!this.eq_s("\u0BCD")) {
      return false;
    }
    this.ket = this.cursor;
    this.slice_del();
    v_1 = this.cursor;
    lab0: do {
      if (!this.r_fix_va_start()) {
        break lab0;
      }
    } while (false);
    this.cursor = v_1;
    return true;
  }
  r_fix_ending() {
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
    let v_12;
    let v_13;
    this.B_found_wrong_ending = false;
    this.I_length = this.current.length;
    if (!(this.I_length > 3)) {
      return false;
    }
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    lab0: do {
      v_1 = this.limit - this.cursor;
      lab1: do {
        this.ket = this.cursor;
        if (this.find_among_b(StemmerTa.a_1) === 0) {
          break lab1;
        }
        this.bra = this.cursor;
        this.slice_del();
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab2: do {
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0BAF\u0BCD")) {
          break lab2;
        }
        v_2 = this.limit - this.cursor;
        if (this.find_among_b(StemmerTa.a_2) === 0) {
          break lab2;
        }
        this.cursor = this.limit - v_2;
        this.bra = this.cursor;
        this.slice_del();
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab3: do {
        this.ket = this.cursor;
        lab4: do {
          v_3 = this.limit - this.cursor;
          lab5: do {
            if (!this.eq_s_b("\u0B9F\u0BCD\u0BAA\u0BCD")) {
              break lab5;
            }
            break lab4;
          } while (false);
          this.cursor = this.limit - v_3;
          if (!this.eq_s_b("\u0B9F\u0BCD\u0B95\u0BCD")) {
            break lab3;
          }
        } while (false);
        this.bra = this.cursor;
        this.slice_from("\u0BB3\u0BCD");
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab6: do {
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0BA9\u0BCD\u0BB1\u0BCD")) {
          break lab6;
        }
        this.bra = this.cursor;
        this.slice_from("\u0BB2\u0BCD");
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab7: do {
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0BB1\u0BCD\u0B95\u0BCD")) {
          break lab7;
        }
        this.bra = this.cursor;
        this.slice_from("\u0BB2\u0BCD");
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab8: do {
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0B9F\u0BCD\u0B9F\u0BCD")) {
          break lab8;
        }
        this.bra = this.cursor;
        this.slice_from("\u0B9F\u0BC1");
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab9: do {
        if (!this.B_found_vetrumai_urupu) {
          break lab9;
        }
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0BA4\u0BCD\u0BA4\u0BCD")) {
          break lab9;
        }
        v_4 = this.limit - this.cursor;
        {
          v_5 = this.limit - this.cursor;
          lab10: do {
            if (!this.eq_s_b("\u0BC8")) {
              break lab10;
            }
            break lab9;
          } while (false);
          this.cursor = this.limit - v_5;
        }
        this.cursor = this.limit - v_4;
        this.bra = this.cursor;
        this.slice_from("\u0BAE\u0BCD");
        this.bra = this.cursor;
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab11: do {
        this.ket = this.cursor;
        lab12: do {
          v_6 = this.limit - this.cursor;
          lab13: do {
            if (!this.eq_s_b("\u0BC1\u0B95\u0BCD")) {
              break lab13;
            }
            break lab12;
          } while (false);
          this.cursor = this.limit - v_6;
          if (!this.eq_s_b("\u0BC1\u0B95\u0BCD\u0B95\u0BCD")) {
            break lab11;
          }
        } while (false);
        this.bra = this.cursor;
        this.slice_from("\u0BCD");
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab14: do {
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0BCD")) {
          break lab14;
        }
        if (this.find_among_b(StemmerTa.a_3) === 0) {
          break lab14;
        }
        if (!this.eq_s_b("\u0BCD")) {
          break lab14;
        }
        if (this.find_among_b(StemmerTa.a_4) === 0) {
          break lab14;
        }
        this.bra = this.cursor;
        this.slice_del();
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab15: do {
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0BC1\u0B95\u0BCD")) {
          break lab15;
        }
        this.bra = this.cursor;
        this.slice_from("\u0BCD");
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab16: do {
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0BCD")) {
          break lab16;
        }
        if (this.find_among_b(StemmerTa.a_5) === 0) {
          break lab16;
        }
        this.bra = this.cursor;
        this.slice_del();
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab17: do {
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0BCD")) {
          break lab17;
        }
        lab18: do {
          v_7 = this.limit - this.cursor;
          lab19: do {
            if (this.find_among_b(StemmerTa.a_6) === 0) {
              break lab19;
            }
            break lab18;
          } while (false);
          this.cursor = this.limit - v_7;
          if (this.find_among_b(StemmerTa.a_7) === 0) {
            break lab17;
          }
        } while (false);
        if (!this.eq_s_b("\u0BCD")) {
          break lab17;
        }
        this.bra = this.cursor;
        this.slice_from("\u0BCD");
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab20: do {
        this.ket = this.cursor;
        if (this.find_among_b(StemmerTa.a_8) === 0) {
          break lab20;
        }
        this.bra = this.cursor;
        this.slice_del();
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab21: do {
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0BA9\u0BC1")) {
          break lab21;
        }
        v_8 = this.limit - this.cursor;
        {
          v_9 = this.limit - this.cursor;
          lab22: do {
            if (this.find_among_b(StemmerTa.a_9) === 0) {
              break lab22;
            }
            break lab21;
          } while (false);
          this.cursor = this.limit - v_9;
        }
        this.cursor = this.limit - v_8;
        this.bra = this.cursor;
        this.slice_del();
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab23: do {
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0B99\u0BCD")) {
          break lab23;
        }
        v_10 = this.limit - this.cursor;
        {
          v_11 = this.limit - this.cursor;
          lab24: do {
            if (!this.eq_s_b("\u0BC8")) {
              break lab24;
            }
            break lab23;
          } while (false);
          this.cursor = this.limit - v_11;
        }
        this.cursor = this.limit - v_10;
        this.bra = this.cursor;
        this.slice_from("\u0BAE\u0BCD");
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab25: do {
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0B99\u0BCD")) {
          break lab25;
        }
        this.bra = this.cursor;
        this.slice_del();
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      this.ket = this.cursor;
      if (!this.eq_s_b("\u0BCD")) {
        return false;
      }
      v_12 = this.limit - this.cursor;
      lab26: do {
        v_13 = this.limit - this.cursor;
        lab27: do {
          if (this.find_among_b(StemmerTa.a_10) === 0) {
            break lab27;
          }
          break lab26;
        } while (false);
        this.cursor = this.limit - v_13;
        if (!this.eq_s_b("\u0BCD")) {
          return false;
        }
      } while (false);
      this.cursor = this.limit - v_12;
      this.bra = this.cursor;
      this.slice_del();
    } while (false);
    this.cursor = this.limit_backward;
    this.B_found_wrong_ending = true;
    return true;
  }
  r_remove_pronoun_prefixes() {
    let v_1;
    this.B_found_a_match = false;
    this.bra = this.cursor;
    if (this.find_among(StemmerTa.a_11) === 0) {
      return false;
    }
    if (this.find_among(StemmerTa.a_12) === 0) {
      return false;
    }
    if (!this.eq_s("\u0BCD")) {
      return false;
    }
    this.ket = this.cursor;
    this.slice_del();
    this.B_found_a_match = true;
    v_1 = this.cursor;
    lab0: do {
      if (!this.r_fix_va_start()) {
        break lab0;
      }
    } while (false);
    this.cursor = v_1;
    return true;
  }
  r_remove_plural_suffix() {
    let v_1;
    let v_2;
    let v_3;
    this.B_found_a_match = false;
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    lab0: do {
      v_1 = this.limit - this.cursor;
      lab1: do {
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD")) {
          break lab1;
        }
        v_2 = this.limit - this.cursor;
        {
          v_3 = this.limit - this.cursor;
          lab2: do {
            if (this.find_among_b(StemmerTa.a_13) === 0) {
              break lab2;
            }
            break lab1;
          } while (false);
          this.cursor = this.limit - v_3;
        }
        this.cursor = this.limit - v_2;
        this.bra = this.cursor;
        this.slice_from("\u0BCD");
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab3: do {
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0BB1\u0BCD\u0B95\u0BB3\u0BCD")) {
          break lab3;
        }
        this.bra = this.cursor;
        this.slice_from("\u0BB2\u0BCD");
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab4: do {
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0B9F\u0BCD\u0B95\u0BB3\u0BCD")) {
          break lab4;
        }
        this.bra = this.cursor;
        this.slice_from("\u0BB3\u0BCD");
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      this.ket = this.cursor;
      if (!this.eq_s_b("\u0B95\u0BB3\u0BCD")) {
        return false;
      }
      this.bra = this.cursor;
      this.slice_del();
    } while (false);
    this.B_found_a_match = true;
    this.cursor = this.limit_backward;
    return true;
  }
  r_remove_question_suffixes() {
    let v_1;
    let v_2;
    if (!this.r_has_min_length()) {
      return false;
    }
    this.B_found_a_match = false;
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    v_1 = this.limit - this.cursor;
    lab0: do {
      this.ket = this.cursor;
      if (this.find_among_b(StemmerTa.a_14) === 0) {
        break lab0;
      }
      this.bra = this.cursor;
      this.slice_from("\u0BCD");
      this.B_found_a_match = true;
    } while (false);
    this.cursor = this.limit - v_1;
    this.cursor = this.limit_backward;
    v_2 = this.cursor;
    lab1: do {
      if (!this.r_fix_endings()) {
        break lab1;
      }
    } while (false);
    this.cursor = v_2;
    return true;
  }
  r_remove_command_suffixes() {
    if (!this.r_has_min_length()) {
      return false;
    }
    this.B_found_a_match = false;
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    this.ket = this.cursor;
    if (this.find_among_b(StemmerTa.a_15) === 0) {
      return false;
    }
    this.bra = this.cursor;
    this.slice_del();
    this.B_found_a_match = true;
    this.cursor = this.limit_backward;
    return true;
  }
  r_remove_um() {
    let v_1;
    this.B_found_a_match = false;
    if (!this.r_has_min_length()) {
      return false;
    }
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    this.ket = this.cursor;
    if (!this.eq_s_b("\u0BC1\u0BAE\u0BCD")) {
      return false;
    }
    this.bra = this.cursor;
    this.slice_from("\u0BCD");
    this.B_found_a_match = true;
    this.cursor = this.limit_backward;
    v_1 = this.cursor;
    lab0: do {
      if (!this.r_fix_ending()) {
        break lab0;
      }
    } while (false);
    this.cursor = v_1;
    return true;
  }
  r_remove_common_word_endings() {
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    let v_5;
    let v_6;
    let v_7;
    this.B_found_a_match = false;
    if (!this.r_has_min_length()) {
      return false;
    }
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    lab0: do {
      v_1 = this.limit - this.cursor;
      lab1: do {
        v_2 = this.limit - this.cursor;
        this.ket = this.cursor;
        lab2: do {
          v_3 = this.limit - this.cursor;
          lab3: do {
            if (!this.eq_s_b("\u0BC1\u0B9F\u0BA9\u0BCD")) {
              break lab3;
            }
            break lab2;
          } while (false);
          this.cursor = this.limit - v_3;
          lab4: do {
            if (!this.eq_s_b("\u0BBF\u0BB2\u0BCD\u0BB2\u0BC8")) {
              break lab4;
            }
            break lab2;
          } while (false);
          this.cursor = this.limit - v_3;
          lab5: do {
            if (!this.eq_s_b("\u0BBF\u0B9F\u0BAE\u0BCD")) {
              break lab5;
            }
            break lab2;
          } while (false);
          this.cursor = this.limit - v_3;
          lab6: do {
            if (!this.eq_s_b("\u0BBF\u0BA9\u0BCD\u0BB1\u0BBF")) {
              break lab6;
            }
            break lab2;
          } while (false);
          this.cursor = this.limit - v_3;
          lab7: do {
            if (!this.eq_s_b("\u0BBE\u0B95\u0BBF")) {
              break lab7;
            }
            break lab2;
          } while (false);
          this.cursor = this.limit - v_3;
          lab8: do {
            if (!this.eq_s_b("\u0BBE\u0B95\u0BBF\u0BAF")) {
              break lab8;
            }
            break lab2;
          } while (false);
          this.cursor = this.limit - v_3;
          lab9: do {
            if (!this.eq_s_b("\u0BC6\u0BA9\u0BCD\u0BB1\u0BC1")) {
              break lab9;
            }
            break lab2;
          } while (false);
          this.cursor = this.limit - v_3;
          lab10: do {
            if (!this.eq_s_b("\u0BC1\u0BB3\u0BCD\u0BB3")) {
              break lab10;
            }
            break lab2;
          } while (false);
          this.cursor = this.limit - v_3;
          lab11: do {
            if (!this.eq_s_b("\u0BC1\u0B9F\u0BC8\u0BAF")) {
              break lab11;
            }
            break lab2;
          } while (false);
          this.cursor = this.limit - v_3;
          lab12: do {
            if (!this.eq_s_b("\u0BC1\u0B9F\u0BC8")) {
              break lab12;
            }
            break lab2;
          } while (false);
          this.cursor = this.limit - v_3;
          lab13: do {
            if (!this.eq_s_b("\u0BC6\u0BA9\u0BC1\u0BAE\u0BCD")) {
              break lab13;
            }
            break lab2;
          } while (false);
          this.cursor = this.limit - v_3;
          lab14: do {
            if (!this.eq_s_b("\u0BB2\u0BCD\u0BB2")) {
              break lab14;
            }
            v_4 = this.limit - this.cursor;
            {
              v_5 = this.limit - this.cursor;
              lab15: do {
                if (this.find_among_b(StemmerTa.a_16) === 0) {
                  break lab15;
                }
                break lab14;
              } while (false);
              this.cursor = this.limit - v_5;
            }
            this.cursor = this.limit - v_4;
            break lab2;
          } while (false);
          this.cursor = this.limit - v_3;
          lab16: do {
            if (!this.eq_s_b("\u0BC6\u0BA9")) {
              break lab16;
            }
            break lab2;
          } while (false);
          this.cursor = this.limit - v_3;
          if (!this.eq_s_b("\u0BBE\u0B95\u0BBF")) {
            break lab1;
          }
        } while (false);
        this.bra = this.cursor;
        this.slice_from("\u0BCD");
        this.B_found_a_match = true;
        this.cursor = this.limit - v_2;
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      v_6 = this.limit - this.cursor;
      this.ket = this.cursor;
      if (this.find_among_b(StemmerTa.a_17) === 0) {
        return false;
      }
      this.bra = this.cursor;
      this.slice_del();
      this.B_found_a_match = true;
      this.cursor = this.limit - v_6;
    } while (false);
    this.cursor = this.limit_backward;
    v_7 = this.cursor;
    lab17: do {
      if (!this.r_fix_endings()) {
        break lab17;
      }
    } while (false);
    this.cursor = v_7;
    return true;
  }
  r_remove_vetrumai_urupukal() {
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
    let v_12;
    let v_13;
    let v_14;
    let v_15;
    let v_16;
    let v_17;
    let v_18;
    let v_19;
    let v_20;
    let v_21;
    this.B_found_a_match = false;
    this.B_found_vetrumai_urupu = false;
    if (!this.r_has_min_length()) {
      return false;
    }
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    lab0: do {
      v_1 = this.limit - this.cursor;
      lab1: do {
        v_2 = this.limit - this.cursor;
        this.ket = this.cursor;
        if (!this.eq_s_b("\u0BA9\u0BC8")) {
          break lab1;
        }
        this.bra = this.cursor;
        this.slice_del();
        this.cursor = this.limit - v_2;
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab2: do {
        v_3 = this.limit - this.cursor;
        this.ket = this.cursor;
        lab3: do {
          v_4 = this.limit - this.cursor;
          lab4: do {
            lab5: do {
              v_5 = this.limit - this.cursor;
              lab6: do {
                if (!this.eq_s_b("\u0BBF\u0BA9\u0BC8")) {
                  break lab6;
                }
                break lab5;
              } while (false);
              this.cursor = this.limit - v_5;
              if (!this.eq_s_b("\u0BC8")) {
                break lab4;
              }
            } while (false);
            v_6 = this.limit - this.cursor;
            {
              v_7 = this.limit - this.cursor;
              lab7: do {
                if (this.find_among_b(StemmerTa.a_18) === 0) {
                  break lab7;
                }
                break lab4;
              } while (false);
              this.cursor = this.limit - v_7;
            }
            this.cursor = this.limit - v_6;
            break lab3;
          } while (false);
          this.cursor = this.limit - v_4;
          if (!this.eq_s_b("\u0BC8")) {
            break lab2;
          }
          v_8 = this.limit - this.cursor;
          if (this.find_among_b(StemmerTa.a_19) === 0) {
            break lab2;
          }
          if (!this.eq_s_b("\u0BCD")) {
            break lab2;
          }
          this.cursor = this.limit - v_8;
        } while (false);
        this.bra = this.cursor;
        this.slice_from("\u0BCD");
        this.cursor = this.limit - v_3;
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab8: do {
        v_9 = this.limit - this.cursor;
        this.ket = this.cursor;
        lab9: do {
          v_10 = this.limit - this.cursor;
          lab10: do {
            if (!this.eq_s_b("\u0BCA\u0B9F\u0BC1")) {
              break lab10;
            }
            break lab9;
          } while (false);
          this.cursor = this.limit - v_10;
          lab11: do {
            if (!this.eq_s_b("\u0BCB\u0B9F\u0BC1")) {
              break lab11;
            }
            break lab9;
          } while (false);
          this.cursor = this.limit - v_10;
          lab12: do {
            if (!this.eq_s_b("\u0BBF\u0BB2\u0BCD")) {
              break lab12;
            }
            break lab9;
          } while (false);
          this.cursor = this.limit - v_10;
          lab13: do {
            if (!this.eq_s_b("\u0BBF\u0BB1\u0BCD")) {
              break lab13;
            }
            break lab9;
          } while (false);
          this.cursor = this.limit - v_10;
          lab14: do {
            if (!this.eq_s_b("\u0BBF\u0BA9\u0BCD")) {
              break lab14;
            }
            v_11 = this.limit - this.cursor;
            {
              v_12 = this.limit - this.cursor;
              lab15: do {
                if (!this.eq_s_b("\u0BAE")) {
                  break lab15;
                }
                break lab14;
              } while (false);
              this.cursor = this.limit - v_12;
            }
            this.cursor = this.limit - v_11;
            break lab9;
          } while (false);
          this.cursor = this.limit - v_10;
          lab16: do {
            if (!this.eq_s_b("\u0BBF\u0BA9\u0BCD\u0BB1\u0BC1")) {
              break lab16;
            }
            break lab9;
          } while (false);
          this.cursor = this.limit - v_10;
          lab17: do {
            if (!this.eq_s_b("\u0BBF\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4\u0BC1")) {
              break lab17;
            }
            break lab9;
          } while (false);
          this.cursor = this.limit - v_10;
          lab18: do {
            if (!this.eq_s_b("\u0BB5\u0BBF\u0B9F")) {
              break lab18;
            }
            break lab9;
          } while (false);
          this.cursor = this.limit - v_10;
          lab19: do {
            if (!(this.I_length >= 7)) {
              break lab19;
            }
            if (!this.eq_s_b("\u0BBF\u0B9F\u0BAE\u0BCD")) {
              break lab19;
            }
            break lab9;
          } while (false);
          this.cursor = this.limit - v_10;
          lab20: do {
            if (!this.eq_s_b("\u0BBE\u0BB2\u0BCD")) {
              break lab20;
            }
            break lab9;
          } while (false);
          this.cursor = this.limit - v_10;
          lab21: do {
            if (!this.eq_s_b("\u0BC1\u0B9F\u0BC8")) {
              break lab21;
            }
            break lab9;
          } while (false);
          this.cursor = this.limit - v_10;
          lab22: do {
            if (!this.eq_s_b("\u0BBE\u0BAE\u0BB2\u0BCD")) {
              break lab22;
            }
            break lab9;
          } while (false);
          this.cursor = this.limit - v_10;
          lab23: do {
            if (!this.eq_s_b("\u0BB2\u0BCD")) {
              break lab23;
            }
            v_13 = this.limit - this.cursor;
            {
              v_14 = this.limit - this.cursor;
              lab24: do {
                if (this.find_among_b(StemmerTa.a_20) === 0) {
                  break lab24;
                }
                break lab23;
              } while (false);
              this.cursor = this.limit - v_14;
            }
            this.cursor = this.limit - v_13;
            break lab9;
          } while (false);
          this.cursor = this.limit - v_10;
          if (!this.eq_s_b("\u0BC1\u0BB3\u0BCD")) {
            break lab8;
          }
        } while (false);
        this.bra = this.cursor;
        this.slice_from("\u0BCD");
        this.cursor = this.limit - v_9;
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      lab25: do {
        v_15 = this.limit - this.cursor;
        this.ket = this.cursor;
        lab26: do {
          v_16 = this.limit - this.cursor;
          lab27: do {
            if (!this.eq_s_b("\u0B95\u0BA3\u0BCD")) {
              break lab27;
            }
            break lab26;
          } while (false);
          this.cursor = this.limit - v_16;
          lab28: do {
            if (!this.eq_s_b("\u0BAE\u0BC1\u0BA9\u0BCD")) {
              break lab28;
            }
            break lab26;
          } while (false);
          this.cursor = this.limit - v_16;
          lab29: do {
            if (!this.eq_s_b("\u0BAE\u0BC7\u0BB2\u0BCD")) {
              break lab29;
            }
            break lab26;
          } while (false);
          this.cursor = this.limit - v_16;
          lab30: do {
            if (!this.eq_s_b("\u0BAE\u0BC7\u0BB1\u0BCD")) {
              break lab30;
            }
            break lab26;
          } while (false);
          this.cursor = this.limit - v_16;
          lab31: do {
            if (!this.eq_s_b("\u0B95\u0BC0\u0BB4\u0BCD")) {
              break lab31;
            }
            break lab26;
          } while (false);
          this.cursor = this.limit - v_16;
          lab32: do {
            if (!this.eq_s_b("\u0BAA\u0BBF\u0BA9\u0BCD")) {
              break lab32;
            }
            break lab26;
          } while (false);
          this.cursor = this.limit - v_16;
          if (!this.eq_s_b("\u0BA4\u0BC1")) {
            break lab25;
          }
          v_17 = this.limit - this.cursor;
          {
            v_18 = this.limit - this.cursor;
            lab33: do {
              if (this.find_among_b(StemmerTa.a_21) === 0) {
                break lab33;
              }
              break lab25;
            } while (false);
            this.cursor = this.limit - v_18;
          }
          this.cursor = this.limit - v_17;
        } while (false);
        this.bra = this.cursor;
        this.slice_del();
        this.cursor = this.limit - v_15;
        break lab0;
      } while (false);
      this.cursor = this.limit - v_1;
      v_19 = this.limit - this.cursor;
      this.ket = this.cursor;
      if (!this.eq_s_b("\u0BC0")) {
        return false;
      }
      this.bra = this.cursor;
      this.slice_from("\u0BBF");
      this.cursor = this.limit - v_19;
    } while (false);
    this.B_found_a_match = true;
    this.B_found_vetrumai_urupu = true;
    v_20 = this.limit - this.cursor;
    lab34: do {
      this.ket = this.cursor;
      if (!this.eq_s_b("\u0BBF\u0BA9\u0BCD")) {
        break lab34;
      }
      this.bra = this.cursor;
      this.slice_from("\u0BCD");
    } while (false);
    this.cursor = this.limit - v_20;
    this.cursor = this.limit_backward;
    v_21 = this.cursor;
    lab35: do {
      if (!this.r_fix_endings()) {
        break lab35;
      }
    } while (false);
    this.cursor = v_21;
    return true;
  }
  r_remove_tense_suffixes() {
    let v_1;
    let v_2;
    this.B_found_a_match = true;
    replab0: while (true) {
      v_1 = this.cursor;
      lab1: do {
        if (!this.B_found_a_match) {
          break lab1;
        }
        v_2 = this.cursor;
        lab2: do {
          if (!this.r_remove_tense_suffix()) {
            break lab2;
          }
        } while (false);
        this.cursor = v_2;
        continue replab0;
      } while (false);
      this.cursor = v_1;
      break replab0;
    }
    return true;
  }
  r_remove_tense_suffix() {
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
    let v_12;
    let v_13;
    let v_14;
    let v_15;
    let v_16;
    let v_17;
    let v_18;
    this.B_found_a_match = false;
    if (!this.r_has_min_length()) {
      return false;
    }
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    v_1 = this.limit - this.cursor;
    lab0: do {
      lab1: do {
        v_2 = this.limit - this.cursor;
        lab2: do {
          v_3 = this.limit - this.cursor;
          this.ket = this.cursor;
          if (this.find_among_b(StemmerTa.a_22) === 0) {
            break lab2;
          }
          this.bra = this.cursor;
          this.slice_del();
          this.B_found_a_match = true;
          this.cursor = this.limit - v_3;
          break lab1;
        } while (false);
        this.cursor = this.limit - v_2;
        lab3: do {
          v_4 = this.limit - this.cursor;
          this.ket = this.cursor;
          lab4: do {
            v_5 = this.limit - this.cursor;
            lab5: do {
              if (!this.eq_s_b("\u0BAE\u0BBE\u0BB0\u0BCD")) {
                break lab5;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab6: do {
              if (!this.eq_s_b("\u0BAE\u0BBF\u0BA9\u0BCD")) {
                break lab6;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab7: do {
              if (!this.eq_s_b("\u0BA9\u0BA9\u0BCD")) {
                break lab7;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab8: do {
              if (!this.eq_s_b("\u0BA9\u0BBE\u0BA9\u0BCD")) {
                break lab8;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab9: do {
              if (!this.eq_s_b("\u0BA9\u0BBE\u0BB3\u0BCD")) {
                break lab9;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab10: do {
              if (!this.eq_s_b("\u0BA9\u0BBE\u0BB0\u0BCD")) {
                break lab10;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab11: do {
              if (!this.eq_s_b("\u0BB5\u0BA9\u0BCD")) {
                break lab11;
              }
              v_6 = this.limit - this.cursor;
              {
                v_7 = this.limit - this.cursor;
                lab12: do {
                  if (this.find_among_b(StemmerTa.a_23) === 0) {
                    break lab12;
                  }
                  break lab11;
                } while (false);
                this.cursor = this.limit - v_7;
              }
              this.cursor = this.limit - v_6;
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab13: do {
              if (!this.eq_s_b("\u0BA9\u0BB3\u0BCD")) {
                break lab13;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab14: do {
              if (!this.eq_s_b("\u0BB5\u0BB3\u0BCD")) {
                break lab14;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab15: do {
              if (!this.eq_s_b("\u0BA9\u0BB0\u0BCD")) {
                break lab15;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab16: do {
              if (!this.eq_s_b("\u0BB5\u0BB0\u0BCD")) {
                break lab16;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab17: do {
              if (!this.eq_s_b("\u0BA9")) {
                break lab17;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab18: do {
              if (!this.eq_s_b("\u0BAA")) {
                break lab18;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab19: do {
              if (!this.eq_s_b("\u0B95")) {
                break lab19;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab20: do {
              if (!this.eq_s_b("\u0BA4")) {
                break lab20;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab21: do {
              if (!this.eq_s_b("\u0BAF")) {
                break lab21;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab22: do {
              if (!this.eq_s_b("\u0BAA\u0BA9\u0BCD")) {
                break lab22;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab23: do {
              if (!this.eq_s_b("\u0BAA\u0BB3\u0BCD")) {
                break lab23;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab24: do {
              if (!this.eq_s_b("\u0BAA\u0BB0\u0BCD")) {
                break lab24;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab25: do {
              if (!this.eq_s_b("\u0BA4\u0BC1")) {
                break lab25;
              }
              v_8 = this.limit - this.cursor;
              {
                v_9 = this.limit - this.cursor;
                lab26: do {
                  if (this.find_among_b(StemmerTa.a_24) === 0) {
                    break lab26;
                  }
                  break lab25;
                } while (false);
                this.cursor = this.limit - v_9;
              }
              this.cursor = this.limit - v_8;
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab27: do {
              if (!this.eq_s_b("\u0BBF\u0BB1\u0BCD\u0BB1\u0BC1")) {
                break lab27;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab28: do {
              if (!this.eq_s_b("\u0BAA\u0BAE\u0BCD")) {
                break lab28;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab29: do {
              if (!this.eq_s_b("\u0BA9\u0BAE\u0BCD")) {
                break lab29;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab30: do {
              if (!this.eq_s_b("\u0BA4\u0BC1\u0BAE\u0BCD")) {
                break lab30;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab31: do {
              if (!this.eq_s_b("\u0BB1\u0BC1\u0BAE\u0BCD")) {
                break lab31;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab32: do {
              if (!this.eq_s_b("\u0B95\u0BC1\u0BAE\u0BCD")) {
                break lab32;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab33: do {
              if (!this.eq_s_b("\u0BA9\u0BC6\u0BA9\u0BCD")) {
                break lab33;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            lab34: do {
              if (!this.eq_s_b("\u0BA9\u0BC8")) {
                break lab34;
              }
              break lab4;
            } while (false);
            this.cursor = this.limit - v_5;
            if (!this.eq_s_b("\u0BB5\u0BC8")) {
              break lab3;
            }
          } while (false);
          this.bra = this.cursor;
          this.slice_del();
          this.B_found_a_match = true;
          this.cursor = this.limit - v_4;
          break lab1;
        } while (false);
        this.cursor = this.limit - v_2;
        lab35: do {
          v_10 = this.limit - this.cursor;
          this.ket = this.cursor;
          lab36: do {
            v_11 = this.limit - this.cursor;
            lab37: do {
              if (!this.eq_s_b("\u0BBE\u0BA9\u0BCD")) {
                break lab37;
              }
              v_12 = this.limit - this.cursor;
              {
                v_13 = this.limit - this.cursor;
                lab38: do {
                  if (!this.eq_s_b("\u0B9A")) {
                    break lab38;
                  }
                  break lab37;
                } while (false);
                this.cursor = this.limit - v_13;
              }
              this.cursor = this.limit - v_12;
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab39: do {
              if (!this.eq_s_b("\u0BBE\u0BB3\u0BCD")) {
                break lab39;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab40: do {
              if (!this.eq_s_b("\u0BBE\u0BB0\u0BCD")) {
                break lab40;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab41: do {
              if (!this.eq_s_b("\u0BC7\u0BA9\u0BCD")) {
                break lab41;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab42: do {
              if (!this.eq_s_b("\u0BBE")) {
                break lab42;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab43: do {
              if (!this.eq_s_b("\u0BBE\u0BAE\u0BCD")) {
                break lab43;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab44: do {
              if (!this.eq_s_b("\u0BC6\u0BAE\u0BCD")) {
                break lab44;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab45: do {
              if (!this.eq_s_b("\u0BC7\u0BAE\u0BCD")) {
                break lab45;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab46: do {
              if (!this.eq_s_b("\u0BCB\u0BAE\u0BCD")) {
                break lab46;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab47: do {
              if (!this.eq_s_b("\u0B95\u0BC1\u0BAE\u0BCD")) {
                break lab47;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab48: do {
              if (!this.eq_s_b("\u0BA4\u0BC1\u0BAE\u0BCD")) {
                break lab48;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab49: do {
              if (!this.eq_s_b("\u0B9F\u0BC1\u0BAE\u0BCD")) {
                break lab49;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab50: do {
              if (!this.eq_s_b("\u0BB1\u0BC1\u0BAE\u0BCD")) {
                break lab50;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab51: do {
              if (!this.eq_s_b("\u0BBE\u0BAF\u0BCD")) {
                break lab51;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab52: do {
              if (!this.eq_s_b("\u0BA9\u0BC6\u0BA9\u0BCD")) {
                break lab52;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab53: do {
              if (!this.eq_s_b("\u0BA9\u0BBF\u0BB0\u0BCD")) {
                break lab53;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            lab54: do {
              if (!this.eq_s_b("\u0BC0\u0BB0\u0BCD")) {
                break lab54;
              }
              break lab36;
            } while (false);
            this.cursor = this.limit - v_11;
            if (!this.eq_s_b("\u0BC0\u0BAF\u0BB0\u0BCD")) {
              break lab35;
            }
          } while (false);
          this.bra = this.cursor;
          this.slice_from("\u0BCD");
          this.B_found_a_match = true;
          this.cursor = this.limit - v_10;
          break lab1;
        } while (false);
        this.cursor = this.limit - v_2;
        v_14 = this.limit - this.cursor;
        this.ket = this.cursor;
        lab55: do {
          v_15 = this.limit - this.cursor;
          lab56: do {
            if (!this.eq_s_b("\u0B95\u0BC1")) {
              break lab56;
            }
            break lab55;
          } while (false);
          this.cursor = this.limit - v_15;
          if (!this.eq_s_b("\u0BA4\u0BC1")) {
            break lab0;
          }
        } while (false);
        v_16 = this.limit - this.cursor;
        if (!this.eq_s_b("\u0BCD")) {
          break lab0;
        }
        this.cursor = this.limit - v_16;
        this.bra = this.cursor;
        this.slice_del();
        this.B_found_a_match = true;
        this.cursor = this.limit - v_14;
      } while (false);
    } while (false);
    this.cursor = this.limit - v_1;
    v_17 = this.limit - this.cursor;
    lab57: do {
      this.ket = this.cursor;
      if (this.find_among_b(StemmerTa.a_25) === 0) {
        break lab57;
      }
      this.bra = this.cursor;
      this.slice_del();
      this.B_found_a_match = true;
    } while (false);
    this.cursor = this.limit - v_17;
    this.cursor = this.limit_backward;
    v_18 = this.cursor;
    lab58: do {
      if (!this.r_fix_endings()) {
        break lab58;
      }
    } while (false);
    this.cursor = v_18;
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
    this.B_found_vetrumai_urupu = false;
    v_1 = this.cursor;
    lab0: do {
      if (!this.r_fix_ending()) {
        break lab0;
      }
    } while (false);
    this.cursor = v_1;
    if (!this.r_has_min_length()) {
      return false;
    }
    v_2 = this.cursor;
    lab1: do {
      if (!this.r_remove_question_prefixes()) {
        break lab1;
      }
    } while (false);
    this.cursor = v_2;
    v_3 = this.cursor;
    lab2: do {
      if (!this.r_remove_pronoun_prefixes()) {
        break lab2;
      }
    } while (false);
    this.cursor = v_3;
    v_4 = this.cursor;
    lab3: do {
      if (!this.r_remove_question_suffixes()) {
        break lab3;
      }
    } while (false);
    this.cursor = v_4;
    v_5 = this.cursor;
    lab4: do {
      if (!this.r_remove_um()) {
        break lab4;
      }
    } while (false);
    this.cursor = v_5;
    v_6 = this.cursor;
    lab5: do {
      if (!this.r_remove_common_word_endings()) {
        break lab5;
      }
    } while (false);
    this.cursor = v_6;
    v_7 = this.cursor;
    lab6: do {
      if (!this.r_remove_vetrumai_urupukal()) {
        break lab6;
      }
    } while (false);
    this.cursor = v_7;
    v_8 = this.cursor;
    lab7: do {
      if (!this.r_remove_plural_suffix()) {
        break lab7;
      }
    } while (false);
    this.cursor = v_8;
    v_9 = this.cursor;
    lab8: do {
      if (!this.r_remove_command_suffixes()) {
        break lab8;
      }
    } while (false);
    this.cursor = v_9;
    v_10 = this.cursor;
    lab9: do {
      if (!this.r_remove_tense_suffixes()) {
        break lab9;
      }
    } while (false);
    this.cursor = v_10;
    return true;
  }
}

StemmerTa.a_0 = [
  new Among("\u0B95", -1, -1),
  new Among("\u0B99", -1, -1),
  new Among("\u0B9A", -1, -1),
  new Among("\u0B9E", -1, -1),
  new Among("\u0BA4", -1, -1),
  new Among("\u0BA8", -1, -1),
  new Among("\u0BAA", -1, -1),
  new Among("\u0BAE", -1, -1),
  new Among("\u0BAF", -1, -1),
  new Among("\u0BB5", -1, -1)
];

StemmerTa.a_1 = [
  new Among("\u0BA8\u0BCD\u0BA4", -1, -1),
  new Among("\u0BA8\u0BCD\u0BA4\u0BCD", -1, -1),
  new Among("\u0BA8\u0BCD", -1, -1)
];

StemmerTa.a_2 = [
  new Among("\u0BBF", -1, -1),
  new Among("\u0BC0", -1, -1),
  new Among("\u0BC8", -1, -1)
];

StemmerTa.a_3 = [
  new Among("\u0B95", -1, -1),
  new Among("\u0B9A", -1, -1),
  new Among("\u0B9F", -1, -1),
  new Among("\u0BA4", -1, -1),
  new Among("\u0BAA", -1, -1),
  new Among("\u0BB1", -1, -1)
];

StemmerTa.a_4 = [
  new Among("\u0B95", -1, -1),
  new Among("\u0B9A", -1, -1),
  new Among("\u0B9F", -1, -1),
  new Among("\u0BA4", -1, -1),
  new Among("\u0BAA", -1, -1),
  new Among("\u0BB1", -1, -1)
];

StemmerTa.a_5 = [
  new Among("\u0B95", -1, -1),
  new Among("\u0B9A", -1, -1),
  new Among("\u0B9F", -1, -1),
  new Among("\u0BA4", -1, -1),
  new Among("\u0BAA", -1, -1),
  new Among("\u0BB1", -1, -1)
];

StemmerTa.a_6 = [
  new Among("\u0BAF", -1, -1),
  new Among("\u0BB0", -1, -1),
  new Among("\u0BB2", -1, -1),
  new Among("\u0BB3", -1, -1),
  new Among("\u0BB4", -1, -1),
  new Among("\u0BB5", -1, -1)
];

StemmerTa.a_7 = [
  new Among("\u0B99", -1, -1),
  new Among("\u0B9E", -1, -1),
  new Among("\u0BA3", -1, -1),
  new Among("\u0BA8", -1, -1),
  new Among("\u0BA9", -1, -1),
  new Among("\u0BAE", -1, -1)
];

StemmerTa.a_8 = [
  new Among("\u0BAF", -1, -1),
  new Among("\u0BB5", -1, -1),
  new Among("\u0BB5\u0BCD", -1, -1)
];

StemmerTa.a_9 = [
  new Among("\u0BBE", -1, -1),
  new Among("\u0BBF", -1, -1),
  new Among("\u0BC0", -1, -1),
  new Among("\u0BC1", -1, -1),
  new Among("\u0BC2", -1, -1),
  new Among("\u0BC6", -1, -1),
  new Among("\u0BC7", -1, -1),
  new Among("\u0BC8", -1, -1)
];

StemmerTa.a_10 = [
  new Among("\u0BBE", -1, -1),
  new Among("\u0BBF", -1, -1),
  new Among("\u0BC0", -1, -1),
  new Among("\u0BC1", -1, -1),
  new Among("\u0BC2", -1, -1),
  new Among("\u0BC6", -1, -1),
  new Among("\u0BC7", -1, -1),
  new Among("\u0BC8", -1, -1)
];

StemmerTa.a_11 = [
  new Among("\u0B85", -1, -1),
  new Among("\u0B87", -1, -1),
  new Among("\u0B89", -1, -1)
];

StemmerTa.a_12 = [
  new Among("\u0B95", -1, -1),
  new Among("\u0B99", -1, -1),
  new Among("\u0B9A", -1, -1),
  new Among("\u0B9E", -1, -1),
  new Among("\u0BA4", -1, -1),
  new Among("\u0BA8", -1, -1),
  new Among("\u0BAA", -1, -1),
  new Among("\u0BAE", -1, -1),
  new Among("\u0BAF", -1, -1),
  new Among("\u0BB5", -1, -1)
];

StemmerTa.a_13 = [
  new Among("\u0B95", -1, -1),
  new Among("\u0B9A", -1, -1),
  new Among("\u0B9F", -1, -1),
  new Among("\u0BA4", -1, -1),
  new Among("\u0BAA", -1, -1),
  new Among("\u0BB1", -1, -1)
];

StemmerTa.a_14 = [
  new Among("\u0BBE", -1, -1),
  new Among("\u0BC7", -1, -1),
  new Among("\u0BCB", -1, -1)
];

StemmerTa.a_15 = [
  new Among("\u0BAA\u0BBF", -1, -1),
  new Among("\u0BB5\u0BBF", -1, -1)
];

StemmerTa.a_16 = [
  new Among("\u0BBE", -1, -1),
  new Among("\u0BBF", -1, -1),
  new Among("\u0BC0", -1, -1),
  new Among("\u0BC1", -1, -1),
  new Among("\u0BC2", -1, -1),
  new Among("\u0BC6", -1, -1),
  new Among("\u0BC7", -1, -1),
  new Among("\u0BC8", -1, -1)
];

StemmerTa.a_17 = [
  new Among("\u0BAA\u0B9F\u0BCD\u0B9F", -1, -1),
  new Among("\u0BAA\u0B9F\u0BCD\u0B9F\u0BA3", -1, -1),
  new Among("\u0BA4\u0BBE\u0BA9", -1, -1),
  new Among("\u0BAA\u0B9F\u0BBF\u0BA4\u0BBE\u0BA9", 2, -1),
  new Among("\u0B95\u0BC1\u0BB0\u0BBF\u0BAF", -1, -1),
  new Among("\u0BAA\u0B9F\u0BBF", -1, -1),
  new Among("\u0BAA\u0BB1\u0BCD\u0BB1\u0BBF", -1, -1),
  new Among("\u0BAA\u0B9F\u0BC1", -1, -1),
  new Among("\u0BB5\u0BBF\u0B9F\u0BC1", -1, -1),
  new Among("\u0BAA\u0B9F\u0BCD\u0B9F\u0BC1", -1, -1),
  new Among("\u0BB5\u0BBF\u0B9F\u0BCD\u0B9F\u0BC1", -1, -1),
  new Among("\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1", -1, -1),
  new Among("\u0BC6\u0BB2\u0BCD\u0BB2\u0BBE\u0BAE\u0BCD", -1, -1)
];

StemmerTa.a_18 = [
  new Among("\u0B95", -1, -1),
  new Among("\u0B9A", -1, -1),
  new Among("\u0B9F", -1, -1),
  new Among("\u0BA4", -1, -1),
  new Among("\u0BAA", -1, -1),
  new Among("\u0BB1", -1, -1)
];

StemmerTa.a_19 = [
  new Among("\u0B95", -1, -1),
  new Among("\u0B9A", -1, -1),
  new Among("\u0B9F", -1, -1),
  new Among("\u0BA4", -1, -1),
  new Among("\u0BAA", -1, -1),
  new Among("\u0BB1", -1, -1)
];

StemmerTa.a_20 = [
  new Among("\u0BBE", -1, -1),
  new Among("\u0BBF", -1, -1),
  new Among("\u0BC0", -1, -1),
  new Among("\u0BC1", -1, -1),
  new Among("\u0BC2", -1, -1),
  new Among("\u0BC6", -1, -1),
  new Among("\u0BC7", -1, -1),
  new Among("\u0BC8", -1, -1)
];

StemmerTa.a_21 = [
  new Among("\u0BBE", -1, -1),
  new Among("\u0BBF", -1, -1),
  new Among("\u0BC0", -1, -1),
  new Among("\u0BC1", -1, -1),
  new Among("\u0BC2", -1, -1),
  new Among("\u0BC6", -1, -1),
  new Among("\u0BC7", -1, -1),
  new Among("\u0BC8", -1, -1)
];

StemmerTa.a_22 = [
  new Among("\u0BAA\u0B9F\u0BC1", -1, -1),
  new Among("\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BCD", -1, -1)
];

StemmerTa.a_23 = [
  new Among("\u0B85", -1, -1),
  new Among("\u0B86", -1, -1),
  new Among("\u0B87", -1, -1),
  new Among("\u0B88", -1, -1),
  new Among("\u0B89", -1, -1),
  new Among("\u0B8A", -1, -1),
  new Among("\u0B8E", -1, -1),
  new Among("\u0B8F", -1, -1),
  new Among("\u0B90", -1, -1),
  new Among("\u0B92", -1, -1),
  new Among("\u0B93", -1, -1),
  new Among("\u0B94", -1, -1)
];

StemmerTa.a_24 = [
  new Among("\u0BBE", -1, -1),
  new Among("\u0BBF", -1, -1),
  new Among("\u0BC0", -1, -1),
  new Among("\u0BC1", -1, -1),
  new Among("\u0BC2", -1, -1),
  new Among("\u0BC6", -1, -1),
  new Among("\u0BC7", -1, -1),
  new Among("\u0BC8", -1, -1)
];

StemmerTa.a_25 = [
  new Among("\u0B95\u0BBF\u0BB1", -1, -1),
  new Among("\u0B95\u0BBF\u0BA9\u0BCD\u0BB1", -1, -1),
  new Among("\u0BBE\u0BA8\u0BBF\u0BA9\u0BCD\u0BB1", -1, -1),
  new Among("\u0B95\u0BBF\u0BB1\u0BCD", -1, -1),
  new Among("\u0B95\u0BBF\u0BA9\u0BCD\u0BB1\u0BCD", -1, -1),
  new Among("\u0BBE\u0BA8\u0BBF\u0BA9\u0BCD\u0BB1\u0BCD", -1, -1)
];

module.exports = StemmerTa;
