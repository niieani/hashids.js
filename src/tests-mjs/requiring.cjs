const Hashids = require('hashids')
const Hashids2 = require('hashids/cjs')
const Hashids3 = require('hashids/cjs/index')

if (Hashids !== Hashids2 || Hashids !== Hashids3) {
  throw new Error('Hashids was not loaded properly')
}

if (typeof Hashids !== 'function') {
  throw new Error('Hashids is not a function')
}

const instance = new Hashids('Not Real', 5, 'ABCDEFGHJKMNPQRTWXY234689')

if (!(instance instanceof Hashids)) {
  throw new Error('new Hashids(...) did not result in an instance of Hashids')
}
