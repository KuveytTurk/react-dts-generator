import * as React from "react";
import { BasicComponentProps } from "../basic/basic";
import { RequiredComponentProps } from "../basic/required";

export interface ComposedComponentProps
  extends BasicComponentProps,
    RequiredComponentProps {
  temp?: any;
}

export default class ComposedComponent extends React.Component<
  ComposedComponentProps
> {}
