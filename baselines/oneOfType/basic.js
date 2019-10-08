import * as React from 'react';
import * as PropTypes from 'prop-types';

const OneOfTypeComponent = () => {
	return <div>OneOfTypeComponent </div>;
};

OneOfTypeComponent.propTypes = {
	oneOfStringOrNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	anyType: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
	oneOfBoolOrObject: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
};

export default OneOfTypeComponent;
