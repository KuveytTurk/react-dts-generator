import * as React from 'react';
import * as PropTypes from 'prop-types';

const FuncComponent = () => {
	return <div>FuncComponent </div>;
};

FuncComponent.propTypes = {
	/**
	 * @param {string} stringParam 
	 * @return {bool} result
	 */
	checkResult: PropTypes.func,
	/**
	 * @param {number} number - The param value.
	 */
	onChange: PropTypes.func.isRequired,

};

export default FuncComponent;
