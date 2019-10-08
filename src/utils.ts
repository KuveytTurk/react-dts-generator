import * as dom from './dts-dom';
import CommentParser from 'comment-parser';
import { Prop, Props, ValueArray } from 'react-docgen';

export type PropResult = PropDeclaration | undefined;
export interface PropDeclaration {
	property: dom.ObjectTypeMember;
	interfaces?: dom.InterfaceDeclaration[];
}

export function getType(type: string): dom.Type {
	switch (type.toLowerCase()) {
		case 'any': return dom.type.any;
		case 'array': return dom.type.array(dom.type.any);
		case 'bool': return dom.type.boolean;
		case 'number': return dom.type.number;
		case 'object': return dom.type.object;
		case 'string': return dom.type.string;
		case 'this': return dom.type.this;
		case 'element': return 'React.ReactElement<any>';
		case 'node': return 'React.ReactNode';
		case 'shape': return type;
		default: return dom.type.any;
	}
}

export function generateProp(prop: Prop): PropResult {
	function generate(name: string, type: dom.Type, flag: dom.DeclarationFlags): PropResult {
		const property = dom.create.property(name, type, flag);
		return { property };
	}

	function generateFunc(name: string, description: string, flag: dom.DeclarationFlags): PropResult {
		const result = CommentParser(makeComment(description));
		if (result && result.length > 0) {
			const signature = result[0];
			const parameters: dom.Parameter[] = [];
			let returnType: dom.Type = dom.type.void;

			signature.tags.forEach(item => {
				if (item.tag === 'param') {
					const type = item.type ? item.type : 'any';
					parameters.push(dom.create.parameter(item.name, getType(type)));
				} else if (item.tag === 'return') {
					returnType = getType(item.type);
				}
			});
			const property = dom.create.method(name, parameters, returnType, flag);
			return { property };
		}
	}

	function generateShape(name: string, props: Props, flag: dom.DeclarationFlags): PropDeclaration {
		const interfaces: dom.InterfaceDeclaration[] = [];
		const shapeDefinition = generateShapeInterface(name, props, interfaces);
		const property = dom.create.property(name, shapeDefinition.name, flag);
		return { property, interfaces };
	}

	function generateArrayOf(name: string, prop: Prop, flag: dom.DeclarationFlags): PropDeclaration {
		const property = dom.create.property(name, dom.type.array(getType(prop.name)), flag);
		return { property };
	}

	function generateOneOf(name: string, values: ValueArray, flag: dom.DeclarationFlags): PropDeclaration {
		let unions = '';
		values.forEach(item => unions += `${item.value as string} | `);
		unions = unions.substr(0, unions.length - 3);
		const property = dom.create.property(name, unions, flag);
		return { property };
	}

	function generateOneOfType(name: string, values: ValueArray, flag: dom.DeclarationFlags): PropDeclaration {
		let isAnyType: boolean = false;
		const unionTypes: dom.Type[] = [];
		const interfaces: dom.InterfaceDeclaration[] = [];

		values.forEach(item => {
			const t = getType(item.name);
			if (t === dom.type.any) {
				isAnyType = true;
			} else if (t === 'shape') {
				const shapeDefinition = generateShapeInterface(name, item.value as Props, interfaces);
				unionTypes.push(shapeDefinition.name);
			} else {
				unionTypes.push(getType(item.name));
			}
		});
		const union = dom.create.union(unionTypes);
		const property = dom.create.property(name, isAnyType ? dom.type.any : union, flag);
		return { property, interfaces };
	}

	function generateShapeInterface(name: string, props: Props, shapes: dom.InterfaceDeclaration[]): dom.InterfaceDeclaration {
		const interfaceName = getDeclarationName(name);
		const shapeDefinition = dom.create.interface(interfaceName);

		Object.keys(props).forEach(key => {
			const { required, name } = props[key];
			const flag = required ? dom.DeclarationFlags.None : dom.DeclarationFlags.Optional;
			const type = getType(name);

			if (type === 'shape') {
				const childShape = generateShapeInterface(key, props[key].value as Props, shapes);
				shapeDefinition.members.push(dom.create.property(key, childShape.name, flag));
			} else if (name === 'union') {
				const union = generateOneOfType(key, props[key].value as ValueArray, flag);
				shapeDefinition.members.push(union.property);
				shapes.push(...union.interfaces || []);
			} else {
				shapeDefinition.members.push(dom.create.property(key, type, flag));
			}

		});

		shapes.push(shapeDefinition);
		return shapeDefinition;
	}

	function makeComment(doc: string): string {
		return `/**\r\n ${doc} \r\n*/`;
	}

	function getDeclarationName(prop: string): string {
		return prop.charAt(0).toUpperCase() + prop.slice(1);
	}

	const { name, required, type, description } = prop;
	const flag = required ? dom.DeclarationFlags.None : dom.DeclarationFlags.Optional;

	try {
		switch (type.name.toLowerCase()) {
			case 'any': return generate(name, dom.type.any, flag);
			case 'bool': return generate(name, dom.type.boolean, flag);
			case 'number': return generate(name, dom.type.number, flag);
			case 'object': return generate(name, dom.type.object, flag);
			case 'string': return generate(name, dom.type.string, flag);
			case 'this': return generate(name, dom.type.this, flag);
			case 'array': return generate(name, dom.type.array(dom.type.any), flag);
			case 'element': return generate(name, 'React.ReactElement<any>', flag);
			case 'node': return generate(name, 'React.ReactNode', flag);
			case 'func': return generateFunc(name, description, flag);
			case 'shape': return generateShape(name, type.value as Props, flag);
			case 'arrayof': return generateArrayOf(name, type.value as Prop, flag);
			case 'enum': return generateOneOf(name, type.value as ValueArray, flag);
			case 'union': return generateOneOfType(name, type.value as ValueArray, flag);
			default: return generate(name, dom.type.any, flag);
		}
	} catch (e) {
		return generate(name, dom.type.any, flag);
	}
}

export function writeGeneric(out: string, type: string): string {
	return `${out}<${type}>`;
}

export function createImport(from: string, defaultImport?: string, namedImport?: string): dom.Import {
	if (defaultImport) {
		return dom.create.importDefault(defaultImport, from);
	} else if (namedImport) {
		return dom.create.importNamed(namedImport, from);
	}
	return dom.create.import(from);
}
