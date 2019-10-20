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
const stopwords = require('../stopwords/stopwords_sv.json');

class SloveneStemmer extends BaseStemmer {
  constructor(tokenizer) {
    super(tokenizer, stopwords.words);
    this.I_p1 = 0;
  }

  stem() {
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
    this.I_p1 = this.current.length;
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    v_1 = this.limit - this.cursor;
    lab0: do {
      for (v_2 = 4; v_2 > 0; v_2--) {
        v_3 = this.limit - this.cursor;
        lab1: do {
          if (!(this.I_p1 > 8)) {
            this.cursor = this.limit - v_3;
            break lab1;
          }
          this.ket = this.cursor;
          among_var = this.find_among_b(SloveneStemmer.a_0);
          if (among_var === 0) {
            this.cursor = this.limit - v_3;
            break lab1;
          }
          this.bra = this.cursor;
          switch (among_var) {
            case 0:
              this.cursor = this.limit - v_3;
              break lab1;
            case 1:
              this.slice_del();
              break;
          }
        } while (false);
        v_4 = this.limit - this.cursor;
        lab2: do {
          if (!(this.I_p1 > 7)) {
            this.cursor = this.limit - v_4;
            break lab2;
          }
          this.ket = this.cursor;
          among_var = this.find_among_b(SloveneStemmer.a_1);
          if (among_var === 0) {
            this.cursor = this.limit - v_4;
            break lab2;
          }
          this.bra = this.cursor;
          switch (among_var) {
            case 0:
              this.cursor = this.limit - v_4;
              break lab2;
            case 1:
              this.slice_del();
              break;
          }
        } while (false);
        this.I_p1 = this.current.length;
        v_5 = this.limit - this.cursor;
        lab3: do {
          if (!(this.I_p1 > 6)) {
            this.cursor = this.limit - v_5;
            break lab3;
          }
          this.ket = this.cursor;
          among_var = this.find_among_b(SloveneStemmer.a_2);
          if (among_var === 0) {
            this.cursor = this.limit - v_5;
            break lab3;
          }
          this.bra = this.cursor;
          switch (among_var) {
            case 0:
              this.cursor = this.limit - v_5;
              break lab3;
            case 1:
              this.slice_del();
              break;
          }
        } while (false);
        this.I_p1 = this.current.length;
        v_6 = this.limit - this.cursor;
        lab4: do {
          if (!(this.I_p1 > 6)) {
            this.cursor = this.limit - v_6;
            break lab4;
          }
          this.ket = this.cursor;
          among_var = this.find_among_b(SloveneStemmer.a_3);
          if (among_var === 0) {
            this.cursor = this.limit - v_6;
            break lab4;
          }
          this.bra = this.cursor;
          switch (among_var) {
            case 0:
              this.cursor = this.limit - v_6;
              break lab4;
            case 1:
              this.slice_del();
              break;
          }
        } while (false);
        this.I_p1 = this.current.length;
        v_7 = this.limit - this.cursor;
        lab5: do {
          if (!(this.I_p1 > 5)) {
            this.cursor = this.limit - v_7;
            break lab5;
          }
          this.ket = this.cursor;
          among_var = this.find_among_b(SloveneStemmer.a_4);
          if (among_var === 0) {
            this.cursor = this.limit - v_7;
            break lab5;
          }
          this.bra = this.cursor;
          switch (among_var) {
            case 0:
              this.cursor = this.limit - v_7;
              break lab5;
            case 1:
              this.slice_del();
              break;
          }
        } while (false);
        this.I_p1 = this.current.length;
        v_8 = this.limit - this.cursor;
        lab6: do {
          if (!(this.I_p1 > 6)) {
            this.cursor = this.limit - v_8;
            break lab6;
          }
          this.ket = this.cursor;
          if (!this.in_grouping_b(SloveneStemmer.g_soglasniki, 98, 382)) {
            this.cursor = this.limit - v_8;
            break lab6;
          }
          this.bra = this.cursor;
          v_9 = this.limit - this.cursor;
          if (!this.in_grouping_b(SloveneStemmer.g_soglasniki, 98, 382)) {
            this.cursor = this.limit - v_8;
            break lab6;
          }
          this.cursor = this.limit - v_9;
          this.slice_del();
        } while (false);
        this.I_p1 = this.current.length;
        v_10 = this.limit - this.cursor;
        lab7: do {
          if (!(this.I_p1 > 5)) {
            this.cursor = this.limit - v_10;
            break lab7;
          }
          this.ket = this.cursor;
          among_var = this.find_among_b(SloveneStemmer.a_5);
          if (among_var === 0) {
            this.cursor = this.limit - v_10;
            break lab7;
          }
          this.bra = this.cursor;
          switch (among_var) {
            case 0:
              this.cursor = this.limit - v_10;
              break lab7;
            case 1:
              this.slice_del();
              break;
          }
        } while (false);
      }
    } while (false);
    this.cursor = this.limit - v_1;
    this.cursor = this.limit_backward;
    return true;
  }
}

SloveneStemmer.a_0 = [
  new Among("anski", -1, 1),
  new Among("evski", -1, 1),
  new Among("ovski", -1, 1)
];

SloveneStemmer.a_1 = [new Among("stvo", -1, 1), new Among("\u0161tvo", -1, 1)];

SloveneStemmer.a_2 = [
  new Among("ega", -1, 1),
  new Among("ija", -1, 1),
  new Among("ila", -1, 1),
  new Among("ema", -1, 1),
  new Among("vna", -1, 1),
  new Among("ite", -1, 1),
  new Among("ste", -1, 1),
  new Among("\u0161\u010De", -1, 1),
  new Among("ski", -1, 1),
  new Among("\u0161ki", -1, 1),
  new Among("iti", -1, 1),
  new Among("ovi", -1, 1),
  new Among("\u010Dek", -1, 1),
  new Among("ovm", -1, 1),
  new Among("\u010Dan", -1, 1),
  new Among("len", -1, 1),
  new Among("ven", -1, 1),
  new Among("\u0161en", -1, 1),
  new Among("ejo", -1, 1),
  new Among("ijo", -1, 1),
  new Among("ast", -1, 1),
  new Among("ost", -1, 1)
];

SloveneStemmer.a_3 = [
  new Among("ja", -1, 1),
  new Among("ka", -1, 1),
  new Among("ma", -1, 1),
  new Among("ec", -1, 1),
  new Among("je", -1, 1),
  new Among("eg", -1, 1),
  new Among("eh", -1, 1),
  new Among("ih", -1, 1),
  new Among("mi", -1, 1),
  new Among("ti", -1, 1),
  new Among("ij", -1, 1),
  new Among("al", -1, 1),
  new Among("il", -1, 1),
  new Among("em", -1, 1),
  new Among("om", -1, 1),
  new Among("an", -1, 1),
  new Among("en", -1, 1),
  new Among("in", -1, 1),
  new Among("do", -1, 1),
  new Among("jo", -1, 1),
  new Among("ir", -1, 1),
  new Among("at", -1, 1),
  new Among("ev", -1, 1),
  new Among("iv", -1, 1),
  new Among("ov", -1, 1),
  new Among("o\u010D", -1, 1)
];

SloveneStemmer.a_4 = [
  new Among("a", -1, 1),
  new Among("c", -1, 1),
  new Among("e", -1, 1),
  new Among("i", -1, 1),
  new Among("m", -1, 1),
  new Among("o", -1, 1),
  new Among("u", -1, 1),
  new Among("\u0161", -1, 1)
];

SloveneStemmer.a_5 = [
  new Among("a", -1, 1),
  new Among("e", -1, 1),
  new Among("i", -1, 1),
  new Among("o", -1, 1),
  new Among("u", -1, 1)
];

SloveneStemmer.g_soglasniki = [
  119,
  95,
  23,
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
  0,
  0,
  0,
  0,
  0,
  8,
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
  0,
  0,
  0,
  16
];

module.exports = SloveneStemmer;
