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

class Bench {
  constructor(settings = {}) {
    this.duration = settings.duration || 60000;
    this.transactionsPerRun = settings.transactionsPerRun || 1;
    this.algorithms = [];
  }

  add(name, fn, initfn) {
    const algorithm = {
      name,
      fn,
      initfn: initfn || (() => {}),
    };
    this.algorithms.push(algorithm);
  }

  getElapsed(hrstart) {
    const hrend = process.hrtime(hrstart);
    return hrend[0] * 1000 + hrend[1] / 1000000;
  }

  measure(algorithm) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const initValue = await algorithm.initfn();
      const hrstart = process.hrtime();
      let runs = 0;
      let elapsed = 0;
      while (elapsed < this.duration) {
        await algorithm.fn(initValue);
        runs += 1;
        elapsed = this.getElapsed(hrstart);
      }
      const transactions = runs * this.transactionsPerRun;
      const timePerRun = elapsed / runs;
      const timePerTransaction = elapsed / transactions;
      const result = {
        name: algorithm.name,
        runs,
        transactions,
        elapsed,
        timePerRun,
        timePerTransaction,
        runsPerSecond: 1000 / timePerRun,
        transactionsPerSecond: 1000 / timePerTransaction,
      };
      resolve(result);
    });
  }

  async run() {
    const result = [];
    for (let i = 0; i < this.algorithms.length; i += 1) {
      const value = await this.measure(this.algorithms[i]);
      result.push(value);
    }
    return result.sort(
      (a, b) => b.transactionsPerSecond - a.transactionsPerSecond
    );
  }
}

module.exports = Bench;
