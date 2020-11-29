/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {
  regexEmail,
  regexURL,
  regexIPv4,
  regexIPv6,
  regexHexColor,
  regexTime,
  regexPhone,
  regexHashtag,
  regexNumber,
  regexDate,
} = require('./common-regex');

function recognize(text, regex, entityName, typeName) {
  let match = regex.exec(text);
  const result = [];
  while (match !== null) {
    const utteranceText = match[0];
    const obj = {
      start: match.index,
      end: match.index + utteranceText.length - 1,
      len: utteranceText.length,
      accuracy: 0.95,
      sourceText: utteranceText,
      utteranceText,
      entity: entityName,
      resolution: { value: utteranceText },
    };
    if (typeName) {
      obj.resolution.type = typeName;
    }
    result.push(obj);
    match = regex.exec(text);
  }
  return result;
}

const recognizeEmail = (text) => recognize(text, regexEmail, 'email');
const recognizeURL = (text) => recognize(text, regexURL, 'url');
const recognizeIPv4 = (text) => recognize(text, regexIPv4, 'ip', 'ipv4');
const recognizeIPv6 = (text) => recognize(text, regexIPv6, 'ip', 'ipv6');
const recognizeHexColor = (text) =>
  recognize(text, regexHexColor, 'color', 'hexcolor');
const recognizeTime = (text) => recognize(text, regexTime);
const recognizePhoneNumber = (text) =>
  recognize(text, regexPhone, 'phonenumber');
const recognizeIpAddress = (text) => {
  const ipv4 = recognizeIPv4(text);
  const ipv6 = recognizeIPv6(text);
  const result = [...ipv4, ...ipv6];
  return result;
};
const recognizeHashtag = (text) => recognize(text, regexHashtag, 'hashtag');
const recognizeNumber = (text) => {
  const numbers = recognize(text, regexNumber, 'number');
  for (let i = 0; i < numbers.length; i += 1) {
    const number = numbers[i];
    number.resolution.value = parseFloat(number.resolution.value);
    number.resolution.type = Number.isInteger(number.resolution.value)
      ? 'integer'
      : 'float';
    console.log(numbers[i]);
  }
  return numbers;
};

function toDate(s) {
  let day;
  let month;
  let year;
  if (s.indexOf('-') === -1) {
    year = parseInt(s.slice(6, 10), 10);
    month = parseInt(s.slice(3, 5), 10) - 1;
    day = parseInt(s.slice(0, 2), 10);
  } else {
    year = parseInt(s.slice(0, 4), 10);
    month = parseInt(s.slice(5, 7), 10) - 1;
    day = parseInt(s.slice(8, 10), 10);
  }
  const date = new Date(year, month, day, 0, 0, 0, 0);
  if (date.getDate() === day && date.getMonth() === month) {
    return date;
  }
  return undefined;
}

const recognizeDate = (text) => {
  let match = regexDate.exec(text);
  const result = [];
  while (match !== null) {
    const utteranceText = match[0];
    const date = toDate(utteranceText);
    if (date) {
      const obj = {
        start: match.index,
        end: match.index + utteranceText.length - 1,
        len: utteranceText.length,
        accuracy: 0.95,
        sourceText: utteranceText,
        utteranceText,
        entity: 'date',
        resolution: { value: date },
      };
      result.push(obj);
    }
    match = regexDate.exec(text);
  }
  return result;
};

module.exports = {
  recognize,
  recognizeEmail,
  recognizeURL,
  recognizeIPv4,
  recognizeIPv6,
  recognizeHexColor,
  recognizeTime,
  recognizePhoneNumber,
  recognizeIpAddress,
  recognizeHashtag,
  recognizeNumber,
  recognizeDate,
};
