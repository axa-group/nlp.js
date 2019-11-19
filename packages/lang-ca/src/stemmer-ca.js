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
class StemmerCa extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-ca';
    this.I_p1 = 0;
    this.I_p2 = 0;
  }

  r_mark_regions() {
    let v_1;
    this.I_p1 = this.limit;
    this.I_p2 = this.limit;
    v_1 = this.cursor;
    lab0: do {
      golab1: while (true) {
        do {
          if (!this.in_grouping(StemmerCa.g_v, 97, 252)) {
            break;
          }
          break golab1;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      golab3: while (true) {
        do {
          if (!this.out_grouping(StemmerCa.g_v, 97, 252)) {
            break;
          }
          break golab3;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      this.I_p1 = this.cursor;
      golab5: while (true) {
        do {
          if (!this.in_grouping(StemmerCa.g_v, 97, 252)) {
            break;
          }
          break golab5;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      golab7: while (true) {
        do {
          if (!this.out_grouping(StemmerCa.g_v, 97, 252)) {
            break;
          }
          break golab7;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      this.I_p2 = this.cursor;
    } while (false);
    this.cursor = v_1;
    return true;
  }

  r_cleaning() {
    let among_var;
    let v_1;
    replab0: while (true) {
      v_1 = this.cursor;
      lab1: do {
        this.bra = this.cursor;
        among_var = this.find_among(StemmerCa.a_0);
        if (among_var === 0) {
          break;
        }
        this.ket = this.cursor;
        switch (among_var) {
          case 0:
            break lab1;
          case 1:
            this.slice_from('a');
            break;
          case 2:
            this.slice_from('a');
            break;
          case 3:
            this.slice_from('e');
            break;
          case 4:
            this.slice_from('e');
            break;
          case 5:
            this.slice_from('i');
            break;
          case 6:
            this.slice_from('i');
            break;
          case 7:
            this.slice_from('o');
            break;
          case 8:
            this.slice_from('o');
            break;
          case 9:
            this.slice_from('u');
            break;
          case 10:
            this.slice_from('u');
            break;
          case 11:
            this.slice_from('i');
            break;
          case 12:
            this.slice_from('.');
            break;
          case 13:
            if (this.cursor >= this.limit) {
              break lab1;
            }
            this.cursor++;
            break;
        }
        continue replab0;
      } while (false);
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

  r_attached_pronoun() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerCa.a_1);
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
    }
    return true;
  }

  r_standard_suffix() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerCa.a_2);
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
      case 3:
        if (!this.r_R2()) {
          return false;
        }
        this.slice_from('log');
        break;
      case 4:
        if (!this.r_R2()) {
          return false;
        }
        this.slice_from('ic');
        break;
      case 5:
        if (!this.r_R1()) {
          return false;
        }
        this.slice_from('c');
        break;
    }
    return true;
  }

  r_verb_suffix() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerCa.a_3);
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

  r_residual_suffix() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerCa.a_4);
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
        if (!this.r_R1()) {
          return false;
        }
        this.slice_from('ic');
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
    v_1 = this.cursor;
    do {
      if (!this.r_mark_regions()) {
        break;
      }
    } while (false);
    this.cursor = v_1;
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    v_2 = this.limit - this.cursor;
    do {
      if (!this.r_attached_pronoun()) {
        break;
      }
    } while (false);
    this.cursor = this.limit - v_2;
    v_3 = this.limit - this.cursor;
    lab2: do {
      lab3: do {
        v_4 = this.limit - this.cursor;
        do {
          if (!this.r_standard_suffix()) {
            break;
          }
          break lab3;
        } while (false);
        this.cursor = this.limit - v_4;
        if (!this.r_verb_suffix()) {
          break lab2;
        }
      } while (false);
    } while (false);
    this.cursor = this.limit - v_3;
    v_5 = this.limit - this.cursor;
    do {
      if (!this.r_residual_suffix()) {
        break;
      }
    } while (false);
    this.cursor = this.limit - v_5;
    this.cursor = this.limit_backward;
    v_6 = this.cursor;
    do {
      if (!this.r_cleaning()) {
        break;
      }
    } while (false);
    this.cursor = v_6;
    return true;
  }
}

StemmerCa.a_0 = [
  new Among('', -1, 13),
  new Among('\u00B7', 0, 12),
  new Among('\u00E0', 0, 2),
  new Among('\u00E1', 0, 1),
  new Among('\u00E8', 0, 4),
  new Among('\u00E9', 0, 3),
  new Among('\u00EC', 0, 6),
  new Among('\u00ED', 0, 5),
  new Among('\u00EF', 0, 11),
  new Among('\u00F2', 0, 8),
  new Among('\u00F3', 0, 7),
  new Among('\u00FA', 0, 9),
  new Among('\u00FC', 0, 10),
];

StemmerCa.a_1 = [
  new Among('la', -1, 1),
  new Among('-la', 0, 1),
  new Among('sela', 0, 1),
  new Among('le', -1, 1),
  new Among('me', -1, 1),
  new Among('-me', 4, 1),
  new Among('se', -1, 1),
  new Among('-te', -1, 1),
  new Among('hi', -1, 1),
  new Among("'hi", 8, 1),
  new Among('li', -1, 1),
  new Among('-li', 10, 1),
  new Among("'l", -1, 1),
  new Among("'m", -1, 1),
  new Among('-m', -1, 1),
  new Among("'n", -1, 1),
  new Among('-n', -1, 1),
  new Among('ho', -1, 1),
  new Among("'ho", 17, 1),
  new Among('lo', -1, 1),
  new Among('selo', 19, 1),
  new Among("'s", -1, 1),
  new Among('las', -1, 1),
  new Among('selas', 22, 1),
  new Among('les', -1, 1),
  new Among('-les', 24, 1),
  new Among("'ls", -1, 1),
  new Among('-ls', -1, 1),
  new Among("'ns", -1, 1),
  new Among('-ns', -1, 1),
  new Among('ens', -1, 1),
  new Among('los', -1, 1),
  new Among('selos', 31, 1),
  new Among('nos', -1, 1),
  new Among('-nos', 33, 1),
  new Among('vos', -1, 1),
  new Among('us', -1, 1),
  new Among('-us', 36, 1),
  new Among("'t", -1, 1),
];

StemmerCa.a_2 = [
  new Among('ica', -1, 4),
  new Among('l\u00F3gica', 0, 3),
  new Among('enca', -1, 1),
  new Among('ada', -1, 2),
  new Among('ancia', -1, 1),
  new Among('encia', -1, 1),
  new Among('\u00E8ncia', -1, 1),
  new Among('\u00EDcia', -1, 1),
  new Among('logia', -1, 3),
  new Among('inia', -1, 1),
  new Among('\u00EDinia', 9, 1),
  new Among('eria', -1, 1),
  new Among('\u00E0ria', -1, 1),
  new Among('at\u00F2ria', -1, 1),
  new Among('alla', -1, 1),
  new Among('ella', -1, 1),
  new Among('\u00EDvola', -1, 1),
  new Among('ima', -1, 1),
  new Among('\u00EDssima', 17, 1),
  new Among('qu\u00EDssima', 18, 5),
  new Among('ana', -1, 1),
  new Among('ina', -1, 1),
  new Among('era', -1, 1),
  new Among('sfera', 22, 1),
  new Among('ora', -1, 1),
  new Among('dora', 24, 1),
  new Among('adora', 25, 1),
  new Among('adura', -1, 1),
  new Among('esa', -1, 1),
  new Among('osa', -1, 1),
  new Among('assa', -1, 1),
  new Among('essa', -1, 1),
  new Among('issa', -1, 1),
  new Among('eta', -1, 1),
  new Among('ita', -1, 1),
  new Among('ota', -1, 1),
  new Among('ista', -1, 1),
  new Among('ialista', 36, 1),
  new Among('ionista', 36, 1),
  new Among('iva', -1, 1),
  new Among('ativa', 39, 1),
  new Among('n\u00E7a', -1, 1),
  new Among('log\u00EDa', -1, 3),
  new Among('ic', -1, 4),
  new Among('\u00EDstic', 43, 1),
  new Among('enc', -1, 1),
  new Among('esc', -1, 1),
  new Among('ud', -1, 1),
  new Among('atge', -1, 1),
  new Among('ble', -1, 1),
  new Among('able', 49, 1),
  new Among('ible', 49, 1),
  new Among('isme', -1, 1),
  new Among('ialisme', 52, 1),
  new Among('ionisme', 52, 1),
  new Among('ivisme', 52, 1),
  new Among('aire', -1, 1),
  new Among('icte', -1, 1),
  new Among('iste', -1, 1),
  new Among('ici', -1, 1),
  new Among('\u00EDci', -1, 1),
  new Among('logi', -1, 3),
  new Among('ari', -1, 1),
  new Among('tori', -1, 1),
  new Among('al', -1, 1),
  new Among('il', -1, 1),
  new Among('all', -1, 1),
  new Among('ell', -1, 1),
  new Among('\u00EDvol', -1, 1),
  new Among('isam', -1, 1),
  new Among('issem', -1, 1),
  new Among('\u00ECssem', -1, 1),
  new Among('\u00EDssem', -1, 1),
  new Among('\u00EDssim', -1, 1),
  new Among('qu\u00EDssim', 73, 5),
  new Among('amen', -1, 1),
  new Among('\u00ECssin', -1, 1),
  new Among('ar', -1, 1),
  new Among('ificar', 77, 1),
  new Among('egar', 77, 1),
  new Among('ejar', 77, 1),
  new Among('itar', 77, 1),
  new Among('itzar', 77, 1),
  new Among('fer', -1, 1),
  new Among('or', -1, 1),
  new Among('dor', 84, 1),
  new Among('dur', -1, 1),
  new Among('doras', -1, 1),
  new Among('ics', -1, 4),
  new Among('l\u00F3gics', 88, 3),
  new Among('uds', -1, 1),
  new Among('nces', -1, 1),
  new Among('ades', -1, 2),
  new Among('ancies', -1, 1),
  new Among('encies', -1, 1),
  new Among('\u00E8ncies', -1, 1),
  new Among('\u00EDcies', -1, 1),
  new Among('logies', -1, 3),
  new Among('inies', -1, 1),
  new Among('\u00EDnies', -1, 1),
  new Among('eries', -1, 1),
  new Among('\u00E0ries', -1, 1),
  new Among('at\u00F2ries', -1, 1),
  new Among('bles', -1, 1),
  new Among('ables', 103, 1),
  new Among('ibles', 103, 1),
  new Among('imes', -1, 1),
  new Among('\u00EDssimes', 106, 1),
  new Among('qu\u00EDssimes', 107, 5),
  new Among('formes', -1, 1),
  new Among('ismes', -1, 1),
  new Among('ialismes', 110, 1),
  new Among('ines', -1, 1),
  new Among('eres', -1, 1),
  new Among('ores', -1, 1),
  new Among('dores', 114, 1),
  new Among('idores', 115, 1),
  new Among('dures', -1, 1),
  new Among('eses', -1, 1),
  new Among('oses', -1, 1),
  new Among('asses', -1, 1),
  new Among('ictes', -1, 1),
  new Among('ites', -1, 1),
  new Among('otes', -1, 1),
  new Among('istes', -1, 1),
  new Among('ialistes', 124, 1),
  new Among('ionistes', 124, 1),
  new Among('iques', -1, 4),
  new Among('l\u00F3giques', 127, 3),
  new Among('ives', -1, 1),
  new Among('atives', 129, 1),
  new Among('log\u00EDes', -1, 3),
  new Among('alleng\u00FCes', -1, 1),
  new Among('icis', -1, 1),
  new Among('\u00EDcis', -1, 1),
  new Among('logis', -1, 3),
  new Among('aris', -1, 1),
  new Among('toris', -1, 1),
  new Among('ls', -1, 1),
  new Among('als', 138, 1),
  new Among('ells', 138, 1),
  new Among('ims', -1, 1),
  new Among('\u00EDssims', 141, 1),
  new Among('qu\u00EDssims', 142, 5),
  new Among('ions', -1, 1),
  new Among('cions', 144, 1),
  new Among('acions', 145, 2),
  new Among('esos', -1, 1),
  new Among('osos', -1, 1),
  new Among('assos', -1, 1),
  new Among('issos', -1, 1),
  new Among('ers', -1, 1),
  new Among('ors', -1, 1),
  new Among('dors', 152, 1),
  new Among('adors', 153, 1),
  new Among('idors', 153, 1),
  new Among('ats', -1, 1),
  new Among('itats', 156, 1),
  new Among('bilitats', 157, 1),
  new Among('ivitats', 157, 1),
  new Among('ativitats', 159, 1),
  new Among('\u00EFtats', 156, 1),
  new Among('ets', -1, 1),
  new Among('ants', -1, 1),
  new Among('ents', -1, 1),
  new Among('ments', 164, 1),
  new Among('aments', 165, 1),
  new Among('ots', -1, 1),
  new Among('uts', -1, 1),
  new Among('ius', -1, 1),
  new Among('trius', 169, 1),
  new Among('atius', 169, 1),
  new Among('\u00E8s', -1, 1),
  new Among('\u00E9s', -1, 1),
  new Among('\u00EDs', -1, 1),
  new Among('d\u00EDs', 174, 1),
  new Among('\u00F3s', -1, 1),
  new Among('itat', -1, 1),
  new Among('bilitat', 177, 1),
  new Among('ivitat', 177, 1),
  new Among('ativitat', 179, 1),
  new Among('\u00EFtat', -1, 1),
  new Among('et', -1, 1),
  new Among('ant', -1, 1),
  new Among('ent', -1, 1),
  new Among('ient', 184, 1),
  new Among('ment', 184, 1),
  new Among('ament', 186, 1),
  new Among('isament', 187, 1),
  new Among('ot', -1, 1),
  new Among('isseu', -1, 1),
  new Among('\u00ECsseu', -1, 1),
  new Among('\u00EDsseu', -1, 1),
  new Among('triu', -1, 1),
  new Among('\u00EDssiu', -1, 1),
  new Among('atiu', -1, 1),
  new Among('\u00F3', -1, 1),
  new Among('i\u00F3', 196, 1),
  new Among('ci\u00F3', 197, 1),
  new Among('aci\u00F3', 198, 1),
];

StemmerCa.a_3 = [
  new Among('aba', -1, 1),
  new Among('esca', -1, 1),
  new Among('isca', -1, 1),
  new Among('\u00EFsca', -1, 1),
  new Among('ada', -1, 1),
  new Among('ida', -1, 1),
  new Among('uda', -1, 1),
  new Among('\u00EFda', -1, 1),
  new Among('ia', -1, 1),
  new Among('aria', 8, 1),
  new Among('iria', 8, 1),
  new Among('ara', -1, 1),
  new Among('iera', -1, 1),
  new Among('ira', -1, 1),
  new Among('adora', -1, 1),
  new Among('\u00EFra', -1, 1),
  new Among('ava', -1, 1),
  new Among('ixa', -1, 1),
  new Among('itza', -1, 1),
  new Among('\u00EDa', -1, 1),
  new Among('ar\u00EDa', 19, 1),
  new Among('er\u00EDa', 19, 1),
  new Among('ir\u00EDa', 19, 1),
  new Among('\u00EFa', -1, 1),
  new Among('isc', -1, 1),
  new Among('\u00EFsc', -1, 1),
  new Among('ad', -1, 1),
  new Among('ed', -1, 1),
  new Among('id', -1, 1),
  new Among('ie', -1, 1),
  new Among('re', -1, 1),
  new Among('dre', 30, 1),
  new Among('ase', -1, 1),
  new Among('iese', -1, 1),
  new Among('aste', -1, 1),
  new Among('iste', -1, 1),
  new Among('ii', -1, 1),
  new Among('ini', -1, 1),
  new Among('esqui', -1, 1),
  new Among('eixi', -1, 1),
  new Among('itzi', -1, 1),
  new Among('am', -1, 1),
  new Among('em', -1, 1),
  new Among('arem', 42, 1),
  new Among('irem', 42, 1),
  new Among('\u00E0rem', 42, 1),
  new Among('\u00EDrem', 42, 1),
  new Among('\u00E0ssem', 42, 1),
  new Among('\u00E9ssem', 42, 1),
  new Among('iguem', 42, 1),
  new Among('\u00EFguem', 42, 1),
  new Among('avem', 42, 1),
  new Among('\u00E0vem', 42, 1),
  new Among('\u00E1vem', 42, 1),
  new Among('ir\u00ECem', 42, 1),
  new Among('\u00EDem', 42, 1),
  new Among('ar\u00EDem', 55, 1),
  new Among('ir\u00EDem', 55, 1),
  new Among('assim', -1, 1),
  new Among('essim', -1, 1),
  new Among('issim', -1, 1),
  new Among('\u00E0ssim', -1, 1),
  new Among('\u00E8ssim', -1, 1),
  new Among('\u00E9ssim', -1, 1),
  new Among('\u00EDssim', -1, 1),
  new Among('\u00EFm', -1, 1),
  new Among('an', -1, 1),
  new Among('aban', 66, 1),
  new Among('arian', 66, 1),
  new Among('aran', 66, 1),
  new Among('ieran', 66, 1),
  new Among('iran', 66, 1),
  new Among('\u00EDan', 66, 1),
  new Among('ar\u00EDan', 72, 1),
  new Among('er\u00EDan', 72, 1),
  new Among('ir\u00EDan', 72, 1),
  new Among('en', -1, 1),
  new Among('ien', 76, 1),
  new Among('arien', 77, 1),
  new Among('irien', 77, 1),
  new Among('aren', 76, 1),
  new Among('eren', 76, 1),
  new Among('iren', 76, 1),
  new Among('\u00E0ren', 76, 1),
  new Among('\u00EFren', 76, 1),
  new Among('asen', 76, 1),
  new Among('iesen', 76, 1),
  new Among('assen', 76, 1),
  new Among('essen', 76, 1),
  new Among('issen', 76, 1),
  new Among('\u00E9ssen', 76, 1),
  new Among('\u00EFssen', 76, 1),
  new Among('esquen', 76, 1),
  new Among('isquen', 76, 1),
  new Among('\u00EFsquen', 76, 1),
  new Among('aven', 76, 1),
  new Among('ixen', 76, 1),
  new Among('eixen', 96, 1),
  new Among('\u00EFxen', 76, 1),
  new Among('\u00EFen', 76, 1),
  new Among('in', -1, 1),
  new Among('inin', 100, 1),
  new Among('sin', 100, 1),
  new Among('isin', 102, 1),
  new Among('assin', 102, 1),
  new Among('essin', 102, 1),
  new Among('issin', 102, 1),
  new Among('\u00EFssin', 102, 1),
  new Among('esquin', 100, 1),
  new Among('eixin', 100, 1),
  new Among('aron', -1, 1),
  new Among('ieron', -1, 1),
  new Among('ar\u00E1n', -1, 1),
  new Among('er\u00E1n', -1, 1),
  new Among('ir\u00E1n', -1, 1),
  new Among('i\u00EFn', -1, 1),
  new Among('ado', -1, 1),
  new Among('ido', -1, 1),
  new Among('ando', -1, 2),
  new Among('iendo', -1, 1),
  new Among('io', -1, 1),
  new Among('ixo', -1, 1),
  new Among('eixo', 121, 1),
  new Among('\u00EFxo', -1, 1),
  new Among('itzo', -1, 1),
  new Among('ar', -1, 1),
  new Among('tzar', 125, 1),
  new Among('er', -1, 1),
  new Among('eixer', 127, 1),
  new Among('ir', -1, 1),
  new Among('ador', -1, 1),
  new Among('as', -1, 1),
  new Among('abas', 131, 1),
  new Among('adas', 131, 1),
  new Among('idas', 131, 1),
  new Among('aras', 131, 1),
  new Among('ieras', 131, 1),
  new Among('\u00EDas', 131, 1),
  new Among('ar\u00EDas', 137, 1),
  new Among('er\u00EDas', 137, 1),
  new Among('ir\u00EDas', 137, 1),
  new Among('ids', -1, 1),
  new Among('es', -1, 1),
  new Among('ades', 142, 1),
  new Among('ides', 142, 1),
  new Among('udes', 142, 1),
  new Among('\u00EFdes', 142, 1),
  new Among('atges', 142, 1),
  new Among('ies', 142, 1),
  new Among('aries', 148, 1),
  new Among('iries', 148, 1),
  new Among('ares', 142, 1),
  new Among('ires', 142, 1),
  new Among('adores', 142, 1),
  new Among('\u00EFres', 142, 1),
  new Among('ases', 142, 1),
  new Among('ieses', 142, 1),
  new Among('asses', 142, 1),
  new Among('esses', 142, 1),
  new Among('isses', 142, 1),
  new Among('\u00EFsses', 142, 1),
  new Among('ques', 142, 1),
  new Among('esques', 161, 1),
  new Among('\u00EFsques', 161, 1),
  new Among('aves', 142, 1),
  new Among('ixes', 142, 1),
  new Among('eixes', 165, 1),
  new Among('\u00EFxes', 142, 1),
  new Among('\u00EFes', 142, 1),
  new Among('abais', -1, 1),
  new Among('arais', -1, 1),
  new Among('ierais', -1, 1),
  new Among('\u00EDais', -1, 1),
  new Among('ar\u00EDais', 172, 1),
  new Among('er\u00EDais', 172, 1),
  new Among('ir\u00EDais', 172, 1),
  new Among('aseis', -1, 1),
  new Among('ieseis', -1, 1),
  new Among('asteis', -1, 1),
  new Among('isteis', -1, 1),
  new Among('inis', -1, 1),
  new Among('sis', -1, 1),
  new Among('isis', 181, 1),
  new Among('assis', 181, 1),
  new Among('essis', 181, 1),
  new Among('issis', 181, 1),
  new Among('\u00EFssis', 181, 1),
  new Among('esquis', -1, 1),
  new Among('eixis', -1, 1),
  new Among('itzis', -1, 1),
  new Among('\u00E1is', -1, 1),
  new Among('ar\u00E9is', -1, 1),
  new Among('er\u00E9is', -1, 1),
  new Among('ir\u00E9is', -1, 1),
  new Among('ams', -1, 1),
  new Among('ados', -1, 1),
  new Among('idos', -1, 1),
  new Among('amos', -1, 1),
  new Among('\u00E1bamos', 197, 1),
  new Among('\u00E1ramos', 197, 1),
  new Among('i\u00E9ramos', 197, 1),
  new Among('\u00EDamos', 197, 1),
  new Among('ar\u00EDamos', 201, 1),
  new Among('er\u00EDamos', 201, 1),
  new Among('ir\u00EDamos', 201, 1),
  new Among('aremos', -1, 1),
  new Among('eremos', -1, 1),
  new Among('iremos', -1, 1),
  new Among('\u00E1semos', -1, 1),
  new Among('i\u00E9semos', -1, 1),
  new Among('imos', -1, 1),
  new Among('adors', -1, 1),
  new Among('ass', -1, 1),
  new Among('erass', 212, 1),
  new Among('ess', -1, 1),
  new Among('ats', -1, 1),
  new Among('its', -1, 1),
  new Among('ents', -1, 1),
  new Among('\u00E0s', -1, 1),
  new Among('ar\u00E0s', 218, 1),
  new Among('ir\u00E0s', 218, 1),
  new Among('ar\u00E1s', -1, 1),
  new Among('er\u00E1s', -1, 1),
  new Among('ir\u00E1s', -1, 1),
  new Among('\u00E9s', -1, 1),
  new Among('ar\u00E9s', 224, 1),
  new Among('\u00EDs', -1, 1),
  new Among('i\u00EFs', -1, 1),
  new Among('at', -1, 1),
  new Among('it', -1, 1),
  new Among('ant', -1, 1),
  new Among('ent', -1, 1),
  new Among('int', -1, 1),
  new Among('ut', -1, 1),
  new Among('\u00EFt', -1, 1),
  new Among('au', -1, 1),
  new Among('erau', 235, 1),
  new Among('ieu', -1, 1),
  new Among('ineu', -1, 1),
  new Among('areu', -1, 1),
  new Among('ireu', -1, 1),
  new Among('\u00E0reu', -1, 1),
  new Among('\u00EDreu', -1, 1),
  new Among('asseu', -1, 1),
  new Among('esseu', -1, 1),
  new Among('eresseu', 244, 1),
  new Among('\u00E0sseu', -1, 1),
  new Among('\u00E9sseu', -1, 1),
  new Among('igueu', -1, 1),
  new Among('\u00EFgueu', -1, 1),
  new Among('\u00E0veu', -1, 1),
  new Among('\u00E1veu', -1, 1),
  new Among('itzeu', -1, 1),
  new Among('\u00ECeu', -1, 1),
  new Among('ir\u00ECeu', 253, 1),
  new Among('\u00EDeu', -1, 1),
  new Among('ar\u00EDeu', 255, 1),
  new Among('ir\u00EDeu', 255, 1),
  new Among('assiu', -1, 1),
  new Among('issiu', -1, 1),
  new Among('\u00E0ssiu', -1, 1),
  new Among('\u00E8ssiu', -1, 1),
  new Among('\u00E9ssiu', -1, 1),
  new Among('\u00EDssiu', -1, 1),
  new Among('\u00EFu', -1, 1),
  new Among('ix', -1, 1),
  new Among('eix', 265, 1),
  new Among('\u00EFx', -1, 1),
  new Among('itz', -1, 1),
  new Among('i\u00E0', -1, 1),
  new Among('ar\u00E0', -1, 1),
  new Among('ir\u00E0', -1, 1),
  new Among('itz\u00E0', -1, 1),
  new Among('ar\u00E1', -1, 1),
  new Among('er\u00E1', -1, 1),
  new Among('ir\u00E1', -1, 1),
  new Among('ir\u00E8', -1, 1),
  new Among('ar\u00E9', -1, 1),
  new Among('er\u00E9', -1, 1),
  new Among('ir\u00E9', -1, 1),
  new Among('\u00ED', -1, 1),
  new Among('i\u00EF', -1, 1),
  new Among('i\u00F3', -1, 1),
];

StemmerCa.a_4 = [
  new Among('a', -1, 1),
  new Among('e', -1, 1),
  new Among('i', -1, 1),
  new Among('\u00EFn', -1, 1),
  new Among('o', -1, 1),
  new Among('ir', -1, 1),
  new Among('s', -1, 1),
  new Among('is', 6, 1),
  new Among('os', 6, 1),
  new Among('\u00EFs', 6, 1),
  new Among('it', -1, 1),
  new Among('eu', -1, 1),
  new Among('iu', -1, 1),
  new Among('iqu', -1, 2),
  new Among('itz', -1, 1),
  new Among('\u00E0', -1, 1),
  new Among('\u00E1', -1, 1),
  new Among('\u00E9', -1, 1),
  new Among('\u00EC', -1, 1),
  new Among('\u00ED', -1, 1),
  new Among('\u00EF', -1, 1),
  new Among('\u00F3', -1, 1),
];

StemmerCa.g_v = [
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
  129,
  81,
  6,
  10,
];

module.exports = StemmerCa;
