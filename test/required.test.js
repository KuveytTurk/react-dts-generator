import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import run from '../src';

describe('Required test', () => {
  it('should create typings with required', () => {
    run({
      input: path.join(__dirname, 'required.js'),
      output: path.join(__dirname, 'tmp', 'required.d.ts'),
    });

    const file1 = fs.readFileSync(path.join(__dirname, 'tmp', 'required.d.ts'), 'utf8');
    const file2 = fs.readFileSync(path.join(__dirname, 'typings', 'required.d.ts'), 'utf8');

    assert.strictEqual(file1, file2);
  });
});
