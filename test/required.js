import React from 'react';
import PropTypes from 'prop-types';

const BasicComponent = () => {
  return <div>BasicComponent</div>;
}

BasicComponent.propTypes = {
  stringProp: PropTypes.string.isRequired,
  numberProp: PropTypes.number,
}

export default BasicComponent;
