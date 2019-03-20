import * as dom from 'dts-dom';

module.exports = (type) => {
  switch(type.toLowerCase()) {
    case 'any': return dom.type.any;
    case 'array': return dom.type.array(dom.type.any);
    case 'bool': return dom.type.boolean;
    case 'number': return dom.type.number;
    case 'object': return dom.type.object;
    case 'string': return dom.type.string;
    default: return dom.type.any;
  }
}
