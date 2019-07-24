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

const { BaseNLU, NlpUtil } = require('../../lib');

describe('Base NLU', () => {
  describe('constructor', () => {
    test('Should create a new instance', () => {
      const nlu = new BaseNLU();
      expect(nlu).toBeDefined();
    });
    test('Should initialize the default properties', () => {
      const nlu = new BaseNLU();
      expect(nlu.language).toEqual('en');
      expect(nlu.stemmer).toBeDefined();
      expect(nlu.docs).toEqual([]);
      expect(nlu.features).toEqual({});
    });
    test('I can provide my own stemmer', () => {
      const stemmer = NlpUtil.getStemmer('en');
      const nlu = new BaseNLU({ stemmer });
      expect(nlu.stemmer).toBe(stemmer);
    });
    test('I can decide to not keep the stopwords', () => {
      const nlu = new BaseNLU({ keepStopwords: false });
      expect(nlu.keepStopwords).toBeFalsy();
    });
  });

  describe('add', () => {
    test('Should add an utterance and intent', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      expect(nlu.docs).toHaveLength(1);
      nlu.add('bonne nuit', 'greet');
      expect(nlu.docs).toHaveLength(2);
    });
    test('Should add an utterance and intent even to different intents', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      expect(nlu.docs).toHaveLength(1);
      nlu.add('bonne nuit', 'greet');
      expect(nlu.docs).toHaveLength(2);
      nlu.add("J'ai perdu mes clés", 'keys');
      expect(nlu.docs).toHaveLength(3);
      nlu.add('Je ne trouve pas mes clés', 'keys');
      expect(nlu.docs).toHaveLength(4);
    });
    test('Should check that the utterance is an string', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      expect(() => nlu.add(1, 'greet')).toThrow('Utterance must be an string');
      expect(() => nlu.add(undefined, 'greet')).toThrow(
        'Utterance must be an string'
      );
    });
    test('Should check that the intent is an string', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      expect(() => nlu.add('Bonjour', 1)).toThrow('Intent must be an string');
      expect(() => nlu.add('Bonjour', undefined)).toThrow(
        'Intent must be an string'
      );
    });
    test('If the utterance is empty, do not add doc to the classifier', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add(' ', 'greet');
      expect(nlu.docs).toHaveLength(0);
    });
    test('If the utterance was already added, do not add doc to the classifier', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      expect(nlu.docs).toHaveLength(1);
      nlu.add('Bonjour', 'greet');
      expect(nlu.docs).toHaveLength(1);
    });
  });

  describe('Pos utterance', () => {
    test('Should return the position of the utterance', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      expect(nlu.posUtterance('Bonjour')).toEqual(0);
      expect(nlu.posUtterance('Bonne nuit')).toEqual(1);
    });
    test('Should return -1 if the utterance does not exists', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      expect(nlu.posUtterance('Bonsoir')).toEqual(-1);
    });
    test('Should return position if the utterance stems already exists', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      expect(nlu.posUtterance('Bonn nuite')).toEqual(1);
    });
  });

  describe('exists utterance', () => {
    test('Should return if the utterance exists', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      expect(nlu.existsUtterance('Bonjour')).toBeTruthy();
      expect(nlu.existsUtterance('Bonne nuit')).toBeTruthy();
      expect(nlu.existsUtterance('Bonsoir')).toBeFalsy();
    });
  });

  describe('remove utterance', () => {
    test('Should remove the utterance if no intent is given', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('Bonjour François', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.remove('bonjour');
      expect(nlu.docs).toHaveLength(2);
    });
    test('Should do nothing if utterance does not exists', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.remove('bonsoire');
      expect(nlu.docs).toHaveLength(2);
    });
    test('Should remove the utterance if intent is provided', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.remove('bonjour', 'greet');
      expect(nlu.docs).toHaveLength(1);
    });
    test('Should do nothing if utterance does not exists for the intent', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.remove('Bonjour', 'meh');
      expect(nlu.docs).toHaveLength(2);
    });
    test('Should do nothing if utterance is empty', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.remove('', 'meh');
      expect(nlu.docs).toHaveLength(2);
    });
    test('Should throw an error if the utterance is not a string', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      expect(() => {
        nlu.remove(1, 'meh');
      }).toThrow('Utterance must be an string');
    });
  });

  describe('Normalize Neural', () => {
    test('If called with 0 total, do not calculate', () => {
      const nlu = new BaseNLU();
      const expected = [{ label: 'a', value: 0 }, { label: 'b', value: 0 }];
      const actual = nlu.normalizeNeural(expected);
      expect(actual).toBe(expected);
    });
  });

  describe('Edit Mode', () => {
    test('When entering edit mode all docs are marked as delete', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.beginEdit();
      const docs = nlu.docs.filter(x => x.status === 'delete');
      expect(docs).toHaveLength(4);
    });
    test('When entering edit mode isEditing is marked as true', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.beginEdit();
      expect(nlu.isEditing).toBeTruthy();
    });
    test('If I add an already existing doc, is marked as untouch', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.beginEdit();
      nlu.add('bonne nuit', 'greet');
      expect(nlu.docs[1].status).toEqual('untouch');
      const docs = nlu.docs.filter(x => x.status === 'delete');
      expect(docs).toHaveLength(3);
    });
    test('If already in edit mode, do not change status of docs', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.beginEdit();
      nlu.add('bonne nuit', 'greet');
      nlu.beginEdit();
      expect(nlu.docs[1].status).toEqual('untouch');
      const docs = nlu.docs.filter(x => x.status === 'delete');
      expect(docs).toHaveLength(3);
    });
    test('If I add a new doc, status should be create', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.beginEdit();
      nlu.add('bonne tarda', 'greet');
      expect(nlu.docs[4].status).toEqual('create');
      const docs = nlu.docs.filter(x => x.status === 'delete');
      expect(docs).toHaveLength(4);
    });
    test('If I add a new doc, and then add it again, status should be create', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.beginEdit();
      nlu.add('bonne tarda', 'greet');
      nlu.add('bonne tarda', 'greet');
      expect(nlu.docs[4].status).toEqual('create');
      const docs = nlu.docs.filter(x => x.status === 'delete');
      expect(docs).toHaveLength(4);
    });
    test('If I remove a doc it still have status delete', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.beginEdit();
      nlu.remove('bonne nuit', 'greet');
      const docs = nlu.docs.filter(x => x.status === 'delete');
      expect(docs).toHaveLength(4);
    });
    test('If I remove a newly added doc it is removed completely', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.beginEdit();
      nlu.add('bonne tarda', 'greet');
      nlu.remove('bonne tarda', 'greet');
      expect(nlu.docs).toHaveLength(4);
    });
    test('If I remove an untouch doc it return to delete status', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.beginEdit();
      nlu.add('bonne nuit', 'greet');
      nlu.remove('bonne nuit', 'greet');
      const docs = nlu.docs.filter(x => x.status === 'delete');
      expect(docs).toHaveLength(4);
    });
    test('If I end edit mode with all untouch it returns false', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.beginEdit();
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      const actual = nlu.endEdit();
      expect(actual).toBeFalsy();
    });
    test('If I end edit mode with at least one new doc, return true', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.beginEdit();
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.add('bonne tarda', 'greet');
      const actual = nlu.endEdit();
      expect(actual).toBeTruthy();
    });
    test('If I end edit mode with at least one deleted doc, return true', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.beginEdit();
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      const actual = nlu.endEdit();
      expect(actual).toBeTruthy();
    });
    test('If I end edit mode then isEditing status must end', () => {
      const nlu = new BaseNLU({ language: 'fr' });
      nlu.add('Bonjour', 'greet');
      nlu.add('bonne nuit', 'greet');
      nlu.add("J'ai perdu mes clés", 'keys');
      nlu.add('Je ne trouve pas mes clés', 'keys');
      nlu.beginEdit();
      nlu.endEdit();
      expect(nlu.isEditing).toBeFalsy();
    });
  });
});
