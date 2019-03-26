import * as fs from 'fs';
import * as prettier from 'prettier';
import { parse as DocParser, Props, Prop, ValueArray } from 'react-docgen';
import CommentParser from 'comment-parser';
import * as dom from './dts-dom';
import * as Utils from './utils';

export interface ImportType {
    named?: string;
    default?: string;
    from: string;
}

export interface Extends {
    includePropsAsGeneric?: boolean;
    import: ImportType;
}

export interface Options {
    input: string;
    output: string;
    isBaseClass?: boolean;
    propTypesComposition?: ImportType[];
    extends?: Extends;
    imports?: ImportType[];
}

export function generate(options: Options): string {
    let result: string = '';
    let baseType: string = 'React.Component';

    const { input, output, isBaseClass, propTypesComposition, imports } = options;

    const content: string = fs.readFileSync(input, 'utf8');
    const componentInfo = DocParser(content);
    const className = isBaseClass ? Utils.writeGeneric(componentInfo.displayName, 'T = any') : componentInfo.displayName;

    const importDefinitions: dom.Import[] = [];
    const interfaceDefinitions: dom.InterfaceDeclaration[] = [];

    if (componentInfo) {
        const propsIntefaceName = `${componentInfo.displayName}Props`;
        const propsDefinition = dom.create.interface(propsIntefaceName, dom.DeclarationFlags.Export);
        const importDefinition = dom.create.importAll('React', 'react');
        const classDefinition = dom.create.class(className, dom.DeclarationFlags.ExportDefault);

        importDefinitions.push(importDefinition);

        if (imports && imports.length > 0) {
            imports.forEach(x => {
                importDefinitions.push(Utils.createImport(x.from, x.default, x.named));
            });
        }

        if (componentInfo.props) {
            const props = componentInfo.props;
            const keys = Object.keys(props);

            if (keys.length > 0) {
                keys.forEach(key => {
                    const { required, type, description } = props[key];
                    const flag = required ? dom.DeclarationFlags.None : dom.DeclarationFlags.Optional;

                    if (!type) {
                        return;
                    }

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
                    } else if (Utils.isOneOfProp(type.name)) {
                        const values = type.value as ValueArray;
                        let unions = '';
                        values.forEach(item => {
                            unions += `${item.value as string} | `;
                        });
                        unions = unions.substr(0, unions.length - 3);
                        propsDefinition.members.push(dom.create.property(key, unions, flag));

                    } else if (Utils.isOneOfTypeProp(type.name)) {
                        let isAnyType: boolean = false;
                        const unionTypes: dom.Type[] = [];
                        const values = type.value as ValueArray;
                        values.forEach(item => {
                            const t = Utils.getType(item.name);
                            if (t === dom.type.any) {
                                isAnyType = true;
                            }
                            unionTypes.push(Utils.getType(item.name));
                        });
                        const union = dom.create.union(unionTypes);
                        propsDefinition.members.push(dom.create.property(key, isAnyType ? dom.type.any : union, flag));
                    } else {
                        propsDefinition.members.push(dom.create.property(key, Utils.getType(type.name), flag));
                    }
                });
            }

            baseType = Utils.writeGeneric('React.Component', isBaseClass ? 'T' : propsIntefaceName);
            interfaceDefinitions.push(propsDefinition);
        }

        if (propTypesComposition && propTypesComposition.length > 0) {
            propsDefinition.baseTypes = [];
            propTypesComposition.forEach(x => {
                importDefinitions.push(Utils.createImport(x.from, x.default, x.named));
                propsDefinition.baseTypes.push(x.default as string || x.named as string);
            });
        }

        if (options.extends) {
            if (options.extends.import) {
                const { from, named } = options.extends.import;
                importDefinitions.push(Utils.createImport(from, options.extends.import.default, named));
                const baseTypeName = named as string || options.extends.import.default as string;
                const genericName = isBaseClass ? 'T' : propsIntefaceName;
                baseType = Utils.writeGeneric(baseTypeName, genericName);
            }
        }


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

        result += dom.emit(dom.create.imports(importDefinitions));
        interfaceDefinitions.forEach(x => result += dom.emit(x));
        classDefinition.baseType = baseType;
        result += dom.emit(classDefinition);

        if (result) {
            const fileName = output || input.split('.')[0] + '.d.ts';
            result = prettier.format(result, { parser: 'typescript' });
            fs.writeFileSync(fileName, result, { flag: 'w', encoding: 'utf8' });
            return result;
        }
    }

    return '';
}
