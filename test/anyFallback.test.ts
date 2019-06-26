import * as fs from 'fs';
import * as path from 'path';
import { assert } from 'chai';
import { generate } from '../src';

describe('anyFallback test', () => {
	before(() => {
		if (!fs.existsSync(path.join(__dirname, 'tmp'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp'));
		}
		if (!fs.existsSync(path.join(__dirname, 'tmp', 'anyFallback'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp', 'anyFallback'));
		}
	});

	it('should create typings with basic', () => {
		const result = generate({
			input: path.join(__dirname, '..', '..', 'baselines', 'anyFallback', 'anyFallback.js'),
			output: path.join(__dirname, 'tmp', 'anyFallback', 'anyFallback.d.ts'),
		});

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'anyFallback', 'anyFallback.d.ts');
		const baseline = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(result, baseline);

	});
});
