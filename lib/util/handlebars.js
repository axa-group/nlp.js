const handlebarRegex = /{{(\w+)}}/;

const matchReplace = (str, match, val) => {
  const regexStr = `{{${match}}}`;
  const regex = new RegExp(regexStr, 'g');
  return str.replace(regex, val);
};

function resolveTemplate(str, values) {
  let strUpdate = str;
  const objVals = Object.keys(values);
  const len = objVals.length;
  for (let idx = 0; idx < len; idx += 1) {
    const matches = handlebarRegex.exec(strUpdate);
    if (matches) {
      const objVal = objVals[idx];
      if (matches[1] === objVal) {
        const newVal = values[objVal];
        strUpdate = matchReplace(strUpdate, matches[1], newVal);
      }
    }
  }
  return strUpdate;
}

module.exports = { resolveTemplate };
