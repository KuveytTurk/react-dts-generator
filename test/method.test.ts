import * as fs from 'fs';
import * as path from 'path';
import { assert } from 'chai';
import run from '../src';

describe('Instance methods', () => {
	before(() => {
		if (!fs.existsSync(path.join(__dirname, 'tmp'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp'));
		}
		if (!fs.existsSync(path.join(__dirname, 'tmp', 'method'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp', 'method'));
		}
	});

	it('should create instance methods', () => {
		const result = run({
			input: path.join(__dirname, '..', '..', 'baselines', 'method', 'method.js'),
			output: path.join(__dirname, 'tmp', 'method', 'method.d.ts'),
		});

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'method', 'method.d.ts');
		const baseline = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(result, baseline);
	});
});
