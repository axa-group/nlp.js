class Tokenizer {
  constructor(container) {
    this.container = container;
  }

  tokenize(text) {
    return text.split(/[\s,.!?;:([\]'"¡¿)/]+/);
  }

  run(srcInput) {
    const input = srcInput;
    const locale = input.locale || 'en';
    const tokenizer = this.container.get(`tokenizer-${locale}`) || this;
    input.tokens = tokenizer.tokenize(input.text, input).filter(x => x);
    return input;
  }
}

module.exports = Tokenizer;
