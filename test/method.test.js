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
  });
});
