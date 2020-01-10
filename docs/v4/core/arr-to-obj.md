# ArrToObj

This is a plugin to transform an array of strings into a hashmap where the keys are the different strings in the array and the values are 1.
This plugin is used internally by the NLU to convert the array of stems to a hashmap when doing the utterance preparation process.

## Use without container

You can use it directly without container system:

```javascript
const { ArrToObj } = require('@nlpjs/core');

const arr = ['the', 'water', 'the', 'pot'];
const obj = ArrToObj.arrToObj(arr);
console.log(obj); // { the: 1, water: 1, pot: 1 }
```

## Use with container

Used with container the plugin is defined as input.tokens: string[] -> input.tokens: object. Example of use:

```javascript
const { ArrToObj, Container } = require('@nlpjs/core');

const input = {
  tokens: ['the', 'water', 'the', 'pot'] 
} 
const container = new Container();
container.use(ArrToObj);
const obj = container.get('arrToObj').run(input);
console.log(obj); // { tokens: { the: 1, water: 1, pot: 1 } }
```

## Use with bootstrapped container

The container bootstrap already includes this plugin, so you don't need to require the plugin neither to register it into the container:

```javascript
const { containerBootstrap } = require('@nlpjs/core');

const input = {
  tokens: ['the', 'water', 'the', 'pot'] 
} 
const container = containerBootstrap();
const obj = container.get('arrToObj').run(input);
console.log(obj); // { tokens: { the: 1, water: 1, pot: 1 } }
```