import Hashids from '../lib/hashids'

const hashids = new Hashids()

describe('bad input', () => {
  test(`should throw an error when small alphabet`, () => {
    expect(() => {
      const hashidsIgnored = new Hashids('', 0, '1234567890')
    }).toThrow()
  })

  test(`should not throw an error when alphabet has spaces`, () => {
    expect(() => {
      const hashidsIgnored = new Hashids('', 0, 'a cdefghijklmnopqrstuvwxyz')
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
})
