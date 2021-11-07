import Hashids from '../hashids'

const hashids = new Hashids()
const _BigInt = typeof BigInt === 'function' ? BigInt : undefined

describe('BigInt environment', () => {
  beforeAll(() => {
    // @ts-expect-error wrong output
    delete global.BigInt
  })

  afterAll(() => {
    if (_BigInt) global.BigInt = _BigInt
  })

  it('throws decoding BigInt on unsupported environment', () => {
    expect(() =>
      hashids.decode('N95VW0Lo06rQBvJDOE2BVvREP86AqvYN4O9g9p'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unable to decode the provided string, due to lack of support for BigInt numbers in the current environment"`,
    )
  })
})
