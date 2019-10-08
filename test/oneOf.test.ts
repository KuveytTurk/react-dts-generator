import * as fs from 'fs';
import * as path from 'path';
import { assert } from 'chai';
import { generate } from '../src';

describe('OneOf test', () => {
	before(() => {
		if (!fs.existsSync(path.join(__dirname, 'tmp'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp'));
		}
		if (!fs.existsSync(path.join(__dirname, 'tmp', 'oneOf'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp', 'oneOf'));
		}
	});

	it('should create typings with basic', () => {
		const result = generate({
			input: path.join(__dirname, '..', '..', 'baselines', 'oneOf', 'basic.js'),
			output: path.join(__dirname, 'tmp', 'oneOf', 'basic.d.ts'),
		});

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'oneOf', 'basic.d.ts');
		const baseline = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(result, baseline);

	});
});
