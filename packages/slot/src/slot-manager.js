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
    this.isEmpty = true;
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
   * @param {boolean} [mandatory=false] Flag indicating if is mandatory or optional.
   * @param {Object} [questions] Question to ask when is mandatory, by locale.
   * @returns {Object} New slot instance.
   */
  addSlot(intent, entity, mandatory = false, questions) {
    this.isEmpty = false;
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
   * Adds/modifies the parameter of a slot for a given intent and entity.
   * Slot questions for same locales as already existing will be overwritten.
   * If the slot for the intent and entity does not exist it fill be created.
   * @param {String} intent Name of the intent.
   * @param {String} entity Name of the entity.
   * @param {boolean} mandatory Flag indicating if is mandatory or optional.
   * @param {Object} [questions] Question to ask when is mandatory, by locale.
   * @returns {Object} New/Modified slot instance or undefined if not existing
   */
  updateSlot(intent, entity, mandatory, questions) {
    if (!this.intents[intent] || !this.intents[intent][entity]) {
      return this.addSlot(intent, entity, mandatory, questions);
    }
    const slot = this.intents[intent][entity];
    if (mandatory !== undefined) {
      // Update mandatory flag only if provided
      slot.mandatory = mandatory;
    }
    slot.locales = Object.assign(slot.locales, questions);
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
      entities.forEach((entity) => {
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
   * Given an intent return the information if the intent has entities defined
   *
   * @param {String} intent Name of the intent.
   * @returns {boolean} true if intent has defined entities, else false
   */
  hasIntentEntities(intent) {
    return this.getIntentEntityNames(intent).length > 0;
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
    this.isEmpty = Object.keys(this.intents).length === 0;
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
    keys.forEach((key) => {
      delete context[key];
    });
  }

  generateEntityAliases(entities) {
    const aliases = [];
    const dict = {};
    for (let i = 0; i < entities.length; i += 1) {
      const entity = entities[i];
      if (!dict[entity.entity]) {
        dict[entity.entity] = [];
      }
      aliases[i] = `${entity.entity}_${dict[entity.entity].length}`;
      dict[entity.entity].push(true);
    }
    return aliases;
  }

  process(srcResult, srcContext) {
    const result = srcResult;
    const context = srcContext;
    this.cleanContextEntities(result.intent, context);
    if (context.slotFill) {
      // if we have slotFill values we set the context to be the same as before
      result.intent = context.slotFill.intent;
      result.answer = context.slotFill.answer;
      result.srcAnswer = context.slotFill.srcAnswer;
    }
    if (!result.intent || result.intent === 'None') {
      // No intent found, we repeat the answer from last time
      return false;
    }
    if (context.slotFill && context.slotFill.intent === result.intent) {
      result.entities = [...context.slotFill.entities, ...result.entities];
    }
    const mandatorySlots = this.getMandatorySlots(result.intent);
    let keys = Object.keys(mandatorySlots);
    if (keys.length === 0) {
      // No mandatory entities defined, we repeat the answer from last time
      return false;
    }
    const aliases = this.generateEntityAliases(result.entities);
    for (let i = 0, l = result.entities.length; i < l; i += 1) {
      const entity = result.entities[i];
      // Remove existing mandatory entities to see what's left
      delete mandatorySlots[entity.entity];
      delete mandatorySlots[aliases[i]];
    }
    if (context.slotFill && mandatorySlots[context.slotFill.currentSlot]) {
      // Last time requested slot was not filled by current answer automatically,
      // so add whole utterance as answer for the requested slow
      // Do this because automatically parsed entities by builtins like "duration" are
      // added automatically, and we don't want to have duplicated entries in the list
      result.entities.push({
        entity: context.slotFill.currentSlot,
        utteranceText: result.utterance,
        sourceText: result.utterance,
        accuracy: 0.95,
        start: 0,
        end: result.utterance.length - 1,
        len: result.utterance.length,
        isSlotFillingFallback: true,
      });
      delete mandatorySlots[context.slotFill.currentSlot];
    }
    keys = Object.keys(mandatorySlots);
    if (context.slotFill && context.slotFill.currentSlot) {
      context.slotFill.latestSlot = context.slotFill.currentSlot;
    }
    if (!keys || keys.length === 0) {
      // All mandatory slots are filled, so we are done. No further questions needed
      delete result.srcAnswer;
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
    if (context.slotFill && context.slotFill.latestSlot) {
      result.slotFill.latestSlot = context.slotFill.latestSlot;
    }
    const currentSlot = mandatorySlots[keys[0]];
    result.slotFill.currentSlot = currentSlot.entity;
    result.srcAnswer = currentSlot.locales[result.localeIso2];
    context.slotFill = result.slotFill;
    return true;
  }
}

module.exports = SlotManager;
