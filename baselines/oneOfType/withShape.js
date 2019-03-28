import * as React from 'react';
import * as PropTypes from 'prop-types';

const WithShape = () => {
	return <div>WithShape</div>;
};

WithShape.propTypes = {
	objectOrShape: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.shape({
			foo: PropTypes.number,
			bar: PropTypes.string,
			baz: PropTypes.shape({
				foo: PropTypes.number,
				bar: PropTypes.string,
			}),
		}),
	]),
};

export default WithShape;
