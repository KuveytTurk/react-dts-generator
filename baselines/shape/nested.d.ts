import * as React from "react";

declare interface Baz {
  foo?: number;
  bar?: string;
}

declare interface Nested {
  foo?: number;
  bar?: string;
  baz?: Baz;
}

export interface NestedShapeProps {
  nested?: Nested;
}

export default class NestedShape extends React.Component<NestedShapeProps> {}
