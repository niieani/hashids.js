import Hashids from '../';
import chai from 'chai';

const {assert} = chai;

assert.isFunction(Hashids);
const instance = new Hashids('Not Real', 5, 'ABCDEFGHJKMNPQRTWXY234689');
assert.instanceOf(instance, Hashids);
