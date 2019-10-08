import * as React from "react";

export interface AnyFallbackComponentProps {
  invalidOptionalOneOf?: any;
  invalidOneOf: any;
}

export default class AnyFallbackComponent extends React.Component<
  AnyFallbackComponentProps
> {}
