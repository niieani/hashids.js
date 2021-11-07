import Hashids from '../hashids'

const hashids = new Hashids()

describe.each([
  ['wpVL4j9g', 'deadbeef'],
  ['kmP69lB3xv', 'abcdef123456'],
  ['47JWg0kv4VU0G2KBO2', 'ABCDDD6666DDEEEEEEEEE'],
  ['y42LW46J9luq3Xq9XMly', '507f1f77bcf86cd799439011'],
  ['m1rO8xBQNquXmLvmO65BUO9KQmj', 'f00000fddddddeeeee4444444ababab'],
  ['wBlnMA23NLIQDgw7XxErc2mlNyAjpw', 'abcdef123456abcdef123456abcdef123456'],
  [
    'VwLAoD9BqlT7xn4ZnBXJFmGZ51ZqrBhqrymEyvYLIP199',
    'f000000000000000000000000000000000000000000000000000f',
  ],
  [
    'nBrz1rYyV0C0XKNXxB54fWN0yNvVjlip7127Jo3ri0Pqw',
    'fffffffffffffffffffffffffffffffffffffffffffffffffffff',
  ],
])('encodeHex/decodeHex using default params', (id, hex) => {
  it(`should encode '0x${hex.toUpperCase()}' to '${id}'`, () => {
    expect(hashids.encodeHex(hex)).toBe(id)
  })

  it(`should encode '0x${hex.toUpperCase()}' to '${id}' and decode back correctly`, () => {
    const encodedId = hashids.encodeHex(hex)
    const decodedHex = hashids.decodeHex(encodedId)

    expect(decodedHex).toBe(hex.toLowerCase())
  })
})
