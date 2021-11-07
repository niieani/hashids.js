import Hashids from '../hashids'

const minLength = 30
const hashids = new Hashids(
  'this is my salt',
  minLength,
  'xzal86grmb4jhysfoqp3we7291kuct5iv0nd',
)

describe.each([
  ['0dbq3jwa8p4b3gk6gb8bv21goerm96', 'deadbeef'],
  ['190obdnk4j02pajjdande7aqj628mr', 'abcdef123456'],
  ['a1nvl5d9m3yo8pj1fqag8p9pqw4dyl', 'ABCDDD6666DDEEEEEEEEE'],
  ['1nvlml93k3066oas3l9lr1wn1k67dy', '507f1f77bcf86cd799439011'],
  ['mgyband33ye3c6jj16yq1jayh6krqjbo', 'f00000fddddddeeeee4444444ababab'],
  [
    '9mnwgllqg1q2tdo63yya35a9ukgl6bbn6qn8',
    'abcdef123456abcdef123456abcdef123456',
  ],
  [
    'edjrkn9m6o69s0ewnq5lqanqsmk6loayorlohwd963r53e63xmml29',
    'f000000000000000000000000000000000000000000000000000f',
  ],
  [
    'grekpy53r2pjxwyjkl9aw0k3t5la1b8d5r1ex9bgeqmy93eata0eq0',
    'fffffffffffffffffffffffffffffffffffffffffffffffffffff',
  ],
  // bigint format:
  ...(typeof BigInt === 'function'
    ? (require('./bigint-test-cases').customParamsHex as [string, string][])
    : []),
] as [string, bigint | string][])(
  'encodeHex/decodeHex using default params',
  (id, hex) => {
    it(`should encode ${typeof hex} '0x${hex
      .toString(16)
      .toUpperCase()}' to '${id}'`, () => {
      expect(hashids.encodeHex(hex)).toEqual(id)
    })

    it(`should decode '${id}' to '0x${hex.toString(16).toUpperCase()}'`, () => {
      expect(hashids.decodeHex(id)).toEqual(hex.toString(16).toLowerCase())
    })

    it(`should encode ${typeof hex} '0x${hex
      .toString(16)
      .toUpperCase()}' to '${id}' and decode back correctly`, () => {
      const encodedId = hashids.encodeHex(hex)
      const decodedHex = hashids.decodeHex(encodedId)

      expect(decodedHex).toBe(hex.toString(16).toLowerCase())
    })

    it(`id length should be at least ${minLength}`, () => {
      expect(hashids.encodeHex(hex).length).toBeGreaterThanOrEqual(minLength)
    })
  },
)
