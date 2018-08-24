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

const Recognizers = require('@microsoft/recognizers-text-suite');
const { SimilarSearch } = require('../util');
const EnumNamedEntity = require('./enum-named-entity');
const NlpUtil = require('../nlp/nlp-util');
const RegexNamedEntity = require('./regex-named-entity');


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
    this.threshold = this.settings.threshold || 0.8;
    this.namedEntities = {};
    this.similar = new SimilarSearch({ normalize: true });
    this.builtins = this.settings.builtins || ['Number', 'Ordinal', 'Percentage', 'Age',
      'Currency', 'Dimension', 'Temperature', 'DateTime', 'PhoneNumber', 'IpAddress',
      'Boolean'];
    let list = this.settings.builtinWhitelist || ['age', 'currency', 'dimension',
      'temperature', 'number', 'numberrange', 'ordinal', 'percentage', 'email', 'hashtag', 'ip',
      'mention', 'phonenumber', 'url', 'date', 'daterange', 'datetime', 'datetimealt', 'time',
      'set', 'timerange', 'timezone', 'boolean', 'duration'];
    this.builtinWhitelist = {};
    for (let i = 0; i < list.length; i += 1) {
      this.builtinWhitelist[list[i]] = true;
    }
    list = this.settings.builtinBlacklist || [];
    for (let i = 0; i < list.length; i += 1) {
      delete this.builtinWhitelist[list[i]];
    }
    this.initializeDictionary();
  }

  initializeDictionary() {
    this.dictionary = {
      Año: 'Year',
      Mes: 'Month',
      Día: 'Day',
      Semana: 'Week',
      Ans: 'Year',
      Mois: 'Month',
      Semaines: 'Week',
      Jour: 'Day',
      Ano: 'Year',
      Mês: 'Month',
      Dia: 'Day',
    };
  }

  translate(str) {
    return this.dictionary[str] || str;
  }

  /**
   * Creates a new instance of a named entity.
   * @param {string} entityName Name of the entity
   * @param {string} type Type of the entity
   * @returns {NamedEntity} New named entity.
   */
  newNamedEntity(entityName, type = 'enum') {
    const options = { name: entityName };
    switch (type.toLowerCase()) {
      case 'regex': return new RegexNamedEntity(options);
      default: return new EnumNamedEntity(options);
    }
  }

  /**
   * Adds a new entity to be managed by the NER. If the entity already exists,
   * then returns the already existing one.
   * @param {String} entityName Name of the entity.
   * @param {String} type Type of the entity.
   * @returns {Object} Already existing entity or the new one created.
   */
  addNamedEntity(entityName, type) {
    if (this.namedEntities[entityName]) {
      return this.namedEntities[entityName];
    }
    const entity = this.newNamedEntity(entityName, type);
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
    return force ? this.addNamedEntity(entityName) : this.namedEntities[entityName];
  }

  /**
   * Removes an entity from the NER.
   * @param {String} entityName Name of the entity.
   */
  removeNamedEntity(entityName) {
    delete this.namedEntities[entityName];
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

  calculateResolution(srcResolution) {
    const resolution = srcResolution;
    if (!resolution) {
      return undefined;
    }
    if (resolution.unit) {
      resolution.unit = this.translate(resolution.unit);
    }
    if (['Year', 'Month', 'Week', 'Day'].includes(resolution.unit)) {
      return {
        strValue: resolution.value,
        value: Number.parseFloat(resolution.value),
        unit: resolution.unit,
      };
    }
    return resolution;
  }

  hasCoherence(edge, wordPositions) {
    let startFound = false;
    let endFound = false;
    for (let i = 0; i < wordPositions.length; i += 1) {
      const position = wordPositions[i];
      if (edge.start === position.start) {
        startFound = true;
      }
      if (edge.end === position.end) {
        endFound = true;
      }
      if (startFound && endFound) {
        return true;
      }
    }
    return false;
  }

  findBuiltinEntities(utterance, language, wordPositions) {
    const result = [];
    const culture = NlpUtil.getCulture(language);
    this.builtins.forEach((name) => {
      const entities = Recognizers[`recognize${name}`](utterance, culture);
      for (let i = 0; i < entities.length; i += 1) {
        const entity = entities[i];
        if (this.hasCoherence(entity, wordPositions)) {
          let entityName = entity.typeName;
          const index = entityName.lastIndexOf('.');
          if (index !== -1) {
            entityName = entityName.slice(index + 1);
          }
          if (this.builtinWhitelist[entityName]) {
            const text = utterance.slice(entity.start, entity.end + 1);
            let accuracy = 0.95;
            if (entity.resolution && entity.resolution.values) {
              accuracy -= entity.resolution.values.length / 100;
            }
            const edge = {
              start: entity.start,
              end: entity.end + 1,
              len: (entity.end - entity.start) + 1,
              accuracy,
              sourceText: text,
              utteranceText: text,
              entity: entityName,
            };
            const resolution = this.calculateResolution(entity.resolution);
            if (resolution) {
              edge.resolution = resolution;
            }
            result.push(edge);
          }
        }
      }
    });
    return this.similar.reduceEdges(result).sort((a, b) => a.start - b.start);
  }

  /**
   * Find entities inside an utterance.
   * @param {String} utterance Utterance for searching entities.
   * @param {String} locale Locale of the language.
   * @param {String[]} whitelist Whitelist of entity names.
   * @returns {Object[]} Edges of entities found.
   */
  findEntities(utterance, language, whitelist) {
    const entityNames = whitelist || Object.keys(this.namedEntities);
    const wordPositions = this.similar.getWordPositions(utterance);
    const edges = this.findBuiltinEntities(utterance, language, wordPositions);
    entityNames.forEach((entityName) => {
      const entity = this.namedEntities[entityName];
      if (entity) {
        const newEdges = entity.extract(
          utterance,
          language,
          this.similar,
          wordPositions,
          this.threshold,
        );
        newEdges.forEach((edge) => {
          edges.push(edge);
        });
      }
    });
    return this.similar.reduceEdges(edges);
  }

  /**
   * Find entities on utterance, and replace them by the entity name.
   * @param {String} utterance Utterance to be processed.
   * @param {String} locale Locale of the utterance.
   * @returns {String} Utterance with entities replaced by entity name.
   */
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

  /**
   * Returns a clone object representing this, for saving.
   * @returns {Object} Clone object.
   */
  save() {
    const result = {};
    result.settings = this.settings;
    result.threshold = this.threshold;
    result.builtins = this.builtins;
    result.namedEntities = {};
    const keys = Object.keys(this.namedEntities);
    for (let i = 0; i < keys.length; i += 1) {
      const entity = this.namedEntities[keys[i]];
      const clone = {
        type: entity.type,
        name: entity.name,
        localeFallback: entity.localeFallback,
      };
      if (entity.type === 'enum') {
        clone.locales = entity.locales;
      } else {
        clone.locales = {};
        const localeKeys = Object.keys(entity.locales);
        for (let j = 0; j < localeKeys.length; j += 1) {
          clone.locales[localeKeys[j]] = {
            regex: RegexNamedEntity.regex2str(entity.locales[localeKeys[j]].regex),
          };
        }
      }
      result.namedEntities[keys[i]] = clone;
    }
    return result;
  }

  /**
   * Load this instance from an object.
   * @param {Object} obj Object to load from.
   */
  load(obj) {
    this.settings = obj.settings;
    this.threshold = obj.threshold;
    this.builtins = obj.builtins || [];
    const keys = Object.keys(obj.namedEntities);
    for (let i = 0; i < keys.length; i += 1) {
      const cloned = obj.namedEntities[keys[i]];
      const entity = this.addNamedEntity(cloned.name, cloned.type);
      if (cloned.type === 'enum') {
        entity.locales = cloned.locales;
      } else {
        const localeKeys = Object.keys(cloned.locales);
        for (let j = 0; j < localeKeys.length; j += 1) {
          entity.locales[localeKeys[j]] = {
            regex: RegexNamedEntity.str2regex(cloned.locales[localeKeys[j]].regex),
          };
        }
      }
    }
  }
}

module.exports = NerManager;
