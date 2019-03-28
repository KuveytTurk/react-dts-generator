import * as React from 'react';
import * as PropTypes from 'prop-types';

const NestedShape = () => {
    return <div>NestedShape</div>;
};

NestedShape.propTypes = {
    nested: PropTypes.shape({
        foo: PropTypes.number,
        bar: PropTypes.string,
        baz: PropTypes.shape({
            foo: PropTypes.number,
            bar: PropTypes.string,
        }),
    }),
};

export default NestedShape;
