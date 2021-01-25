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

const { Recognizers } = require('@nlpjs/builtin-default');

function findEntity(edges, entity, typeName) {
  for (let i = 0; i < edges.length; i += 1) {
    if (
      edges[i].entity === entity &&
      (!typeName || (typeName && edges[i].resolution.type === typeName))
    ) {
      return edges[i];
    }
  }
  return undefined;
}

async function validatorBuiltin(
  session,
  context,
  params,
  builtinsName,
  entityName,
  typeName
) {
  const variableName = params[0] || '_lastVariable';
  const text = session.text.trim();
  const container = session.bot ? session.bot.container : undefined;
  const locale = context.locale || 'en';
  const input = {
    locale,
    text,
    builtins: builtinsName,
  };
  if (container) {
    const builtin = container.get(`extract-builtin-${locale}`);
    if (builtin) {
      const result = await builtin.extract(input);
      const entity = findEntity(result.edges, entityName);
      if (entity) {
        return {
          isValid: true,
          changes: [
            {
              name: variableName,
              value: entity.resolution.value || entity.resolution.strValue,
            },
          ],
        };
      }
      return { isValid: false };
    }
  }

  for (let i = 0; i < builtinsName.length; i += 1) {
    const recognizer = Recognizers[`recognize${builtinsName[i]}`];
    if (recognizer) {
      const edges = recognizer(text);
      if (edges && edges.length > 0) {
        const entity = findEntity(edges, entityName, typeName);
        if (entity) {
          return {
            isValid: true,
            changes: [
              {
                name: variableName,
                value: entity.resolution.value || entity.resolution.strValue,
              },
            ],
          };
        }
      }
    }
  }

  return { isValid: false };
}

function validatorEmail(session, context, params) {
  return validatorBuiltin(session, context, params, ['Email'], 'email');
}

function validatorURL(session, context, params) {
  return validatorBuiltin(session, context, params, ['URL'], 'url');
}

function validatorIP(session, context, params) {
  return validatorBuiltin(session, context, params, ['IpAddress'], 'ip');
}

function validatorIPv4(session, context, params) {
  return validatorBuiltin(
    session,
    context,
    params,
    ['IpAddress'],
    'ip',
    'ipv4'
  );
}

function validatorIPv6(session, context, params) {
  return validatorBuiltin(
    session,
    context,
    params,
    ['IpAddress'],
    'ip',
    'ipv6'
  );
}

function validatorPhoneNumber(session, context, params) {
  return validatorBuiltin(
    session,
    context,
    params,
    ['PhoneNumber'],
    'phonenumber'
  );
}

function validatorNumber(session, context, params) {
  return validatorBuiltin(session, context, params, ['Number'], 'number');
}

function validatorInteger(session, context, params) {
  return validatorBuiltin(
    session,
    context,
    params,
    ['Number'],
    'number',
    'integer'
  );
}

function validatorDate(session, context, params) {
  return validatorBuiltin(
    session,
    context,
    params,
    ['Date', 'DateTime'],
    'date'
  );
}

module.exports = {
  validatorBuiltin,
  validatorEmail,
  validatorURL,
  validatorIP,
  validatorIPv4,
  validatorIPv6,
  validatorPhoneNumber,
  validatorNumber,
  validatorInteger,
  validatorDate,
};
