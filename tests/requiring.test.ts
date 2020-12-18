/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-expect-error wrong output
import ImportedHashids from '../cjs'

describe('requiring', () => {
  test('via node', () => {
    const Hashids = require('../cjs') as typeof import('../lib/hashids').default
    expect(typeof Hashids).toBe('function')
    const instance = new Hashids('Not Real', 5, 'ABCDEFGHJKMNPQRTWXY234689')
    expect(instance).toBeInstanceOf(Hashids)
  })

  test('via babel default import', () => {
    expect(typeof ImportedHashids).toBe('function')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const instance = new ImportedHashids(
      'Not Real',
      5,
      'ABCDEFGHJKMNPQRTWXY234689',
    )
    expect(instance).toBeInstanceOf(ImportedHashids)
  })
})
