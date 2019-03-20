import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import run from '../src';

describe('Instance methods', () => {
  it('should create instance methods', () => {
    run({
      input: path.join(__dirname, 'method.js'),
      output: path.join(__dirname, 'tmp', 'method.d.ts'),
    });

    const file1 = fs.readFileSync(path.join(__dirname, 'tmp', 'method.d.ts'), 'utf8');
    const file2 = fs.readFileSync(path.join(__dirname, 'typings', 'method.d.ts'), 'utf8');

    assert.strictEqual(file1, file2);
  });
});
