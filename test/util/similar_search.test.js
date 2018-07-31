/*
 * Copyright (c) AXA Shared Services Spain S.A.
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

const { SimilarSearch } = require('../../lib');

describe('Similar Search', () => {
  describe('Constructor', () => {
    test('Should create an instance', () => {
      const similar = new SimilarSearch();
      expect(similar).toBeDefined();
    });
    test('Should initialize default parameters if no settings provided', () => {
      const similar = new SimilarSearch();
      expect(similar.alphanumeric).toBeDefined();
      expect(similar.collator).toBeDefined();
      expect(similar.useCollator).toEqual(false);
      expect(similar.normalize).toEqual(false);
    });
    test('Should initialize parameters based on settings', () => {
      const similar = new SimilarSearch({ normalize: true });
      expect(similar.alphanumeric).toBeDefined();
      expect(similar.collator).toBeDefined();
      expect(similar.useCollator).toEqual(false);
      expect(similar.normalize).toEqual(true);
    });
  });

  describe('get similarity', () => {
    test('Should return correct levenshtein distance', () => {
      const similar = new SimilarSearch();
      expect(similar.getSimilarity('a', 'b')).toEqual(1);
      expect(similar.getSimilarity('ab', 'ac')).toEqual(1);
      expect(similar.getSimilarity('abc', 'axc')).toEqual(1);
      expect(similar.getSimilarity('xabxcdxxefxgx', '1ab2cd34ef5g6')).toEqual(6);
      expect(similar.getSimilarity('xabxcdxxefxgx', 'abcdefg')).toEqual(6);
      expect(similar.getSimilarity('javawasneat', 'scalaisgreat')).toEqual(7);
      expect(similar.getSimilarity('example', 'samples')).toEqual(3);
      expect(similar.getSimilarity('forward', 'drawrof')).toEqual(6);
      expect(similar.getSimilarity('sturgeon', 'urgently')).toEqual(6);
      expect(similar.getSimilarity('levenshtein', 'frankenstein')).toEqual(6);
      expect(similar.getSimilarity('distance', 'difference')).toEqual(5);
      expect(similar.getSimilarity('distance', 'eistancd')).toEqual(2);
      expect(similar.getSimilarity('你好世界', '你好')).toEqual(2);
      expect(similar.getSimilarity('因為我是中國人所以我會說中文', '因為我是英國人所以我會說英文')).toEqual(2);
      expect(similar.getSimilarity('mikailovitch', 'Mikhaïlovitch')).toEqual(3);
    });
    test('Should return correct levenshtein distance for long texts', () => {
      const similar = new SimilarSearch();
      const text1 = 'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
      const text2 = 'Duis erat dolor, cursus in tincidunt a, lobortis in odio. Cras magna sem, pharetra et iaculis quis, faucibus quis tellus. Suspendisse dapibus sapien in justo cursus';
      expect(similar.getSimilarity(text1, text2)).toEqual(143);
    });
    test('It can use collator', () => {
      const similar = new SimilarSearch({ useCollator: true });
      expect(similar.getSimilarity('mikailovitch', 'Mikhaïlovitch')).toEqual(1);
    });
    test('It can use normalize (faster than collator)', () => {
      const similar = new SimilarSearch({ normalize: true });
      expect(similar.getSimilarity('mikailovitch', 'Mikhaïlovitch')).toEqual(1);
    });
    test('Should return the length of first string if the second is empty', () => {
      const similar = new SimilarSearch();
      expect(similar.getSimilarity('mikailovitch', '')).toEqual(12);
    });
    test('Should return the length of second string if the first is empty', () => {
      const similar = new SimilarSearch();
      expect(similar.getSimilarity('', 'mikailovitch')).toEqual(12);
    });
  });

  describe('Is alphanumeric', () => {
    test('Should return true if the character is alphanumeric', () => {
      const similar = new SimilarSearch();
      const str = 'aAzZ09áÁâÂàÀäÄ';
      for (let i = 0; i < str.length; i += 1) {
        expect(similar.isAlphanumeric(str[i])).toEqual(true);
      }
    });
    test('Should return false if the character is not alphanumeric', () => {
      const similar = new SimilarSearch();
      const str = ' -_.;=)(';
      for (let i = 0; i < str.length; i += 1) {
        expect(similar.isAlphanumeric(str[i])).toEqual(false);
      }
    });
  });

  describe('Get word positions', () => {
    test('Should get position of only one word', () => {
      const similar = new SimilarSearch();
      const text1 = 'Morbi';
      const result = similar.getWordPositions(text1);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ start: 0, end: 5, len: 5 });
    });
    test('Should get position of only one word even if surrounded by non alphanumeric chars', () => {
      const similar = new SimilarSearch();
      const text1 = '; . -Morbi. - ;..,^*';
      const result = similar.getWordPositions(text1);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ start: 5, end: 10, len: 5 });
    });
    test('Should get position of several words', () => {
      const similar = new SimilarSearch();
      const text1 = ';:Morbi..- interdum,   ultricies  ';
      const result = similar.getWordPositions(text1);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ start: 2, end: 7, len: 5 });
      expect(result[1]).toEqual({ start: 11, end: 19, len: 8 });
      expect(result[2]).toEqual({ start: 23, end: 32, len: 9 });
    });
    test('Should get position of words on long texts', () => {
      const similar = new SimilarSearch();
      const text1 = 'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
      const result = similar.getWordPositions(text1);
      expect(result).toHaveLength(26);
      expect(result[0]).toEqual({ start: 0, end: 5, len: 5 });
      expect(result[25]).toEqual({ start: 188, end: 194, len: 6 });
    });
  });

  describe('Get best substring', () => {
    test('Should get position of best when exact', () => {
      const similar = new SimilarSearch();
      const text1 = 'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
      const text2 = 'interdum ultricies';
      const result = similar.getBestSubstring(text1, text2);
      expect(result).toBeDefined();
      expect(result).toEqual({
        start: 6,
        end: 24,
        levenshtein: 0,
        accuracy: 1,
      });
    });
    test('Should get position of best when several words are similar to search string', () => {
      const similar = new SimilarSearch();
      const text1 = 'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
      const text2 = 'interdumaultriciesbneque';
      const result = similar.getBestSubstring(text1, text2);
      expect(result).toBeDefined();
      expect(result).toEqual({
        start: 6,
        end: 30,
        levenshtein: 2,
        accuracy: 0.9166666666666666,
      });
    });
    test('Should return 0 to length result when the substring is longer than the string', () => {
      const similar = new SimilarSearch();
      const text1 = 'dumaultriciesbne';
      const text2 = 'interdumaultriciesbneque';
      const result = similar.getBestSubstring(text1, text2);
      expect(result).toBeDefined();
      expect(result).toEqual({
        start: 0,
        end: 16,
        levenshtein: 8,
        accuracy: 0.6666666666666666,
      });
    });
  });

  describe('Get best entity', () => {
    test('', () => {
      const similar = new SimilarSearch({ normalize: true });
      const text1 = 'I saw spederman eating spaghetti in the city';
      const entities = {
        hero: {
          name: 'hero',
          options: [
            {
              name: 'spiderman',
              texts: {
                en: ['Spiderman', 'Spider-man'],
              },
            },
            {
              name: 'iron man',
              texts: {
                en: ['iron man', 'iron-man'],
              },
            },
            {
              name: 'thor',
              texts: {
                en: ['Thor'],
              },
            },
          ],
        },
        food: {
          name: 'food',
          options: [
            {
              name: 'burguer',
              texts: {
                en: ['Burguer', 'Hamburguer'],
              },
            },
            {
              name: 'pizza',
              texts: {
                en: ['pizza'],
              },
            },
            {
              name: 'pasta',
              texts: {
                en: ['Pasta', 'spaghetti'],
              },
            },
          ],
        },
      };
      const bestEntity = similar.getBestEntity(text1, entities, 'en');
      expect(bestEntity).toBeDefined();
      expect(bestEntity).toHaveLength(2);
      expect(bestEntity[0].start).toEqual(6);
      expect(bestEntity[0].end).toEqual(15);
      expect(bestEntity[0].levenshtein).toEqual(1);
      expect(bestEntity[0].accuracy).toEqual(0.8888888888888888);
      expect(bestEntity[0].option).toEqual('spiderman');
      expect(bestEntity[0].sourceText).toEqual('Spiderman');
      expect(bestEntity[0].entity).toEqual('hero');
      expect(bestEntity[0].utteranceText).toEqual('spederman');
      expect(bestEntity[1].start).toEqual(23);
      expect(bestEntity[1].end).toEqual(32);
      expect(bestEntity[1].levenshtein).toEqual(0);
      expect(bestEntity[1].accuracy).toEqual(1);
      expect(bestEntity[1].option).toEqual('pasta');
      expect(bestEntity[1].sourceText).toEqual('spaghetti');
      expect(bestEntity[1].entity).toEqual('food');
      expect(bestEntity[1].utteranceText).toEqual('spaghetti');
    });
  });
});
