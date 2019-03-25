import * as React from 'react';

declare interface OneOfTypeComponentProps {
    oneOfStringOrNumber?: string | number;
    oneOfBoolOrObject: boolean | object;
}

export default class OneOfTypeComponent extends React.Component<OneOfTypeComponentProps> {
}

