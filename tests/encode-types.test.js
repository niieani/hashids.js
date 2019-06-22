import Hashids from '../lib/hashids'
import expect from 'expect'

describe('encode types', () => {
  const testParams = (...numbers) => {
    const hashids = new Hashids()

    const id = hashids.encode.apply(hashids, numbers)
    const decodedNumbers = hashids.decode(id)
    const encodedId = hashids.encode(decodedNumbers)

    expect(id).toBeTruthy()
    expect(id).toEqual(encodedId)
  }

  test(`should encode 1, 2, 3`, () => {
    testParams(1, 2, 3)
  })

  test(`should encode [1, 2, 3]`, () => {
    testParams('1', '2', '3')
  })

  test(`should encode '1', '2', '3'`, () => {
    testParams([1, 2, 3])
  })

  test(`should encode ['1', '2', '3']`, () => {
    testParams(['1', '2', '3'])
  })
})
