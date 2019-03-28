import * as React from "react";

declare interface Baz {
  foo?: number;
  bar?: string;
}

declare interface ObjectOrShape {
  foo?: number;
  bar?: string;
  baz?: Baz;
}

export interface WithShapeProps {
  objectOrShape?: object | ObjectOrShape;
}

export default class WithShape extends React.Component<WithShapeProps> {}
