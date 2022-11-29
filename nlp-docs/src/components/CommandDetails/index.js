import React from 'react';
import CodeBlock from '@theme/CodeBlock';

const getParametersTable = (parameters) => (
  <table class="dlg-parameterTable">
    <thead>
      <th>Position</th>
      <th>Optional</th>
      <th>Description</th>
    </thead>
    <tbody>
      {parameters.map((param, i) => (
        <tr>
          <td>{i + 1}</td>
          <td>{`${param.opt}`}</td>
          <td>
            <div dangerouslySetInnerHTML={{ __html: param.desc }} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default function CommandDetails({ description, parameters, syntax, examples }) {
  return (
    <div class="commandDetails">
      {description}
      <table>
        <tbody>
          <tr>
            <td>Syntax</td>
            <td cols>{syntax}</td>
          </tr>
          {parameters && parameters.length > 0 && (
            <tr>
              <td>Parameters</td>
              <td>{(parameters && getParametersTable(parameters)) || <td>None</td>}</td>
            </tr>
          )}
        </tbody>
      </table>

      {examples && examples.length > 0 && (
        <div>
          <h3>Usage examples</h3>
          <table>
            {examples.map((example) => (
              <tr>
                <td>
                  <CodeBlock>
                    <div dangerouslySetInnerHTML={{ __html: example.example }} />
                  </CodeBlock>{' '}
                </td>
                <td>
                  <div dangerouslySetInnerHTML={{ __html: example.text }} />
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
    </div>
  );
}
