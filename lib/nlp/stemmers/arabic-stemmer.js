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

const BaseStemmer = require("./base-stemmer");
const Among = require("./among");

class ArabicStemmer extends BaseStemmer {
  constructor(tokenizer) {
    super(tokenizer);
    this.B_is_defined = false;
    this.B_is_verb = false;
    this.B_is_noun = false;
    this.I_word_len = 0;
  }

  r_Normalize_pre() {
    let among_var;
    let v_1;
    let v_2;
    for (v_1 = this.current.length; v_1 > 0; v_1--) {
      lab0: do {
        v_2 = this.cursor;
        lab1: do {
          this.bra = this.cursor;
          among_var = this.find_among(ArabicStemmer.a_0);
          if (among_var === 0) {
            break lab1;
          }
          this.ket = this.cursor;
          switch (among_var) {
            case 0:
              break lab1;
            case 1:
              this.slice_del();
              break;
            case 2:
              this.slice_del();
              break;
            case 3:
              this.slice_del();
              break;
            case 4:
              this.slice_del();
              break;
            case 5:
              this.slice_from("0");
              break;
            case 6:
              this.slice_from("1");
              break;
            case 7:
              this.slice_from("2");
              break;
            case 8:
              this.slice_from("3");
              break;
            case 9:
              this.slice_from("4");
              break;
            case 10:
              this.slice_from("5");
              break;
            case 11:
              this.slice_from("6");
              break;
            case 12:
              this.slice_from("7");
              break;
            case 13:
              this.slice_from("8");
              break;
            case 14:
              this.slice_from("9");
              break;
            case 15:
              this.slice_del();
              break;
            case 16:
              this.slice_from("\u0621");
              break;
            case 17:
              this.slice_from("\u0623");
              break;
            case 18:
              this.slice_from("\u0625");
              break;
            case 19:
              this.slice_from("\u0626");
              break;
            case 20:
              this.slice_from("\u0622");
              break;
            case 21:
              this.slice_from("\u0624");
              break;
            case 22:
              this.slice_from("\u0627");
              break;
            case 23:
              this.slice_from("\u0628");
              break;
            case 24:
              this.slice_from("\u0629");
              break;
            case 25:
              this.slice_from("\u062A");
              break;
            case 26:
              this.slice_from("\u062B");
              break;
            case 27:
              this.slice_from("\u062C");
              break;
            case 28:
              this.slice_from("\u062D");
              break;
            case 29:
              this.slice_from("\u062E");
              break;
            case 30:
              this.slice_from("\u062F");
              break;
            case 31:
              this.slice_from("\u0630");
              break;
            case 32:
              this.slice_from("\u0631");
              break;
            case 33:
              this.slice_from("\u0632");
              break;
            case 34:
              this.slice_from("\u0633");
              break;
            case 35:
              this.slice_from("\u0634");
              break;
            case 36:
              this.slice_from("\u0635");
              break;
            case 37:
              this.slice_from("\u0636");
              break;
            case 38:
              this.slice_from("\u0637");
              break;
            case 39:
              this.slice_from("\u0638");
              break;
            case 40:
              this.slice_from("\u0639");
              break;
            case 41:
              this.slice_from("\u063A");
              break;
            case 42:
              this.slice_from("\u0641");
              break;
            case 43:
              this.slice_from("\u0642");
              break;
            case 44:
              this.slice_from("\u0643");
              break;
            case 45:
              this.slice_from("\u0644");
              break;
            case 46:
              this.slice_from("\u0645");
              break;
            case 47:
              this.slice_from("\u0646");
              break;
            case 48:
              this.slice_from("\u0647");
              break;
            case 49:
              this.slice_from("\u0648");
              break;
            case 50:
              this.slice_from("\u0649");
              break;
            case 51:
              this.slice_from("\u064A");
              break;
            case 52:
              this.slice_from("\u0644\u0627");
              break;
            case 53:
              this.slice_from("\u0644\u0623");
              break;
            case 54:
              this.slice_from("\u0644\u0625");
              break;
            case 55:
              this.slice_from("\u0644\u0622");
              break;
          }
          break lab0;
        } while (false);
        this.cursor = v_2;
        if (this.cursor >= this.limit) {
          return false;
        }
        this.cursor++;
      } while (false);
    }
    return true;
  }
  r_Normalize_post() {
    let among_var;
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    v_1 = this.cursor;
    lab0: do {
      this.limit_backward = this.cursor;
      this.cursor = this.limit;
      this.ket = this.cursor;
      among_var = this.find_among_b(ArabicStemmer.a_1);
      if (among_var === 0) {
        break lab0;
      }
      this.bra = this.cursor;
      switch (among_var) {
        case 0:
          break lab0;
        case 1:
          this.slice_from("\u0621");
          break;
        case 2:
          this.slice_from("\u0621");
          break;
        case 3:
          this.slice_from("\u0621");
          break;
      }
      this.cursor = this.limit_backward;
    } while (false);
    this.cursor = v_1;
    v_2 = this.cursor;
    lab1: do {
      for (v_3 = this.I_word_len; v_3 > 0; v_3--) {
        lab2: do {
          v_4 = this.cursor;
          lab3: do {
            this.bra = this.cursor;
            among_var = this.find_among(ArabicStemmer.a_2);
            if (among_var === 0) {
              break lab3;
            }
            this.ket = this.cursor;
            switch (among_var) {
              case 0:
                break lab3;
              case 1:
                this.slice_from("\u0627");
                break;
              case 2:
                this.slice_from("\u0648");
                break;
              case 3:
                this.slice_from("\u064A");
                break;
            }
            break lab2;
          } while (false);
          this.cursor = v_4;
          if (this.cursor >= this.limit) {
            break lab1;
          }
          this.cursor++;
        } while (false);
      }
    } while (false);
    this.cursor = v_2;
    return true;
  }
  r_Checks1() {
    let among_var;
    this.I_word_len = this.current.length;
    this.bra = this.cursor;
    among_var = this.find_among(ArabicStemmer.a_3);
    if (among_var === 0) {
      return false;
    }
    this.ket = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len > 4)) {
          return false;
        }
        this.B_is_noun = true;
        this.B_is_verb = false;
        this.B_is_defined = true;
        break;
      case 2:
        if (!(this.I_word_len > 3)) {
          return false;
        }
        this.B_is_noun = true;
        this.B_is_verb = false;
        this.B_is_defined = true;
        break;
    }
    return true;
  }
  r_Prefix_Step1() {
    let among_var;
    this.I_word_len = this.current.length;
    this.bra = this.cursor;
    among_var = this.find_among(ArabicStemmer.a_4);
    if (among_var === 0) {
      return false;
    }
    this.ket = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len > 3)) {
          return false;
        }
        this.slice_from("\u0623");
        break;
      case 2:
        if (!(this.I_word_len > 3)) {
          return false;
        }
        this.slice_from("\u0622");
        break;
      case 3:
        if (!(this.I_word_len > 3)) {
          return false;
        }
        this.slice_from("\u0623");
        break;
      case 4:
        if (!(this.I_word_len > 3)) {
          return false;
        }
        this.slice_from("\u0627");
        break;
      case 5:
        if (!(this.I_word_len > 3)) {
          return false;
        }
        this.slice_from("\u0625");
        break;
    }
    return true;
  }
  r_Prefix_Step2() {
    let among_var;
    let v_1;
    let v_2;
    this.I_word_len = this.current.length;
    {
      v_1 = this.cursor;
      lab0: do {
        if (!this.eq_s("\u0641\u0627")) {
          break lab0;
        }
        return false;
      } while (false);
      this.cursor = v_1;
    }
    {
      v_2 = this.cursor;
      lab1: do {
        if (!this.eq_s("\u0648\u0627")) {
          break lab1;
        }
        return false;
      } while (false);
      this.cursor = v_2;
    }
    this.bra = this.cursor;
    among_var = this.find_among(ArabicStemmer.a_5);
    if (among_var === 0) {
      return false;
    }
    this.ket = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len > 3)) {
          return false;
        }
        this.slice_del();
        break;
      case 2:
        if (!(this.I_word_len > 3)) {
          return false;
        }
        this.slice_del();
        break;
    }
    return true;
  }
  r_Prefix_Step3a_Noun() {
    let among_var;
    this.I_word_len = this.current.length;
    this.bra = this.cursor;
    among_var = this.find_among(ArabicStemmer.a_6);
    if (among_var === 0) {
      return false;
    }
    this.ket = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len > 5)) {
          return false;
        }
        this.slice_del();
        break;
      case 2:
        if (!(this.I_word_len > 4)) {
          return false;
        }
        this.slice_del();
        break;
    }
    return true;
  }
  r_Prefix_Step3b_Noun() {
    let among_var;
    let v_1;
    this.I_word_len = this.current.length;
    {
      v_1 = this.cursor;
      lab0: do {
        if (!this.eq_s("\u0628\u0627")) {
          break lab0;
        }
        return false;
      } while (false);
      this.cursor = v_1;
    }
    this.bra = this.cursor;
    among_var = this.find_among(ArabicStemmer.a_7);
    if (among_var === 0) {
      return false;
    }
    this.ket = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len > 3)) {
          return false;
        }
        this.slice_del();
        break;
      case 2:
        if (!(this.I_word_len > 3)) {
          return false;
        }
        this.slice_from("\u0628");
        break;
      case 3:
        if (!(this.I_word_len > 3)) {
          return false;
        }
        this.slice_from("\u0643");
        break;
    }
    return true;
  }
  r_Prefix_Step3_Verb() {
    let among_var;
    this.I_word_len = this.current.length;
    this.bra = this.cursor;
    among_var = this.find_among(ArabicStemmer.a_8);
    if (among_var === 0) {
      return false;
    }
    this.ket = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len > 4)) {
          return false;
        }
        this.slice_from("\u064A");
        break;
      case 2:
        if (!(this.I_word_len > 4)) {
          return false;
        }
        this.slice_from("\u062A");
        break;
      case 3:
        if (!(this.I_word_len > 4)) {
          return false;
        }
        this.slice_from("\u0646");
        break;
      case 4:
        if (!(this.I_word_len > 4)) {
          return false;
        }
        this.slice_from("\u0623");
        break;
    }
    return true;
  }
  r_Prefix_Step4_Verb() {
    let among_var;
    this.I_word_len = this.current.length;
    this.bra = this.cursor;
    among_var = this.find_among(ArabicStemmer.a_9);
    if (among_var === 0) {
      return false;
    }
    this.ket = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len > 4)) {
          return false;
        }
        this.B_is_verb = true;
        this.B_is_noun = false;
        this.slice_from("\u0627\u0633\u062A");
        break;
    }
    return true;
  }
  r_Suffix_Noun_Step1a() {
    let among_var;
    this.I_word_len = this.current.length;
    this.ket = this.cursor;
    among_var = this.find_among_b(ArabicStemmer.a_10);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len >= 4)) {
          return false;
        }
        this.slice_del();
        break;
      case 2:
        if (!(this.I_word_len >= 5)) {
          return false;
        }
        this.slice_del();
        break;
      case 3:
        if (!(this.I_word_len >= 6)) {
          return false;
        }
        this.slice_del();
        break;
    }
    return true;
  }
  r_Suffix_Noun_Step1b() {
    let among_var;
    this.I_word_len = this.current.length;
    this.ket = this.cursor;
    among_var = this.find_among_b(ArabicStemmer.a_11);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len > 5)) {
          return false;
        }
        this.slice_del();
        break;
    }
    return true;
  }
  r_Suffix_Noun_Step2a() {
    let among_var;
    this.I_word_len = this.current.length;
    this.ket = this.cursor;
    among_var = this.find_among_b(ArabicStemmer.a_12);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len > 4)) {
          return false;
        }
        this.slice_del();
        break;
    }
    return true;
  }
  r_Suffix_Noun_Step2b() {
    let among_var;
    this.I_word_len = this.current.length;
    this.ket = this.cursor;
    among_var = this.find_among_b(ArabicStemmer.a_13);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len >= 5)) {
          return false;
        }
        this.slice_del();
        break;
    }
    return true;
  }
  r_Suffix_Noun_Step2c1() {
    let among_var;
    this.I_word_len = this.current.length;
    this.ket = this.cursor;
    among_var = this.find_among_b(ArabicStemmer.a_14);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len >= 4)) {
          return false;
        }
        this.slice_del();
        break;
    }
    return true;
  }
  r_Suffix_Noun_Step2c2() {
    let among_var;
    this.I_word_len = this.current.length;
    this.ket = this.cursor;
    among_var = this.find_among_b(ArabicStemmer.a_15);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len >= 4)) {
          return false;
        }
        this.slice_del();
        break;
    }
    return true;
  }
  r_Suffix_Noun_Step3() {
    let among_var;
    this.I_word_len = this.current.length;
    this.ket = this.cursor;
    among_var = this.find_among_b(ArabicStemmer.a_16);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len >= 3)) {
          return false;
        }
        this.slice_del();
        break;
    }
    return true;
  }
  r_Suffix_Verb_Step1() {
    let among_var;
    this.I_word_len = this.current.length;
    this.ket = this.cursor;
    among_var = this.find_among_b(ArabicStemmer.a_17);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len >= 4)) {
          return false;
        }
        this.slice_del();
        break;
      case 2:
        if (!(this.I_word_len >= 5)) {
          return false;
        }
        this.slice_del();
        break;
      case 3:
        if (!(this.I_word_len >= 6)) {
          return false;
        }
        this.slice_del();
        break;
    }
    return true;
  }
  r_Suffix_Verb_Step2a() {
    let among_var;
    this.I_word_len = this.current.length;
    this.ket = this.cursor;
    among_var = this.find_among_b(ArabicStemmer.a_18);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len >= 4)) {
          return false;
        }
        this.slice_del();
        break;
      case 2:
        if (!(this.I_word_len >= 4)) {
          return false;
        }
        this.slice_del();
        break;
      case 3:
        if (!(this.I_word_len >= 5)) {
          return false;
        }
        this.slice_del();
        break;
      case 4:
        if (!(this.I_word_len > 5)) {
          return false;
        }
        this.slice_del();
        break;
      case 5:
        if (!(this.I_word_len >= 6)) {
          return false;
        }
        this.slice_del();
        break;
    }
    return true;
  }
  r_Suffix_Verb_Step2b() {
    let among_var;
    this.I_word_len = this.current.length;
    this.ket = this.cursor;
    among_var = this.find_among_b(ArabicStemmer.a_19);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len >= 5)) {
          return false;
        }
        this.slice_del();
        break;
    }
    return true;
  }
  r_Suffix_Verb_Step2c() {
    let among_var;
    this.I_word_len = this.current.length;
    this.ket = this.cursor;
    among_var = this.find_among_b(ArabicStemmer.a_20);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!(this.I_word_len >= 4)) {
          return false;
        }
        this.slice_del();
        break;
      case 2:
        if (!(this.I_word_len >= 6)) {
          return false;
        }
        this.slice_del();
        break;
    }
    return true;
  }
  r_Suffix_All_alef_maqsura() {
    let among_var;
    this.I_word_len = this.current.length;
    this.ket = this.cursor;
    among_var = this.find_among_b(ArabicStemmer.a_21);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        this.slice_from("\u064A");
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
    let v_7;
    let v_8;
    let v_9;
    let v_10;
    let v_12;
    let v_13;
    let v_15;
    let v_16;
    let v_17;
    let v_18;
    let v_19;
    let v_20;
    this.B_is_noun = true;
    this.B_is_verb = true;
    this.B_is_defined = false;
    v_1 = this.cursor;
    lab0: do {
      if (!this.r_Checks1()) {
        break lab0;
      }
    } while (false);
    this.cursor = v_1;
    v_2 = this.cursor;
    lab1: do {
      if (!this.r_Normalize_pre()) {
        break lab1;
      }
    } while (false);
    this.cursor = v_2;
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    v_3 = this.limit - this.cursor;
    lab2: do {
      lab3: do {
        v_4 = this.limit - this.cursor;
        lab4: do {
          if (!this.B_is_verb) {
            break lab4;
          }
          lab5: do {
            v_5 = this.limit - this.cursor;
            lab6: do {
              {
                let v_6 = 1;
                replab7: while (true) {
                  v_7 = this.limit - this.cursor;
                  lab8: do {
                    if (!this.r_Suffix_Verb_Step1()) {
                      break lab8;
                    }
                    v_6--;
                    continue replab7;
                  } while (false);
                  this.cursor = this.limit - v_7;
                  break replab7;
                }
                if (v_6 > 0) {
                  break lab6;
                }
              }
              lab9: do {
                v_8 = this.limit - this.cursor;
                lab10: do {
                  if (!this.r_Suffix_Verb_Step2a()) {
                    break lab10;
                  }
                  break lab9;
                } while (false);
                this.cursor = this.limit - v_8;
                lab11: do {
                  if (!this.r_Suffix_Verb_Step2c()) {
                    break lab11;
                  }
                  break lab9;
                } while (false);
                this.cursor = this.limit - v_8;
                if (this.cursor <= this.limit_backward) {
                  break lab6;
                }
                this.cursor--;
              } while (false);
              break lab5;
            } while (false);
            this.cursor = this.limit - v_5;
            lab12: do {
              if (!this.r_Suffix_Verb_Step2b()) {
                break lab12;
              }
              break lab5;
            } while (false);
            this.cursor = this.limit - v_5;
            if (!this.r_Suffix_Verb_Step2a()) {
              break lab4;
            }
          } while (false);
          break lab3;
        } while (false);
        this.cursor = this.limit - v_4;
        lab13: do {
          if (!this.B_is_noun) {
            break lab13;
          }
          v_9 = this.limit - this.cursor;
          lab14: do {
            lab15: do {
              v_10 = this.limit - this.cursor;
              lab16: do {
                if (!this.r_Suffix_Noun_Step2c2()) {
                  break lab16;
                }
                break lab15;
              } while (false);
              this.cursor = this.limit - v_10;
              lab17: do {
                lab18: do {
                  if (!this.B_is_defined) {
                    break lab18;
                  }
                  break lab17;
                } while (false);
                if (!this.r_Suffix_Noun_Step1a()) {
                  break lab17;
                }
                lab19: do {
                  v_12 = this.limit - this.cursor;
                  lab20: do {
                    if (!this.r_Suffix_Noun_Step2a()) {
                      break lab20;
                    }
                    break lab19;
                  } while (false);
                  this.cursor = this.limit - v_12;
                  lab21: do {
                    if (!this.r_Suffix_Noun_Step2b()) {
                      break lab21;
                    }
                    break lab19;
                  } while (false);
                  this.cursor = this.limit - v_12;
                  lab22: do {
                    if (!this.r_Suffix_Noun_Step2c1()) {
                      break lab22;
                    }
                    break lab19;
                  } while (false);
                  this.cursor = this.limit - v_12;
                  if (this.cursor <= this.limit_backward) {
                    break lab17;
                  }
                  this.cursor--;
                } while (false);
                break lab15;
              } while (false);
              this.cursor = this.limit - v_10;
              lab23: do {
                if (!this.r_Suffix_Noun_Step1b()) {
                  break lab23;
                }
                lab24: do {
                  v_13 = this.limit - this.cursor;
                  lab25: do {
                    if (!this.r_Suffix_Noun_Step2a()) {
                      break lab25;
                    }
                    break lab24;
                  } while (false);
                  this.cursor = this.limit - v_13;
                  lab26: do {
                    if (!this.r_Suffix_Noun_Step2b()) {
                      break lab26;
                    }
                    break lab24;
                  } while (false);
                  this.cursor = this.limit - v_13;
                  if (!this.r_Suffix_Noun_Step2c1()) {
                    break lab23;
                  }
                } while (false);
                break lab15;
              } while (false);
              this.cursor = this.limit - v_10;
              lab27: do {
                lab28: do {
                  if (!this.B_is_defined) {
                    break lab28;
                  }
                  break lab27;
                } while (false);
                if (!this.r_Suffix_Noun_Step2a()) {
                  break lab27;
                }
                break lab15;
              } while (false);
              this.cursor = this.limit - v_10;
              if (!this.r_Suffix_Noun_Step2b()) {
                this.cursor = this.limit - v_9;
                break lab14;
              }
            } while (false);
          } while (false);
          if (!this.r_Suffix_Noun_Step3()) {
            break lab13;
          }
          break lab3;
        } while (false);
        this.cursor = this.limit - v_4;
        if (!this.r_Suffix_All_alef_maqsura()) {
          break lab2;
        }
      } while (false);
    } while (false);
    this.cursor = this.limit - v_3;
    this.cursor = this.limit_backward;
    v_15 = this.cursor;
    lab29: do {
      v_16 = this.cursor;
      lab30: do {
        if (!this.r_Prefix_Step1()) {
          this.cursor = v_16;
          break lab30;
        }
      } while (false);
      v_17 = this.cursor;
      lab31: do {
        if (!this.r_Prefix_Step2()) {
          this.cursor = v_17;
          break lab31;
        }
      } while (false);
      lab32: do {
        v_18 = this.cursor;
        lab33: do {
          if (!this.r_Prefix_Step3a_Noun()) {
            break lab33;
          }
          break lab32;
        } while (false);
        this.cursor = v_18;
        lab34: do {
          if (!this.B_is_noun) {
            break lab34;
          }
          if (!this.r_Prefix_Step3b_Noun()) {
            break lab34;
          }
          break lab32;
        } while (false);
        this.cursor = v_18;
        if (!this.B_is_verb) {
          break lab29;
        }
        v_19 = this.cursor;
        lab35: do {
          if (!this.r_Prefix_Step3_Verb()) {
            this.cursor = v_19;
            break lab35;
          }
        } while (false);
        if (!this.r_Prefix_Step4_Verb()) {
          break lab29;
        }
      } while (false);
    } while (false);
    this.cursor = v_15;
    v_20 = this.cursor;
    lab36: do {
      if (!this.r_Normalize_post()) {
        break lab36;
      }
    } while (false);
    this.cursor = v_20;
    return true;
  }
}

ArabicStemmer.a_0 = [
  new Among("!", -1, 3),
  new Among("'", -1, 3),
  new Among("%", -1, 3),
  new Among("*", -1, 3),
  new Among(",", -1, 3),
  new Among(".", -1, 3),
  new Among("/", -1, 3),
  new Among(":", -1, 3),
  new Among(";", -1, 3),
  new Among("?", -1, 3),
  new Among("\\", -1, 3),
  new Among("\u060C", -1, 4),
  new Among("\u061B", -1, 4),
  new Among("\u061F", -1, 4),
  new Among("\u0640", -1, 2),
  new Among("\u064B", -1, 1),
  new Among("\u064C", -1, 1),
  new Among("\u064D", -1, 1),
  new Among("\u064E", -1, 1),
  new Among("\u064F", -1, 1),
  new Among("\u0650", -1, 1),
  new Among("\u0651", -1, 1),
  new Among("\u0652", -1, 1),
  new Among("\u0660", -1, 5),
  new Among("\u0661", -1, 6),
  new Among("\u0662", -1, 7),
  new Among("\u0663", -1, 8),
  new Among("\u0664", -1, 9),
  new Among("\u0665", -1, 10),
  new Among("\u0666", -1, 11),
  new Among("\u0667", -1, 12),
  new Among("\u0668", -1, 13),
  new Among("\u0669", -1, 14),
  new Among("\u066A", -1, 15),
  new Among("\u066B", -1, 15),
  new Among("\u066C", -1, 15),
  new Among("\uFE80", -1, 16),
  new Among("\uFE81", -1, 20),
  new Among("\uFE82", -1, 20),
  new Among("\uFE83", -1, 17),
  new Among("\uFE84", -1, 17),
  new Among("\uFE85", -1, 21),
  new Among("\uFE86", -1, 21),
  new Among("\uFE87", -1, 18),
  new Among("\uFE88", -1, 18),
  new Among("\uFE89", -1, 19),
  new Among("\uFE8A", -1, 19),
  new Among("\uFE8B", -1, 19),
  new Among("\uFE8C", -1, 19),
  new Among("\uFE8D", -1, 22),
  new Among("\uFE8E", -1, 22),
  new Among("\uFE8F", -1, 23),
  new Among("\uFE90", -1, 23),
  new Among("\uFE91", -1, 23),
  new Among("\uFE92", -1, 23),
  new Among("\uFE93", -1, 24),
  new Among("\uFE94", -1, 24),
  new Among("\uFE95", -1, 25),
  new Among("\uFE96", -1, 25),
  new Among("\uFE97", -1, 25),
  new Among("\uFE98", -1, 25),
  new Among("\uFE99", -1, 26),
  new Among("\uFE9A", -1, 26),
  new Among("\uFE9B", -1, 26),
  new Among("\uFE9C", -1, 26),
  new Among("\uFE9D", -1, 27),
  new Among("\uFE9E", -1, 27),
  new Among("\uFE9F", -1, 27),
  new Among("\uFEA0", -1, 27),
  new Among("\uFEA1", -1, 28),
  new Among("\uFEA2", -1, 28),
  new Among("\uFEA3", -1, 28),
  new Among("\uFEA4", -1, 28),
  new Among("\uFEA5", -1, 29),
  new Among("\uFEA6", -1, 29),
  new Among("\uFEA7", -1, 29),
  new Among("\uFEA8", -1, 29),
  new Among("\uFEA9", -1, 30),
  new Among("\uFEAA", -1, 30),
  new Among("\uFEAB", -1, 31),
  new Among("\uFEAC", -1, 31),
  new Among("\uFEAD", -1, 32),
  new Among("\uFEAE", -1, 32),
  new Among("\uFEAF", -1, 33),
  new Among("\uFEB0", -1, 33),
  new Among("\uFEB1", -1, 34),
  new Among("\uFEB2", -1, 34),
  new Among("\uFEB3", -1, 34),
  new Among("\uFEB4", -1, 34),
  new Among("\uFEB5", -1, 35),
  new Among("\uFEB6", -1, 35),
  new Among("\uFEB7", -1, 35),
  new Among("\uFEB8", -1, 35),
  new Among("\uFEB9", -1, 36),
  new Among("\uFEBA", -1, 36),
  new Among("\uFEBB", -1, 36),
  new Among("\uFEBC", -1, 36),
  new Among("\uFEBD", -1, 37),
  new Among("\uFEBE", -1, 37),
  new Among("\uFEBF", -1, 37),
  new Among("\uFEC0", -1, 37),
  new Among("\uFEC1", -1, 38),
  new Among("\uFEC2", -1, 38),
  new Among("\uFEC3", -1, 38),
  new Among("\uFEC4", -1, 38),
  new Among("\uFEC5", -1, 39),
  new Among("\uFEC6", -1, 39),
  new Among("\uFEC7", -1, 39),
  new Among("\uFEC8", -1, 39),
  new Among("\uFEC9", -1, 40),
  new Among("\uFECA", -1, 40),
  new Among("\uFECB", -1, 40),
  new Among("\uFECC", -1, 40),
  new Among("\uFECD", -1, 41),
  new Among("\uFECE", -1, 41),
  new Among("\uFECF", -1, 41),
  new Among("\uFED0", -1, 41),
  new Among("\uFED1", -1, 42),
  new Among("\uFED2", -1, 42),
  new Among("\uFED3", -1, 42),
  new Among("\uFED4", -1, 42),
  new Among("\uFED5", -1, 43),
  new Among("\uFED6", -1, 43),
  new Among("\uFED7", -1, 43),
  new Among("\uFED8", -1, 43),
  new Among("\uFED9", -1, 44),
  new Among("\uFEDA", -1, 44),
  new Among("\uFEDB", -1, 44),
  new Among("\uFEDC", -1, 44),
  new Among("\uFEDD", -1, 45),
  new Among("\uFEDE", -1, 45),
  new Among("\uFEDF", -1, 45),
  new Among("\uFEE0", -1, 45),
  new Among("\uFEE1", -1, 46),
  new Among("\uFEE2", -1, 46),
  new Among("\uFEE3", -1, 46),
  new Among("\uFEE4", -1, 46),
  new Among("\uFEE5", -1, 47),
  new Among("\uFEE6", -1, 47),
  new Among("\uFEE7", -1, 47),
  new Among("\uFEE8", -1, 47),
  new Among("\uFEE9", -1, 48),
  new Among("\uFEEA", -1, 48),
  new Among("\uFEEB", -1, 48),
  new Among("\uFEEC", -1, 48),
  new Among("\uFEED", -1, 49),
  new Among("\uFEEE", -1, 49),
  new Among("\uFEEF", -1, 50),
  new Among("\uFEF0", -1, 50),
  new Among("\uFEF1", -1, 51),
  new Among("\uFEF2", -1, 51),
  new Among("\uFEF3", -1, 51),
  new Among("\uFEF4", -1, 51),
  new Among("\uFEF5", -1, 55),
  new Among("\uFEF6", -1, 55),
  new Among("\uFEF7", -1, 53),
  new Among("\uFEF8", -1, 53),
  new Among("\uFEF9", -1, 54),
  new Among("\uFEFA", -1, 54),
  new Among("\uFEFB", -1, 52),
  new Among("\uFEFC", -1, 52)
];

ArabicStemmer.a_1 = [
  new Among("\u0622", -1, 1),
  new Among("\u0623", -1, 1),
  new Among("\u0624", -1, 2),
  new Among("\u0625", -1, 1),
  new Among("\u0626", -1, 3)
];

ArabicStemmer.a_2 = [
  new Among("\u0622", -1, 1),
  new Among("\u0623", -1, 1),
  new Among("\u0624", -1, 2),
  new Among("\u0625", -1, 1),
  new Among("\u0626", -1, 3)
];

ArabicStemmer.a_3 = [
  new Among("\u0627\u0644", -1, 2),
  new Among("\u0628\u0627\u0644", -1, 1),
  new Among("\u0643\u0627\u0644", -1, 1),
  new Among("\u0644\u0644", -1, 2)
];

ArabicStemmer.a_4 = [
  new Among("\u0623\u0622", -1, 2),
  new Among("\u0623\u0623", -1, 1),
  new Among("\u0623\u0624", -1, 3),
  new Among("\u0623\u0625", -1, 5),
  new Among("\u0623\u0627", -1, 4)
];

ArabicStemmer.a_5 = [new Among("\u0641", -1, 1), new Among("\u0648", -1, 2)];

ArabicStemmer.a_6 = [
  new Among("\u0627\u0644", -1, 2),
  new Among("\u0628\u0627\u0644", -1, 1),
  new Among("\u0643\u0627\u0644", -1, 1),
  new Among("\u0644\u0644", -1, 2)
];

ArabicStemmer.a_7 = [
  new Among("\u0628", -1, 1),
  new Among("\u0628\u0628", 0, 2),
  new Among("\u0643\u0643", -1, 3)
];

ArabicStemmer.a_8 = [
  new Among("\u0633\u0623", -1, 4),
  new Among("\u0633\u062A", -1, 2),
  new Among("\u0633\u0646", -1, 3),
  new Among("\u0633\u064A", -1, 1)
];

ArabicStemmer.a_9 = [
  new Among("\u062A\u0633\u062A", -1, 1),
  new Among("\u0646\u0633\u062A", -1, 1),
  new Among("\u064A\u0633\u062A", -1, 1)
];

ArabicStemmer.a_10 = [
  new Among("\u0643\u0645\u0627", -1, 3),
  new Among("\u0647\u0645\u0627", -1, 3),
  new Among("\u0646\u0627", -1, 2),
  new Among("\u0647\u0627", -1, 2),
  new Among("\u0643", -1, 1),
  new Among("\u0643\u0645", -1, 2),
  new Among("\u0647\u0645", -1, 2),
  new Among("\u0647\u0646", -1, 2),
  new Among("\u0647", -1, 1),
  new Among("\u064A", -1, 1)
];

ArabicStemmer.a_11 = [new Among("\u0646", -1, 1)];

ArabicStemmer.a_12 = [
  new Among("\u0627", -1, 1),
  new Among("\u0648", -1, 1),
  new Among("\u064A", -1, 1)
];

ArabicStemmer.a_13 = [new Among("\u0627\u062A", -1, 1)];
ArabicStemmer.a_14 = [new Among("\u062A", -1, 1)];
ArabicStemmer.a_15 = [new Among("\u0629", -1, 1)];
ArabicStemmer.a_16 = [new Among("\u064A", -1, 1)];
ArabicStemmer.a_17 = [
  new Among("\u0643\u0645\u0627", -1, 3),
  new Among("\u0647\u0645\u0627", -1, 3),
  new Among("\u0646\u0627", -1, 2),
  new Among("\u0647\u0627", -1, 2),
  new Among("\u0643", -1, 1),
  new Among("\u0643\u0645", -1, 2),
  new Among("\u0647\u0645", -1, 2),
  new Among("\u0643\u0646", -1, 2),
  new Among("\u0647\u0646", -1, 2),
  new Among("\u0647", -1, 1),
  new Among("\u0643\u0645\u0648", -1, 3),
  new Among("\u0646\u064A", -1, 2)
];

ArabicStemmer.a_18 = [
  new Among("\u0627", -1, 2),
  new Among("\u062A\u0627", 0, 3),
  new Among("\u062A\u0645\u0627", 0, 5),
  new Among("\u0646\u0627", 0, 3),
  new Among("\u062A", -1, 1),
  new Among("\u0646", -1, 2),
  new Among("\u0627\u0646", 5, 4),
  new Among("\u062A\u0646", 5, 3),
  new Among("\u0648\u0646", 5, 4),
  new Among("\u064A\u0646", 5, 4),
  new Among("\u064A", -1, 2)
];

ArabicStemmer.a_19 = [
  new Among("\u0648\u0627", -1, 1),
  new Among("\u062A\u0645", -1, 1)
];

ArabicStemmer.a_20 = [
  new Among("\u0648", -1, 1),
  new Among("\u062A\u0645\u0648", 0, 2)
];
ArabicStemmer.a_21 = [new Among("\u0649", -1, 1)];

module.exports = ArabicStemmer;
