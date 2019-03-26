import * as React from "react";

declare interface First {
  foo?: number;
  bar?: string;
}

declare interface Second {
  foo?: object;
  bar?: boolean;
}

export interface ShapeComponentProps {
  first: First;
  second?: Second;
}

export default class ShapeComponent extends React.Component<
  ShapeComponentProps
> {}
