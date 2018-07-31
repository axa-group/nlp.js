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
  addNamedEntity(entityName) {
    if (this.namedEntities[entityName]) {
      return this.namedEntities[entityName];
    }
    const entity = {
      name: entityName,
      options: [],
    };
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
    for (let i = 0; i < entity.options.length; i += 1) {
      if (entity.options[i].name === optionName) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Given an entity and an option name, returns the option instance from
   * the entity.
   * @param {Object} entity Entity for searching the option.
   * @param {String} optionName Name of the option.
   * @returns {Object} Option if found, undefined otherwise.
   */
  getOptionFromEntity(entity, optionName) {
    const index = this.getOptionsPositionFromEntity(entity, optionName);
    return index > -1 ? entity.options[index] : undefined;
  }

  /**
   * Adds an option to an entity of the NER.
   * @param {String} entityName Name of the entity.
   * @param {String} optionName Name of the option to be added.
   * @returns Existing option if it already exists, or new one if created.
   */
  addNamedEntityOption(entityName, optionName) {
    const entity = this.getNamedEntity(entityName, true);
    let option = this.getOptionFromEntity(entity, optionName);
    if (!option) {
      option = { name: optionName, texts: {} };
      entity.options.push(option);
    }
    return option;
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
      const index = this.getOptionsPositionFromEntity(entity, optionName);
      if (index !== -1) {
        entity.options.splice(index, 1);
      }
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
    let option = this.getOptionFromEntity(entity, optionName);
    if (!option && force) {
      option = this.addNamedEntityOption(entityName, optionName);
    }
    return option;
  }

  /**
   * Add texts to the given languages of an option of an entity.
   * @param {String} entityName Name of the entity.
   * @param {String} optionName Name of the option.
   * @param {String[]} srcLanguages Language or languages for adding the texts.
   * @param {String[]} srcTexts Text or texts to be added.
   */
  addNamedEntityText(entityName, optionName, srcLanguages, srcTexts) {
    const option = this.getNamedEntityOption(entityName, optionName, true);
    const languages = Array.isArray(srcLanguages) ? srcLanguages : [srcLanguages];
    const texts = Array.isArray(srcTexts) ? srcTexts : [srcTexts];
    languages.forEach((language) => {
      const optionTexts = option.texts[language];
      if (!optionTexts) {
        option.texts[language] = texts.slice();
      } else {
        texts.forEach((text) => {
          optionTexts.push(text);
        });
      }
    });
  }

  /**
   * Remove texts for the given languages of the option of an entity.
   * @param {String} entityName Name of the entity.
   * @param {String} optionName Name of the option.
   * @param {String[]} srcLanguages Languages affected.
   * @param {String[]} srcTexts Texts to be removed.
   */
  removeNamedEntityText(entityName, optionName, srcLanguages, srcTexts) {
    const option = this.getNamedEntityOption(entityName, optionName);
    if (!option) {
      return;
    }
    const languages = Array.isArray(srcLanguages) ? srcLanguages : [srcLanguages];
    const texts = Array.isArray(srcTexts) ? srcTexts : [srcTexts];
    languages.forEach((language) => {
      const optionTexts = option.texts[language];
      if (optionTexts) {
        texts.forEach((text) => {
          const index = optionTexts.indexOf(text);
          if (index !== -1) {
            optionTexts.splice(index, 1);
          }
        });
      }
    });
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
    const entities = {};
    entityNames.forEach((entityName) => {
      entities[entityName] = this.namedEntities[entityName];
    });
    const resultEntities = this.similar.getBestEntity(utterance, entities, locale);
    if (!resultEntities) {
      return [];
    }
    const result = [];
    resultEntities.forEach((resultEntity) => {
      if (resultEntity.accuracy >= this.threshold) {
        result.push(resultEntity);
      }
    });
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
