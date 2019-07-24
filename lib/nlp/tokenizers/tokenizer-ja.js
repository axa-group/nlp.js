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

/* eslint-disable */
const Tokenizer = require('./tokenizer');
const JapaneseRules = require('./japanese-rules.json');

function replacer(translationTable) {
  const pattern = [];
  const keys = Object.keys(translationTable);
  keys.forEach((key) => {
    // eslint-disable-next-line
    pattern.push(`${key}`.replace(/([-()\[\]{}+?*.$\^|,:#<!\\\/])/g, '\\$1').replace(/\x08/g, '\\x08'));
  });
  const regExp = new RegExp(pattern.join('|'), 'g');
  return str => str.replace(regExp, s => translationTable[s]);
}

function merge(...args) {
  const newObj = {};
  let id = 0;
  while (args[id]) {
    const keys = Object.keys(args[id]);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      newObj[key] = args[id][key];
    }
    id += 1;
  }
  return newObj;
}

function flip(obj) {
  const newObj = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    newObj[obj[key]] = key;
  }
  return newObj;
}

const fixFullwidthKana = {
  'ゝ゛': 'ゞ',
  'ヽ゛': 'ヾ',
  'う゛': 'ゔ',
  'か゛': 'が',
  'き゛': 'ぎ',
  'く゛': 'ぐ',
  'け゛': 'げ',
  'こ゛': 'ご',
  'さ゛': 'ざ',
  'し゛': 'じ',
  'す゛': 'ず',
  'せ゛': 'ぜ',
  'そ゛': 'ぞ',
  'た゛': 'だ',
  'ち゛': 'ぢ',
  'つ゛': 'づ',
  'て゛': 'で',
  'と゛': 'ど',
  'は゛': 'ば',
  'は゜': 'ぱ',
  'ひ゛': 'び',
  'ひ゜': 'ぴ',
  'ふ゛': 'ぶ',
  'ふ゜': 'ぷ',
  'へ゛': 'べ',
  'へ゜': 'ぺ',
  'ほ゛': 'ぼ',
  'ほ゜': 'ぽ',
  'っな': 'んな',
  'っに': 'んに',
  'っぬ': 'んぬ',
  'っね': 'んね',
  'っの': 'んの',
  'ウ゛': 'ヴ',
  'カ゛': 'ガ',
  'キ゛': 'ギ',
  'ク゛': 'グ',
  'ケ゛': 'ゲ',
  'コ゛': 'ゴ',
  'サ゛': 'ザ',
  'シ゛': 'ジ',
  'ス゛': 'ズ',
  'セ゛': 'ゼ',
  'ソ゛': 'ゾ',
  'タ゛': 'ダ',
  'チ゛': 'ヂ',
  'ツ゛': 'ヅ',
  'テ゛': 'デ',
  'ト゛': 'ド',
  'ハ゛': 'バ',
  'ハ゜': 'パ',
  'ヒ゛': 'ビ',
  'ヒ゜': 'ピ',
  'フ゛': 'ブ',
  'フ゜': 'プ',
  'ヘ゛': 'ベ',
  'ヘ゜': 'ペ',
  'ホ゛': 'ボ',
  'ホ゜': 'ポ',
  'ッナ': 'ンナ',
  'ッニ': 'ンニ',
  'ッヌ': 'ンヌ',
  'ッネ': 'ンネ',
  'ッノ': 'ンノ',
};


const conversionTables = {
  fullwidthToHalfwidth: {
    alphabet: {
      'ａ': 'a',
      'ｂ': 'b',
      'ｃ': 'c',
      'ｄ': 'd',
      'ｅ': 'e',
      'ｆ': 'f',
      'ｇ': 'g',
      'ｈ': 'h',
      'ｉ': 'i',
      'ｊ': 'j',
      'ｋ': 'k',
      'ｌ': 'l',
      'ｍ': 'm',
      'ｎ': 'n',
      'ｏ': 'o',
      'ｐ': 'p',
      'ｑ': 'q',
      'ｒ': 'r',
      'ｓ': 's',
      'ｔ': 't',
      'ｕ': 'u',
      'ｖ': 'v',
      'ｗ': 'w',
      'ｘ': 'x',
      'ｙ': 'y',
      'ｚ': 'z',
      'Ａ': 'A',
      'Ｂ': 'B',
      'Ｃ': 'C',
      'Ｄ': 'D',
      'Ｅ': 'E',
      'Ｆ': 'F',
      'Ｇ': 'G',
      'Ｈ': 'H',
      'Ｉ': 'I',
      'Ｊ': 'J',
      'Ｋ': 'K',
      'Ｌ': 'L',
      'Ｍ': 'M',
      'Ｎ': 'N',
      'Ｏ': 'O',
      'Ｐ': 'P',
      'Ｑ': 'Q',
      'Ｒ': 'R',
      'Ｓ': 'S',
      'Ｔ': 'T',
      'Ｕ': 'U',
      'Ｖ': 'V',
      'Ｗ': 'W',
      'Ｘ': 'X',
      'Ｙ': 'Y',
      'Ｚ': 'Z',
      '　': ' ',
    },

    numbers: {
      '０': '0',
      '１': '1',
      '２': '2',
      '３': '3',
      '４': '4',
      '５': '5',
      '６': '6',
      '７': '7',
      '８': '8',
      '９': '9',
    },

    symbol: {
      '＿': '_',
      '－': '-',
      '，': ',',
      '；': ';',
      '：': ':',
      '！': '!',
      '？': '?',
      '．': '.',
      '（': '(',
      '）': ')',
      '［': '[',
      '］': ']',
      '｛': '{',
      '｝': '}',
      '＠': '@',
      '＊': '*',
      '＼': '\\',
      '／': '/',
      '＆': '&',
      '＃': '#',
      '％': '%',
      '｀': '`',
      '＾': '^',
      '＋': '+',
      '＜': '<',
      '＝': '=',
      '＞': '>',
      '｜': '|',
      '≪': '«',
      '≫': '»',
      '─': '-',
      '＄': '$',
      '＂': '"',
    },

    purePunctuation: {
      '、': '､',
      '。': '｡',
      '・': '･',
      '「': '｢',
      '」': '｣',
    },

    punctuation: {},

    katakana: {
      '゛': 'ﾞ',
      '゜': 'ﾟ',
      'ー': 'ｰ',
      'ヴ': 'ｳﾞ',
      'ガ': 'ｶﾞ',
      'ギ': 'ｷﾞ',
      'グ': 'ｸﾞ',
      'ゲ': 'ｹﾞ',
      'ゴ': 'ｺﾞ',
      'ザ': 'ｻﾞ',
      'ジ': 'ｼﾞ',
      'ズ': 'ｽﾞ',
      'ゼ': 'ｾﾞ',
      'ゾ': 'ｿﾞ',
      'ダ': 'ﾀﾞ',
      'ヂ': 'ﾁﾞ',
      'ヅ': 'ﾂﾞ',
      'デ': 'ﾃﾞ',
      'ド': 'ﾄﾞ',
      'バ': 'ﾊﾞ',
      'パ': 'ﾊﾟ',
      'ビ': 'ﾋﾞ',
      'ピ': 'ﾋﾟ',
      'ブ': 'ﾌﾞ',
      'プ': 'ﾌﾟ',
      'ベ': 'ﾍﾞ',
      'ペ': 'ﾍﾟ',
      'ボ': 'ﾎﾞ',
      'ポ': 'ﾎﾟ',
      'ァ': 'ｧ',
      'ア': 'ｱ',
      'ィ': 'ｨ',
      'イ': 'ｲ',
      'ゥ': 'ｩ',
      'ウ': 'ｳ',
      'ェ': 'ｪ',
      'エ': 'ｴ',
      'ォ': 'ｫ',
      'オ': 'ｵ',
      'カ': 'ｶ',
      'キ': 'ｷ',
      'ク': 'ｸ',
      'ケ': 'ｹ',
      'コ': 'ｺ',
      'サ': 'ｻ',
      'シ': 'ｼ',
      'ス': 'ｽ',
      'セ': 'ｾ',
      'ソ': 'ｿ',
      'タ': 'ﾀ',
      'チ': 'ﾁ',
      'ッ': 'ｯ',
      'ツ': 'ﾂ',
      'テ': 'ﾃ',
      'ト': 'ﾄ',
      'ナ': 'ﾅ',
      'ニ': 'ﾆ',
      'ヌ': 'ﾇ',
      'ネ': 'ﾈ',
      'ノ': 'ﾉ',
      'ハ': 'ﾊ',
      'ヒ': 'ﾋ',
      'フ': 'ﾌ',
      'ヘ': 'ﾍ',
      'ホ': 'ﾎ',
      'マ': 'ﾏ',
      'ミ': 'ﾐ',
      'ム': 'ﾑ',
      'メ': 'ﾒ',
      'モ': 'ﾓ',
      'ャ': 'ｬ',
      'ヤ': 'ﾔ',
      'ュ': 'ｭ',
      'ユ': 'ﾕ',
      'ョ': 'ｮ',
      'ヨ': 'ﾖ',
      'ラ': 'ﾗ',
      'リ': 'ﾘ',
      'ル': 'ﾙ',
      'レ': 'ﾚ',
      'ロ': 'ﾛ',
      'ワ': 'ﾜ',
      'ヲ': 'ｦ',
      'ン': 'ﾝ',
    },
  },

  halfwidthToFullwidth: {},
};

conversionTables.fullwidthToHalfwidth.punctuation = merge(
  conversionTables.fullwidthToHalfwidth.symbol,
  conversionTables.fullwidthToHalfwidth.purePunctuation,
);

// Fill in the conversion tables with the flipped tables.
conversionTables.halfwidthToFullwidth.alphabet =
  flip(conversionTables.fullwidthToHalfwidth.alphabet);
conversionTables.halfwidthToFullwidth.numbers =
  flip(conversionTables.fullwidthToHalfwidth.numbers);
conversionTables.halfwidthToFullwidth.symbol =
  flip(conversionTables.fullwidthToHalfwidth.symbol);
conversionTables.halfwidthToFullwidth.purePunctuation =
  flip(conversionTables.fullwidthToHalfwidth.purePunctuation);
conversionTables.halfwidthToFullwidth.punctuation =
  flip(conversionTables.fullwidthToHalfwidth.punctuation);
conversionTables.halfwidthToFullwidth.katakana =
  flip(conversionTables.fullwidthToHalfwidth.katakana);

// Build the normalization table.
conversionTables.normalize = merge(
  conversionTables.fullwidthToHalfwidth.alphabet,
  conversionTables.fullwidthToHalfwidth.numbers,
  conversionTables.fullwidthToHalfwidth.symbol,
  conversionTables.halfwidthToFullwidth.purePunctuation,
  conversionTables.halfwidthToFullwidth.katakana,
);


const fixCompositeSymbolsTable = {
  '㋀': '1月',
  '㋁': '2月',
  '㋂': '3月',
  '㋃': '4月',
  '㋄': '5月',
  '㋅': '6月',
  '㋆': '7月',
  '㋇': '8月',
  '㋈': '9月',
  '㋉': '10月',
  '㋊': '11月',
  '㋋': '12月',

  '㏠': '1日',
  '㏡': '2日',
  '㏢': '3日',
  '㏣': '4日',
  '㏤': '5日',
  '㏥': '6日',
  '㏦': '7日',
  '㏧': '8日',
  '㏨': '9日',
  '㏩': '10日',
  '㏪': '11日',
  '㏫': '12日',
  '㏬': '13日',
  '㏭': '14日',
  '㏮': '15日',
  '㏯': '16日',
  '㏰': '17日',
  '㏱': '18日',
  '㏲': '19日',
  '㏳': '20日',
  '㏴': '21日',
  '㏵': '22日',
  '㏶': '23日',
  '㏷': '24日',
  '㏸': '25日',
  '㏹': '26日',
  '㏺': '27日',
  '㏻': '28日',
  '㏼': '29日',
  '㏽': '30日',
  '㏾': '31日',

  '㍘': '0点',
  '㍙': '1点',
  '㍚': '2点',
  '㍛': '3点',
  '㍜': '4点',
  '㍝': '5点',
  '㍞': '6点',
  '㍟': '7点',
  '㍠': '8点',
  '㍡': '9点',
  '㍢': '10点',
  '㍣': '11点',
  '㍤': '12点',
  '㍥': '13点',
  '㍦': '14点',
  '㍧': '15点',
  '㍨': '16点',
  '㍩': '17点',
  '㍪': '18点',
  '㍫': '19点',
  '㍬': '20点',
  '㍭': '21点',
  '㍮': '22点',
  '㍯': '23点',
  '㍰': '24点',

  '㍻': '平成',
  '㍼': '昭和',
  '㍽': '大正',
  '㍾': '明治',
  '㍿': '株式会社',

  '㌀': 'アパート',
  '㌁': 'アルファ',
  '㌂': 'アンペア',
  '㌃': 'アール',
  '㌄': 'イニング',
  '㌅': 'インチ',
  '㌆': 'ウオン',
  '㌇': 'エスクード',
  '㌈': 'エーカー',
  '㌉': 'オンス',
  '㌊': 'オーム',
  '㌋': 'カイリ',
  '㌌': 'カラット',
  '㌍': 'カロリー',
  '㌎': 'ガロン',
  '㌏': 'ガンマ',
  '㌐': 'ギガ',
  '㌑': 'ギニー',
  '㌒': 'キュリー',
  '㌓': 'ギルダー',
  '㌔': 'キロ',
  '㌕': 'キログラム',
  '㌖': 'キロメートル',
  '㌗': 'キロワット',
  '㌘': 'グラム',
  '㌙': 'グラムトン',
  '㌚': 'クルゼイロ',
  '㌛': 'クローネ',
  '㌜': 'ケース',
  '㌝': 'コルナ',
  '㌞': 'コーポ',
  '㌟': 'サイクル',
  '㌠': 'サンチーム',
  '㌡': 'シリング',
  '㌢': 'センチ',
  '㌣': 'セント',
  '㌤': 'ダース',
  '㌥': 'デシ',
  '㌦': 'ドル',
  '㌧': 'トン',
  '㌨': 'ナノ',
  '㌩': 'ノット',
  '㌪': 'ハイツ',
  '㌫': 'パーセント',
  '㌬': 'パーツ',
  '㌭': 'バーレル',
  '㌮': 'ピアストル',
  '㌯': 'ピクル',
  '㌰': 'ピコ',
  '㌱': 'ビル',
  '㌲': 'ファラッド',
  '㌳': 'フィート',
  '㌴': 'ブッシェル',
  '㌵': 'フラン',
  '㌶': 'ヘクタール',
  '㌷': 'ペソ',
  '㌸': 'ペニヒ',
  '㌹': 'ヘルツ',
  '㌺': 'ペンス',
  '㌻': 'ページ',
  '㌼': 'ベータ',
  '㌽': 'ポイント',
  '㌾': 'ボルト',
  '㌿': 'ホン',
  '㍀': 'ポンド',
  '㍁': 'ホール',
  '㍂': 'ホーン',
  '㍃': 'マイクロ',
  '㍄': 'マイル',
  '㍅': 'マッハ',
  '㍆': 'マルク',
  '㍇': 'マンション',
  '㍈': 'ミクロン',
  '㍉': 'ミリ',
  '㍊': 'ミリバール',
  '㍋': 'メガ',
  '㍌': 'メガトン',
  '㍍': 'メートル',
  '㍎': 'ヤード',
  '㍏': 'ヤール',
  '㍐': 'ユアン',
  '㍑': 'リットル',
  '㍒': 'リラ',
  '㍓': 'ルピー',
  '㍔': 'ルーブル',
  '㍕': 'レム',
  '㍖': 'レントゲン',
  '㍗': 'ワット',
};

const fixCompositeSymbols = replacer(fixCompositeSymbolsTable);

const converters = {
  fullwidthToHalfwidth: {
    alphabet: replacer(conversionTables.fullwidthToHalfwidth.alphabet),
    numbers: replacer(conversionTables.fullwidthToHalfwidth.numbers),
    symbol: replacer(conversionTables.fullwidthToHalfwidth.symbol),
    purePunctuation: replacer(conversionTables.fullwidthToHalfwidth.purePunctuation),
    punctuation: replacer(conversionTables.fullwidthToHalfwidth.punctuation),
    katakana: replacer(conversionTables.fullwidthToHalfwidth.katakana),
  },

  halfwidthToFullwidth: {
    alphabet: replacer(conversionTables.halfwidthToFullwidth.alphabet),
    numbers: replacer(conversionTables.halfwidthToFullwidth.numbers),
    symbol: replacer(conversionTables.halfwidthToFullwidth.symbol),
    purePunctuation: replacer(conversionTables.halfwidthToFullwidth.purePunctuation),
    punctuation: replacer(conversionTables.halfwidthToFullwidth.punctuation),
    katakana: replacer(conversionTables.halfwidthToFullwidth.katakana),
  },

  fixFullwidthKana: replacer(fixFullwidthKana),
  normalize: replacer(conversionTables.normalize),
};


class TokenizerJa extends Tokenizer {
  constructor(settings) {
    super(settings);
    this.chartype = [
      [/[〇一二三四五六七八九十百千万億兆]/, 'M'],
      [/[一-鿌〆]/, 'H'],
      [/[ぁ-ゟ]/, 'I'],
      [/[゠-ヿ]/, 'K'],
      [/[a-zA-Z]/, 'A'],
      [/[0-9]/, 'N'],
    ];
    this.bias = -332;
  }

  ctype(str) {
    for (let i = 0, l = this.chartype.length; i < l; i += 1) {
      if (str.match(this.chartype[i][0])) {
        return this.chartype[i][1];
      }
    }
    return 'O';
  }

  ts(v) {
    return v || 0;
  }

  removePuncTokens(tokens) {
    return tokens
      .map(token => token.replace(/[＿－・，、；：！？．。（）［］｛｝｢｣＠＊＼／＆＃％｀＾＋＜＝＞｜～≪≫─＄＂_\-･,､;:!?.｡()[\]{}「」@*/&#%`^+<=>|~«»$"\s]+/g, ''))
      .filter(token => token !== '');
  }

  normalize(srcString) {
    let str = srcString.replace(/(..)々々/g, '$1$1').replace(/(.)々/g, '$1$1');
    str = converters.normalize(str);
    str = converters.fixFullwidthKana(str);
    str = fixCompositeSymbols(str);
    return str;
  }

  tokenize(srcText) {
    if (!srcText || srcText === '') {
      return [];
    }
    const text = this.normalize(srcText);
    const result = [];
    const seg = ['B3', 'B2', 'B1'];
    const ctype = ['O', 'O', 'O'];
    const o = text.split('');
    for (let i = 0, l = o.length; i < l; i += 1) {
      seg.push(o[i]);
      ctype.push(this.ctype(o[i]));
    }
    seg.push('E1');
    seg.push('E2');
    seg.push('E3');
    ctype.push('O');
    ctype.push('O');
    ctype.push('O');
    let word = seg[3];
    let p1 = 'U';
    let p2 = 'U';
    let p3 = 'U';
    for (let i = 4, l = seg.length - 3; i < l; i += 1) {
      let score = this.bias;
      const w1 = seg[i - 3];
      const w2 = seg[i - 2];
      const w3 = seg[i - 1];
      const w4 = seg[i];
      const w5 = seg[i + 1];
      const w6 = seg[i + 2];
      const c1 = ctype[i - 3];
      const c2 = ctype[i - 2];
      const c3 = ctype[i - 1];
      const c4 = ctype[i];
      const c5 = ctype[i + 1];
      const c6 = ctype[i + 2];
      score += this.ts(JapaneseRules.UP1[p1]);
      score += this.ts(JapaneseRules.UP2[p2]);
      score += this.ts(JapaneseRules.UP3[p3]);
      score += this.ts(JapaneseRules.BP1[p1 + p2]);
      score += this.ts(JapaneseRules.BP2[p2 + p3]);
      score += this.ts(JapaneseRules.UW1[w1]);
      score += this.ts(JapaneseRules.UW2[w2]);
      score += this.ts(JapaneseRules.UW3[w3]);
      score += this.ts(JapaneseRules.UW4[w4]);
      score += this.ts(JapaneseRules.UW5[w5]);
      score += this.ts(JapaneseRules.UW6[w6]);
      score += this.ts(JapaneseRules.BW1[w2 + w3]);
      score += this.ts(JapaneseRules.BW2[w3 + w4]);
      score += this.ts(JapaneseRules.BW3[w4 + w5]);
      score += this.ts(JapaneseRules.TW1[w1 + w2 + w3]);
      score += this.ts(JapaneseRules.TW2[w2 + w3 + w4]);
      score += this.ts(JapaneseRules.TW3[w3 + w4 + w5]);
      score += this.ts(JapaneseRules.TW4[w4 + w5 + w6]);
      score += this.ts(JapaneseRules.UC1[c1]);
      score += this.ts(JapaneseRules.UC2[c2]);
      score += this.ts(JapaneseRules.UC3[c3]);
      score += this.ts(JapaneseRules.UC4[c4]);
      score += this.ts(JapaneseRules.UC5[c5]);
      score += this.ts(JapaneseRules.UC6[c6]);
      score += this.ts(JapaneseRules.BC1[c2 + c3]);
      score += this.ts(JapaneseRules.BC2[c3 + c4]);
      score += this.ts(JapaneseRules.BC3[c4 + c5]);
      score += this.ts(JapaneseRules.TC1[c1 + c2 + c3]);
      score += this.ts(JapaneseRules.TC2[c2 + c3 + c4]);
      score += this.ts(JapaneseRules.TC3[c3 + c4 + c5]);
      score += this.ts(JapaneseRules.TC4[c4 + c5 + c6]);
      score += this.ts(JapaneseRules.UQ1[p1 + c1]);
      score += this.ts(JapaneseRules.UQ2[p2 + c2]);
      score += this.ts(JapaneseRules.UQ3[p3 + c3]);
      score += this.ts(JapaneseRules.BQ1[p2 + c2 + c3]);
      score += this.ts(JapaneseRules.BQ2[p2 + c3 + c4]);
      score += this.ts(JapaneseRules.BQ3[p3 + c2 + c3]);
      score += this.ts(JapaneseRules.BQ4[p3 + c3 + c4]);
      score += this.ts(JapaneseRules.TQ1[p2 + c1 + c2 + c3]);
      score += this.ts(JapaneseRules.TQ2[p2 + c2 + c3 + c4]);
      score += this.ts(JapaneseRules.TQ3[p3 + c1 + c2 + c3]);
      score += this.ts(JapaneseRules.TQ4[p3 + c2 + c3 + c4]);
      let p = 'O';
      if (score > 0) {
        result.push(word);
        word = '';
        p = 'B';
      }
      p1 = p2;
      p2 = p3;
      p3 = p;
      word += seg[i];
    }
    result.push(word);
    return this.removePuncTokens(result);
  }
}

module.exports = TokenizerJa;

