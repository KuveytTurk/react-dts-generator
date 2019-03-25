import * as React from 'react';

declare interface MethodComponentProps {
    temp?: any;
}

export default class MethodComponent extends React.Component<MethodComponentProps> {
    foo(number: number): number;
    bar(): string;
    multiple(first: number, second: string): any[];
}

