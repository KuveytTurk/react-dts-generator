import * as React from "react";

declare interface Shape {
  foo?: number;
  bar: string;
}

declare interface First {
  foo?: number | boolean;
  bar?: string;
  baz?: any;
  shape?: object | Shape;
}

export interface OneOfTypeProps {
  first?: First;
}

export default class OneOfType extends React.Component<OneOfTypeProps> {}
