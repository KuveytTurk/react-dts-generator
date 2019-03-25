import * as React from 'react';

declare interface OneOfComponentProps {
    arrayOfString?: 'foo' | 'bar';
    arrayOfNumber: 1 | 2 | 3;
}

export default class OneOfComponent extends React.Component<OneOfComponentProps> {
}

