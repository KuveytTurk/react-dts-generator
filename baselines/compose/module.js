import * as React from 'react';
import * as PropTypes from 'prop-types';
import BasicComponent from '../basic/basic';
import ComponentBase from '@kuveytturk/boa-base/ComponentBase'

class ComposedComponent extends React.Component {
    render() {
        return <div>ComposedComponent</div>;
    }
};

ComposedComponent.propTypes = {
    ...BasicComponent.propTypes,
    ...ComponentBase.propTypes,
    temp: PropTypes.any,
};

export default ComposedComponent;
