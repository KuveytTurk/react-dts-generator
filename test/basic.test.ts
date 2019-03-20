import * as fs from 'fs';
import * as path from 'path';
import { assert } from 'chai';
import run from '../src';

describe('Basic test', () => {
	before(() => {
		if (!fs.existsSync(path.join(__dirname, 'tmp'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp'));
		}
	});
	it('should create typings with basically', () => {
		run({
			input: path.join(__dirname, 'basic.js'),
			output: path.join(__dirname, 'tmp', 'basic.d.ts'),
		});

		const testPath = path.join(__dirname, 'tmp', 'basic.d.ts');
		const file1 = fs.readFileSync(testPath, 'utf8');

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'basic.d.ts');
		const file2 = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(file1, file2);
	});
});
