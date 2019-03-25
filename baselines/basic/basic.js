import * as React from 'react';
import * as PropTypes from 'prop-types';

const BasicComponent = () => {
	return <div>BasicComponent </div>;
};

BasicComponent.propTypes = {
	arrayProp: PropTypes.array,
	boolProp: PropTypes.bool,
	numberProp: PropTypes.number,
	objectProp: PropTypes.object,
	stringProp: PropTypes.string,
	anyProp: PropTypes.any,
	elementProp: PropTypes.element,
};

export default BasicComponent;
