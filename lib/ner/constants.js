const TrimType = {
  Between: 'between',
  After: 'after',
  AfterLast: 'afterLast',
  AfterFirst: 'afterFirst',
  Before: 'before',
  BeforeFirst: 'beforeFirst',
  BeforeLast: 'beforeLast',
};

const TrimTypesList = Object.values(TrimType);

module.exports = {
  TrimType,
  TrimTypesList,
};
