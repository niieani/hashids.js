import Hashids from 'hashids'

if (typeof Hashids !== 'function') {
  throw new Error('Hashids is not a function')
}

const instance = new Hashids('Not Real', 5, 'ABCDEFGHJKMNPQRTWXY234689')

if (!(instance instanceof Hashids)) {
  throw new Error('new Hashids(...) did not result in an instance of Hashids')
}
