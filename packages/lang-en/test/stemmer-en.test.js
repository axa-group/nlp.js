const { Normalizer } = require('@nlpjs/core');
const { TokenizerEn, StemmerEn } = require('../src');

const normalizer = new Normalizer();
const tokenizer = new TokenizerEn();
const stemmer = new StemmerEn();

describe('Stemmer', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const instance = new StemmerEn();
      expect(instance).toBeDefined();
    });
  });

  describe('Stem', () => {
    test('Should stem "what does your company develop"', () => {
      const input = 'what does your company develop';
      const expected = ['what', 'doe', 'your', 'compani', 'develop'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "does your company have other products"', () => {
      const input = 'does your company have other products';
      const expected = ['doe', 'your', 'compani', 'have', 'other', 'product'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "what is your company creating"', () => {
      const input = 'what is your company creating';
      const expected = ['what', 'is', 'your', 'compani', 'creat'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "what is creating your enterprise"', () => {
      const input = 'what is creating your enterprise';
      const expected = ['what', 'is', 'creat', 'your', 'enterpris'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "does your enterprise have other apps?"', () => {
      const input = 'does your enterprise have other apps?';
      const expected = ['doe', 'your', 'enterpris', 'have', 'other', 'app'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "what else is developing your enterprise"', () => {
      const input = 'what else is developing your enterprise';
      const expected = ['what', 'els', 'is', 'develop', 'your', 'enterpris'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "does your company have some other product?"', () => {
      const input = 'does your company have some other product?';
      const expected = [
        'doe',
        'your',
        'compani',
        'have',
        'some',
        'other',
        'product',
      ];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "what else have created your company?"', () => {
      const input = 'what else have created your company?';
      const expected = ['what', 'els', 'have', 'creat', 'your', 'compani'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "does the enterprise have any other app?"', () => {
      const input = 'does the enterprise have any other app?';
      const expected = [
        'doe',
        'the',
        'enterpris',
        'have',
        'ani',
        'other',
        'app',
      ];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "Other product developed by your company?"', () => {
      const input = 'Other product developed by your company?';
      const expected = ['other', 'product', 'develop', 'by', 'your', 'compani'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "what\'s the name of your application"', () => {
      const input = "what's the name of your application";
      const expected = ['what', 'is', 'the', 'name', 'of', 'your', 'applic'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "how\'s your app called"', () => {
      const input = "how's your app called";
      const expected = ['how', 'is', 'your', 'app', 'call'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "tell me your app name"', () => {
      const input = 'tell me your app name';
      const expected = ['tell', 'me', 'your', 'app', 'name'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "name of the app"', () => {
      const input = 'name of the app';
      const expected = ['name', 'of', 'the', 'app'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "I\'d like to know the name of your app"', () => {
      const input = "I'd like to know the name of your app";
      const expected = [
        'i',
        'had',
        'like',
        'to',
        'know',
        'the',
        'name',
        'of',
        'your',
        'app',
      ];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "name of your apps?"', () => {
      const input = 'name of your apps?';
      const expected = ['name', 'of', 'your', 'app'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "tell me your applications names"', () => {
      const input = 'tell me your applications names';
      const expected = ['tell', 'me', 'your', 'applic', 'name'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "how do you call your app?"', () => {
      const input = 'how do you call your app?';
      const expected = ['how', 'do', 'you', 'call', 'your', 'app'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "your application name?"', () => {
      const input = 'your application name?';
      const expected = ['your', 'applic', 'name'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
    test('Should stem "name of the app?"', () => {
      const input = 'name of the app?';
      const expected = ['name', 'of', 'the', 'app'];
      const tokens = tokenizer.tokenize(normalizer.normalize(input));
      const actual = stemmer.stem(tokens);
      expect(actual).toEqual(expected);
    });
  });
});
