import * as React from 'react';
import * as PropTypes from 'prop-types';
import BaseClass from './base';

class TestClass extends BaseClass {
	render() {
		return <div>TestClass</div>;
	}
}

TestClass.propTypes = {
	foo: PropTypes.any,
}

export default TestClass;
