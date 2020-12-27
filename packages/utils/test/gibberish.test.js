const { isGibberish } = require('../src');

describe('Gibberish', () => {
  describe('isGibberish', () => {
    test('Should return false for good sentences', () => {
      expect(isGibberish('This sentence is totally valid.')).toBeFalsy();
      expect(isGibberish('This is not gibberish')).toBeFalsy();
      expect(isGibberish('Esta frase es totalmente correcta')).toBeFalsy();
    });
    test('Should return true for gibberish sentences', () => {
      expect(isGibberish('zxcvwerjasc')).toBeTruthy();
      expect(isGibberish('ertrjiloifdfyyoiu')).toBeTruthy();
      expect(isGibberish('ajgñsgj ajdskfig jskf')).toBeTruthy();
      expect(
        isGibberish('euzbfdhuifdgiuhdsiudvbdjibgdfijbfdsiuddsfhjibfsdifdhbfd')
      ).toBeTruthy();
    });
  });
});
