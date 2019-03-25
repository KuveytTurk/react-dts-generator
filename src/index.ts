import * as fs from 'fs';
import { parse as DocParser, Props, Prop } from 'react-docgen';
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

export function generate(options: Options): string {
	const content: string = fs.readFileSync(options.input, 'utf8');
	const componentInfo = DocParser(content);
	let result: string = '';
	const importDefinitions: dom.Import[] = [];
	const interfaceDefinitions: dom.InterfaceDeclaration[] = [];

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
						propsDefinition.baseTypes.push(x.default);
					} else if (x.named) {
						importDefinitions.push(dom.create.importNamed(x.named, x.from));
						propsDefinition.baseTypes.push(x.named);
					}
				});
			}

			if (keys.length > 0) {
				keys.forEach(key => {
					const { required, type, description } = props[key];
					const flag = required ? dom.DeclarationFlags.None : dom.DeclarationFlags.Optional;

					if (Utils.isFuncProp(type.name)) {
						const result = CommentParser(Utils.makeComment(description));
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
							propsDefinition.members.push(dom.create.method(key, parameters, returnType, flag));
						}
					} else if (Utils.isShapeProp(type.name)) {
						const shapeDefinition = dom.create.interface(Utils.getDeclarationName(key));
						if (type.value && typeof type.value === 'object') {
							const shapeProp = type.value as Props;
							Object.keys(shapeProp).forEach(key => {
								const { required, name } = shapeProp[key];
								const flag = required ? dom.DeclarationFlags.None : dom.DeclarationFlags.Optional;
								shapeDefinition.members.push(dom.create.property(key, Utils.getType(name), flag));
							});
						}
						propsDefinition.members.push(dom.create.property(key, Utils.getDeclarationName(key), flag));
						interfaceDefinitions.push(shapeDefinition);
					} else if (Utils.isArrayOfProp(type.name)) {
						const arrayValue = type.value as Prop;
						if (arrayValue && typeof arrayValue === 'object') {
							propsDefinition.members.push(dom.create.property(key, dom.type.array(Utils.getType(arrayValue.name)), flag));
						}
					} else {
						propsDefinition.members.push(dom.create.property(key, Utils.getType(type.name), flag));
					}
				});
			}

			result += dom.emit(dom.create.imports(importDefinitions));
			interfaceDefinitions.forEach(x => result += dom.emit(x));
			result += dom.emit(propsDefinition);
		}

		const classDefinition = dom.create.class(`${componentInfo.displayName}`, dom.DeclarationFlags.ExportDefault);
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
