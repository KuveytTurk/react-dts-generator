import * as React from 'react';
import * as PropTypes from 'prop-types';

import { someObject } from 'some-external-file-or-package';

const AnyFallbackComponent = () => {
	return <div>AnyFallbackComponent</div>;
};

AnyFallbackComponent.propTypes = {
	invalidOptionalOneOf: PropTypes.oneOf(Object.values(someObject)),
	invalidOneOf: PropTypes.oneOf(Object.values(someObject)).isRequired,
};

export default AnyFallbackComponent;
