import * as fs from 'fs';
import * as path from 'path';
import { assert } from 'chai';
import { generate } from '../src';

describe('Compose test', () => {
	before(() => {
		if (!fs.existsSync(path.join(__dirname, 'tmp'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp'));
		}

		if (!fs.existsSync(path.join(__dirname, 'tmp', 'compose'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp', 'compose'));
		}
	});

	it('should create typings with single compose', () => {
		const result = generate({
			input: path.join(__dirname, '..', '..', 'baselines', 'compose', 'single.js'),
			output: path.join(__dirname, 'tmp', 'compose', 'single.d.ts'),
			propTypesComposition: [{
				named: 'BasicComponentProps',
				from: '../basic/basic',
			}],
		});

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'compose', 'single.d.ts');
		const baseline = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(result, baseline);

	});

	it('should create typings with multiple compose', () => {
		const result = generate({
			input: path.join(__dirname, '..', '..', 'baselines', 'compose', 'multiple.js'),
			output: path.join(__dirname, 'tmp', 'compose', 'multiple.d.ts'),
			propTypesComposition: [{
				named: 'BasicComponentProps',
				from: '../basic/basic',
			},
			{
				named: 'RequiredComponentProps',
				from: '../basic/required',
			}],
		});

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'compose', 'multiple.d.ts');
		const baseline = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(result, baseline);
	});

	it('should create typings with module compose', () => {
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

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'compose', 'module.d.ts');
		const baseline = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(result, baseline);
	});
});
