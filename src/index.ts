import * as dom from 'dts-dom';
import * as fs from 'fs';
import { parse } from 'react-docgen';
import getType from './getType';

export interface CompositionType {
	named?: string;
	default?: string;
	from: string;
}

export interface Options {
	input: string;
	output: string;
	propTypesComposition?: CompositionType[];
}

export declare type ImportType = dom.ImportAllDeclaration | dom.ImportDefaultDeclaration | dom.ImportNamedDeclaration;

function run(options: Options): string {
	const content: string = fs.readFileSync(options.input, 'utf8');
	const componentInfo = parse(content);
	let result: string = '';
	const importDefinitions: ImportType[] = [];
	if (componentInfo) {
		const importDefinition = dom.create.importAll('React', 'react');
		importDefinitions.push(importDefinition);

		if (componentInfo.props) {
			const props = componentInfo.props;
			const keys = Object.keys(props);
			const propsDefinition = dom.create.interface(`${componentInfo.displayName}Props`);

			if (options.propTypesComposition && options.propTypesComposition.length > 0) {
				propsDefinition.baseTypes = [];
				options.propTypesComposition.forEach(x => {
					if (x.default) {
						importDefinitions.push(dom.create.importDefault(x.default, x.from));
						// @ts-ignore
						propsDefinition.baseTypes.push(x.default);
					} else if (x.named) {
						importDefinitions.push(dom.create.importNamed(x.named, x.from));
						// @ts-ignores
						propsDefinition.baseTypes.push(x.named);
					}
				});
			}

			if (keys.length > 0) {
				keys.forEach(key => {
					const required = props[key].required;
					const flag = required ? dom.DeclarationFlags.None : dom.DeclarationFlags.Optional;
					const prop = dom.create.property(key, getType(props[key].type.name), flag);
					propsDefinition.members.push(prop);
				});
			}
			importDefinitions.forEach(item => result += dom.emit(item));
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

	return result;
}

export default run;
