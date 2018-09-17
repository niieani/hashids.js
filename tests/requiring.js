import ImportedHashids from '../';
import * as AsteriskImportedHashids from '../';
import { assert } from 'chai';

describe('requiring', () => {
	it('via node', () => {
		const Hashids = require('../');
		assert.isFunction(Hashids);
		const instance = new Hashids('Not Real', 5, 'ABCDEFGHJKMNPQRTWXY234689');
		assert.instanceOf(instance, Hashids);
	});

	it('via babel-es interop', () => {
		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : { default: obj };
		}
		const _hashids = require('../');
		const _hashids2 = _interopRequireDefault(_hashids);
		assert.isFunction(_hashids2.default);
		const Hashids = _hashids2.default;
		const instance = new Hashids('Not Real', 5, 'ABCDEFGHJKMNPQRTWXY234689');
		assert.instanceOf(instance, Hashids);
	});

	it('via babel default import', () => {
		assert.isFunction(ImportedHashids);
		const instance = new ImportedHashids('Not Real', 5, 'ABCDEFGHJKMNPQRTWXY234689');
		assert.instanceOf(instance, ImportedHashids);
	});

	it('via babel asterisk import', () => {
		assert.isFunction(AsteriskImportedHashids);
		const instance = new AsteriskImportedHashids('Not Real', 5, 'ABCDEFGHJKMNPQRTWXY234689');
		assert.instanceOf(instance, AsteriskImportedHashids);
	});
});
