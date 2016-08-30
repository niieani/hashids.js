
import Hashids from '../lib/hashids';
import { assert } from 'chai';

describe('custom alphabet', () => {

	const testAlphabet = (alphabet) => {

		const hashids = new Hashids('', 0, alphabet);
		const numbers = [1, 2, 3];

		const id = hashids.encode(numbers);
		const decodedNumbers = hashids.decode(id);

		assert.deepEqual(decodedNumbers, numbers);

	};

	it(`should work with the worst alphabet`, () => {
		testAlphabet('cCsSfFhHuUiItT01');
	});

	it(`should work with half the alphabet being separators`, () => {
		testAlphabet('abdegjklCFHISTUc');
	});

	it(`should work with exactly 2 separators`, () => {
		testAlphabet('abdegjklmnopqrSF');
	});

	it(`should work with no separators`, () => {
		testAlphabet('abdegjklmnopqrvwxyzABDEGJKLMNOPQRVWXYZ1234567890');
	});

	it(`should work with super long alphabet`, () => {
		testAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`~!@#$%^&*()-_=+\\|\'";:/?.>,<{[}]');
	});

	it(`should work with a weird alphabet`, () => {
		testAlphabet('`~!@#$%^&*()-_=+\\|\'";:/?.>,<{[}]');
	});

});
