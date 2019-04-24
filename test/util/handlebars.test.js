const { resolveTemplate } = require('../../lib/util/handlebars');

describe('handlebar template handler', () => {
  test('It should skip missing template tokens', () => {
    let str = 'abcdefg';
    let result = resolveTemplate(str, {});
    expect(result).toEqual(str);
    str = '{abcdefg}';
    result = resolveTemplate(str, {});
    expect('{abcdefg}').toEqual(str);
    str = '{{abcdefg}';
    result = resolveTemplate(str, {});
    expect('{{abcdefg}').toEqual(str);
  });
  test('It should replace one template tokens', () => {
    const str = 'abc{{insert}}defg';
    const result = resolveTemplate(str, { insert: 'foobar' });
    expect(result).toEqual('abcfoobardefg');
  });
  test('It should replace two template tokens', () => {
    const str = 'abc{{insert1}}defg{{insert2}}';
    const result = resolveTemplate(str, {
      insert1: 'foobar',
      insert2: 'barfood',
    });
    expect(result).toEqual('abcfoobardefgbarfood');
  });
  test('It should replace two matching tokens', () => {
    const str = 'abc{{insert1}}defg{{insert1}}';
    const result = resolveTemplate(str, { insert1: 'foobar' });
    expect(result).toEqual('abcfoobardefgfoobar');
  });
  test('It should not replace without matching tokens', () => {
    const str = 'abc{{insert1}}defg{{insert1}}';
    const result = resolveTemplate(str, { insert2: 'foobar' });
    expect(result).toEqual('abc{{insert1}}defg{{insert1}}');
  });
});
