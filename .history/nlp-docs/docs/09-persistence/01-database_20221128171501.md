# `@nlpjs/database`

## Introduction

This package contains the Database plugin for nlp.js, and the default adapter for Memory Database.

Basically, this is a database component where you can register adapaters and collections.

- An adapter is a class to talk with one database engine, by default the adapter is Memory Database that uses JSON structures to emulate a database, and even can be set to persists those JSON into file system.
- A collection is a named table in the database, and each collection can be set up to have an adapter. That means that you can set the database to use different database engines for different collections.

## Basic Usage with Dock

```javascript
const { dockStart } = require("@nlpjs/basic");
const { Database } = require("@nlpjs/database");

(async () => {
  const dock = await dockStart();
  dock.getContainer().use(Database);
  const database = dock.get("database");
  await database.connect();
  const collection = database.getCollection("items");
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
