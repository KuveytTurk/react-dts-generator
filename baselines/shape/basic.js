import * as React from 'react';
import * as PropTypes from 'prop-types';

const ShapeComponent = () => {
	return <div>ShapeComponent </div>;
};

ShapeComponent.propTypes = {
	first: PropTypes.shape({
		foo: PropTypes.number,
		bar: PropTypes.string
	}).isRequired,
	second: PropTypes.shape({
		foo: PropTypes.object,
		bar: PropTypes.bool
	})
};

export default ShapeComponent;
