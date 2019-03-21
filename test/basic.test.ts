import * as fs from 'fs';
import * as path from 'path';
import { assert } from 'chai';
import run from '../src';

describe('Basic test', () => {
	before(() => {
		if (!fs.existsSync(path.join(__dirname, 'tmp'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp'));
		}
		if (!fs.existsSync(path.join(__dirname, 'tmp', 'basic'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp', 'basic'));
		}
	});

	it('should create typings with basically', () => {
		const result = run({
			input: path.join(__dirname, '..', '..', 'baselines', 'basic', 'basic.js'),
			output: path.join(__dirname, 'tmp', 'basic', 'basic.d.ts'),
		});

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'basic', 'basic.d.ts');
		const baseline = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(result, baseline);
	});

	it('should create typings with required', () => {
		const result = run({
			input: path.join(__dirname, '..', '..', 'baselines', 'basic', 'required.js'),
			output: path.join(__dirname, 'tmp', 'basic', 'required.d.ts'),
		});

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'basic', 'required.d.ts');
		const baseline = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(result, baseline);

	});
});
