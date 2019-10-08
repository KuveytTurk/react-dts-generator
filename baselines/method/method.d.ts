import * as React from "react";

export interface MethodComponentProps {
  temp?: any;
}

export default class MethodComponent extends React.Component<
  MethodComponentProps
> {
  foo(number: number): number;
  bar(): string;
  multiple(first: number, second: string): any[];
  getInstance(): this;
}
