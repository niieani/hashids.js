// @ts-ignore
import ImportedHashids from '../'
// @ts-ignore
import * as AsteriskImportedHashids from '../'

describe('requiring', () => {
  test('via node', () => {
    const Hashids = require('../')
    expect(typeof Hashids).toBe('function')
    const instance = new Hashids('Not Real', 5, 'ABCDEFGHJKMNPQRTWXY234689')
    expect(instance).toBeInstanceOf(Hashids)
  })

  test('via babel-es interop', () => {
    function _interopRequireDefault(obj: any) {
      return obj && obj.__esModule ? obj : {default: obj}
    }
    const _hashids = require('../')
    const _hashids2 = _interopRequireDefault(_hashids)
    expect(typeof _hashids2.default).toBe('function')
    const Hashids = _hashids2.default
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

  test('via babel asterisk import', () => {
    expect(typeof AsteriskImportedHashids).toBe('function')
    const instance = new AsteriskImportedHashids(
      'Not Real',
      5,
      'ABCDEFGHJKMNPQRTWXY234689',
    )
    expect(instance).toBeInstanceOf(AsteriskImportedHashids)
  })
})
