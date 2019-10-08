import React from 'react';
import PropTypes from 'prop-types';

class BaseClass extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.bar = this.bar.bind(this);
    }

    foo = () => { }
    bar() { }

    render() {
        return <div>BaseClass</div>;
    }
}

BaseClass.propTypes = {
    foo: PropTypes.any,
}

export default BaseClass;
