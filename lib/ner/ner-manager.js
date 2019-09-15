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

const { SimilarSearch } = require('../util');
const EnumNamedEntity = require('./enum-named-entity');
const RegexNamedEntity = require('./regex-named-entity');
const TrimNamedEntity = require('./trim-named-entity');
const { TrimTypesList } = require('./constants');
const NerRecognizer = require('./ner-recognizer');
const NerDuckling = require('./ner-duckling');

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
    this.buildRecognizer();
  }

  buildRecognizer() {
    if (
      this.settings.useDuckling ||
      (this.settings.useDuckling === undefined && this.settings.ducklingUrl)
    ) {
      this.nerRecognizer = new NerDuckling(this.settings);
    } else {
      this.nerRecognizer = new NerRecognizer(this.settings);
    }
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
      case 'regex':
        return new RegexNamedEntity(options);
      case 'trim':
        return new TrimNamedEntity(options);
      default:
        return new EnumNamedEntity(options);
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
    return force
      ? this.addNamedEntity(entityName)
      : this.namedEntities[entityName];
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
    const regex = new RegExp(`%((${entityKeys.join('|')})(?:_\\d+)?)%`, 'gm');
    const match = utterance.match(regex);
    return match ? match.map(item => item.replace(/%/g, '')) : [];
  }

  /**
   * Given an array of edges, detect the trim edges and find overlaps with
   * non trim edges. When an overlap is detected, reduce the trim edged to
   * fit with the other edge.
   * @param {Object[]} edges Edges to be splited
   * @returns {Object[]} Splited edges.
   */
  splitEdges(edges) {
    for (let i = 0, l = edges.length; i < l; i += 1) {
      const edge = edges[i];
      if (TrimTypesList.includes(edge.type)) {
        for (let j = 0; j < edges.length; j += 1) {
          const other = edges[j];
          if (
            i !== j &&
            other.start >= edge.start &&
            other.end <= edge.end &&
            !TrimTypesList.includes(other.type)
          ) {
            const edgeLen = edge.end - edge.start;
            const otherLen = other.end - other.start;
            if (other.start - edge.start > edge.end - other.end) {
              // is at the beginning
              const text = edge.sourceText.substring(0, edgeLen - otherLen - 1);
              edge.sourceText = text;
              edge.utteranceText = text;
              edge.end = other.start - 2;
              edge.len = text.length;
            } else {
              const text = edge.sourceText.substring(edgeLen - otherLen + 2);
              edge.sourceText = text;
              edge.utteranceText = text;
              edge.start = other.end + 2;
              edge.len = text.length;
            }
          }
        }
      }
    }
    return edges;
  }

  /**
   * Extract built-in entities for the utterance given the language.
   * @param {string} utterance Input utterance.
   * @param {string} language Language locale.
   * @returns {Object[]} Extracted entities as edges array.
   */
  findBuiltinEntities(utterance, language) {
    return this.nerRecognizer.findBuiltinEntities(utterance, language);
  }

  /**
   * Find entities inside an utterance.
   * @param {String} utterance Utterance for searching entities.
   * @param {String} locale Locale of the language.
   * @param {String[]} whitelist Whitelist of entity names.
   * @param {boolean} includeBuiltin Include built-in entities.
   * @returns {Promise.Object[]} Promise edges of entities found.
   */
  async findEntitiesFull(
    utterance,
    language,
    whitelist,
    includeBuiltin = true
  ) {
    let witelistMap;

    if (whitelist) {
      witelistMap = {};
      whitelist.forEach(item => {
        const name = item.replace(/_\d+/g, '');
        if (!witelistMap[name]) {
          witelistMap[name] = [];
        }
        witelistMap[name].push(item);
      });
    }

    const entityNames = Object.keys(witelistMap || this.namedEntities);
    const wordPositions = this.similar.getWordPositions(utterance);
    let edges = [];
    let sourceEntities;
    if (includeBuiltin) {
      const entities = await this.findBuiltinEntities(utterance, language);
      sourceEntities = entities.source;
      edges = entities.edges;
    }

    entityNames.forEach(entityName => {
      const entity = this.namedEntities[entityName];
      if (entity) {
        const newEdges = entity.extract(
          utterance,
          language,
          this.similar,
          wordPositions,
          this.threshold
        );
        edges = [...edges, ...newEdges];
      }
    });

    edges.sort((a, b) => a.start - b.start);

    if (witelistMap) {
      edges = edges.map(item => {
        const edge = item;
        if (witelistMap[item.entity]) {
          edge.entity = witelistMap[item.entity].shift() || item.entity;
        } else {
          edge.entity = item.entity;
        }
        return edge;
      });
    }
    return {
      edges: this.similar.reduceEdges(this.splitEdges(edges), false),
      source: sourceEntities,
    };
  }

  async findEntities(utterance, language, whitelist, includeBuiltin = true) {
    return (await this.findEntitiesFull(
      utterance,
      language,
      whitelist,
      includeBuiltin
    )).edges;
  }

  findNamedEntities(utterance, language) {
    const entityNames = Object.keys(this.namedEntities);
    const wordPositions = this.similar.getWordPositions(utterance);
    let edges = [];

    entityNames.forEach(entityName => {
      const entity = this.namedEntities[entityName];
      if (entity) {
        const newEdges = entity.extract(
          utterance,
          language,
          this.similar,
          wordPositions,
          this.threshold
        );
        edges = [...edges, ...newEdges];
      }
    });

    edges.sort((a, b) => a.start - b.start);
    return this.similar.reduceEdges(this.splitEdges(edges), false);
  }

  /**
   * Find entities on utterance, and replace them by the entity name.
   * @param {String} utterance Utterance to be processed.
   * @param {String} locale Locale of the utterance.
   * @returns {Promise.String} Promise utterance with entities replaced by entity name.
   */
  async generateEntityUtterance(utterance, locale) {
    const entities = await this.findEntities(utterance, locale);
    if (entities.length === 0) {
      return utterance;
    }
    entities.sort((a, b) => a.start - b.start);
    let index = 0;
    let result = '';
    for (let i = 0; i < entities.length; i += 1) {
      const entity = entities[i];
      const left = utterance.slice(index, entity.start);
      index = entity.end + 1;
      result += left;
      result += `%${entity.entity}%`;
    }
    const right = utterance.slice(entities[entities.length - 1].end + 1);
    result += right;
    return result;
  }

  generateNamedEntityUtterance(utterance, locale) {
    const entities = this.findNamedEntities(utterance, locale);
    if (entities.length === 0) {
      return undefined;
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
    const right = utterance.slice(entities[entities.length - 1].end + 1);
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
    result.builtins = this.nerRecognizer.builtins;
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
      } else if (entity.type === 'regex') {
        clone.locales = {};
        const localeKeys = Object.keys(entity.locales);
        for (let j = 0; j < localeKeys.length; j += 1) {
          clone.locales[localeKeys[j]] = {
            regex: RegexNamedEntity.regex2str(
              entity.locales[localeKeys[j]].regex
            ),
          };
        }
      } else if (entity.type === 'trim') {
        clone.locales = {};
        const localeKeys = Object.keys(entity.locales);
        for (let j = 0; j < localeKeys.length; j += 1) {
          clone.locales[localeKeys[j]] = {
            conditions: [],
          };
          const { conditions } = entity.locales[localeKeys[j]];
          const cloneConditions = clone.locales[localeKeys[j]].conditions;
          for (let k = 0; k < conditions.length; k += 1) {
            const condition = conditions[k];
            const cloneCondition = {};
            cloneCondition.type = condition.type;
            cloneCondition.options = condition.options;
            if (condition.type === 'between') {
              cloneCondition.leftWords = condition.leftWords;
              cloneCondition.rightWords = condition.rightWords;
              cloneCondition.regex = RegexNamedEntity.regex2str(
                condition.regex
              );
            } else {
              cloneCondition.words = condition.words;
            }
            cloneConditions.push(cloneCondition);
          }
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
    this.buildRecognizer();
    this.threshold = obj.threshold;
    this.nerRecognizer.builtins = obj.builtins || [];
    const keys = Object.keys(obj.namedEntities);
    for (let i = 0; i < keys.length; i += 1) {
      const cloned = obj.namedEntities[keys[i]];
      const entity = this.addNamedEntity(cloned.name, cloned.type);
      if (cloned.type === 'enum') {
        entity.locales = cloned.locales;
      } else if (cloned.type === 'regex') {
        const localeKeys = Object.keys(cloned.locales);
        for (let j = 0; j < localeKeys.length; j += 1) {
          entity.locales[localeKeys[j]] = {
            regex: RegexNamedEntity.str2regex(
              cloned.locales[localeKeys[j]].regex
            ),
          };
        }
      } else if (cloned.type === 'trim') {
        const localeKeys = Object.keys(cloned.locales);
        for (let j = 0; j < localeKeys.length; j += 1) {
          entity.locales[localeKeys[j]] = {
            conditions: [],
          };
          const clonedConditions = cloned.locales[localeKeys[j]].conditions;
          const { conditions } = entity.locales[localeKeys[j]];
          for (let k = 0; k < clonedConditions.length; k += 1) {
            const condition = {
              type: clonedConditions[k].type,
              options: clonedConditions[k].options,
            };
            if (condition.type === 'between') {
              condition.leftWords = clonedConditions[k].leftWords;
              condition.rightWords = clonedConditions[k].rightWords;
              condition.regex = RegexNamedEntity.str2regex(
                clonedConditions[k].regex
              );
            } else {
              condition.words = clonedConditions[k].words;
            }
            conditions.push(condition);
          }
        }
      }
    }
  }
}

module.exports = NerManager;
