const Evaluator = require('./evaluator');

const evaluator = new Evaluator();

const dictionary = {};

function compile(str) {
  if (dictionary[str] === undefined) {
    dictionary[str] = str.match(/{{\s*([^}]+)\s*}}/g) || [];
  }
  const matches = dictionary[str];
  return (context = {}) => {
    return matches.reduce((p, c) => {
      const solution = evaluator.evaluate(c.substr(2, c.length - 4), context);
      return solution ? p.replace(c, solution) : p;
    }, str);
  };
}

module.exports = { compile };
