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

  test('throws encoding big-number string on unsupported environment', () => {
    expect(() =>
      hashids.encode('90071992547409910'),
    ).toThrow()
  })
})

if (_BigInt) {
  describe('BigInt tests', () => {
    test('Encode a big-number string', () => {
      expect(hashids.encode('90071992547409910123456789')).toEqual('jkqwZ8DW1QrVylvVR')
    })

    test('Decode a previously encoded big-number string', () => {
      expect(hashids.decode('jkqwZ8DW1QrVylvVR')).toEqual([BigInt('90071992547409910123456789')])
    })
  })
}