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

const Excel = require('exceljs');
const { XTableUtils } = require('@nlpjs/xtables');

class NlpAnalyzer {
  constructor(settings = {}) {
    this.settings = settings;
    this.threshold =
      this.settings.threshold === undefined ? 0.5 : this.settings.threshold;
  }

  async analyze(corpus, trainFn, testFn) {
    const trainResult = await trainFn(corpus);
    const { data } = corpus;
    const outputs = [];
    const intentNames = corpus.data.map((x) => x.intent);
    for (let i = 0; i < data.length; i += 1) {
      const { intent, tests } = data[i];
      for (let j = 0; j < tests.length; j += 1) {
        const test = tests[j];
        const output = await testFn(test, trainResult);
        const topClassification = output.classifications[0] || {
          intent: 'None',
          score: 1,
        };
        const secondClassification = output.classifications[1] || {
          intent: '',
          score: undefined,
        };
        const current = {
          test,
          sourceOutput: output,
          expectedIntent: intent,
          topIntent: topClassification.intent,
          topScore: topClassification.score,
          secondIntent: secondClassification.intent,
          secondScore: secondClassification.score,
          isCorrect: intent === topClassification.intent,
          isCorrectGoodScore:
            intent === topClassification.intent &&
            topClassification.score >= this.threshold,
        };
        if (intentNames.indexOf(current.topIntent) === -1) {
          intentNames.push(current.topIntent);
        }
        outputs.push(current);
      }
    }
    const analysis = {
      corpus,
      outputs,
      confidenceHistogram: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      clarityHistogram: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      confusionMatrix: {
        matrix: [],
        intents: [],
        totals: {
          tp: 0,
          fp: 0,
          tn: 0,
          fn: 0,
        },
      },
    };
    intentNames.sort();
    const intentDict = {};
    for (let i = 0; i < intentNames.length; i += 1) {
      intentDict[intentNames[i]] = i;
      analysis.confusionMatrix.intents.push({
        name: intentNames[i],
        tp: 0,
        fp: 0,
        tn: 0,
        fn: 0,
      });
      const arr = [];
      for (let j = 0; j < intentNames.length; j += 1) {
        arr.push(0);
      }
      analysis.confusionMatrix.matrix.push(arr);
    }
    let correct = 0;
    let correctGoodScore = 0;
    const errors = [];
    for (let i = 0; i < outputs.length; i += 1) {
      const output = outputs[i];
      if (output.isCorrect) {
        correct += 1;
        if (output.isCorrectGoodScore) {
          correctGoodScore += 1;
        }
        let confidence = Math.floor(output.topScore * 10);
        if (confidence > 9) {
          confidence = 9;
        }
        if (confidence < 0) {
          confidence = 0;
        }
        analysis.confidenceHistogram[confidence] += 1;
        if (output.secondScore) {
          let clarity = Math.floor((output.topScore - output.secondScore) * 10);
          if (clarity > 9) {
            clarity = 9;
          }
          if (clarity < 0) {
            clarity = 0;
          }
          analysis.clarityHistogram[clarity] += 1;
        }
        const intentPos = intentDict[output.topIntent];
        analysis.confusionMatrix.matrix[intentPos][intentPos] += 1;
        for (let j = 0; j < analysis.confusionMatrix.intents.length; j += 1) {
          const current = analysis.confusionMatrix.intents[j];
          if (j === intentPos) {
            current.tp += 1;
          } else {
            current.tn += 1;
          }
        }
      } else {
        const expectedIntentPos = intentDict[output.expectedIntent];
        const actualIntentPos = intentDict[output.topIntent];
        analysis.confusionMatrix.matrix[actualIntentPos][
          expectedIntentPos
        ] += 1;
        for (let j = 0; j < analysis.confusionMatrix.intents.length; j += 1) {
          const current = analysis.confusionMatrix.intents[j];
          if (j === expectedIntentPos) {
            current.fn += 1;
            // errors.push({
            //   type: 'fn',
            //   expected: output.expectedIntent,
            //   received: output.topIntent,
            //   score: output.topScore,
            //   test: output.test,
            // });
          } else if (j === actualIntentPos) {
            current.fp += 1;
            errors.push({
              type: 'fp',
              expected: output.expectedIntent,
              received: output.topIntent,
              score: output.topScore,
              test: output.test,
            });
          } else {
            current.tn += 1;
          }
        }
      }
    }
    analysis.correct = correct;
    analysis.correctGoodScore = correctGoodScore;
    analysis.correctPercentage = (correct * 100) / outputs.length;
    analysis.correctGoodScorePercentage =
      (correctGoodScore * 100) / outputs.length;
    for (let i = 0; i < analysis.confusionMatrix.intents.length; i += 1) {
      const current = analysis.confusionMatrix.intents[i];
      analysis.confusionMatrix.totals.tp += current.tp;
      analysis.confusionMatrix.totals.fp += current.fp;
      analysis.confusionMatrix.totals.tn += current.tn;
      analysis.confusionMatrix.totals.fn += current.fn;
      current.accuracy =
        (current.tp + current.tn) /
        (current.tp + current.tn + current.fp + current.fn);
      current.specificity = current.tn / (current.tn + current.fp);
      current.precision = current.tp / (current.tp + current.fp);
      current.recall = current.tp / (current.tp + current.fn);
      current.f1Score =
        (2 * current.precision * current.recall) /
        (current.precision + current.recall);
    }
    const { totals } = analysis.confusionMatrix;
    totals.accuracy =
      (totals.tp + totals.tn) / (totals.tp + totals.tn + totals.fp + totals.fn);
    totals.specificity = totals.tn / (totals.tn + totals.fp);
    totals.precision = totals.tp / (totals.tp + totals.fp);
    totals.recall = totals.tp / (totals.tp + totals.fn);
    totals.f1Score =
      (2 * totals.precision * totals.recall) /
      (totals.precision + totals.recall);
    analysis.errors = errors;
    return analysis;
  }

  writeAt(sheet, column, row, value) {
    sheet.getCell(XTableUtils.coord2excel({ column, row })).value = value;
  }

  generateConfusionMatrix(workbook, analysis) {
    const titles = [
      'True Positives',
      'False Positives',
      'True Negatives',
      'False Negatives',
      'Accuracy',
      'Specificity / TN rate',
      'Precision',
      'Recall / Sensitivity / TP rate',
      'F1-Score',
    ];
    const sheet = workbook.addWorksheet('Confusion Matrix');
    const { confusionMatrix } = analysis;
    const { intents, matrix } = confusionMatrix;
    let maxLength = 0;

    for (let i = 0; i < titles.length; i += 1) {
      const pos = XTableUtils.coord2excel({
        column: intents.length + i + 2,
        row: 0,
      });
      const cell = sheet.getCell(pos);
      cell.value = titles[i];
      cell.alignment = { textRotation: 45 };
    }

    for (let i = 0; i < intents.length; i += 1) {
      const position = XTableUtils.coord2excel({ column: i + 1, row: 0 });
      const cell = sheet.getCell(position);
      cell.value = intents[i].name;
      if (intents[i].name.length > maxLength) {
        maxLength = intents[i].name.length;
      }
      cell.alignment = { textRotation: 45 };
      const positionRow = XTableUtils.coord2excel({ column: 0, row: i + 1 });
      const cellRow = sheet.getCell(positionRow);
      cellRow.value = intents[i].name;
      sheet.getColumn(i + 2).width = 3;
      this.writeAt(sheet, intents.length + 2, i + 1, intents[i].tp);
      this.writeAt(sheet, intents.length + 3, i + 1, intents[i].fp);
      this.writeAt(sheet, intents.length + 4, i + 1, intents[i].tn);
      this.writeAt(sheet, intents.length + 5, i + 1, intents[i].fn);
      this.writeAt(sheet, intents.length + 6, i + 1, intents[i].accuracy);
      this.writeAt(sheet, intents.length + 7, i + 1, intents[i].specificity);
      this.writeAt(sheet, intents.length + 8, i + 1, intents[i].precision);
      this.writeAt(sheet, intents.length + 9, i + 1, intents[i].recall);
      this.writeAt(sheet, intents.length + 10, i + 1, intents[i].f1Score);
      const row = matrix[i];
      for (let j = 0; j < intents.length; j += 1) {
        const dataPosition = XTableUtils.coord2excel({
          column: j + 1,
          row: i + 1,
        });
        const dataCell = sheet.getCell(dataPosition);
        dataCell.value = row[j];
        if (j === i) {
          dataCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFAA00FF' },
          };
        } else if (row[j] > 0) {
          dataCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF0000' },
          };
        }
      }
    }
    sheet.getColumn(1).width = maxLength;
  }

  generateData(workbook, analysis) {
    const sheet = workbook.addWorksheet('Analysis');
    sheet.getColumn(2).width = 30;
    sheet.getColumn(5).width = 20;
    this.writeAt(sheet, 1, 2, 'Name');
    this.writeAt(sheet, 2, 2, analysis.corpus.name);
    this.writeAt(sheet, 1, 3, 'Language');
    this.writeAt(sheet, 2, 3, analysis.corpus.locale);
    this.writeAt(sheet, 1, 4, 'Total Tests');
    this.writeAt(sheet, 2, 4, analysis.outputs.length);
    this.writeAt(sheet, 1, 5, 'Threshold');
    this.writeAt(sheet, 2, 5, this.threshold);
    this.writeAt(sheet, 1, 6, 'Correct');
    this.writeAt(sheet, 2, 6, analysis.correct);
    this.writeAt(sheet, 1, 7, 'Correct (score over threshold)');
    this.writeAt(sheet, 2, 7, analysis.correctGoodScore);
    this.writeAt(sheet, 1, 8, '% Correct');
    this.writeAt(sheet, 2, 8, analysis.correctPercentage);
    this.writeAt(sheet, 1, 9, '% Correct (score over threshold)');
    this.writeAt(sheet, 2, 9, analysis.correctGoodScorePercentage);
    this.writeAt(sheet, 1, 10, 'True Positive');
    this.writeAt(sheet, 2, 10, analysis.confusionMatrix.totals.tp);
    this.writeAt(sheet, 1, 11, 'False Positive');
    this.writeAt(sheet, 2, 11, analysis.confusionMatrix.totals.fp);
    this.writeAt(sheet, 1, 12, 'True Negative');
    this.writeAt(sheet, 2, 12, analysis.confusionMatrix.totals.tn);
    this.writeAt(sheet, 1, 13, 'False Negative');
    this.writeAt(sheet, 2, 13, analysis.confusionMatrix.totals.fn);
    this.writeAt(sheet, 1, 14, 'Accuracy');
    this.writeAt(sheet, 2, 14, analysis.confusionMatrix.totals.accuracy);
    this.writeAt(sheet, 1, 15, 'Specificity');
    this.writeAt(sheet, 2, 15, analysis.confusionMatrix.totals.specificity);
    this.writeAt(sheet, 1, 16, 'Precision');
    this.writeAt(sheet, 2, 16, analysis.confusionMatrix.totals.precision);
    this.writeAt(sheet, 1, 17, 'Recall');
    this.writeAt(sheet, 2, 17, analysis.confusionMatrix.totals.recall);
    this.writeAt(sheet, 1, 18, 'F1-Score');
    this.writeAt(sheet, 2, 18, analysis.confusionMatrix.totals.f1Score);

    this.writeAt(sheet, 5, 20, '0..10');
    this.writeAt(sheet, 6, 20, '10..20');
    this.writeAt(sheet, 7, 20, '20..30');
    this.writeAt(sheet, 8, 20, '30..40');
    this.writeAt(sheet, 9, 20, '40..50');
    this.writeAt(sheet, 10, 20, '50..60');
    this.writeAt(sheet, 11, 20, '60..70');
    this.writeAt(sheet, 12, 20, '70..80');
    this.writeAt(sheet, 13, 20, '80..90');
    this.writeAt(sheet, 14, 20, '90..100');
    this.writeAt(sheet, 4, 21, 'Confidence Histogram');
    this.writeAt(sheet, 4, 22, 'Clarity Histogram');
    for (let i = 0; i < 10; i += 1) {
      this.writeAt(sheet, 5 + i, 21, analysis.confidenceHistogram[i]);
      this.writeAt(sheet, 5 + i, 22, analysis.clarityHistogram[i]);
    }

    if (analysis.errors) {
      const sheetWithWErrors = workbook.addWorksheet('Errors');
      sheetWithWErrors.getColumn(2).width = 30;
      sheetWithWErrors.getColumn(3).width = 30;
      sheetWithWErrors.getColumn(5).width = 60;

      this.writeAt(sheetWithWErrors, 0, 0, 'Error type');
      this.writeAt(sheetWithWErrors, 1, 0, 'Expected');
      this.writeAt(sheetWithWErrors, 2, 0, 'Received');
      this.writeAt(sheetWithWErrors, 3, 0, 'Score');
      this.writeAt(sheetWithWErrors, 4, 0, 'Test');

      for (let i = 1; i <= analysis.errors.length; i += 1) {
        const error = analysis.errors[i - 1];
        this.writeAt(sheetWithWErrors, 0, i, error.type);
        this.writeAt(sheetWithWErrors, 1, i, error.expected);
        this.writeAt(sheetWithWErrors, 2, i, error.received);
        this.writeAt(sheetWithWErrors, 3, i, error.score);
        this.writeAt(sheetWithWErrors, 4, i, error.test);
      }
    }
  }

  async generateExcel(fileName, analysis, options = {}) {
    const workbook = new Excel.Workbook();
    workbook.creator = options.creator || 'Jesús Seijas';
    workbook.lastModifiedBy = options.lastModifiedBy || 'Jesús Seijas';
    workbook.created = options.created || new Date();
    workbook.modified = options.modified || workbook.created;
    this.generateConfusionMatrix(workbook, analysis);
    this.generateData(workbook, analysis);
    await workbook.xlsx.writeFile(fileName);
  }

  streamExcel(outStream, analysis, options = {}) {
    const workbook = new Excel.Workbook();
    workbook.creator = options.creator || 'Jesús Seijas';
    workbook.lastModifiedBy = options.lastModifiedBy || 'Jesús Seijas';
    workbook.created = options.created || new Date();
    workbook.modified = options.modified || workbook.created;
    this.generateConfusionMatrix(workbook, analysis);
    this.generateData(workbook, analysis);
    return workbook.xlsx.write(outStream, {
      options: options.separator || ';',
    });
  }
}

module.exports = NlpAnalyzer;
