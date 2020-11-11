class MockTemplate {
  compile(message, context) {
    let result = message.answer || message;
    const keys = Object.keys(context);
    for (let i = 0; i < keys.length; i += 1) {
      result = result.replace(`{{ ${keys[i]} }}`, context[keys[i]]);
    }
    if (message.answer) {
      message.answer = result;
      return message;
    }
    return result;
  }
}

module.exports = MockTemplate;
