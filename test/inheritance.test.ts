import * as fs from 'fs';
import * as path from 'path';
import { assert } from 'chai';
import { generate } from '../src';

describe('Inheritance test', () => {
	before(() => {
		if (!fs.existsSync(path.join(__dirname, 'tmp'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp'));
		}
		if (!fs.existsSync(path.join(__dirname, 'tmp', 'inheritance'))) {
			fs.mkdirSync(path.join(__dirname, 'tmp', 'inheritance'));
		}
	});

	it('should create base type', () => {
		const result = generate({
			input: path.join(__dirname, '..', '..', 'baselines', 'inheritance', 'base.js'),
			output: path.join(__dirname, 'tmp', 'inheritance', 'base.d.ts'),
			isBaseClass: true,
		});

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'inheritance', 'base.d.ts');
		const baseline = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(result, baseline);
	});

	it('should create with inheritance', () => {
		const result = generate({
			input: path.join(__dirname, '..', '..', 'baselines', 'inheritance', 'basic.js'),
			output: path.join(__dirname, 'tmp', 'inheritance', 'basic.d.ts'),
			extends: {
				includePropsAsGeneric: true,
				import: {
					from: './base',
					default: 'BaseClass',
				},
			},
		});

		const basePath = path.join(__dirname, '..', '..', 'baselines', 'inheritance', 'basic.d.ts');
		const baseline = fs.readFileSync(basePath, 'utf-8');

		assert.strictEqual(result, baseline);
	});
});
