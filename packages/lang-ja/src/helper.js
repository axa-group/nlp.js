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

function replacer(translationTable) {
  const pattern = [];
  const keys = Object.keys(translationTable);
  keys.forEach((key) => {
    // eslint-disable-next-line
    pattern.push(`${key}`.replace(/([-()\[\]{}+?*.$\^|,:#<!\\\/])/g, '\\$1').replace(/\x08/g, '\\x08'));
  });
  const regExp = new RegExp(pattern.join('|'), 'g');
  return (str) => str.replace(regExp, (s) => translationTable[s]);
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
  っな: 'んな',
  っに: 'んに',
  っぬ: 'んぬ',
  っね: 'んね',
  っの: 'んの',
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
  ッナ: 'ンナ',
  ッニ: 'ンニ',
  ッヌ: 'ンヌ',
  ッネ: 'ンネ',
  ッノ: 'ンノ',
};

const conversionTables = {
  fullwidthToHalfwidth: {
    alphabet: {
      ａ: 'a',
      ｂ: 'b',
      ｃ: 'c',
      ｄ: 'd',
      ｅ: 'e',
      ｆ: 'f',
      ｇ: 'g',
      ｈ: 'h',
      ｉ: 'i',
      ｊ: 'j',
      ｋ: 'k',
      ｌ: 'l',
      ｍ: 'm',
      ｎ: 'n',
      ｏ: 'o',
      ｐ: 'p',
      ｑ: 'q',
      ｒ: 'r',
      ｓ: 's',
      ｔ: 't',
      ｕ: 'u',
      ｖ: 'v',
      ｗ: 'w',
      ｘ: 'x',
      ｙ: 'y',
      ｚ: 'z',
      Ａ: 'A',
      Ｂ: 'B',
      Ｃ: 'C',
      Ｄ: 'D',
      Ｅ: 'E',
      Ｆ: 'F',
      Ｇ: 'G',
      Ｈ: 'H',
      Ｉ: 'I',
      Ｊ: 'J',
      Ｋ: 'K',
      Ｌ: 'L',
      Ｍ: 'M',
      Ｎ: 'N',
      Ｏ: 'O',
      Ｐ: 'P',
      Ｑ: 'Q',
      Ｒ: 'R',
      Ｓ: 'S',
      Ｔ: 'T',
      Ｕ: 'U',
      Ｖ: 'V',
      Ｗ: 'W',
      Ｘ: 'X',
      Ｙ: 'Y',
      Ｚ: 'Z',
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
      ー: 'ｰ',
      ヴ: 'ｳﾞ',
      ガ: 'ｶﾞ',
      ギ: 'ｷﾞ',
      グ: 'ｸﾞ',
      ゲ: 'ｹﾞ',
      ゴ: 'ｺﾞ',
      ザ: 'ｻﾞ',
      ジ: 'ｼﾞ',
      ズ: 'ｽﾞ',
      ゼ: 'ｾﾞ',
      ゾ: 'ｿﾞ',
      ダ: 'ﾀﾞ',
      ヂ: 'ﾁﾞ',
      ヅ: 'ﾂﾞ',
      デ: 'ﾃﾞ',
      ド: 'ﾄﾞ',
      バ: 'ﾊﾞ',
      パ: 'ﾊﾟ',
      ビ: 'ﾋﾞ',
      ピ: 'ﾋﾟ',
      ブ: 'ﾌﾞ',
      プ: 'ﾌﾟ',
      ベ: 'ﾍﾞ',
      ペ: 'ﾍﾟ',
      ボ: 'ﾎﾞ',
      ポ: 'ﾎﾟ',
      ァ: 'ｧ',
      ア: 'ｱ',
      ィ: 'ｨ',
      イ: 'ｲ',
      ゥ: 'ｩ',
      ウ: 'ｳ',
      ェ: 'ｪ',
      エ: 'ｴ',
      ォ: 'ｫ',
      オ: 'ｵ',
      カ: 'ｶ',
      キ: 'ｷ',
      ク: 'ｸ',
      ケ: 'ｹ',
      コ: 'ｺ',
      サ: 'ｻ',
      シ: 'ｼ',
      ス: 'ｽ',
      セ: 'ｾ',
      ソ: 'ｿ',
      タ: 'ﾀ',
      チ: 'ﾁ',
      ッ: 'ｯ',
      ツ: 'ﾂ',
      テ: 'ﾃ',
      ト: 'ﾄ',
      ナ: 'ﾅ',
      ニ: 'ﾆ',
      ヌ: 'ﾇ',
      ネ: 'ﾈ',
      ノ: 'ﾉ',
      ハ: 'ﾊ',
      ヒ: 'ﾋ',
      フ: 'ﾌ',
      ヘ: 'ﾍ',
      ホ: 'ﾎ',
      マ: 'ﾏ',
      ミ: 'ﾐ',
      ム: 'ﾑ',
      メ: 'ﾒ',
      モ: 'ﾓ',
      ャ: 'ｬ',
      ヤ: 'ﾔ',
      ュ: 'ｭ',
      ユ: 'ﾕ',
      ョ: 'ｮ',
      ヨ: 'ﾖ',
      ラ: 'ﾗ',
      リ: 'ﾘ',
      ル: 'ﾙ',
      レ: 'ﾚ',
      ロ: 'ﾛ',
      ワ: 'ﾜ',
      ヲ: 'ｦ',
      ン: 'ﾝ',
    },
  },

  halfwidthToFullwidth: {},
};

conversionTables.fullwidthToHalfwidth.punctuation = merge(
  conversionTables.fullwidthToHalfwidth.symbol,
  conversionTables.fullwidthToHalfwidth.purePunctuation
);

// Fill in the conversion tables with the flipped tables.
conversionTables.halfwidthToFullwidth.alphabet = flip(
  conversionTables.fullwidthToHalfwidth.alphabet
);
conversionTables.halfwidthToFullwidth.numbers = flip(
  conversionTables.fullwidthToHalfwidth.numbers
);
conversionTables.halfwidthToFullwidth.symbol = flip(
  conversionTables.fullwidthToHalfwidth.symbol
);
conversionTables.halfwidthToFullwidth.purePunctuation = flip(
  conversionTables.fullwidthToHalfwidth.purePunctuation
);
conversionTables.halfwidthToFullwidth.punctuation = flip(
  conversionTables.fullwidthToHalfwidth.punctuation
);
conversionTables.halfwidthToFullwidth.katakana = flip(
  conversionTables.fullwidthToHalfwidth.katakana
);

// Build the normalization table.
conversionTables.normalize = merge(
  conversionTables.fullwidthToHalfwidth.alphabet,
  conversionTables.fullwidthToHalfwidth.numbers,
  conversionTables.fullwidthToHalfwidth.symbol,
  conversionTables.halfwidthToFullwidth.purePunctuation,
  conversionTables.halfwidthToFullwidth.katakana
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
    purePunctuation: replacer(
      conversionTables.fullwidthToHalfwidth.purePunctuation
    ),
    punctuation: replacer(conversionTables.fullwidthToHalfwidth.punctuation),
    katakana: replacer(conversionTables.fullwidthToHalfwidth.katakana),
  },

  halfwidthToFullwidth: {
    alphabet: replacer(conversionTables.halfwidthToFullwidth.alphabet),
    numbers: replacer(conversionTables.halfwidthToFullwidth.numbers),
    symbol: replacer(conversionTables.halfwidthToFullwidth.symbol),
    purePunctuation: replacer(
      conversionTables.halfwidthToFullwidth.purePunctuation
    ),
    punctuation: replacer(conversionTables.halfwidthToFullwidth.punctuation),
    katakana: replacer(conversionTables.halfwidthToFullwidth.katakana),
  },

  fixFullwidthKana: replacer(fixFullwidthKana),
  normalize: replacer(conversionTables.normalize),
};

module.exports = {
  fixCompositeSymbols,
  converters,
};
