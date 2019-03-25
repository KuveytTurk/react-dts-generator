import * as React from 'react';

declare interface BaseClassProps {
    foo?: any;
}

export default class BaseClass<T = any> extends React.Component<T> {
    foo(): any;
    bar(): any;
}

