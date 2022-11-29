/**
 * Class that does minimal text replacement of a context property "name" used for some nlp tests
 */
class TemplateMock {
  compile(str, context) {
    if (str && str.answer && context.name) {
      str.answer = str.answer.replace(/{{ ?name ?}}/g, context.name);
    }
    return str;
  }
}

module.exports = TemplateMock;
