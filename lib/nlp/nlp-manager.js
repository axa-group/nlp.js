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

const fs = require('fs');
const Handlebars = require('handlebars');
const NlpExcelReader = require('./nlp-excel-reader');
const BaseNlpManager = require('./base-nlp-manager');

/**
 * Class for the NLP Manager.
 * The NLP manager is the one that is able to manage several classifiers,
 * to have multilanguage, and also is the responsible of the NER (Named Entity
 * Recognition).
 *
 * Understanding NER:
 *
 * You can have several entities defined, each one with multilanguage and
 * several texts for each option. Example
 * Entity   Option           English                  Spanish
 * FOOD     Burguer          Burguer, Hamburguer      Hamburguesa
 * FOOD     Salad            Salad                    Ensalada
 * FOOD     Pizza            Pizza                    Pizza
 *
 */
class NlpManager extends BaseNlpManager {
  /**
   * Save the NLP manager information into a file.
   * @param {String} srcFileName Filename for saving the NLP manager.
   */
  save(srcFileName, minified = false) {
    const fileName = srcFileName || 'model.nlp';
    fs.writeFileSync(fileName, this.export(minified), 'utf8');
  }

  /**
   * Load the NLP manager information from a file.
   * @param {String} srcFilename Filename for loading the NLP manager.
   */
  load(srcFileName) {
    const fileName = srcFileName || 'model.nlp';
    const data = fs.readFileSync(fileName, 'utf8');
    this.import(data);
  }

  /**
   * Load the NLP manager information from an excel file.
   * @param {Sting} srcFileName File name of the excel.
   */
  loadExcel(srcFileName) {
    this.clear();
    const fileName = srcFileName || 'model.xls';
    const reader = new NlpExcelReader(this);
    reader.load(fileName);
  }

  compileAnswer(answer, context) {
    return Handlebars.compile(answer)(context);
  }
}

module.exports = NlpManager;
