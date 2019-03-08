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
  });
});
