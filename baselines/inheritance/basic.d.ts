import * as React from 'react';
import BaseClass from './base';

declare interface TestClassProps {
    foo?: any;
}

export default class TestClass extends BaseClass<TestClassProps> {
}

