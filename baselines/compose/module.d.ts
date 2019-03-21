import * as React from 'react';

import {BasicComponentProps} from '../basic/basic';

import {ComponentBaseProps} from '@kuveytturk/boa-base/ComponentBase';

declare interface ComposedComponentProps extends BasicComponentProps, ComponentBaseProps{
    temp?: any;
}

export default class ComposedComponent extends React.Component<ComposedComponentProps> {
}

