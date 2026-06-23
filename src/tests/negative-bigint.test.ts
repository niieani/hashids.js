import Hashids from '../hashids'

const hashids = new Hashids()

describe('negative BigInt input', () => {
  it(`should return an empty string when encoding a negative BigInt`, () => {
    expect(hashids.encode(BigInt(-1))).toBe('')
    expect(hashids.encode(BigInt(-100))).toBe('')
  })

  it(`should return an empty string when an array contains a negative BigInt`, () => {
    expect(hashids.encode([BigInt(5), BigInt(-3)])).toBe('')
    expect(hashids.encode([BigInt(-1)])).toBe('')
  })

  it(`should not throw when encoding a negative BigInt`, () => {
    expect(() => hashids.encode(BigInt(-1))).not.toThrow()
  })
})
