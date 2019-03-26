import * as React from "react";
import BaseClass from "./base";

export interface TestClassProps {
  foo?: any;
}

export default class TestClass extends BaseClass<TestClassProps> {}
