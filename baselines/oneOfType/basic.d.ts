import * as React from "react";

export interface OneOfTypeComponentProps {
  oneOfStringOrNumber?: string | number;
  anyType?: any;
  oneOfBoolOrObject: boolean | object;
}

export default class OneOfTypeComponent extends React.Component<
  OneOfTypeComponentProps
> {}
