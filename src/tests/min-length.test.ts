/* eslint-disable jest/expect-expect */
import Hashids from '../hashids'

describe('min length', () => {
  const testMinLength = (minLength: number) => {
    const hashids = new Hashids('', minLength)
    const numbers = [1, 2, 3]

    const id = hashids.encode(numbers)
    const decodedNumbers = hashids.decode(id)

    expect(decodedNumbers).toEqual(numbers)
    expect([...id].length).toBeGreaterThanOrEqual(minLength)
  }

  it(`should work when 0`, () => {
    testMinLength(0)
  })

  it(`should work when 1`, () => {
    testMinLength(1)
  })

  it(`should work when 10`, () => {
    testMinLength(10)
  })

  it(`should work when 999`, () => {
    testMinLength(999)
  })

  it(`should work when 1000`, () => {
    testMinLength(1000)
  })
})
