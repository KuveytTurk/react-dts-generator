import * as fs from 'fs';
import { parse as DocParser } from 'react-docgen';
import CommentParser from 'comment-parser';
import * as dom from './dts-dom';
import * as Utils from './utils';

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

export function generate(options: Options): string {
	const content: string = fs.readFileSync(options.input, 'utf8');
	const componentInfo = DocParser(content);
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

					if (Utils.isFuncProp(props[key].type.name)) {
						const result = CommentParser(Utils.makeComment(props[key].description));
						if (result && result.length > 0) {
							const signature = result[0];
							const parameters: dom.Parameter[] = [];
							let returnType: dom.Type = dom.type.void;

							signature.tags.forEach(item => {
								if (item.tag === 'param') {
									const type = item.type ? item.type : 'any';
									parameters.push(dom.create.parameter(item.name, Utils.getType(type)));
								} else if (item.tag === 'return') {
									returnType = Utils.getType(item.type);
								}
							});
							propsDefinition.members.push(dom.create.method(key, parameters, returnType));
						}
					} else {
						propsDefinition.members.push(dom.create.property(key, Utils.getType(props[key].type.name), flag));
					}
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
						parameters.push(dom.create.parameter(param.name, Utils.getType(type)));
					});
				}
				const returnType = returns ? returns.type.name : 'any';
				classDefinition.members.push(dom.create.method(method.name, parameters, Utils.getType(returnType)));
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
