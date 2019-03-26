import * as React from "react";

export interface OneOfComponentProps {
  oneOfString?: "foo" | "bar";
  oneOfNumber: 1 | 2 | 3;
}

export default class OneOfComponent extends React.Component<
  OneOfComponentProps
> {}
