import * as React from 'react';
import * as PropTypes from 'prop-types';

const ArrayOfComponent = () => {
	return <div>ArrayOfComponent </div>;
};

ArrayOfComponent.propTypes = {
	arrayOfString: PropTypes.arrayOf(PropTypes.string),
	arrayOfNumber: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default ArrayOfComponent;
