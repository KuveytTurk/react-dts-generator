import * as fs from 'fs';
import * as path from 'path';
import { assert } from 'chai';
import { generate } from '../src';

describe('Shape test', () => {
	before(() => {
		if (!fs.existsSync(path.join(__dirname, 'tmp'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp'));
		}
		if (!fs.existsSync(path.join(__dirname, 'tmp', 'shape'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp', 'shape'));
		}
	});

	it('should create typings with basically', () => {
		const result = generate({
			input: path.join(__dirname, '..', '..', 'baselines', 'shape', 'basic.js'),
			output: path.join(__dirname, 'tmp', 'shape', 'basic.d.ts'),
		});

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'shape', 'basic.d.ts');
		const baseline = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(result, baseline);
	});

	it('should create typings with nested shape', () => {
		const result = generate({
			input: path.join(__dirname, '..', '..', 'baselines', 'shape', 'nested.js'),
			output: path.join(__dirname, 'tmp', 'shape', 'nested.d.ts'),
		});

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'shape', 'nested.d.ts');
		const baseline = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(result, baseline);
	});

	it('should create typings with oneOfType', () => {
		const result = generate({
			input: path.join(__dirname, '..', '..', 'baselines', 'shape', 'withOneOfType.js'),
			output: path.join(__dirname, 'tmp', 'shape', 'withOneOfType.d.ts'),
		});

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'shape', 'withOneOfType.d.ts');
		const baseline = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(result, baseline);
	});
});
