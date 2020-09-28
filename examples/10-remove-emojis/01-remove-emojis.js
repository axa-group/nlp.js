const { removeEmojis } = require('../../packages/emoji/src');
// const { removeEmojis } = require('@nlpjs/emoji');

const actual = removeEmojis('I ❤️  ☕️! -  😯⭐️😍  ::: test : : 👍+');
console.log(actual);
