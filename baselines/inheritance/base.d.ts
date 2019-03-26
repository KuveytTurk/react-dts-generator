import * as React from "react";

export interface BaseClassProps {
  foo?: any;
}

export default class BaseClass<T = any> extends React.Component<T> {
  foo(): any;
  bar(): any;
}
