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

/**
 * Class for a Slot Manager that takes care of the slot information.
 */
class SlotManager {
  /**
   * Constructor of the class.
   */
  constructor() {
    this.intents = {};
  }

  /**
   * Returns an slot given the intent and entity.
   * @param {String} intent Name of the intent.
   * @param {String} entity Name of the entity.
   * @returns {Object} Slot or undefined if not found.
   */
  getSlot(intent, entity) {
    if (!this.intents[intent]) {
      return undefined;
    }
    return this.intents[intent][entity];
  }

  /**
   * Indicates if a given slot exists, given the intent and entity.
   * @param {String} intent Name of the intent.
   * @param {String} entity Name of the entity.
   * @returns {boolean} True if the slot exists, false otherwise.
   */
  existsSlot(intent, entity) {
    return this.getSlot(intent, entity) !== undefined;
  }

  /**
   * Adds a new slot for a given intent and entity.
   * @param {String} intent Name of the intent.
   * @param {String} entity Name of the entity.
   * @param {boolean} mandatory Flag indicating if is mandatory or optional.
   * @param {Object} questions Question to ask when is mandatory, by locale.
   * @returns {Object} New slot instance.
   */
  addSlot(intent, entity, mandatory = false, questions) {
    if (!this.intents[intent]) {
      this.intents[intent] = {};
    }
    this.intents[intent][entity] = {
      intent,
      entity,
      mandatory,
      locales: questions || {},
    };
    return this.intents[intent][entity];
  }

  /**
   * Remove an slot given the intent and the entity.
   * @param {String} intent Name of the intent.
   * @param {String} entity Name of the entity.
   */
  removeSlot(intent, entity) {
    if (this.intents[intent]) {
      delete this.intents[intent][entity];
    }
  }

  /**
   * Add several entities if they don't exists.
   * @param {String} intent Name of the intent.
   * @param {String[]} entities List of entities.
   * @returns {Object[]} Array of resulting entities.
   */
  addBatch(intent, entities) {
    const result = [];
    if (entities && entities.length > 0) {
      entities.forEach(entity => {
        let slot = this.getSlot(intent, entity);
        if (!slot) {
          slot = this.addSlot(intent, entity);
        }
        result.push(slot);
      });
    }
    return result;
  }

  /**
   * Given an intent, return the array of entity names of this intent.
   * @param {String} intent Name of the intent.
   * @returns {String[]} Array of entity names of the intent.
   */
  getIntentEntityNames(intent) {
    if (!this.intents[intent]) {
      return undefined;
    }
    return Object.keys(this.intents[intent]);
  }

  /**
   * Clear the slot manager.
   */
  clear() {
    this.intents = {};
  }

  /**
   * Loads the slot manager content.
   * @param {Object} src Source content.
   */
  load(src) {
    this.intents = src || {};
  }

  /**
   * Returns the slot manager content.
   * @returns {Object} Slot manager content.
   */
  save() {
    return this.intents;
  }

  /**
   * Given an intent return the mandatory slots.
   * @param {String} intent Name of the intent
   * @returns {Object} Object with the mandatory slots.
   */
  getMandatorySlots(intent) {
    const result = {};
    const intentSlots = this.intents[intent];
    if (intentSlots) {
      const keys = Object.keys(intentSlots);
      for (let i = 0, l = keys.length; i < l; i += 1) {
        const slot = intentSlots[keys[i]];
        if (slot.mandatory) {
          result[slot.entity] = slot;
        }
      }
    }
    return result;
  }

  cleanContextEntities(intent, srcContext) {
    const context = srcContext;
    if (context.slotFill) {
      return;
    }
    const mandatorySlots = this.getMandatorySlots(intent);
    const keys = Object.keys(mandatorySlots);
    if (keys.length === 0) {
      return;
    }
    keys.forEach(key => {
      delete context[key];
    });
  }

  process(srcResult, srcContext) {
    const result = srcResult;
    const context = srcContext;
    this.cleanContextEntities(result.intent, context);
    if (context.slotFill) {
      result.intent = context.slotFill.intent;
      result.answer = context.slotFill.answer;
      result.srcAnswer = context.slotFill.srcAnswer;
    }
    if (!result.intent || result.intent === 'None') {
      return false;
    }
    if (context.slotFill && context.slotFill.intent === result.intent) {
      result.entities = [...context.slotFill.entities, ...result.entities];
    }
    const mandatorySlots = this.getMandatorySlots(result.intent);
    let keys = Object.keys(mandatorySlots);
    if (keys.length === 0) {
      return false;
    }
    if (context.slotFill) {
      result.entities.push({
        entity: context.slotFill.currentSlot,
        utteranceText: result.utterance,
        sourceText: result.utterance,
        accuracy: 0.95,
        start: 0,
        end: result.utterance.length - 1,
        len: result.utterance.length,
      });
    }
    for (let i = 0, l = result.entities.length; i < l; i += 1) {
      delete mandatorySlots[result.entities[i].entity];
    }
    keys = Object.keys(mandatorySlots);
    if (!keys || keys.length === 0) {
      return true;
    }
    if (context.slotFill && context.slotFill.intent === result.intent) {
      result.localeIso2 = context.slotFill.localeIso2;
    }
    result.slotFill = {
      localeIso2: result.localeIso2,
      intent: result.intent,
      entities: result.entities,
      answer: result.answer,
      srcAnswer: result.srcAnswer,
    };
    const currentSlot = mandatorySlots[keys[0]];
    result.slotFill.currentSlot = currentSlot.entity;
    result.srcAnswer = currentSlot.locales[result.localeIso2];
    context.slotFill = result.slotFill;
    return true;
  }
}

module.exports = SlotManager;
