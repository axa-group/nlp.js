const CollectionMock = require('./collection-mock');

class MongoClientMock {
  constructor() {
    this.collections = {};
  }

  connect(cb) {
    cb(undefined, this);
  }

  close() {}

  db() {
    return this;
  }

  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new CollectionMock();
    }
    return this.collections[name];
  }
}

module.exports = MongoClientMock;
