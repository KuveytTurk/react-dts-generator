import * as React from 'react';
import * as PropTypes from 'prop-types';

const OneOfComponent = () => {
	return <div>OneOfComponent </div>;
};

OneOfComponent.propTypes = {
	oneOfString: PropTypes.oneOf(['foo', 'bar']),
	oneOfNumber: PropTypes.oneOf([1, 2, 3]).isRequired,
};

export default OneOfComponent;
