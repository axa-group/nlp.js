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

class Collection {
  constructor(db, name) {
    this.db = db;
    this.name = name;
  }

  runOp(...args) {
    return this.db[args[0]](...args.slice(0));
  }

  find(condition) {
    return this.db.find(this.name, condition);
  }

  findOne(condition) {
    return this.db.findOne(this.name, condition);
  }

  findById(id) {
    return this.db.findById(this.name, id);
  }

  insertOne(item) {
    return this.db.insertOne(this.name, item);
  }

  insertMany(items) {
    return this.db.insertMany(this.name, items);
  }

  update(item) {
    return this.db.update(this.name, item);
  }

  save(item) {
    return this.db.save(this.name, item);
  }

  remove(condition, justOne) {
    return this.db.remove(this.name, condition, justOne);
  }

  removeById(id) {
    return this.db.removeById(this.name, id);
  }
}

module.exports = Collection;
