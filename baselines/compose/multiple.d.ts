import * as React from "react";
import { BasicComponentProps, RequiredComponentProps } from "../basic";

export interface ComposedComponentProps
  extends BasicComponentProps,
    RequiredComponentProps {
  temp?: any;
}

export default class ComposedComponent extends React.Component<
  ComposedComponentProps
> {}
