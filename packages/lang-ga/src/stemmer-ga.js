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
class StemmerGa extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-ga';
    this.I_p1 = 0;
    this.I_p2 = 0;
    this.I_pV = 0;
  }

  r_mark_regions() {
    let v_1;
    let v_3;
    this.I_pV = this.limit;
    this.I_p1 = this.limit;
    this.I_p2 = this.limit;
    v_1 = this.cursor;
    lab0: do {
      golab1: while (true) {
        lab2: do {
          if (!this.in_grouping(StemmerGa.g_v, 97, 250)) {
            break lab2;
          }
          break golab1;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      this.I_pV = this.cursor;
    } while (false);
    this.cursor = v_1;
    v_3 = this.cursor;
    lab3: do {
      golab4: while (true) {
        lab5: do {
          if (!this.in_grouping(StemmerGa.g_v, 97, 250)) {
            break lab5;
          }
          break golab4;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab3;
        }
        this.cursor++;
      }
      golab6: while (true) {
        lab7: do {
          if (!this.out_grouping(StemmerGa.g_v, 97, 250)) {
            break lab7;
          }
          break golab6;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab3;
        }
        this.cursor++;
      }
      this.I_p1 = this.cursor;
      golab8: while (true) {
        lab9: do {
          if (!this.in_grouping(StemmerGa.g_v, 97, 250)) {
            break lab9;
          }
          break golab8;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab3;
        }
        this.cursor++;
      }
      golab10: while (true) {
        lab11: do {
          if (!this.out_grouping(StemmerGa.g_v, 97, 250)) {
            break lab11;
          }
          break golab10;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab3;
        }
        this.cursor++;
      }
      this.I_p2 = this.cursor;
    } while (false);
    this.cursor = v_3;
    return true;
  }
  r_initial_morph() {
    let among_var;
    this.bra = this.cursor;
    among_var = this.find_among(StemmerGa.a_0);
    if (among_var === 0) {
      return false;
    }
    this.ket = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        this.slice_del();
        break;
      case 2:
        this.slice_del();
        break;
      case 3:
        this.slice_from('f');
        break;
      case 4:
        this.slice_del();
        break;
      case 5:
        this.slice_from('s');
        break;
      case 6:
        this.slice_from('b');
        break;
      case 7:
        this.slice_from('c');
        break;
      case 8:
        this.slice_from('d');
        break;
      case 9:
        this.slice_from('f');
        break;
      case 10:
        this.slice_from('g');
        break;
      case 11:
        this.slice_from('p');
        break;
      case 12:
        this.slice_from('s');
        break;
      case 13:
        this.slice_from('t');
        break;
      case 14:
        this.slice_from('b');
        break;
      case 15:
        this.slice_from('c');
        break;
      case 16:
        this.slice_from('d');
        break;
      case 17:
        this.slice_from('f');
        break;
      case 18:
        this.slice_from('g');
        break;
      case 19:
        this.slice_from('m');
        break;
      case 20:
        this.slice_from('p');
        break;
      case 21:
        this.slice_from('t');
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
  r_noun_sfx() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerGa.a_1);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!this.r_R1()) {
          return false;
        }
        this.slice_del();
        break;
      case 2:
        if (!this.r_R2()) {
          return false;
        }
        this.slice_del();
        break;
    }
    return true;
  }
  r_deriv() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerGa.a_2);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!this.r_R2()) {
          return false;
        }
        this.slice_del();
        break;
      case 2:
        this.slice_from('arc');
        break;
      case 3:
        this.slice_from('gin');
        break;
      case 4:
        this.slice_from('graf');
        break;
      case 5:
        this.slice_from('paite');
        break;
      case 6:
        this.slice_from('\u00F3id');
        break;
    }
    return true;
  }
  r_verb_sfx() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerGa.a_3);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        if (!this.r_RV()) {
          return false;
        }
        this.slice_del();
        break;
      case 2:
        if (!this.r_R1()) {
          return false;
        }
        this.slice_del();
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
    v_1 = this.cursor;
    lab0: do {
      if (!this.r_initial_morph()) {
        break lab0;
      }
    } while (false);
    this.cursor = v_1;
    v_2 = this.cursor;
    lab1: do {
      if (!this.r_mark_regions()) {
        break lab1;
      }
    } while (false);
    this.cursor = v_2;
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    v_3 = this.limit - this.cursor;
    lab2: do {
      if (!this.r_noun_sfx()) {
        break lab2;
      }
    } while (false);
    this.cursor = this.limit - v_3;
    v_4 = this.limit - this.cursor;
    lab3: do {
      if (!this.r_deriv()) {
        break lab3;
      }
    } while (false);
    this.cursor = this.limit - v_4;
    v_5 = this.limit - this.cursor;
    lab4: do {
      if (!this.r_verb_sfx()) {
        break lab4;
      }
    } while (false);
    this.cursor = this.limit - v_5;
    this.cursor = this.limit_backward;
    return true;
  }
}

StemmerGa.a_0 = [
  new Among("b'", -1, 4),
  new Among('bh', -1, 14),
  new Among('bhf', 1, 9),
  new Among('bp', -1, 11),
  new Among('ch', -1, 15),
  new Among("d'", -1, 2),
  new Among("d'fh", 5, 3),
  new Among('dh', -1, 16),
  new Among('dt', -1, 13),
  new Among('fh', -1, 17),
  new Among('gc', -1, 7),
  new Among('gh', -1, 18),
  new Among('h-', -1, 1),
  new Among("m'", -1, 4),
  new Among('mb', -1, 6),
  new Among('mh', -1, 19),
  new Among('n-', -1, 1),
  new Among('nd', -1, 8),
  new Among('ng', -1, 10),
  new Among('ph', -1, 20),
  new Among('sh', -1, 5),
  new Among('t-', -1, 1),
  new Among('th', -1, 21),
  new Among('ts', -1, 12)
];

StemmerGa.a_1 = [
  new Among('\u00EDochta', -1, 1),
  new Among('a\u00EDochta', 0, 1),
  new Among('ire', -1, 2),
  new Among('aire', 2, 2),
  new Among('abh', -1, 1),
  new Among('eabh', 4, 1),
  new Among('ibh', -1, 1),
  new Among('aibh', 6, 1),
  new Among('amh', -1, 1),
  new Among('eamh', 8, 1),
  new Among('imh', -1, 1),
  new Among('aimh', 10, 1),
  new Among('\u00EDocht', -1, 1),
  new Among('a\u00EDocht', 12, 1),
  new Among('ir\u00ED', -1, 2),
  new Among('air\u00ED', 14, 2)
];

StemmerGa.a_2 = [
  new Among('\u00F3ideacha', -1, 6),
  new Among('patacha', -1, 5),
  new Among('achta', -1, 1),
  new Among('arcachta', 2, 2),
  new Among('eachta', 2, 1),
  new Among('grafa\u00EDochta', -1, 4),
  new Among('paite', -1, 5),
  new Among('ach', -1, 1),
  new Among('each', 7, 1),
  new Among('\u00F3ideach', 8, 6),
  new Among('gineach', 8, 3),
  new Among('patach', 7, 5),
  new Among('grafa\u00EDoch', -1, 4),
  new Among('pataigh', -1, 5),
  new Among('\u00F3idigh', -1, 6),
  new Among('acht\u00FAil', -1, 1),
  new Among('eacht\u00FAil', 15, 1),
  new Among('gineas', -1, 3),
  new Among('ginis', -1, 3),
  new Among('acht', -1, 1),
  new Among('arcacht', 19, 2),
  new Among('eacht', 19, 1),
  new Among('grafa\u00EDocht', -1, 4),
  new Among('arcachta\u00ED', -1, 2),
  new Among('grafa\u00EDochta\u00ED', -1, 4)
];

StemmerGa.a_3 = [
  new Among('imid', -1, 1),
  new Among('aimid', 0, 1),
  new Among('\u00EDmid', -1, 1),
  new Among('a\u00EDmid', 2, 1),
  new Among('adh', -1, 2),
  new Among('eadh', 4, 2),
  new Among('faidh', -1, 1),
  new Among('fidh', -1, 1),
  new Among('\u00E1il', -1, 2),
  new Among('ain', -1, 2),
  new Among('tear', -1, 2),
  new Among('tar', -1, 2)
];

StemmerGa.g_v = [
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
  2
];

module.exports = StemmerGa;
