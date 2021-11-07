// eslint-disable-next-line import/no-relative-packages
import ImportedHashids from '../..'

describe('requiring', () => {
  it('via node', () => {
    const Hashids = require('../..') as typeof import('../hashids').default
    expect(typeof Hashids).toBe('function')
    const instance = new Hashids('Not Real', 5, 'ABCDEFGHJKMNPQRTWXY234689')
    expect(instance).toBeInstanceOf(Hashids)
  })

  it('via babel default import', () => {
    expect(typeof ImportedHashids).toBe('function')
    const instance = new ImportedHashids(
      'Not Real',
      5,
      'ABCDEFGHJKMNPQRTWXY234689',
    )
    expect(instance).toBeInstanceOf(ImportedHashids)
  })
})
