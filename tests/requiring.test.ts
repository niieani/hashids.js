// @ts-ignore
import ImportedHashids from '../cjs'

describe('requiring', () => {
  test('via node', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Hashids = require('../cjs')
    expect(typeof Hashids).toBe('function')
    const instance = new Hashids('Not Real', 5, 'ABCDEFGHJKMNPQRTWXY234689')
    expect(instance).toBeInstanceOf(Hashids)
  })

  test('via babel default import', () => {
    expect(typeof ImportedHashids).toBe('function')
    const instance = new ImportedHashids(
      'Not Real',
      5,
      'ABCDEFGHJKMNPQRTWXY234689',
    )
    expect(instance).toBeInstanceOf(ImportedHashids)
  })
})
