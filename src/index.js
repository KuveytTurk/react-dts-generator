import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import { parse } from 'react-docgen';

function run(options = {}) {
  const content = fs.readFileSync(options.input);
  const componentInfo = parse(content);
  if (componentInfo) {
    let result = `import * as React from 'react'\r\n\r\n`;
    if (componentInfo.props) {
      const props = componentInfo.props;
      const keys = Object.keys(props);
      result += `declare interface ${componentInfo.displayName}Props {\r\n`;

      if (keys.length > 0) {
        keys.forEach((key, index) => {
          const required = props[key].required;
          result += `  ${key}${required ? '?' : ''}: ${props[key].type.name};`
          if (index !== keys.length - 1) {
            result += `\r\n`;
          }
        });
      }
      result += `\r\n}\r\n\r\n`
    }

    if (componentInfo.methods) {
      result += `declare interface ${componentInfo.displayName}Instance {\r\n`;
      componentInfo.methods.forEach((method, index) => {
        const { params, returns } = method;
        let parameters = '(';
        if (params && params.length > 0) {
          params.forEach((param) => {
            parameters += `${param.name}: ${param.type ? param.type.name : 'any'},`
          });
        }
        parameters += ')';
        result += `  ${method.name}${parameters}: ${returns ? returns.type.name : 'any'};`

      });
      result += `\r\n}\r\n\r\n`
    }

    result += `export default class ${componentInfo.displayName} extends React.Component<BasicComponentProps> { }\r\n`
    result = prettier.format(result, { parser: 'babel' });
    if (result) {
      const fileName = options.output || options.input.split('.')[0] + '.d.ts';
      fs.writeFileSync(
        fileName,
        result,
        { flag: 'w', encoding: 'utf8' },
      );
    }
  }
}

export default run;
