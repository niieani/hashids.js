import Hashids from '../hashids'

const hashids = new Hashids()
const _BigInt = typeof BigInt === 'function' ? BigInt : undefined

describe('BigInt environment', () => {
  describe('BigInt on unsupported environment', () => {
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

    it('throws encoding a big numeric string on unsupported environment', () => {
      expect(() =>
        hashids.encode('90071992547409910123456789'),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Unable to encode the provided BigInt string without loss of information due to lack of support for BigInt type in the current environment"`,
      )
    })
  })

  describe('BigInt on supported environment', () => {
    it('decodes big numeric string on supported environment', () => {
      const id = '90071992547409910123456789'
      const encodedId = hashids.encode(id)
      const [decodedId] = hashids.decode(encodedId)

      expect(encodedId).toBeTruthy()
      expect(decodedId).toBeTruthy()
      expect(id).toBe(decodedId?.toString())
    })
  })
})
