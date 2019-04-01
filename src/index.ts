import * as fs from 'fs';
import * as prettier from 'prettier';
import { parse as DocParser } from 'react-docgen';
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
                    const prop = { ...props[key], name: key };
                    if (!prop.type) {
                        return;
                    }

                    const propResult = Utils.generateProp(prop);
                    if (propResult) {
                        const { property, interfaces } = propResult;
                        propsDefinition.members.push(property);
                        if (interfaces && interfaces.length > 0) {
                            interfaceDefinitions.push(...interfaces);
                        }
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
