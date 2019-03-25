import * as dom from './dts-dom';

export function getType(type: string): dom.Type {
	switch (type.toLowerCase()) {
		case 'any': return dom.type.any;
		case 'array': return dom.type.array(dom.type.any);
		case 'bool': return dom.type.boolean;
		case 'number': return dom.type.number;
		case 'object': return dom.type.object;
		case 'string': return dom.type.string;
		case 'element': return 'React.ReactElement<any>';
		case 'node': return 'React.ReactNode';
		default: return dom.type.any;
	}
}

export function isFuncProp(type: string): boolean {
	return type === 'func';
}

export function isShapeProp(type: string): boolean {
	return type === 'shape';
}

export function isArrayOfProp(type: string): boolean {
	return type === 'arrayOf';
}

export function isOneOfProp(type: string): boolean {
	return type === 'enum';
}

export function makeComment(doc: string): string {
	return `/**\r\n ${doc} \r\n*/`;
}

export function getDeclarationName(prop: string): string {
	return prop.charAt(0).toUpperCase() + prop.slice(1);
}
