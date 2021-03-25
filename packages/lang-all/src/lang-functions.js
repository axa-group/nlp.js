const { Language } = require('@nlpjs/language');
const langAr = require('@nlpjs/lang-ar');
const langBr = require('@nlpjs/lang-bn');
const langCa = require('@nlpjs/lang-ca');
const langCs = require('@nlpjs/lang-cs');
const langDa = require('@nlpjs/lang-da');
const langDe = require('@nlpjs/lang-de');
const langEl = require('@nlpjs/lang-el');
const langEn = require('@nlpjs/lang-en');
const langEs = require('@nlpjs/lang-es');
const langEu = require('@nlpjs/lang-eu');
const langFa = require('@nlpjs/lang-fa');
const langFi = require('@nlpjs/lang-fi');
const langFr = require('@nlpjs/lang-fr');
const langGa = require('@nlpjs/lang-ga');
const langGl = require('@nlpjs/lang-gl');
const langHi = require('@nlpjs/lang-hi');
const langHu = require('@nlpjs/lang-hu');
const langHy = require('@nlpjs/lang-hy');
const langId = require('@nlpjs/lang-id');
const langIt = require('@nlpjs/lang-it');
const langJa = require('@nlpjs/lang-ja');
const langKo = require('@nlpjs/lang-ko');
const langLt = require('@nlpjs/lang-lt');
const langMs = require('@nlpjs/lang-ms');
const langNe = require('@nlpjs/lang-ne');
const langNl = require('@nlpjs/lang-nl');
const langNo = require('@nlpjs/lang-no');
const langPl = require('@nlpjs/lang-pl');
const langPt = require('@nlpjs/lang-pt');
const langRo = require('@nlpjs/lang-ro');
const langRu = require('@nlpjs/lang-ru');
const langSl = require('@nlpjs/lang-sl');
const langSr = require('@nlpjs/lang-sr');
const langSv = require('@nlpjs/lang-sv');
const langTa = require('@nlpjs/lang-ta');
const langTh = require('@nlpjs/lang-th');
const langTl = require('@nlpjs/lang-tl');
const langTr = require('@nlpjs/lang-tr');
const langUk = require('@nlpjs/lang-uk');
const langZh = require('@nlpjs/lang-zh');

const langs = {
  ar: langAr,
  br: langBr,
  ca: langCa,
  cs: langCs,
  da: langDa,
  de: langDe,
  el: langEl,
  en: langEn,
  es: langEs,
  eu: langEu,
  fa: langFa,
  fi: langFi,
  fr: langFr,
  ga: langGa,
  gl: langGl,
  hi: langHi,
  hu: langHu,
  hy: langHy,
  id: langId,
  it: langIt,
  ja: langJa,
  ko: langKo,
  lt: langLt,
  ms: langMs,
  ne: langNe,
  nl: langNl,
  no: langNo,
  pl: langPl,
  pt: langPt,
  ro: langRo,
  ru: langRu,
  sl: langSl,
  sr: langSr,
  sv: langSv,
  ta: langTa,
  th: langTh,
  tl: langTl,
  tr: langTr,
  uk: langUk,
  zh: langZh,
};

const language = new Language();
const langDict = {};
const keys = Object.keys(language.languagesAlpha2);

for (let i = 0; i < keys.length; i += 1) {
  const key = keys[i];
  const langData = language.languagesAlpha2[key];
  langDict[key] = key;
  langDict[langData.alpha3] = key;
  langDict[langData.name.toLowerCase()] = key;
}

function getLangClass(inputLanguage, className) {
  let locale = langDict[inputLanguage.toLowerCase()];
  if (!locale) {
    locale = langDict[inputLanguage.toLowerCase().slice(0, 2)] || 'en';
  }
  const lang = langs[locale];
  if (!lang) {
    throw new Error(
      `Language classes not found for language "${inputLanguage}"`
    );
  }
  const localeCapitalized = `${locale.charAt(0).toUpperCase()}${locale.slice(
    1
  )}`;
  return lang[`${className}${localeCapitalized}`];
}

function getNormalizer(inputLanguage = 'en') {
  const Clazz = getLangClass(inputLanguage, 'Normalizer');
  if (Clazz) {
    return new Clazz();
  }
  return undefined;
}

function getTokenizer(inputLanguage = 'en') {
  const Clazz = getLangClass(inputLanguage, 'Tokenizer');
  if (Clazz) {
    return new Clazz();
  }
  return undefined;
}

function getStemmer(inputLanguage = 'en') {
  const Clazz = getLangClass(inputLanguage, 'Stemmer');
  if (Clazz) {
    return new Clazz();
  }
  return undefined;
}

function getStopwords(inputLanguage = 'en') {
  const Clazz = getLangClass(inputLanguage, 'Stopwords');
  if (Clazz) {
    return new Clazz();
  }
  return undefined;
}

function getSentiment(inputLanguage = 'en') {
  const Clazz = getLangClass(inputLanguage, 'Sentiment');
  if (Clazz) {
    return new Clazz();
  }
  return undefined;
}

function normalize(text, locale = 'en') {
  const normalizer = getNormalizer(locale);
  return normalizer.normalize(text);
}

function tokenize(text, locale = 'en', shouldNormalize = false) {
  const tokenizer = getTokenizer(locale);
  return tokenizer.tokenize(text, shouldNormalize);
}

function stem(text, locale = 'en') {
  const stemmer = getStemmer(locale);
  if (Array.isArray(text)) {
    return stemmer.stem(text);
  }
  const normalizer = getNormalizer(locale);
  const tokenizer = getTokenizer(locale);
  return stemmer.stem(tokenizer.tokenize(normalizer.normalize(text)));
}

function removeStopwords(tokens, locale = 'en') {
  const stopwords = getStopwords(locale);
  return stopwords.removeStopwords(tokens);
}

function dict(sentences, locale = 'en', useStemmer = false) {
  const freqs = {};
  for (let i = 0; i < sentences.length; i += 1) {
    const current = useStemmer
      ? stem(sentences[i], locale)
      : tokenize(sentences[i], locale).map((x) => x.toLowerCase());
    for (let j = 0; j < current.length; j += 1) {
      freqs[current[j]] = (freqs[current[j]] || 0) + 1;
    }
  }
  const positions = {};
  const words = Object.keys(freqs);
  for (let i = 0; i < words.length; i += 1) {
    positions[words[i]] = i;
  }
  return {
    locale,
    useStemmer,
    freqs,
    positions,
    keys: words,
    length: words.length,
  };
}

function bow(sentence, voc) {
  const current = voc.useStemmer
    ? stem(sentence, voc.locale)
    : tokenize(sentence, voc.locale).map((x) => x.toLowerCase());
  const result = new Array(voc.length).fill(0);
  for (let i = 0; i < current.length; i += 1) {
    const index = voc.positions[current[i]];
    if (index !== undefined) {
      result[index] = 1;
    }
  }
  return result;
}

module.exports = {
  langs,
  language,
  langDict,
  getNormalizer,
  getTokenizer,
  getStemmer,
  getStopwords,
  getSentiment,
  normalize,
  tokenize,
  stem,
  removeStopwords,
  dict,
  bow,
};
