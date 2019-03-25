import * as React from 'react';

declare interface ArrayOfComponentProps {
    arrayOfString?: string[];
    arrayOfNumber: number[];
}

export default class ArrayOfComponent extends React.Component<ArrayOfComponentProps> {
}

