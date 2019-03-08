import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import run from '../src';

describe('Basic test', () => {
  it('should create typings with basically', () => {
    run({
      input: path.join(__dirname, 'basic.js'),
      output: path.join(__dirname, 'tmp', 'basic.d.ts'),
    });
  });
});
