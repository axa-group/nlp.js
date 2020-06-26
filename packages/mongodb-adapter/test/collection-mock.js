const { ObjectId } = require('mongodb');

const idField = '_id';

class CollectionMock {
  constructor() {
    this.items = {};
  }

  insertOne(item, cb) {
    item[idField] = new ObjectId();
    this.items[item[idField]] = item;
    cb(undefined, { ops: [item] });
  }

  insertMany(items, cb) {
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      item[idField] = new ObjectId();
      this.items[item[idField]] = item;
    }
    cb(undefined, items);
  }

  find() {
    return {
      toArray: (cb) => {
        cb(undefined, Object.values(this.items));
      },
    };
  }

  findOne(condition, cb) {
    const id = condition[idField];
    if (id) {
      return cb(undefined, this.items[id]);
    }
    return cb(undefined, Object.values(this.items)[0]);
  }

  updateOne(condition, values, cb) {
    const id = condition[idField];
    if (id) {
      const item = values.$set;
      item[idField] = id;
      this.items[id] = item;
      return cb(undefined, item);
    }
    return cb('Id not found');
  }
}

module.exports = CollectionMock;
