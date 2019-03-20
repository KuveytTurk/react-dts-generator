import * as dom from 'dts-dom';
import * as fs from 'fs';
import { parse } from 'react-docgen';
import getType from './getType';

export interface Options {
	input: string;
	output: string;
}

function run(options: Options) {
	const content: string = fs.readFileSync(options.input, 'utf8');
	const componentInfo = parse(content);
	let result: string = '';

	if (componentInfo) {
		const importDefinition = dom.create.importAll('React', 'react');
		result += dom.emit(importDefinition);

		if (componentInfo.props) {
			const props = componentInfo.props;
			const keys = Object.keys(props);
			const propsDefinition = dom.create.interface(`${componentInfo.displayName}Props`);

			if (keys.length > 0) {
				keys.forEach(key => {
					const required = props[key].required;
					const flag = required ? dom.DeclarationFlags.None : dom.DeclarationFlags.Optional;
					const prop = dom.create.property(key, getType(props[key].type.name), flag);
					propsDefinition.members.push(prop);
				});
			}
			result += dom.emit(propsDefinition);
		}

		const classDefinition = dom.create.class(`${componentInfo.displayName}`, dom.DeclarationFlags.ExportDefault);
		// @ts-ignore
		classDefinition.baseType = `React.Component<${componentInfo.displayName}Props>`;

		if (componentInfo.methods) {
			componentInfo.methods.forEach(method => {
				const { params, returns } = method;
				const parameters: dom.Parameter[] = [];
				if (params && params.length > 0) {
					params.forEach(param => {
						const type = param.type ? param.type.name : 'any';
						parameters.push(dom.create.parameter(param.name, getType(type)));
					});
				}
				const returnType = returns ? returns.type.name : 'any';
				classDefinition.members.push(dom.create.method(method.name, parameters, getType(returnType)));
			});
		}

		result += dom.emit(classDefinition);
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
