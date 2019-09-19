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
      expect(similar.getSimilarity('potatoe', 'potatoe')).toEqual(0);
      expect(similar.getSimilarity('', '123')).toEqual(3);
      expect(similar.getSimilarity('123', '')).toEqual(3);
      expect(similar.getSimilarity('a', 'b')).toEqual(1);
      expect(similar.getSimilarity('ab', 'ac')).toEqual(1);
      expect(similar.getSimilarity('abc', 'axc')).toEqual(1);
      expect(similar.getSimilarity('xabxcdxxefxgx', '1ab2cd34ef5g6')).toEqual(
        6
      );
      expect(similar.getSimilarity('xabxcdxxefxgx', 'abcdefg')).toEqual(6);
      expect(similar.getSimilarity('javawasneat', 'scalaisgreat')).toEqual(7);
      expect(similar.getSimilarity('example', 'samples')).toEqual(3);
      expect(similar.getSimilarity('forward', 'drawrof')).toEqual(6);
      expect(similar.getSimilarity('sturgeon', 'urgently')).toEqual(6);
      expect(similar.getSimilarity('levenshtein', 'frankenstein')).toEqual(6);
      expect(similar.getSimilarity('distance', 'difference')).toEqual(5);
      expect(similar.getSimilarity('distance', 'eistancd')).toEqual(2);
      expect(similar.getSimilarity('你好世界', '你好')).toEqual(2);
      expect(
        similar.getSimilarity(
          '因為我是中國人所以我會說中文',
          '因為我是英國人所以我會說英文'
        )
      ).toEqual(2);
      expect(similar.getSimilarity('mikailovitch', 'Mikhaïlovitch')).toEqual(3);
    });
    test('Should return correct levenshtein distance for long texts', () => {
      const similar = new SimilarSearch();
      const text1 =
        'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
      const text2 =
        'Duis erat dolor, cursus in tincidunt a, lobortis in odio. Cras magna sem, pharetra et iaculis quis, faucibus quis tellus. Suspendisse dapibus sapien in justo cursus';
      expect(similar.getSimilarity(text1, text2)).toEqual(143);
    });
    test('It can use collator', () => {
      const similar = new SimilarSearch({ useCollator: true });
      expect(similar.getSimilarity('mikailovitch', 'Mikhaïlovitch')).toEqual(1);
      expect(similar.getSimilarity('potatoe', 'potatoe')).toEqual(0);
      expect(similar.getSimilarity('', '123')).toEqual(3);
      expect(similar.getSimilarity('123', '')).toEqual(3);
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
      expect(result[0]).toEqual({ start: 0, end: 4, len: 5 });
    });
    test('Should get position of only one word even if surrounded by non alphanumeric chars', () => {
      const similar = new SimilarSearch();
      const text1 = '; . -Morbi. - ;..,^*';
      const result = similar.getWordPositions(text1);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ start: 5, end: 9, len: 5 });
    });
    test('Should get position of several words', () => {
      const similar = new SimilarSearch();
      const text1 = ';:Morbi..- interdum,   ultricies  ';
      const result = similar.getWordPositions(text1);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ start: 2, end: 6, len: 5 });
      expect(result[1]).toEqual({ start: 11, end: 18, len: 8 });
      expect(result[2]).toEqual({ start: 23, end: 31, len: 9 });
    });
    test('Should get position of words on long texts', () => {
      const similar = new SimilarSearch();
      const text1 =
        'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
      const result = similar.getWordPositions(text1);
      expect(result).toHaveLength(26);
      expect(result[0]).toEqual({ start: 0, end: 4, len: 5 });
      expect(result[25]).toEqual({ start: 188, end: 193, len: 6 });
    });
  });

  describe('Get best substring', () => {
    test('Should get position of best when exact', () => {
      const similar = new SimilarSearch();
      const text1 =
        'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
      const text2 = 'interdum ultricies';
      const result = similar.getBestSubstring(text1, text2);
      expect(result).toBeDefined();
      expect(result).toEqual({
        start: 6,
        end: 23,
        len: 18,
        levenshtein: 0,
        accuracy: 1,
      });
    });
    test('Should get position of best when several words are similar to search string', () => {
      const similar = new SimilarSearch();
      const text1 =
        'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
      const text2 = 'interdumaultriciesbneque';
      const result = similar.getBestSubstring(text1, text2);
      expect(result).toBeDefined();
      expect(result).toEqual({
        start: 6,
        end: 29,
        len: 24,
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
        end: 15,
        len: 16,
        levenshtein: 8,
        accuracy: 0.6666666666666666,
      });
    });
  });
  describe('Reduce edges', () => {
    test('It should do nothing if edges are empty', () => {
      const similar = new SimilarSearch();
      const edges = [];
      const result = similar.reduceEdges(edges);
      expect(result).toEqual([]);
    });
    test('If two edges collide, only the best accuracy remains', () => {
      const similar = new SimilarSearch();
      const edges = [
        {
          start: 1,
          end: 10,
          len: 9,
          accuracy: 1,
        },
        {
          start: 1,
          end: 10,
          len: 9,
          accuracy: 0.9,
        },
      ];
      const result = similar.reduceEdges(edges);
      expect(result).toEqual([
        {
          start: 1,
          end: 10,
          len: 9,
          accuracy: 1,
        },
      ]);
    });
    test('Edges can overlap in the left', () => {
      const similar = new SimilarSearch();
      const edges = [
        {
          start: 1,
          end: 10,
          len: 9,
          accuracy: 1,
        },
        {
          start: 0,
          end: 9,
          len: 9,
          accuracy: 0.9,
        },
      ];
      const result = similar.reduceEdges(edges);
      expect(result).toEqual([
        {
          start: 1,
          end: 10,
          len: 9,
          accuracy: 1,
        },
      ]);
    });
    test('Edges can overlap in the right', () => {
      const similar = new SimilarSearch();
      const edges = [
        {
          start: 1,
          end: 10,
          len: 9,
          accuracy: 1,
        },
        {
          start: 2,
          end: 11,
          len: 9,
          accuracy: 0.9,
        },
      ];
      const result = similar.reduceEdges(edges);
      expect(result).toEqual([
        {
          start: 1,
          end: 10,
          len: 9,
          accuracy: 1,
        },
      ]);
    });
    test('One edge can contain other', () => {
      const similar = new SimilarSearch();
      const edges = [
        {
          start: 1,
          end: 10,
          len: 9,
          accuracy: 1,
        },
        {
          start: 0,
          end: 11,
          len: 11,
          accuracy: 0.9,
        },
      ];
      const result = similar.reduceEdges(edges);
      expect(result).toEqual([
        {
          start: 1,
          end: 10,
          len: 9,
          accuracy: 1,
        },
      ]);
    });
    test('If both have same accuracy, return largest one', () => {
      const similar = new SimilarSearch();
      const edges = [
        {
          start: 1,
          end: 10,
          len: 9,
          accuracy: 1,
        },
        {
          start: 0,
          end: 11,
          len: 11,
          accuracy: 1,
        },
      ];
      const result = similar.reduceEdges(edges);
      expect(result).toEqual([
        {
          start: 0,
          end: 11,
          len: 11,
          accuracy: 1,
        },
      ]);
    });
    test('If both have same accuracy, return largest one even if goes first', () => {
      const similar = new SimilarSearch();
      const edges = [
        {
          start: 0,
          end: 11,
          len: 11,
          accuracy: 1,
        },
        {
          start: 1,
          end: 10,
          len: 9,
          accuracy: 1,
        },
      ];
      const result = similar.reduceEdges(edges);
      expect(result).toEqual([
        {
          start: 0,
          end: 11,
          len: 11,
          accuracy: 1,
        },
      ]);
    });
    test('If there are more than 2 edges overlaped, decide 1', () => {
      const similar = new SimilarSearch();
      const edges = [
        {
          start: 0,
          end: 11,
          len: 11,
          accuracy: 1,
        },
        {
          start: 1,
          end: 10,
          len: 9,
          accuracy: 1,
        },
        {
          start: 9,
          end: 18,
          len: 9,
          accuracy: 1,
        },
      ];
      const result = similar.reduceEdges(edges);
      expect(result).toEqual([
        {
          start: 0,
          end: 11,
          len: 11,
          accuracy: 1,
        },
      ]);
    });
    test('Should respect non overlaped edges', () => {
      const similar = new SimilarSearch();
      const edges = [
        {
          start: 0,
          end: 11,
          len: 11,
          accuracy: 1,
        },
        {
          start: 1,
          end: 10,
          len: 9,
          accuracy: 1,
        },
        {
          start: 12,
          end: 20,
          len: 8,
          accuracy: 1,
        },
      ];
      const result = similar.reduceEdges(edges);
      expect(result).toEqual([
        {
          start: 0,
          end: 11,
          len: 11,
          accuracy: 1,
        },
        {
          start: 12,
          end: 20,
          len: 8,
          accuracy: 1,
        },
      ]);
    });
    test('When there are different groups of overlaped edges, return one per group', () => {
      const similar = new SimilarSearch();
      const edges = [
        {
          start: 0,
          end: 11,
          len: 11,
          accuracy: 1,
        },
        {
          start: 12,
          end: 20,
          len: 8,
          accuracy: 1,
        },
        {
          start: 1,
          end: 10,
          len: 9,
          accuracy: 1,
        },
        {
          start: 12,
          end: 21,
          len: 9,
          accuracy: 1,
        },
      ];
      const result = similar.reduceEdges(edges);
      expect(result).toEqual([
        {
          start: 0,
          end: 11,
          len: 11,
          accuracy: 1,
        },
        {
          start: 12,
          end: 21,
          len: 9,
          accuracy: 1,
        },
      ]);
    });
  });
  describe('Get best substring list', () => {
    test('If not threshold is defined, then search for exact occurences', () => {
      const similar = new SimilarSearch();
      const text1 =
        'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
      const text2 = 'interdum ultricies';
      const result = similar.getBestSubstringList(text1, text2);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        start: 6,
        end: 23,
        len: 18,
        levenshtein: 0,
        accuracy: 1,
      });
    });
    test('If there are more than 1 occurence search exact, should return all', () => {
      const similar = new SimilarSearch();
      const text1 =
        'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
      const text2 = 'interdum';
      const result = similar.getBestSubstringList(text1, text2);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        start: 6,
        end: 13,
        len: 8,
        levenshtein: 0,
        accuracy: 1,
      });
      expect(result[1]).toEqual({
        start: 73,
        end: 80,
        len: 8,
        levenshtein: 0,
        accuracy: 1,
      });
    });
    test('Should get more than 1 occurence when searching with threshold', () => {
      const similar = new SimilarSearch();
      const text1 =
        'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus';
      const text2 = 'internum';
      const result = similar.getBestSubstringList(text1, text2, undefined, 0.8);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        start: 6,
        end: 13,
        len: 8,
        levenshtein: 1,
        accuracy: 0.875,
      });
      expect(result[1]).toEqual({
        start: 73,
        end: 80,
        len: 8,
        levenshtein: 1,
        accuracy: 0.875,
      });
    });
    test('Should return 0 to length element in array when the substring is longer than the string and accuracy is at least threshold', () => {
      const similar = new SimilarSearch();
      const text1 = 'dumaultriciesbne';
      const text2 = 'interdumaultriciesbneque';
      const result = similar.getBestSubstringList(text1, text2, undefined, 0.6);
      expect(result).toBeDefined();
      expect(result).toEqual([
        {
          start: 0,
          end: 15,
          len: 16,
          levenshtein: 8,
          accuracy: 0.6666666666666666,
        },
      ]);
    });
    test('Should return empty array when the substring is longer than the string and accuracy is lower than threshold', () => {
      const similar = new SimilarSearch();
      const text1 = 'dumaultriciesbne';
      const text2 = 'interdumaultriciesbneque';
      const result = similar.getBestSubstringList(text1, text2, undefined, 0.7);
      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });
  describe('Get edges from entity', () => {
    test('It should get the edges from an utterance', () => {
      const similar = new SimilarSearch({ normalize: true });
      const text1 = 'I saw spederman eating spaghetti in the city';
      const entity = {
        en: {
          spiderman: ['Spiderman', 'Spider-man'],
          'iron man': ['iron man', 'iron-man'],
          thor: ['Thor'],
        },
      };
      const bestEntity = similar.getEdgesFromEntity(
        text1,
        entity,
        'en',
        'entity',
        0.8
      );
      expect(bestEntity).toBeDefined();
      expect(bestEntity).toHaveLength(1);
      expect(bestEntity[0].start).toEqual(6);
      expect(bestEntity[0].end).toEqual(14);
      expect(bestEntity[0].levenshtein).toEqual(1);
      expect(bestEntity[0].accuracy).toEqual(0.8888888888888888);
      expect(bestEntity[0].option).toEqual('spiderman');
      expect(bestEntity[0].sourceText).toEqual('Spiderman');
      expect(bestEntity[0].utteranceText).toEqual('spederman');
    });
    test('It no threshold is provided, then is 1', () => {
      const similar = new SimilarSearch({ normalize: true });
      const text1 = 'I saw spiderman eating iron-men in the city';
      const entity = {
        en: {
          spiderman: ['Spiderman', 'Spider-man'],
          'iron man': ['iron man', 'iron-man'],
          thor: ['Thor'],
        },
      };
      const bestEntity = similar.getEdgesFromEntity(text1, entity, 'en');
      expect(bestEntity).toBeDefined();
      expect(bestEntity).toHaveLength(1);
      expect(bestEntity[0].start).toEqual(6);
      expect(bestEntity[0].end).toEqual(14);
      expect(bestEntity[0].levenshtein).toEqual(0);
      expect(bestEntity[0].accuracy).toEqual(1);
      expect(bestEntity[0].option).toEqual('spiderman');
      expect(bestEntity[0].sourceText).toEqual('Spiderman');
      expect(bestEntity[0].utteranceText).toEqual('spiderman');
    });
    test('It can return several occurances of options', () => {
      const similar = new SimilarSearch({ normalize: true });
      const text1 = 'I saw spiderman eating iron-men in the city spederman';
      const entity = {
        en: {
          spiderman: ['Spiderman', 'Spider-man'],
          'iron man': ['iron man', 'iron-man'],
          thor: ['Thor'],
        },
      };
      const bestEntity = similar.getEdgesFromEntity(
        text1,
        entity,
        'en',
        'entity',
        0.8
      );
      expect(bestEntity).toBeDefined();
      expect(bestEntity).toHaveLength(3);
      expect(bestEntity[0].start).toEqual(6);
      expect(bestEntity[0].end).toEqual(14);
      expect(bestEntity[0].levenshtein).toEqual(0);
      expect(bestEntity[0].accuracy).toEqual(1);
      expect(bestEntity[0].option).toEqual('spiderman');
      expect(bestEntity[0].sourceText).toEqual('Spiderman');
      expect(bestEntity[0].utteranceText).toEqual('spiderman');
      expect(bestEntity[1].start).toEqual(44);
      expect(bestEntity[1].end).toEqual(52);
      expect(bestEntity[1].levenshtein).toEqual(1);
      expect(bestEntity[1].accuracy).toEqual(0.8888888888888888);
      expect(bestEntity[1].option).toEqual('spiderman');
      expect(bestEntity[1].sourceText).toEqual('Spiderman');
      expect(bestEntity[1].utteranceText).toEqual('spederman');
      expect(bestEntity[2].start).toEqual(23);
      expect(bestEntity[2].end).toEqual(30);
      expect(bestEntity[2].levenshtein).toEqual(1);
      expect(bestEntity[2].accuracy).toEqual(0.875);
      expect(bestEntity[2].option).toEqual('iron man');
      expect(bestEntity[2].sourceText).toEqual('iron-man');
      expect(bestEntity[2].utteranceText).toEqual('iron-men');
    });
    test('If locale does not exists return empty array', () => {
      const similar = new SimilarSearch({ normalize: true });
      const text1 = 'I saw spiderman eating iron-men in the city spederman';
      const entity = {
        en: {
          spiderman: ['Spiderman', 'Spider-man'],
          'iron man': ['iron man', 'iron-man'],
          thor: ['Thor'],
        },
      };
      const bestEntity = similar.getEdgesFromEntity(text1, entity, 'es', 0.8);
      expect(bestEntity).toEqual([]);
    });
  });
  describe('Get edges from entities', () => {
    test('It should get the edges from an utterance', () => {
      const similar = new SimilarSearch({ normalize: true });
      const text1 = 'I saw spederman eating spaghetti in the city';
      const entities = {
        hero: {
          en: {
            spiderman: ['Spiderman', 'Spider-man'],
            'iron man': ['iron man', 'iron-man'],
            thor: ['Thor'],
          },
        },
        food: {
          en: {
            burguer: ['Burguer', 'Hamburguer'],
            pizza: ['pizza'],
            pasta: ['Pasta', 'spaguetti', 'spaghetti'],
          },
        },
      };
      const bestEntity = similar.getEdgesFromEntities(
        text1,
        entities,
        'en',
        undefined,
        0.8
      );
      expect(bestEntity).toBeDefined();
      expect(bestEntity).toHaveLength(2);
      expect(bestEntity[0].start).toEqual(6);
      expect(bestEntity[0].end).toEqual(14);
      expect(bestEntity[0].levenshtein).toEqual(1);
      expect(bestEntity[0].accuracy).toEqual(0.8888888888888888);
      expect(bestEntity[0].option).toEqual('spiderman');
      expect(bestEntity[0].sourceText).toEqual('Spiderman');
      expect(bestEntity[0].entity).toEqual('hero');
      expect(bestEntity[0].utteranceText).toEqual('spederman');
      expect(bestEntity[1].start).toEqual(23);
      expect(bestEntity[1].end).toEqual(31);
      expect(bestEntity[1].levenshtein).toEqual(0);
      expect(bestEntity[1].accuracy).toEqual(1);
      expect(bestEntity[1].option).toEqual('pasta');
      expect(bestEntity[1].sourceText).toEqual('spaghetti');
      expect(bestEntity[1].entity).toEqual('food');
      expect(bestEntity[1].utteranceText).toEqual('spaghetti');
    });
    test('It no threshold is provided then is 1', () => {
      const similar = new SimilarSearch({ normalize: true });
      const text1 = 'I saw spederman eating spaghetti in the city';
      const entities = {
        hero: {
          en: {
            spiderman: ['Spiderman', 'Spider-man'],
            'iron man': ['iron man', 'iron-man'],
            thor: ['Thor'],
          },
        },
        food: {
          en: {
            burguer: ['Burguer', 'Hamburguer'],
            pizza: ['pizza'],
            pasta: ['Pasta', 'spaguetti', 'spaghetti'],
          },
        },
      };
      const bestEntity = similar.getEdgesFromEntities(text1, entities, 'en');
      expect(bestEntity).toBeDefined();
      expect(bestEntity).toHaveLength(1);
      expect(bestEntity[0].start).toEqual(23);
      expect(bestEntity[0].end).toEqual(31);
      expect(bestEntity[0].levenshtein).toEqual(0);
      expect(bestEntity[0].accuracy).toEqual(1);
      expect(bestEntity[0].option).toEqual('pasta');
      expect(bestEntity[0].sourceText).toEqual('spaghetti');
      expect(bestEntity[0].entity).toEqual('food');
      expect(bestEntity[0].utteranceText).toEqual('spaghetti');
    });
    test('If whitelist of entities is provided, check only those entities', () => {
      const similar = new SimilarSearch({ normalize: true });
      const text1 = 'I saw spederman eating spaghetti in the city';
      const entities = {
        hero: {
          en: {
            spiderman: ['Spiderman', 'Spider-man'],
            'iron man': ['iron man', 'iron-man'],
            thor: ['Thor'],
          },
        },
        food: {
          en: {
            burguer: ['Burguer', 'Hamburguer'],
            pizza: ['pizza'],
            pasta: ['Pasta', 'spaguetti', 'spaghetti'],
          },
        },
      };
      const bestEntity = similar.getEdgesFromEntities(
        text1,
        entities,
        'en',
        ['hero'],
        0.8
      );
      expect(bestEntity).toBeDefined();
      expect(bestEntity).toHaveLength(1);
      expect(bestEntity[0].start).toEqual(6);
      expect(bestEntity[0].end).toEqual(14);
      expect(bestEntity[0].levenshtein).toEqual(1);
      expect(bestEntity[0].accuracy).toEqual(0.8888888888888888);
      expect(bestEntity[0].option).toEqual('spiderman');
      expect(bestEntity[0].sourceText).toEqual('Spiderman');
      expect(bestEntity[0].entity).toEqual('hero');
      expect(bestEntity[0].utteranceText).toEqual('spederman');
    });
  });
});
