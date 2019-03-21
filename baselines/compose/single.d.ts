import * as React from 'react';

import BasicComponentProps from '../basic';

declare interface ComposedComponentProps extends BasicComponentProps{
    temp?: any;
}

export default class ComposedComponent extends React.Component<ComposedComponentProps> {
}

