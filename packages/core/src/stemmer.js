class Stemmer {
  constructor(container) {
    this.container = container;
  }

  stem(tokens) {
    return tokens;
  }

  run(srcInput) {
    const input = srcInput;
    const locale = input.locale || 'en';
    const stemmer = this.container.get(`stemmer-${locale}`) || this;
    input.tokens = stemmer.stem(input.tokens, input);
    return input;
  }
}

module.exports = Stemmer;
