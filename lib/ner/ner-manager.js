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

const { SimilarSearch } = require('../util');
const NamedEntity = require('./named-entity');

/**
 * Class for a named entities manager, that can be recognized inside
 * a string.
 * Basically, a named entity is an enumerator that has a set of options,
 * and each option can have several words to refer to this option.
 * Example:
 * We have the entity "Superhero". Inside "Superhero" we have different
 * options:
 * - Superman: Superman
 * - Spiderman: Spiderman, Spider-man
 * - Wolverine: Wolverine, Logan, Patch, Weapon X
 */
class NerManager {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for initializing this instance.
   */
  constructor(settings) {
    this.settings = settings || {};
    this.threshold = this.settings.threshold || 0.5;
    this.namedEntities = {};
    this.similar = new SimilarSearch({ normalize: true });
  }

  /**
   * Adds a new entity to be managed by the NER. If the entity already exists,
   * then returns the already existing one.
   * @param {String} entityName Name of the entity.
   * @returns {Object} Already existing entity or the new one created.
   */
  addNamedEntity(entityName, regex) {
    if (this.namedEntities[entityName]) {
      return this.namedEntities[entityName];
    }
    const options = { name: entityName };
    if (regex) {
      options.regex = regex;
    }
    const entity = new NamedEntity(options);
    this.namedEntities[entityName] = entity;
    return entity;
  }

  /**
   * Get an entity given its name. If the entity does not exists and the
   * force flag is on, then creates the entity.
   * @param {String} entityName Name of the entity.
   * @param {boolean} force Flag to create the entity when it does not exists.
   * @returns {Object} The entity, or undefined if not found and not forced.
   */
  getNamedEntity(entityName, force = false) {
    if (force) {
      return this.addNamedEntity(entityName);
    }
    return this.namedEntities[entityName];
  }

  /**
   * Removes an entity from the NER.
   * @param {String} entityName Name of the entity.
   */
  removeNamedEntity(entityName) {
    delete this.namedEntities[entityName];
  }

  /**
   * Given an entity and an option name, returns the position of the option.
   * @param {Object} entity Entiy for searching the option.
   * @param {String} optionName Name of the option.
   * @return {Object} Position of the option, -1 if not found.
   */
  getOptionsPositionFromEntity(entity, optionName) {
    return entity.getOptionPosition(optionName);
  }

  /**
   * Adds an option to an entity of the NER.
   * @param {String} entityName Name of the entity.
   * @param {String} optionName Name of the option to be added.
   * @returns Existing option if it already exists, or new one if created.
   */
  addNamedEntityOption(entityName, optionName) {
    const entity = this.getNamedEntity(entityName, true);
    return entity.addOption(optionName);
  }

  /**
   * Given an entity name and an option name, removes the option from
   * the entity.
   * @param {String} entityName Name of the entity.
   * @param {String} optionName Name of the option.
   */
  removeNamedEntityOption(entityName, optionName) {
    const entity = this.getNamedEntity(entityName);
    if (entity) {
      entity.removeOption(optionName);
    }
  }

  /**
   * Given an entity name and an option name, return this option from
   * the entity. If force flag is active, and the entity or the option
   * does not exists, then are forced to be created.
   * @param {String} entityName Name of the entity.
   * @param {String} optionName Name of the option.
   * @param {boolean} force Flag for forcing creation of entity or option.
   * @returns {Object} Option already existing, or the created one.
   */
  getNamedEntityOption(entityName, optionName, force = false) {
    const entity = this.getNamedEntity(entityName, force);
    if (!entity) {
      return undefined;
    }
    return entity.getOption(optionName, force);
  }

  /**
   * Add texts to the given languages of an option of an entity.
   * @param {String} entityName Name of the entity.
   * @param {String} optionName Name of the option.
   * @param {String[]} srcLanguages Language or languages for adding the texts.
   * @param {String[]} srcTexts Text or texts to be added.
   */
  addNamedEntityText(entityName, optionName, srcLanguages, srcTexts) {
    const entity = this.getNamedEntity(entityName, true);
    entity.addText(optionName, srcLanguages, srcTexts);
  }

  /**
   * Remove texts for the given languages of the option of an entity.
   * @param {String} entityName Name of the entity.
   * @param {String} optionName Name of the option.
   * @param {String[]} srcLanguages Languages affected.
   * @param {String[]} srcTexts Texts to be removed.
   */
  removeNamedEntityText(entityName, optionName, srcLanguages, srcTexts) {
    const entity = this.getNamedEntity(entityName);
    if (entity) {
      entity.removeText(optionName, srcLanguages, srcTexts);
    }
  }

  /**
   * Given an utterance, search for %entity% format inside it, in order to
   * return the list of entities referenced by the utterance.
   * @param {String} utterance Utterance for searching.
   * @returns {String[]} List of entities.
   */
  getEntitiesFromUtterance(utterance) {
    const entityKeys = Object.keys(this.namedEntities);
    const result = [];
    entityKeys.forEach((entity) => {
      if (utterance.indexOf(`%${entity}%`) > -1) {
        result.push(entity);
      }
    });
    return result;
  }

  /**
   * Find entities inside an utterance.
   * @param {String} utterance Utterance for searching entities.
   * @param {String} locale Locale of the language.
   * @param {String[]} whitelist Whitelist of entity names.
   */
  findEntities(utterance, locale, whitelist) {
    const entityNames = whitelist || Object.keys(this.namedEntities);
    const entitiesEnum = {};
    const entitiesRegex = {};
    entityNames.forEach((entityName) => {
      const entity = this.namedEntities[entityName];
      if (entity.type === 'enum') {
        entitiesEnum[entityName] = entity;
      } else {
        entitiesRegex[entityName] = entity;
      }
    });
    const resultEntities = this.similar.getBestEntity(utterance, entitiesEnum, locale);
    const result = [];
    resultEntities.forEach((resultEntity) => {
      if (resultEntity.accuracy >= this.threshold) {
        result.push(resultEntity);
      }
    });
    const keys = Object.keys(entitiesRegex);
    for (let i = 0; i < keys.length; i += 1) {
      const entity = entitiesRegex[keys[i]];
      const matchs = entity.getMatchs(utterance);
      matchs.forEach((match) => {
        result.push(Object.assign(match, { entity: keys[i] }));
      });
    }
    return result;
  }

  generateEntityUtterance(utterance, locale) {
    const entities = this.findEntities(utterance, locale);
    if (entities.length === 0) {
      return utterance;
    }
    let index = 0;
    let result = '';
    for (let i = 0; i < entities.length; i += 1) {
      const entity = entities[i];
      const left = utterance.slice(index, entity.start);
      index = entity.end;
      result += left;
      result += `%${entity.entity}%`;
    }
    const right = utterance.slice(entities[entities.length - 1].end);
    result += right;
    return result;
  }
}

module.exports = NerManager;
