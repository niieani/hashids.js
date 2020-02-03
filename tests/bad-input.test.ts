import Hashids from '../lib/hashids'

const hashids = new Hashids()

describe('bad input', () => {
  test(`should throw an error when small alphabet`, () => {
    expect(() => {
      void new Hashids('', 0, '1234567890')
    }).toThrow()
  })

  test(`should throw an error when alphabet not a string`, () => {
    expect(() => {
      // @ts-ignore
      void new Hashids('', 0, 7)
    }).toThrow(TypeError)
  })

  test(`should not throw an error when alphabet has spaces`, () => {
    expect(() => {
      void new Hashids('', 0, 'a cdefghijklmnopqrstuvwxyz')
    }).not.toThrow()
  })

  test(`should return an empty string when encoding nothing`, () => {
    const id = hashids.encode()
    expect(id).toEqual('')
  })

  test(`should return an empty string when encoding an empty array`, () => {
    const id = hashids.encode([])
    expect(id).toEqual('')
  })

  test(`should return an empty string when encoding a negative number`, () => {
    const id = hashids.encode(-1)
    expect(id).toEqual('')
  })

  test(`should return an empty string when encoding a string with non-numeric characters`, () => {
    expect(hashids.encode('6B')).toEqual('')
    expect(hashids.encode('123a')).toEqual('')
  })

  test(`should return an empty string when encoding infinity`, () => {
    const id = hashids.encode(Infinity)
    expect(id).toEqual('')
  })

  test(`should return an empty string when encoding a null`, () => {
    // @ts-ignore
    const id = hashids.encode(null)
    expect(id).toEqual('')
  })

  test(`should return an empty string when encoding a NaN`, () => {
    const id = hashids.encode(NaN)
    expect(id).toEqual('')
  })

  test(`should return an empty string when encoding an undefined`, () => {
    // @ts-ignore
    const id = hashids.encode(undefined)
    expect(id).toEqual('')
  })

  test(`should return an empty string when encoding an array with non-numeric input`, () => {
    const id = hashids.encode(['z'])
    expect(id).toEqual('')
  })

  test(`should return an empty array when decoding nothing`, () => {
    // @ts-ignore
    const numbers = hashids.decode()
    expect(numbers).toEqual([])
  })

  test(`should return an empty array when decoding an empty string`, () => {
    const numbers = hashids.decode('')
    expect(numbers).toEqual([])
  })

  test(`should return an empty string when encoding non-numeric input`, () => {
    const id = hashids.encode('z')
    expect(id).toEqual('')
  })

  test(`should return an empty array when decoding invalid id`, () => {
    const numbers = hashids.decode('f')
    expect(numbers).toEqual([])
  })

  test(`should return an empty string when encoding non-hex input`, () => {
    const id = hashids.encodeHex('z')
    expect(id).toEqual('')
  })

  test(`should return an empty string when hex-decoding invalid id`, () => {
    const hex = hashids.decodeHex('f')
    expect(hex).toEqual('')
  })

  // reproduction from https://github.com/niieani/hashids.js/issues/126
  test(`should throw an error when an id to be decoded contains chars that do not exist in the alphabet (multiple)`, () => {
    const hashids = new Hashids('', 6, 'abcdefghjklmnpqrstuvwxyz23456789')
    expect(hashids.isValidId('[object Object]')).toBe(false)
    expect(() => {
      hashids.decode('[object Object]')
    }).toThrow(Error)
  })

  // reproduction from https://github.com/niieani/hashids.js/issues/126
  test(`should throw an error when an id to be decoded contains chars that do not exist in the alphabet (single)`, () => {
    const hashids = new Hashids('', 6, 'abcdefghjklmnpqrstuvwxyz23456789')
    expect(hashids.isValidId('a1bcdef')).toBe(false)
    expect(() => {
      hashids.decode('a1bcdef')
    }).toThrow(Error)
  })
})
