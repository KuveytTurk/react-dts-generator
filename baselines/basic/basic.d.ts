import * as React from 'react';

export interface BasicComponentProps {
    arrayProp?: any[];
    boolProp?: boolean;
    numberProp?: number;
    objectProp?: object;
    stringProp?: string;
    anyProp?: any;
    elementProp?: React.ReactElement<any>;
    nodeProp?: React.ReactNode;
}

export default class BasicComponent extends React.Component<BasicComponentProps> {
}

