import * as fs from 'fs';
import * as path from 'path';
import { assert } from 'chai';
import { generate } from '../src';

describe('Func props', () => {
	before(() => {
		if (!fs.existsSync(path.join(__dirname, 'tmp'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp'));
		}
		if (!fs.existsSync(path.join(__dirname, 'tmp', 'func'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp', 'func'));
		}
	});

	it('should create func props', () => {
		const result = generate({
			input: path.join(__dirname, '..', '..', 'baselines', 'func', 'basic.js'),
			output: path.join(__dirname, 'tmp', 'func', 'basic.d.ts'),
		});

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'func', 'basic.d.ts');
		const baseline = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(result, baseline);
	});
});
