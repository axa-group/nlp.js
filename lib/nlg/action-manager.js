/*
 * Copyright (c) AXA Shared Services Spain S.A.
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

/**
 * Action Manager.
 * It stores the actions that should be executed for a given intent.
 */
class ActionManager {
  /**
   * Constructor of the class
   */
  constructor() {
    this.actions = {};
  }

  /**
   * Find the index of an action
   * @param {String} intent Name of the intent.
   * @param {String} action Name of the action.
   * @param {String} parameters Parameters of the action.
   */
  posAction(intent, action, parameters) {
    if (!this.actions[intent]) {
      return -1;
    }
    const actions = this.actions[intent];
    for (let i = 0; i < actions.length; i += 1) {
      if (
        actions[i].action === action &&
        actions[i].parameters === parameters
      ) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Return an array of actions for the intent.
   * @param {String} intent Name of the intent.
   * @returns {Object[]} Actions for this intent.
   */
  findActions(intent) {
    return this.actions[intent] || [];
  }

  /**
   * Add an action to a given intent.
   * @param {String} intent Name of the intent.
   * @param {String} action Action to be executed
   * @param {String} parameters Parameters of the action
   */
  addAction(intent, action, parameters) {
    if (this.posAction(intent, action, parameters) === -1) {
      if (!this.actions[intent]) {
        this.actions[intent] = [];
      }
      this.actions[intent].push({ action, parameters });
    }
  }

  /**
   * Remove an action.
   * @param {String} intent Name of the intent
   * @param {String} action Name of the action
   * @param {String} parameters Parameters of the action.
   */
  removeAction(intent, action, parameters) {
    const index = this.posAction(intent, action, parameters);
    if (index > -1) {
      this.actions[intent].splice(index, 1);
    }
  }

  /**
   * Remove all the actions of a given intent.
   * @param {String} intent Name of the intent.
   */
  removeActions(intent) {
    delete this.actions[intent];
  }
}

module.exports = ActionManager;
