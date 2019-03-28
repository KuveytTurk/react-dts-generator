import * as dom from './dts-dom';
import CommentParser from 'comment-parser';
import { Prop, Props, Type, ValueArray } from 'react-docgen';

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

	function generateShape(name: string, type: Type, flag: dom.DeclarationFlags): PropResult {
		const shapeDefinition = dom.create.interface(getDeclarationName(name));
		if (typeof type.value === 'object') {
			const shapeProp = type.value as Props;
			Object.keys(shapeProp).forEach(key => {
				const { required, name } = shapeProp[key];
				const flag = required ? dom.DeclarationFlags.None : dom.DeclarationFlags.Optional;
				shapeDefinition.members.push(dom.create.property(key, getType(name), flag));
			});
			const property = dom.create.property(name, getDeclarationName(name), flag);
			const interfaces = [shapeDefinition];
			return { property, interfaces };
		}
	}

	function generateArrayOf(name: string, type: Type, flag: dom.DeclarationFlags): PropResult {
		const arrayValue = type.value as Prop;
		if (typeof arrayValue === 'object') {
			const property = dom.create.property(name, dom.type.array(getType(arrayValue.name)), flag);
			return { property };
		}
	}

	function genereteOneOf(name: string, type: Type, flag: dom.DeclarationFlags): PropResult {
		let unions = '';
		const values = type.value as ValueArray;
		values.forEach(item => {
			unions += `${item.value as string} | `;
		});
		unions = unions.substr(0, unions.length - 3);
		const property = dom.create.property(name, unions, flag);
		return { property };
	}

	function genereteOneOfType(name: string, type: Type, flag: dom.DeclarationFlags): PropResult {
		let isAnyType: boolean = false;
		const unionTypes: dom.Type[] = [];
		const values = type.value as ValueArray;
		values.forEach(item => {
			const t = getType(item.name);
			if (t === dom.type.any) {
				isAnyType = true;
			}
			unionTypes.push(getType(item.name));
		});
		const union = dom.create.union(unionTypes);
		const property = dom.create.property(name, isAnyType ? dom.type.any : union, flag);
		return { property };
	}

	function makeComment(doc: string): string {
		return `/**\r\n ${doc} \r\n*/`;
	}

	function getDeclarationName(prop: string): string {
		return prop.charAt(0).toUpperCase() + prop.slice(1);
	}

	const { name, required, type, description } = prop;
	const flag = required ? dom.DeclarationFlags.None : dom.DeclarationFlags.Optional;
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
		case 'shape': return generateShape(name, type, flag);
		case 'arrayof': return generateArrayOf(name, type, flag);
		case 'enum': return genereteOneOf(name, type, flag);
		case 'union': return genereteOneOfType(name, type, flag);
		default: return generate(name, dom.type.any, flag);
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

