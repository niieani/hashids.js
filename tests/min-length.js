
import Hashids from '../lib/hashids';
import { assert } from 'chai';

describe('min length', () => {

	const testMinLength = (minLength) => {

		const hashids = new Hashids('', minLength);
		const numbers = [1, 2, 3];

		const id = hashids.encode(numbers);
		const decodedNumbers = hashids.decode(id);

		assert.deepEqual(decodedNumbers, numbers);
		assert.isAtLeast(id.length, minLength);

	};

	it(`should work when 0`, () => {
		testMinLength(0);
	});

	it(`should work when 1`, () => {
		testMinLength(1);
	});

	it(`should work when 10`, () => {
		testMinLength(10);
	});

	it(`should work when 999`, () => {
		testMinLength(999);
	});

	it(`should work when 1000`, () => {
		testMinLength(1000);
	});

});
