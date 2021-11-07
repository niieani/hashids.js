import Hashids from '../hashids'

const minLength = 30
const hashids = new Hashids(
  'this is my salt',
  minLength,
  'xzal86grmb4jhysfoqp3we7291kuct5iv0nd',
)

describe.each([
  ['nej1m3d5a6yn875e7gr9kbwpqol02q', [0]],
  ['dw1nqdp92yrajvl9v6k3gl5mb0o8ea', [1]],
  ['onqr0bk58p642wldq14djmw21ygl39', [928_728]],
  ['18apy3wlqkjvd5h1id7mn5ore2d06b', [1, 2, 3]],
  ['o60edky1ng3vl9hbfavwr5pa2q8mb9', [1, 0, 0]],
  ['o60edky1ng3vlqfbfp4wr5pa2q8mb9', [0, 0, 1]],
  ['qek2a08gpl575efrfd7yomj9dwbr63', [0, 0, 0]],
  ['m3d5a6yn875rae8y81a94gr9kbwpqo', [1_000_000_000_000]],
  ['1q3y98ln48w96kpo0wgk314w5mak2d', [9_007_199_254_740_991]],
  ['op7qrcdc3cgc2c0cbcrcoc5clce4d6', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]],
  [
    '5430bd2jo0lxyfkfjfyojej5adqdy4',
    [10_000_000_000, 0, 0, 0, 999_999_999_999_999],
  ],
  [
    'aa5kow86ano1pt3e1aqm239awkt9pk380w9l3q6',
    [9_007_199_254_740_991, 9_007_199_254_740_991, 9_007_199_254_740_991],
  ],
  [
    'mmmykr5nuaabgwnohmml6dakt00jmo3ainnpy2mk',
    [1_000_000_001, 1_000_000_002, 1_000_000_003, 1_000_000_004, 1_000_000_005],
  ],
  [
    'w1hwinuwt1cbs6xwzafmhdinuotpcosrxaz0fahl',
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  ],
  // bigint format:
  ...(typeof BigInt === 'function'
    ? require('./bigint-test-cases').customParams
    : []),
] as [string, (bigint | number)[]][])(
  'encode/decode using custom params',
  (id, numbers) => {
    it(`should encode [${numbers}] to '${id}' (passing array of numbers)`, () => {
      expect(id).toEqual(hashids.encode(numbers))
    })

    it(`should decode '${id}' to '${numbers.join(', ')}'`, () => {
      expect(hashids.decode(id)).toEqual(numbers)
    })

    it(`should encode [${numbers}] to '${id}' (passing numbers)`, () => {
      expect(id).toEqual(hashids.encode(...numbers))
    })

    it(`should encode [${numbers}] to '${id}' and decode back correctly`, () => {
      const encodedId = hashids.encode(numbers)
      const decodedNumbers = hashids.decode(encodedId)

      expect(numbers).toEqual(decodedNumbers)
    })

    it(`id length should be at least ${minLength}`, () => {
      expect(hashids.encode(numbers).length).toBeGreaterThanOrEqual(minLength)
    })
  },
)
