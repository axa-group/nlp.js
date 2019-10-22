class Stopwords {
  constructor(container) {
    this.container = container;
    this.name = 'removeStopwords';
  }

  removeStopwords(tokens) {
    return tokens;
  }

  run(srcInput) {
    if (srcInput.settings && srcInput.settings.keepStopwords) {
      return srcInput;
    }
    const input = srcInput;
    const locale = input.locale || 'en';
    const remover = this.container.get(`stopwords-${locale}`) || this;
    input.tokens = remover.removeStopwords(input.tokens, input).filter(x => x);
    return input;
  }
}

module.exports = Stopwords;
