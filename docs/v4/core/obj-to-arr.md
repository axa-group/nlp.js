# ObjToArr

This is a plugin to transform an hashmap object to an array of strings where each string is a key of the hashmap.

## Use without container

You can use it directly without container system:

```javascript
const { ObjToArr } = require('@nlpjs/core');

const obj = { the: 1, water: 1, pot: 1 }
const arr = ObjToArr.objToArr(obj);
console.log(tokens); // ['the', 'water', 'pot']
```

## Use with container

Used with container the plugin is defined as input.tokens: string[] -> input.tokens: object. Example of use:

```javascript
const { ObjToArr, Container } = require('@nlpjs/core');

const input = {
  tokens: { the: 1, water: 1, pot: 1 } 
} 
const container = new Container();
container.use(ObjToArr);
const obj = container.get('objToArr').run(input);
console.log(obj); // { tokens: ['the', 'water', 'pot'] }
```

## Use with bootstrapped container

The container bootstrap already includes this plugin, so you don't need to require the plugin neither to register it into the container:

```javascript
const { containerBootstrap } = require('@nlpjs/core');

const input = {
  tokens: { the: 1, water: 1, pot: 1 } 
} 
const container = containerBootstrap();
const obj = container.get('objToArr').run(input);
console.log(obj); // { tokens: ['the', 'water', 'pot'] }
```