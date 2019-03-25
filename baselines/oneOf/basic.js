import * as React from 'react';
import * as PropTypes from 'prop-types';

const OneOfComponent = () => {
	return <div>OneOfComponent </div>;
};

OneOfComponent.propTypes = {
	arrayOfString: PropTypes.oneOf(['foo', 'bar']),
	arrayOfNumber: PropTypes.oneOf([1, 2, 3]).isRequired,
};

export default OneOfComponent;
