import * as React from 'react';

declare interface BasicComponentProps {
    stringProp: string;
    numberProp?: number;
}

export default class BasicComponent extends React.Component<BasicComponentProps> {
}

