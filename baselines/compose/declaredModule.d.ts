declare module "myDeclaredComponent" {
  import * as React from "react";

  export interface MyDeclaredComponentProps {
    temp?: any;
  }

  export default class MyDeclaredComponent extends React.Component<
    MyDeclaredComponentProps
  > {}
}
