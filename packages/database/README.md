# `@nlpjs/database`

## Introduction

This package contains the Database plugin for nlp.js, and the default adapter for Memory Database.

Basically, this is a database component where you can register adapaters and collections.
- An adapter is a class to talk with one database engine, by default the adapter is Memory Database that uses JSON structures to emulate a database, and even can be set to persists those JSON into file system.
- A collection is a named table in the database, and each collection can be set up to have an adapter. That means that you can set the database to use different database engines for different collections.

## Basic Usage with Dock

```javascript
const { dockStart } = require('@nlpjs/basic');
const { Database } = require('@nlpjs/database');

(async () => {
  const dock = await dockStart();
  dock.getContainer().use(Database);
  const database = dock.get('database');
  await database.connect();
  const collection = database.getCollection('items');
  const items = [];
  for (let i = 0; i < 100; i += 1) {
    const item = { num: i, mod: i % 10 };
    items.push(item);
  }
  await collection.insertMany(items);
  const actual = await collection.find({ mod: 3 });
  await database.disconnect();
  console.log(actual);
})();
```

## Contributing

You can read the guide of how to contribute at [Contributing](CONTRIBUTING.md).

## Contributors

[![Contributors](https://contributors-img.firebaseapp.com/image?repo=axa-group/nlp.js)](https://github.com/axa-group/nlp.js/graphs/contributors)

Made with [contributors-img](https://contributors-img.firebaseapp.com).

## Code of Conduct

You can read the Code of Conduct at [Code of Conduct](CODE_OF_CONDUCT.md).

## Who is behind it`?`

This project is developed by AXA Group Operations Spain S.A.

If you need to contact us, you can do it at the email jesus.seijas@axa.com

## License

Copyright (c) AXA Group Operations Spain S.A.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
