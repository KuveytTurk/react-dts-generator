import * as React from 'react';

export interface ArrayOfComponentProps {
    arrayOfString?: string[];
    arrayOfNumber: number[];
}

export default class ArrayOfComponent extends React.Component<ArrayOfComponentProps> {
}

