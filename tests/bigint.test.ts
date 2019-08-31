import Hashids from '../lib/hashids'

const hashids = new Hashids()
const _BigInt = typeof BigInt === 'function' ? BigInt : undefined

describe('BigInt environment', () => {
  beforeAll(() => {
    // @ts-ignore
    delete global.BigInt
  })

  afterAll(() => {
    // @ts-ignore
    if (_BigInt) global.BigInt = _BigInt
  })

  test('throws decoding BigInt on unsupported environment', () => {
    expect(() =>
      hashids.decode('N95VW0Lo06rQBvJDOE2BVvREP86AqvYN4O9g9p'),
    ).toThrow()
  })
})
