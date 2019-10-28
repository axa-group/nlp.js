const { NormalizerJa, TokenizerJa } = require('../src');

describe('Tokenizer Japanse', () => {
  describe('Tokenize', () => {
    test('It should tokenize "一般的にコーヌビアナイトと呼ばれる変成岩。"', () => {
      const expected = [
        '一般的',
        'に',
        'コーヌビアナイト',
        'と',
        '呼ばれる',
        '変成',
        '岩',
      ];
      const text = '一般的にコーヌビアナイトと呼ばれる変成岩。';
      const normalizer = new NormalizerJa();
      const tokenizer = new TokenizerJa();
      const actual = tokenizer.tokenize(normalizer.normalize(text));
      expect(actual).toEqual(expected);
    });
  });
});
