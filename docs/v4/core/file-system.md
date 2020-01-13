# File System

## Introduction

To be able to work with files, a File System should be defined. A file system should include these methods:
- readFile(fileName): returns a promise to read the file.
- readFileSync(fileName): synchronous method to read a file.
- writeFile(fileName, data, format): returns a promise to write the data into the file.
- existsSync(fileName): synchronous method to check if a file exists.
- lstatSync(fileName): synchronous method to get the stats of a file, used to check if a path is a directory or a file.

By default, a mock file system plugin is mounted.

## Mock File System

Is the default plugin mounted at the core.
- readFile: returns a Promise that resolve to undefined.
- writeFile: returns a Promise that resolve to an Error.
- existsSync: returns false
- lstatSync: returns undefined
- readFileSync: returns undefined

## Request File System

This is the plugin mounted by the core-loader, as it's the one that fits the use at backend. It allows to read files from the OS or if you provide an URL will load them using a request.
This plugin is automatically mounted when you use @nlpjs/core-loader.
If you want to use this plugin by your own, then install it with:
```bash
npm i @nlpjs/request
```

And to use the plugin in your container, register it:
```javascript
const { Container } = require('@nlpjs/core');
const { fs: requestfs } = require('@nlpjs/request');


async function main() {
  const container = new Container();
  container.register('fs', requestfs);
  const fs = container.get('fs');
  const readme = await fs.readFile('https://raw.githubusercontent.com/axa-group/nlp.js/master/README.md');
  console.log(readme); // will return the content of the README.md
}

main();
```

If the resolved data form the URL is a valid JSON object, then will be returned as an object, otherwise the string with the content will be returned.

Also you can load files from the file system:

```javascript
const { Container } = require('@nlpjs/core');
const { fs: requestfs } = require('@nlpjs/request');


async function main() {
  const container = new Container();
  container.register('fs', requestfs);
  const fs = container.get('fs');
  const readme = await fs.readFile('./index.js');
  console.log(readme); // will return the content of the index.js file
}

main();
```

## Request RN File System

This is the file system for Web and React Native, where no OS file system can be accesed, but we still can load from URLs.
If you want to use this plugin by your own, then install it with:

```bash
npm i @nlpjs/request-rn
```

And to use the plugin in your container, register it:
```javascript
const { Container } = require('@nlpjs/core');
const { fs: requestfs } = require('@nlpjs/request-rn');


async function main() {
  const container = new Container();
  container.register('fs', requestfs);
  const fs = container.get('fs');
  const readme = await fs.readFile('https://raw.githubusercontent.com/axa-group/nlp.js/master/README.md');
  console.log(readme); // will return the content of the README.md
}

main();
```
