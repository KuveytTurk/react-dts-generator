import * as React from 'react';
import * as PropTypes from 'prop-types';
import BasicComponent from '../basic/basic';

class ComposedComponent extends React.Component {
	render() {
		return <div>ComposedComponent</div>;
	}
};

ComposedComponent.propTypes = {
	...BasicComponent.propTypes,
	temp: PropTypes.any,
};

export default ComposedComponent;
