import Hashids from '../lib/hashids'

const hashids = new Hashids()

describe.each([
  ['gY', [0]],
  ['jR', [1]],
  ['R8ZN0', [928728]],
  ['o2fXhV', [1, 2, 3]],
  ['jRfMcP', [1, 0, 0]],
  ['jQcMcW', [0, 0, 1]],
  ['gYcxcr', [0, 0, 0]],
  ['gLpmopgO6', [1000000000000]],
  ['lEW77X7g527', [9007199254740991]],
  ['BrtltWt2tyt1tvt7tJt2t1tD', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]],
  ['G6XOnGQgIpcVcXcqZ4B8Q8B9y', [10000000000, 0, 0, 0, 999999999999999]],
  [
    '5KoLLVL49RLhYkppOplM6piwWNNANny8N',
    [9007199254740991, 9007199254740991, 9007199254740991],
  ],
  [
    'BPg3Qx5f8VrvQkS16wpmwIgj9Q4Jsr93gqx',
    [1000000001, 1000000002, 1000000003, 1000000004, 1000000005],
  ],
  [
    '1wfphpilsMtNumCRFRHXIDSqT2UPcWf1hZi3s7tN',
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  ],
  // bigint format:
  ...(typeof BigInt === 'function'
    ? require('./bigint-test-cases').defaultParams
    : []),
] as [string, (number | bigint)[]][])(
  'encode/decode using default params',
  (id, numbers) => {
    test(`should encode [${numbers}] to '${id}' (passing array of numbers)`, () => {
      expect(id).toEqual(hashids.encode(numbers))
    })

    test(`should encode [${numbers}] to '${id}' (passing numbers)`, () => {
      expect(id).toEqual(hashids.encode(...numbers))
    })

    test(`should encode [${numbers}] to '${id}' and decode back correctly`, () => {
      const encodedId = hashids.encode(numbers)
      const decodedNumbers = hashids.decode(encodedId)

      expect(numbers).toEqual(decodedNumbers)
    })
  },
)
