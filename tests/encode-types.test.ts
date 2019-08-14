import Hashids from '../lib/hashids'

describe('encode types', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testParams = (...numbers: any[]) => {
    const hashids = new Hashids()

    const id = hashids.encode(...numbers)
    const decodedNumbers = hashids.decode(id)
    const encodedId = hashids.encode(decodedNumbers)

    expect(id).toBeTruthy()
    expect(encodedId).toBe(id)
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
