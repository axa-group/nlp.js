const { forEach, range, print, getIndex, len } = require('./helper');
const PythonParser = require('./python-parser');

function evalInScope(js, contextAsScope) {
  with(contextAsScope) {
    return eval(js);
  }
}

function executePython(str, context) {
  if (!context) {
    context = {};
  }
  const transpiled = PythonParser.transpile(str);
  return evalInScope(transpiled, context);
}

module.exports = executePython;