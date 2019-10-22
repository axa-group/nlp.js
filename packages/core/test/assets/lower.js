class Lower {
  toLower(srcInput) {
    const input = srcInput;
    input.str = input.str.toLowerCase();
    return input;
  }

  run(input) {
    return this.toLower(input.str ? input : { str: input });
  }
}

module.exports = Lower;
