import Hashids from '../lib/hashids'
import expect from 'expect'

describe('custom alphabet', () => {
  const testAlphabet = (alphabet) => {
    const hashids = new Hashids('', 0, alphabet)
    const numbers = [1, 2, 3]

    const id = hashids.encode(numbers)
    const decodedNumbers = hashids.decode(id)

    expect(decodedNumbers).toEqual(numbers)
  }

  test(`should work with the worst alphabet`, () => {
    testAlphabet('cCsSfFhHuUiItT01')
  })

  test(`should work with half the alphabet being separators`, () => {
    testAlphabet('abdegjklCFHISTUc')
  })

  test(`should work with exactly 2 separators`, () => {
    testAlphabet('abdegjklmnopqrSF')
  })

  test(`should work with no separators`, () => {
    testAlphabet('abdegjklmnopqrvwxyzABDEGJKLMNOPQRVWXYZ1234567890')
  })

  test(`should work with super long alphabet`, () => {
    testAlphabet(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`~!@#$%^&*()-_=+\\|\'";:/?.>,<{[}]',
    )
  })

  test(`should work with a weird alphabet`, () => {
    testAlphabet('`~!@#$%^&*()-_=+\\|\'";:/?.>,<{[}]')
  })
})
