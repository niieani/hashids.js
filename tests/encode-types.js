
import Hashids from '../lib/hashids';
import { assert } from 'chai';

describe('encode types', () => {

	const testParams = (...numbers) => {

		const hashids = new Hashids();

		const id = hashids.encode.apply(hashids, numbers);
		const decodedNumbers = hashids.decode(id);
		const encodedId = hashids.encode(decodedNumbers);

		assert.isOk(id);
		assert.equal(id, encodedId);

	};

	it(`should encode 1, 2, 3`, () => {
		testParams(1, 2, 3);
	});

	it(`should encode [1, 2, 3]`, () => {
		testParams('1', '2', '3');
	});

	it(`should encode '1', '2', '3'`, () => {
		testParams([1, 2, 3]);
	});

	it(`should encode ['1', '2', '3']`, () => {
		testParams(['1', '2', '3']);
	});

});
