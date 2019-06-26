import * as React from 'react';
import * as PropTypes from 'prop-types';

import { someObject } from 'some-external-file-or-package';

const AnyFabllbackComponent = () => {
	return <div>AnyFabllbackComponent</div>;
};

AnyFabllbackComponent.propTypes = {
	invalidOptionalOneOf: PropTypes.oneOf(Object.values(someObject)),
	invalidOneOf: PropTypes.oneOf(Object.values(someObject)).isRequired,
};

export default AnyFabllbackComponent;
