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

const { TranslateZh } = require('../src');

describe('Translate Chinese', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const translate = new TranslateZh();
      expect(translate).toBeDefined();
    });
  });

  describe('identify', () => {
    test('It should identify traditional', () => {
      const translate = new TranslateZh();
      const inputs = ['這是一些將顯示的文本', '歡迎來到應用程序'];
      for (let i = 0; i < inputs.length; i += 1) {
        const input = inputs[i];
        const token = translate.identify(input);
        expect(token.dialect).toEqual('traditional');
        expect(token.variant).toEqual('none');
      }
    });

    test('It should identify traditional from hong kong', () => {
      const translate = new TranslateZh();
      const inputs = [
        '另一方面，我們以正義的憤慨和不喜歡那些被那些因為慾望而蒙蔽的那一刻的快樂魅力所迷惑和挫敗的人，他們不能預見到隨之而來的痛苦和麻煩; 和同樣的責任屬於那些通過意志薄弱而失敗的人，這與通過勉強和痛苦的說法是一樣的。 這些情況是非常簡單和容易區分。 在一個自由的時間，當我們的選擇權力沒有受到限制，沒有什麼能阻止我們能夠做我們最喜歡做的事情，每一個快樂是歡迎，每一個疼痛避免。 但是在某些情況下，由於義務的索賠或商業的義務，經常發生的是，樂趣必須被拒絕和煩惱被接受。 聰明人因此在這些事情上總是堅持這種選擇原則：他拒絕快樂，以確保其他更大的快樂，或者他忍受痛苦，以避免更糟的疼痛',
      ];
      for (let i = 0; i < inputs.length; i += 1) {
        const input = inputs[i];
        const token = translate.identify(input);
        expect(token.dialect).toEqual('traditional');
        expect(token.variant).toEqual('hk');
      }
    });

    test('It should identify simplified', () => {
      const translate = new TranslateZh();
      const inputs = [
        '这是一些将显示的文本',
        '欢迎来到应用程序',
        '另一方面，我们以正义的愤慨和不喜欢那些被那些因为欲望而蒙蔽的那一刻的快乐魅力所迷惑和挫败的人，他们不能预见到随之而来的痛苦和麻烦; 和同样的责任属于那些通过意志薄弱而失败的人，这与通过勉强和痛苦的说法是一样的。 这些情况是非常简单和容易区分。 在一个自由的时间，当我们的选择权力没有受到限制，当没有什么阻止我们能够做我们最喜欢做的事情，每一个快乐是欢迎，每一个疼痛避免。 但是在某些情况下，由于义务的索赔或商业的义务，经常发生的是，乐趣必须被拒绝和烦恼被接受。 聪明人因此在这些事情上总是坚持这种选择原则：他拒绝快乐，以确保其他更大的快乐，或者他忍受痛苦，以避免更糟的疼痛',
      ];
      for (let i = 0; i < inputs.length; i += 1) {
        const input = inputs[i];
        const token = translate.identify(input);
        expect(token.dialect).toEqual('simplified');
        expect(token.variant).toEqual('none');
      }
    });

    test('It should identify none', () => {
      const translate = new TranslateZh();
      const inputs = ['hello world', 'potatoe?'];
      for (let i = 0; i < inputs.length; i += 1) {
        const input = inputs[i];
        const token = translate.identify(input);
        expect(token.dialect).toEqual('none');
        expect(token.variant).toEqual('none');
      }
    });

    test('It should identify both', () => {
      const translate = new TranslateZh();
      const inputs = ['你好！', 'simplified: 国 traditional: 國'];
      for (let i = 0; i < inputs.length; i += 1) {
        const input = inputs[i];
        const token = translate.identify(input);
        expect(token.dialect).toEqual('both');
        expect(token.variant).toEqual('none');
      }
    });
  });

  describe('traditional to simplified', () => {
    test('Should translate traditional to simplified in long sentence', () => {
      const input =
        '犬（學名：Canis lupus familiaris）[1]，現代俗稱為狗，一種常見的犬科哺乳動物，與狼為同一種動物，生物學分類上是狼的一個亞種。狗是人類最早馴養的一個物種。被人養的稱為家犬，返回野外沒人養的狗稱為「野狗」或「流浪狗」，是會造成各種問題的。犬的壽命最多可達二十多年，平均則為十數年，與貓的平均壽命相近。若無發生意外，平均壽命以小型犬為長。';
      const expected =
        '犬（学名：Canis lupus familiaris）[1]，现代俗称为狗，一种常见的犬科哺乳动物，与狼为同一种动物，生物学分类上是狼的一个亚种。狗是人类最早驯养的一个物种。被人养的称为家犬，返回野外没人养的狗称为「野狗」或「流浪狗」，是会造成各种问题的。犬的寿命最多可达二十多年，平均则为十数年，与猫的平均寿命相近。若无发生意外，平均寿命以小型犬为长。';
      const translate = new TranslateZh();
      const actual = translate.traditionalToSimplified(input);
      expect(actual).toEqual(expected);
    });
    test('Should translate traditional to simplified in short sentence', () => {
      const input = '為爲为昰是哪裏哪裡';
      const expected = '为为为昰是哪里哪里';
      const translate = new TranslateZh();
      const actual = translate.traditionalToSimplified(input);
      expect(actual).toEqual(expected);
    });
  });

  describe('Hong Kong to simplified', () => {
    test('hong kong to simplified', () => {
      const inputs = ['虛偽歎息', '潮濕灶台', '沙河涌洶湧的波浪'];
      const expecteds = ['虚伪叹息', '潮湿灶台', '沙河涌汹涌的波浪'];
      const translate = new TranslateZh();
      for (let i = 0; i < inputs.length; i += 1) {
        const input = inputs[i];
        const expected = expecteds[i];
        const actual = translate.hongKongToSimplified(input);
        expect(actual).toEqual(expected);
      }
    });
  });

  describe('Simplified to Hong Kong', () => {
    test('simplified to hong kong', () => {
      const inputs = ['虚伪叹息', '潮湿灶台', '沙河涌汹涌的波浪'];
      const expecteds = ['虛偽歎息', '潮濕灶台', '沙河湧洶湧的波浪'];
      const translate = new TranslateZh();
      for (let i = 0; i < inputs.length; i += 1) {
        const input = inputs[i];
        const expected = expecteds[i];
        const actual = translate.simplifiedToHongKong(input);
        expect(actual).toEqual(expected);
      }
    });
  });

  describe('Simplified to Traditional', () => {
    test('simplified to traditional', () => {
      const inputs = [
        '夸夸其谈 夸父逐日',
        '我干什么不干你事。',
        '太后的头发很干燥。',
        '燕燕于飞，差池其羽。之子于归，远送于野。',
        '请成相，世之殃，愚暗愚暗堕贤良。人主无贤，如瞽无相何伥伥！请布基，慎圣人，愚而自专事不治。主忌苟胜，群臣莫谏必逢灾。',
        '曾经有一份真诚的爱情放在我面前，我没有珍惜，等我失去的时候我才后悔莫及。人事间最痛苦的事莫过于此。如果上天能够给我一个再来一次得机会，我会对那个女孩子说三个字，我爱你。如果非要在这份爱上加个期限，我希望是，一万年。',
        '新的理论被发现了。',
        '鲶鱼和鲇鱼是一种生物。',
        '金胄不是金色的甲胄。',
      ];
      const expecteds = [
        '誇誇其談 夸父逐日',
        '我幹什麼不干你事。',
        '太后的頭髮很乾燥。',
        '燕燕于飛，差池其羽。之子于歸，遠送於野。',
        '請成相，世之殃，愚闇愚闇墮賢良。人主無賢，如瞽無相何倀倀！請布基，慎聖人，愚而自專事不治。主忌苟勝，羣臣莫諫必逢災。',
        '曾經有一份真誠的愛情放在我面前，我沒有珍惜，等我失去的時候我才後悔莫及。人事間最痛苦的事莫過於此。如果上天能夠給我一個再來一次得機會，我會對那個女孩子說三個字，我愛你。如果非要在這份愛上加個期限，我希望是，一萬年。',
        '新的理論被發現了。',
        '鯰魚和鮎魚是一種生物。',
        '金胄不是金色的甲冑。',
      ];
      const translate = new TranslateZh();
      for (let i = 0; i < inputs.length; i += 1) {
        const input = inputs[i];
        const expected = expecteds[i];
        const actual = translate.simplifiedToTraditional(input);
        expect(actual).toEqual(expected);
      }
    });
  });

  describe('Simplified to Taiwan', () => {
    test('simplified to taiwan', () => {
      const inputs = [
        '着装污染虚伪发泄棱柱群众里面',
        '鲶鱼和鲇鱼是一种生物。',
        '鼠标里面的硅二极管坏了，导致光标分辨率降低。',
        '我们在老挝的服务器的硬盘需要使用互联网算法软件解决异步的问题。',
        '为什么你在床里面睡着？',
      ];
      const expecteds = [
        '著裝汙染虛偽發洩稜柱群眾裡面',
        '鯰魚和鯰魚是一種生物。',
        '滑鼠裡面的矽二極體壞了，導致游標解析度降低。',
        '我們在寮國的伺服器的硬碟需要使用網際網路演算法軟體解決非同步的問題。',
        '為什麼你在床裡面睡著？',
      ];
      const translate = new TranslateZh();
      for (let i = 0; i < inputs.length; i += 1) {
        const input = inputs[i];
        const expected = expecteds[i];
        const actual = translate.simplifiedToTaiwan(input);
        expect(actual).toEqual(expected);
      }
    });
  });
  describe('Taiwan to Simplified', () => {
    test('taiwan to simplified', () => {
      const inputs = [
        '著裝著作汙染虛偽發洩稜柱群眾裡面',
        '滑鼠裡面的矽二極體壞了，導致游標解析度降低。',
        '我們在寮國的伺服器的硬碟需要使用網際網路演算法軟體解決非同步的問題。',
        '為什麼你在床裡面睡著？',
      ];
      const expecteds = [
        '着装着作污染虚伪发泄棱柱群众里面',
        '鼠标里面的硅二极管坏了，导致光标分辨率降低。',
        '我们在老挝的服务器的硬盘需要使用互联网算法软件解决异步的问题。',
        '为什麽你在床里面睡着？',
      ];
      const translate = new TranslateZh();
      for (let i = 0; i < inputs.length; i += 1) {
        const input = inputs[i];
        const expected = expecteds[i];
        const actual = translate.taiwanToSimplified(input);
        expect(actual).toEqual(expected);
      }
    });
  });
});
