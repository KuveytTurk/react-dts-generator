# react-dts-generator 

This module creates typescript definitons for the react components.

## Installation

```sh
## npm
npm install react-dts-generator
## yarn
yarn add react-dts-generator
```


## Usage

```js
import { generate } from 'react-dts-generator';
const result = generate(options);
```

### Options

#### `input: string`

The `.js` file that contains React Component. `react-dts-generator` use the [`react-docgen`](https://github.com/reactjs/react-docgen) library to generate props and methods. The input file format guideline:

- Modules have to export a single component, and only that component is analyzed.
- When using `React.createClass`, the component definition (the value passed to it) must resolve to an object literal.
- When using classes, the class must either `extend React.Component` _or_ define a `render()` method.
- `propTypes` must be an object literal or resolve to an object literal in the same file.
- The `return` statement in `getDefaultProps` must contain an object literal.

#### `output: string`

The `.d.ts` file that contains typescript definitions. If not specified output file will be exported to the same location of the input file.


#### `isBaseClass?: boolean`

If the input component is a base class for another components the typings could be generate with generic prop types like below. Then, another components could pass own props to the base class declaration.


```ts
export default class BaseClass<T = any> extends React.Component<T> {
```

#### `extends?: { includePropsAsGeneric: boolean, import: ImportType }`

If the input component inherits from another component, base class could be import.

- ```includePropsAsGeneric: boolean```
Should the props of the input component pass to the base class?

```ts
export default class BaseClass<T = any> extends React.Component<T> {
```

- ```import: ImportType```
Indicates that base class import location.

#### `propTypesComposition: ImportType[]`

If the component propTypes has composes by another component's propTypes, and typescript definitions of the other component were already generated they could be imported and generated types extend from them.

```js
		const result = generate({
			input: path.join(__dirname, '..', '..', 'baselines', 'compose', 'module.js'),
			output: path.join(__dirname, 'tmp', 'compose', 'module.d.ts'),
			propTypesComposition: [{
				named: 'BasicComponentProps',
				from: '../basic/basic',
			},
			{
				named: 'ComponentBaseProps',
				from: '@kuveytturk/boa-base/ComponentBase',
			}],

		});
```

### Samples

Checkout the [baselines](https://github.com/KuveytTurk/react-dts-generator/tree/master/baselines).



### Known Issues

- These propTypes generated as `any`
	-	`PropTypes.symbol`
	-	`PropTypes.elementType`
	-	`PropTypes.instanceOf` 
	-	`PropTypes.objectOf` 
	-	`PropTypes.exact`

- Custom propTypes is not supported.