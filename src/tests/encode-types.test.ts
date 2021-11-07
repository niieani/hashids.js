/* eslint-disable jest/expect-expect */
import Hashids from '../hashids'

describe('encode types', () => {
  const testParams = (...numbers: any[]) => {
    const hashids = new Hashids()

    const id = hashids.encode(...numbers)
    const decodedNumbers = hashids.decode(id)
    const encodedId = hashids.encode(decodedNumbers)

    expect(id).toBeTruthy()
    expect(encodedId).toBe(id)
  }

  it(`should encode 1, 2, 3`, () => {
    testParams(1, 2, 3)
  })

  it(`should encode [1, 2, 3]`, () => {
    testParams('1', '2', '3')
  })

  it(`should encode '1', '2', '3'`, () => {
    testParams([1, 2, 3])
  })

  it(`should encode ['1', '2', '3']`, () => {
    testParams(['1', '2', '3'])
  })
})
