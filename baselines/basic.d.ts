import * as React from 'react';

declare interface BasicComponentProps {
    arrayProp?: any[];
    boolProp?: boolean;
    numberProp?: number;
    objectProp?: object;
    stringProp?: string;
    anyProp?: any;
}

export default class BasicComponent extends React.Component<BasicComponentProps> {
}

