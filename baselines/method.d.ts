import * as React from 'react';

declare interface BasicComponentProps {
    temp?: any;
}

export default class BasicComponent extends React.Component<BasicComponentProps> {
    foo(number: number): number;
    bar(): string;
    multiple(first: number, second: string): any[];
}

