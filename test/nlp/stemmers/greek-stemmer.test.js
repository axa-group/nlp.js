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

const { NlpUtil } = require('../../../lib');

const feats = {
  ΚΡΕΑΣ: 'ΚΡΕ',
  ΠΑΝΓΚΡΕΑΣ: 'ΠΑΝΓΚΡΕ',
  ΗΜΙΦΩΣ: 'ΗΜΙΦΩ',
  ΚΟΜΠΟΛΟΓΙΑ: 'ΚΟΜΠΟΛΟΓ',
  ΠΑΤΕΡΑΣ: 'ΠΑΤΕΡ',
  ΓΙΑΓΙΑΔΩΝ: 'ΓΙΑΓΙ',
  ΟΜΑΔΕΣ: 'ΟΜΑΔ',
  ΚΑΦΕΔΩΝ: 'ΚΑΦ',
  ΓΗΠΕΔΩΝ: 'ΓΗΠΕΔ',
  ΠΑΠΠΟΥΔΩΝ: 'παππουδ', // ΠΑΠΠΟΥΔΩΝ: 'ΠΑΠΠ'
  ΑΡΚΟΥΔΕΣ: 'ΑΡΚΟΥΔ',
  ΥΠΟΘΕΣΕΩΣ: 'ΥΠΟΘΕΣ',
  ΥΠΟΘΕΣΕΩΝ: 'ΥΠΟΘΕΣ',
  ΘΕΩΝ: 'ΘΕ',
  ΓΥΝΑΙΚΕΙΟ: 'ΓΥΝΑΙΚ',
  ΤΕΛΕΙΟΥ: 'ΤΕΛΕΙ',
  ΤΕΛΕΙΩΝ: 'ΤΕΛΕΙ',
  ΘΕΙΑ: 'ΘΕΙ',
  ΠΑΙΔΙΑ: 'ΠΑΙΔ',
  ΖΗΛΙΑΡΙΚΟ: 'ζηλιαρικ', // ΖΗΛΙΑΡΙΚΟ: 'ΖΗΛΙΑΡ',
  ΑΓΡΟΙΚΟΥ: 'ΑΓΡΟΙΚ',
  ΑΓΑΠΑΜΕ: 'ΑΓΑΠ', //
  ΑΓΑΠΗΣΑΜΕ: 'ΑΓΑΠ',
  ΑΝΑΠΑΜΕ: 'ΑΝΑΠΑΜ',
  ΑΓΑΠΗΣΑΝΕ: 'ΑΓΑΠ',
  ΤΡΑΓΑΝΕ: 'ΤΡΑΓΑΝ',
  ΒΡΑΧΜΑΝΕ: 'ΒΡΑΧΜΑΝ',
  ΣΑΡΑΚΑΤΣΑΝΕ: 'ΣΑΡΑΚΑΤΣΑΝ',
  ΑΓΑΠΗΣΕΤΕ: 'αγαπησ', // ΑΓΑΠΗΣΕΤΕ: 'ΑΓΑΠ'
  ΒΕΝΕΤΕ: 'ΒΕΝΕΤ',
  ΑΓΑΠΩΝΤΑΣ: 'ΑΓΑΠ',
  ΑΡΧΟΝΤΑΣ: 'ΑΡΧΟΝΤ',
  ΚΡΕΩΝΤΑΣ: 'ΚΡΕΩΝΤ',
  ΑΓΑΠΙΟΜΑΣΤΕ: 'ΑΓΑΠ',
  ΟΝΟΜΑΣΤΕ: 'ΟΝΟΜΑΣΤ',
  ΑΓΑΠΙΕΣΤΕ: 'ΑΓΑΠ',
  ΠΙΕΣΤΕ: 'ΠΙΕΣΤ',
  ΕΚΤΕΛΕΣΤΕ: 'ΕΚΤΕΛΕΣΤ',
  ΧΤΙΣΤΗΚΕ: 'ΧΤΙΣΤ',
  ΔΙΑΘΗΚΗ: 'ΔΙΑΘΗΚ',
  ΔΙΑΘΗΚΕΣ: 'ΔΙΑΘΗΚ',
  ΚΑΤΑΚΤΗΘΗΚΕ: 'ΚΑΤΑΚΤ',
  ΠΟΛΕΜΗΘΗΚΕ: 'ΠΟΛΕΜ',
  ΧΤΥΠΩ: 'ΧΤΥΠ',
  ΧΤΥΠΟΥΣΕΣ: 'ΧΤΥΠ',
  ΜΕΔΟΥΣΑ: 'ΜΕΔΟΥΣ',
  ΜΕΔΟΥΣΕΣ: 'ΜΕΔΟΥΣ',
  ΚΟΛΛΑΩ: 'ΚΟΛΛ',
  ΚΟΛΛΑΓΕΣ: 'κολλαγ', // ΚΟΛΛΑΓΕΣ: 'ΚΟΛΛ',
  ΑΒΑΣΤΑΓΟ: 'ΑΒΑΣΤΑΓ',
  ΑΒΑΣΤΑΓΑ: 'ΑΒΑΣΤΑΓ',
  ΑΓΑΠΩ: 'ΑΓΑΠ',
  ΑΓΑΠΗΣΕ: 'ΑΓΑΠ',
  ΝΗΣΟΣ: 'ΝΗΣ',
  ΝΗΣΟΥ: 'ΝΗΣ',
  ΑΓΑΠΗΣΤΕ: 'ΑΓΑΠ',
  ΣΒΗΣΤΟΣ: 'ΣΒΗΣΤ',
  ΣΒΗΣΤΕ: 'ΣΒΗΣΤ',
  ΑΓΑΠΟΥΝΕ: 'ΑΓΑΠ',
  ΝΟΥΝΟΣ: 'ΝΟΥΝ',
  ΝΟΥΝΕ: 'ΝΟΥΝ',
  ΑΓΑΠΟΥΜΕ: 'ΑΓΑΠ',
  ΦΟΥΜΟΣ: 'ΦΟΥΜ',
  ΦΟΥΜΕ: 'ΦΟΥΜ',
  ΚΥΜΑ: 'ΚΥΜ',
  ΚΥΜΑΤΑ: 'ΚΥΜ',
  ΧΩΡΑΤΟ: 'ΧΩΡΑΤ',
  ΧΩΡΑΤΑ: 'ΧΩΡΑΤ',
  ΓΕΝΟΥΑ: 'ΓΕΝΟΥ',
  ΓΟΥΑ: 'ΓΟΥ',
  ΤΟΥΡΝΟΥΑ: 'ΤΟΥΡΝΟΥ',
  ΝΙΚΑΡΑΓΟΥΑ: 'ΝΙΚΑΡΑΓΟΥ',
  ΔΙΧΤΥ: 'ΔΙΧΤ',
  ΔΙΧΤΥΑ: 'ΔΙΧΤ',
  ΜΑΚΡΥ: 'ΜΑΚΡ',
  ΜΑΚΡΥΑ: 'ΜΑΚΡ',
  ΔΑΚΡΥ: 'ΔΑΚΡ',
  ΔΑΚΡΥΑ: 'ΔΑΚΡ',
  ΠΛΗΣΙΕΣΤΑΤΟΣ: 'ΠΛΗΣΙ',
  ΜΕΓΑΛΥΤΕΡΗ: 'ΜΕΓΑΛ',
  ΚΟΝΤΟΤΕΡΟ: 'ΚΟΝΤ',
};

describe('Greek Stemmer', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const stemmer = NlpUtil.getStemmer('el');
      expect(stemmer).toBeDefined();
    });
  });
  describe('Stem', () => {
    test('Should execute step1', () => {
      const stemmer = NlpUtil.getStemmer('el');
      const keys = Object.keys(feats);
      for (let i = 0; i < keys.length; i += 1) {
        const expected = [feats[keys[i]].toLowerCase().replace('ς', 'σ')];
        const actual = stemmer.tokenizeAndStem(keys[i]);
        expect(actual).toEqual(expected);
      }
    });
  });
});
