# @nlpjs/emoji

## Introduction

@nlpjs/emoji is the package that adds the function _removeEmojis_ which replaces emojis with their text equivalents.

## Installing

_removeEmojis_ is a function in the package _@nlpjs/emoji_, which you can install via NPM:

```bash
  npm install @nlpjs/emoji
```

## Example of use

```javascript
const { removeEmojis } = require('@nlpjs/emoji');

const actual = removeEmojis('I ❤️  ☕️! -  😯⭐️😍  ::: test : : 👍+');
console.log(actual);
// I :heart:  :coffee:! -  :hushed::star::heart_eyes:  ::: test : : :thumbsup:+
```
