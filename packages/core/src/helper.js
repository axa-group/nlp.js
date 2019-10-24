const rsAstralRange = '\\ud800-\\udfff';
const rsComboMarksRange = '\\u0300-\\u036f';
const reComboHalfMarksRange = '\\ufe20-\\ufe2f';
const rsComboSymbolsRange = '\\u20d0-\\u20ff';
const rsComboMarksExtendedRange = '\\u1ab0-\\u1aff';
const rsComboMarksSupplementRange = '\\u1dc0-\\u1dff';
const rsComboRange =
  rsComboMarksRange +
  reComboHalfMarksRange +
  rsComboSymbolsRange +
  rsComboMarksExtendedRange +
  rsComboMarksSupplementRange;
const rsVarRange = '\\ufe0e\\ufe0f';
const rsAstral = `[${rsAstralRange}]`;
const rsCombo = `[${rsComboRange}]`;
const rsFitz = '\\ud83c[\\udffb-\\udfff]';
const rsModifier = `(?:${rsCombo}|${rsFitz})`;
const rsNonAstral = `[^${rsAstralRange}]`;
const rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
const rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
const rsZWJ = '\\u200d';
const reOptMod = `${rsModifier}?`;
const rsOptVar = `[${rsVarRange}]?`;
const rsOptJoin = `(?:${rsZWJ}(?:${[rsNonAstral, rsRegional, rsSurrPair].join(
  '|'
)})${rsOptVar + reOptMod})*`;
const rsSeq = rsOptVar + reOptMod + rsOptJoin;
const rsNonAstralCombo = `${rsNonAstral}${rsCombo}?`;
const rsSymbol = `(?:${[
  rsNonAstralCombo,
  rsCombo,
  rsRegional,
  rsSurrPair,
  rsAstral,
].join('|')})`;

/* eslint-disable no-misleading-character-class */
const reHasUnicode = RegExp(
  `[${rsZWJ + rsAstralRange + rsComboRange + rsVarRange}]`
);
const reUnicode = RegExp(`${rsFitz}(?=${rsFitz})|${rsSymbol + rsSeq}`, 'g');
/* eslint-enable no-misleading-character-class */

const hasUnicode = str => reHasUnicode.test(str);
const unicodeToArray = str => str.match(reUnicode) || [];
const asciiToArray = str => str.split('');
const stringToArray = str =>
  hasUnicode(str) ? unicodeToArray(str) : asciiToArray(str);

function compareWildcars(text, rule) {
  const escapeRegex = str => str.replace(/([.*+^=!:${}()|[\]/\\])/g, '\\$1');
  const regexRule = `^${rule
    .split('*')
    .map(escapeRegex)
    .join('.*')}$`.replace(/\?/g, '.');
  return new RegExp(regexRule).test(text);
}

module.exports = {
  hasUnicode,
  unicodeToArray,
  asciiToArray,
  stringToArray,
  compareWildcars,
};
