import * as React from 'react';

declare interface RequiredComponentProps {
    requiredProp: string;
    numberProp?: number;
}

export default class RequiredComponent extends React.Component<RequiredComponentProps> {
}

