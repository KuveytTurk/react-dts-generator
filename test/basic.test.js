import fs from 'fs';
import path from 'path';
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

    const file1 = fs.readFileSync(path.join(__dirname, 'tmp', 'basic.d.ts'), 'utf8');
    const file2 = fs.readFileSync(path.join(__dirname, 'typings', 'basic.d.ts'), 'utf8');

    assert.strictEqual(file1, file2);
  });
});
