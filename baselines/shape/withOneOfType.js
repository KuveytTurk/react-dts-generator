import * as React from 'react';
import * as PropTypes from 'prop-types';

const OneOfType = () => {
    return <div>OneOfType </div>;
};

OneOfType.propTypes = {
    first: PropTypes.shape({
        foo: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
        bar: PropTypes.string,
        baz: PropTypes.oneOfType([PropTypes.any, PropTypes.object]),
        shape: PropTypes.oneOfType([PropTypes.object, PropTypes.shape({
            foo: PropTypes.number,
            bar: PropTypes.string.isRequired,
        })]),
    })
};

export default OneOfType;
