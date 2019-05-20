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

const { ActionManager } = require('../../lib');

describe('Action Manager', () => {
  describe('constructor', () => {
    test('Should create an instance', () => {
      const manager = new ActionManager();
      expect(manager).toBeDefined();
    });
    test('Should initialize properties', () => {
      const manager = new ActionManager();
      expect(manager.actions).toEqual({});
    });
  });

  describe('Add actions', () => {
    test('Should be able to add an action to an intent', () => {
      const manager = new ActionManager();
      manager.addAction('intent1', 'action1', 'parameter1,parameter2');
      expect(manager.actions.intent1).toHaveLength(1);
      expect(manager.actions.intent1[0].action).toEqual('action1');
      expect(manager.actions.intent1[0].parameters).toEqual(
        'parameter1,parameter2'
      );
    });
    test('If the same action is added, then avoid it', () => {
      const manager = new ActionManager();
      manager.addAction('intent1', 'action1', 'parameter1,parameter2');
      manager.addAction('intent1', 'action1', 'parameter1,parameter2');
      expect(manager.actions.intent1).toHaveLength(1);
      expect(manager.actions.intent1[0].action).toEqual('action1');
      expect(manager.actions.intent1[0].parameters).toEqual(
        'parameter1,parameter2'
      );
    });
    test('Should be able to add several actions to an intent', () => {
      const manager = new ActionManager();
      manager.addAction('intent1', 'action1', 'parameter1,parameter2');
      manager.addAction('intent1', 'action2', 'parameter3,parameter4');
      expect(manager.actions.intent1).toHaveLength(2);
      expect(manager.actions.intent1[0].action).toEqual('action1');
      expect(manager.actions.intent1[0].parameters).toEqual(
        'parameter1,parameter2'
      );
      expect(manager.actions.intent1[1].action).toEqual('action2');
      expect(manager.actions.intent1[1].parameters).toEqual(
        'parameter3,parameter4'
      );
    });
    test('Should be able to add several actions to several intents', () => {
      const manager = new ActionManager();
      manager.addAction('intent1', 'action1', 'parameter1,parameter2');
      manager.addAction('intent1', 'action2', 'parameter3,parameter4');
      manager.addAction('intent2', 'action3', 'parameter5,parameter6');
      manager.addAction('intent2', 'action4', 'parameter7,parameter8');
      expect(manager.actions.intent1).toHaveLength(2);
      expect(manager.actions.intent1[0].action).toEqual('action1');
      expect(manager.actions.intent1[0].parameters).toEqual(
        'parameter1,parameter2'
      );
      expect(manager.actions.intent1[1].action).toEqual('action2');
      expect(manager.actions.intent1[1].parameters).toEqual(
        'parameter3,parameter4'
      );
      expect(manager.actions.intent2).toHaveLength(2);
      expect(manager.actions.intent2[0].action).toEqual('action3');
      expect(manager.actions.intent2[0].parameters).toEqual(
        'parameter5,parameter6'
      );
      expect(manager.actions.intent2[1].action).toEqual('action4');
      expect(manager.actions.intent2[1].parameters).toEqual(
        'parameter7,parameter8'
      );
    });
  });

  describe('find actions', () => {
    test('Should be able to find actions of an intent', () => {
      const manager = new ActionManager();
      manager.addAction('intent1', 'action1', 'parameter1,parameter2');
      manager.addAction('intent1', 'action2', 'parameter3,parameter4');
      manager.addAction('intent2', 'action3', 'parameter5,parameter6');
      manager.addAction('intent2', 'action4', 'parameter7,parameter8');
      const actions = manager.findActions('intent2');
      expect(actions).toHaveLength(2);
      expect(actions[0].action).toEqual('action3');
      expect(actions[0].parameters).toEqual('parameter5,parameter6');
      expect(actions[1].action).toEqual('action4');
      expect(actions[1].parameters).toEqual('parameter7,parameter8');
    });
  });

  describe('remove action', () => {
    test('Should be able to remove an action', () => {
      const manager = new ActionManager();
      manager.addAction('intent1', 'action1', 'parameter1,parameter2');
      manager.addAction('intent1', 'action2', 'parameter3,parameter4');
      manager.addAction('intent2', 'action3', 'parameter5,parameter6');
      manager.addAction('intent2', 'action4', 'parameter7,parameter8');
      manager.removeAction('intent1', 'action2', 'parameter3,parameter4');
      expect(manager.actions.intent1).toHaveLength(1);
      expect(manager.actions.intent1[0].action).toEqual('action1');
      expect(manager.actions.intent1[0].parameters).toEqual(
        'parameter1,parameter2'
      );
      expect(manager.actions.intent2).toHaveLength(2);
      expect(manager.actions.intent2[0].action).toEqual('action3');
      expect(manager.actions.intent2[0].parameters).toEqual(
        'parameter5,parameter6'
      );
      expect(manager.actions.intent2[1].action).toEqual('action4');
      expect(manager.actions.intent2[1].parameters).toEqual(
        'parameter7,parameter8'
      );
    });
    test('No error if removing non existing action', () => {
      const manager = new ActionManager();
      manager.addAction('intent1', 'action1', 'parameter1,parameter2');
      manager.addAction('intent1', 'action2', 'parameter3,parameter4');
      manager.addAction('intent2', 'action3', 'parameter5,parameter6');
      manager.addAction('intent2', 'action4', 'parameter7,parameter8');
      manager.removeAction('intent1', 'action3', 'parameter3,parameter4');
      expect(manager.actions.intent1).toHaveLength(2);
      expect(manager.actions.intent2).toHaveLength(2);
    });
  });
  describe('remove actions', () => {
    test('Should be able to remove all actions of an intent', () => {
      const manager = new ActionManager();
      manager.addAction('intent1', 'action1', 'parameter1,parameter2');
      manager.addAction('intent1', 'action2', 'parameter3,parameter4');
      manager.addAction('intent2', 'action3', 'parameter5,parameter6');
      manager.addAction('intent2', 'action4', 'parameter7,parameter8');
      manager.removeActions('intent1');
      expect(manager.actions.intent1).toBeUndefined();
      expect(manager.actions.intent2).toHaveLength(2);
      expect(manager.actions.intent2[0].action).toEqual('action3');
      expect(manager.actions.intent2[0].parameters).toEqual(
        'parameter5,parameter6'
      );
      expect(manager.actions.intent2[1].action).toEqual('action4');
      expect(manager.actions.intent2[1].parameters).toEqual(
        'parameter7,parameter8'
      );
    });
  });
});
