import * as React from 'react';
import { BasicComponentProps } from '../basic/basic';

declare interface ComposedComponentProps extends BasicComponentProps{
    temp?: any;
}

export default class ComposedComponent extends React.Component<ComposedComponentProps> {
}

