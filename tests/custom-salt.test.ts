import Hashids from '../lib/hashids'

describe('custom salt', () => {
  const testSalt = (salt: string) => {
    const hashids = new Hashids(salt)
    const numbers = [
      1,
      2,
      3,
      // bigint format:
      ...(typeof BigInt === 'function'
        ? require('./bigint-test-cases').customSaltNumbers
        : []),
    ]

    const id = hashids.encode(numbers)
    const decodedNumbers = hashids.decode(id)

    expect(decodedNumbers).toEqual(numbers)
  }

  test(`should work with ''`, () => {
    testSalt('')
  })

  test(`should work with '   '`, () => {
    testSalt('   ')
  })

  test(`should work with 'this is my salt'`, () => {
    testSalt('this is my salt')
  })

  test(`should work with a really long salt`, () => {
    testSalt(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`~!@#$%^&*()-_=+\\|\'";:/?.>,<{[}]',
    )
  })

  test(`should work with a weird salt`, () => {
    testSalt('`~!@#$%^&*()-_=+\\|\'";:/?.>,<{[}]')
  })

  test(`should work with an ultra weird salt`, () => {
    testSalt('🤺👩🏿‍🦳🛁👩🏻🦷🤦‍♂️🐁☝🏼✍🏾👉🏽🇸🇰❤️🍭')
  })
})
