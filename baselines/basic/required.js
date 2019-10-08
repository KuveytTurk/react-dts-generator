import * as React from 'react';
import * as PropTypes from 'prop-types';

const RequiredComponent = () => {
	return <div>RequiredComponent</div>;
};

RequiredComponent.propTypes = {
	requiredProp: PropTypes.string.isRequired,
	numberProp: PropTypes.number,
};

export default RequiredComponent;
