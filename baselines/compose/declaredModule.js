import * as React from 'react';
import * as PropTypes from 'prop-types';

class MyDeclaredComponent extends React.Component {
	render() {
		return <div>MyDeclaredComponent</div>;
	}
};

MyDeclaredComponent.propTypes = {
	temp: PropTypes.any,
};

export default MyDeclaredComponent;
