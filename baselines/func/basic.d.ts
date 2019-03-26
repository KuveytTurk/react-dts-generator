import * as React from 'react';

export interface FuncComponentProps {
    checkResult?(stringParam: string): boolean;
    onChange(number: number): void;
}

export default class FuncComponent extends React.Component<FuncComponentProps> {
}

