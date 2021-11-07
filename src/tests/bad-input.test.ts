import Hashids from '../hashids'

const hashids = new Hashids()

describe('bad input', () => {
  it(`should throw an error when small alphabet`, () => {
    expect(() => {
      void new Hashids('', 0, '1234567890')
    }).toThrowErrorMatchingInlineSnapshot(
      `"Hashids: alphabet must contain at least 16 unique characters, provided: 1234567890"`,
    )
  })

  it(`should throw an error when alphabet not a string`, () => {
    expect(() => {
      // @ts-expect-error wrong output
      void new Hashids('', 0, 7)
    }).toThrow(TypeError)
  })

  it(`should not throw an error when alphabet has spaces`, () => {
    expect(() => {
      void new Hashids('', 0, 'a cdefghijklmnopqrstuvwxyz')
    }).not.toThrow()
  })

  it(`should return an empty string when encoding nothing`, () => {
    const id = hashids.encode()
    expect(id).toEqual('')
  })

  it(`should return an empty string when encoding an empty array`, () => {
    const id = hashids.encode([])
    expect(id).toEqual('')
  })

  it(`should return an empty string when encoding a negative number`, () => {
    const id = hashids.encode(-1)
    expect(id).toEqual('')
  })

  it(`should return an empty string when encoding a string with non-numeric characters`, () => {
    expect(hashids.encode('6B')).toEqual('')
    expect(hashids.encode('123a')).toEqual('')
  })

  it(`should return an empty string when encoding infinity`, () => {
    const id = hashids.encode(Number.POSITIVE_INFINITY)
    expect(id).toEqual('')
  })

  it(`should return an empty string when encoding a null`, () => {
    // @ts-expect-error wrong output
    const id = hashids.encode(null)
    expect(id).toEqual('')
  })

  it(`should return an empty string when encoding a NaN`, () => {
    const id = hashids.encode(Number.NaN)
    expect(id).toEqual('')
  })

  it(`should return an empty string when encoding an undefined`, () => {
    // @ts-expect-error wrong output
    const id = hashids.encode(undefined)
    expect(id).toEqual('')
  })

  it(`should return an empty string when encoding an array with non-numeric input`, () => {
    const id = hashids.encode(['z'])
    expect(id).toEqual('')
  })

  it(`should return an empty array when decoding nothing`, () => {
    // @ts-expect-error wrong output
    const numbers = hashids.decode()
    expect(numbers).toEqual([])
  })

  it(`should return an empty array when decoding an empty string`, () => {
    const numbers = hashids.decode('')
    expect(numbers).toEqual([])
  })

  it(`should return an empty string when encoding non-numeric input`, () => {
    const id = hashids.encode('z')
    expect(id).toEqual('')
  })

  it(`should return an empty array when decoding invalid id`, () => {
    const numbers = hashids.decode('f')
    expect(numbers).toEqual([])
  })

  it(`should return an empty string when encoding non-hex input`, () => {
    const id = hashids.encodeHex('z')
    expect(id).toEqual('')
  })

  it(`should return an empty string when hex-decoding invalid id`, () => {
    const hex = hashids.decodeHex('f')
    expect(hex).toEqual('')
  })

  // reproduction from https://github.com/niieani/hashids.js/issues/126
  it(`should throw an error when an id to be decoded contains chars that do not exist in the alphabet (multiple)`, () => {
    const instance = new Hashids('', 6, 'abcdefghjklmnpqrstuvwxyz23456789')
    expect(instance.isValidId('[object Object]')).toBe(false)
    expect(() => {
      instance.decode('[object Object]')
    }).toThrow(Error)
  })

  // reproduction from https://github.com/niieani/hashids.js/issues/126
  it(`should throw an error when an id to be decoded contains chars that do not exist in the alphabet (single)`, () => {
    const instance = new Hashids('', 6, 'abcdefghjklmnpqrstuvwxyz23456789')
    expect(instance.isValidId('a1bcdef')).toBe(false)
    expect(() => {
      instance.decode('a1bcdef')
    }).toThrow(Error)
  })
})
