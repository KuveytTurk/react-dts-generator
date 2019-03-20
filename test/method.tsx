import * as React from 'react';
import * as PropTypes from 'prop-types';

class BasicComponent extends React.Component {
	constructor(props: any, context: any) {
		super(props, context);
		this.foo = this.foo.bind(this);
	}

	static propTypes = {
		temp: PropTypes.any,
	};

	/**
	 * @param {number} number - The param value.
	 * @return {number} returns a number value
	 */
	foo(number: number) {
		return number;
	}

	/**
	 * @return {string} returns a string
	 */
	bar = () => {
		return 'bar';
	}

	/**
	 *
	 * @param {number} first
	 * @param {string} second
	 * @returns {array}
	 */
	multiple(first: number, second: string) {
		return [first, second];
	}
}
export default BasicComponent;
