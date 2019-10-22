class Char {
  toChars(srcInput) {
    const input = srcInput;
    input.arr = input.str.split('');
    return input;
  }

  filter(srcInput) {
    const input = srcInput;
    input.arr = input.arr.filter(x => !x.includes(input.excludeChars));
    return input;
  }

  run(input) {
    return this.toChars(input.str ? input : { str: input });
  }
}

module.exports = Char;
