
import Hashids from '../lib/hashids';
import { assert } from 'chai';

const hashids = new Hashids();

describe('bad input', () => {

	it(`should throw an error when small alphabet`, () => {
		assert.throws(() => {
			const hashidsIgnored = new Hashids('', 0, '1234567890');
		});
	});

	it(`should throw an error when alphabet has spaces`, () => {
		assert.throws(() => {
			const hashidsIgnored = new Hashids('', 0, 'a cdefghijklmnopqrstuvwxyz');
		});
	});

	it(`should return an empty string when encoding nothing`, () => {
		const id = hashids.encode();
		assert.equal(id, '');
	});

	it(`should return an empty string when encoding an empty array`, () => {
		const id = hashids.encode([]);
		assert.equal(id, '');
	});

	it(`should return an empty string when encoding a negative number`, () => {
		const id = hashids.encode(-1);
		assert.equal(id, '');
	});

	it(`should return an empty string when encoding a string with non-numeric characters`, () => {
		assert.equal(hashids.encode('6B'), '');
		assert.equal(hashids.encode('123a'), '');
	});

	it(`should return an empty string when encoding infinity`, () => {
		const id = hashids.encode(Infinity);
		assert.equal(id, '');
	});

	it(`should return an empty string when encoding a null`, () => {
		const id = hashids.encode(null);
		assert.equal(id, '');
	});

	it(`should return an empty string when encoding a NaN`, () => {
		const id = hashids.encode(NaN);
		assert.equal(id, '');
	});

	it(`should return an empty string when encoding an undefined`, () => {
		const id = hashids.encode(undefined);
		assert.equal(id, '');
	});

	it(`should return an empty string when encoding an array with non-numeric input`, () => {
		const id = hashids.encode(['z']);
		assert.equal(id, '');
	});

	it(`should return an empty array when decoding nothing`, () => {
		const numbers = hashids.decode();
		assert.deepEqual(numbers, []);
	});

	it(`should return an empty string when encoding non-numeric input`, () => {
		const id = hashids.encode('z');
		assert.equal(id, '');
	});

	it(`should return an empty array when decoding invalid id`, () => {
		const numbers = hashids.decode('f');
		assert.deepEqual(numbers, []);
	});

	it(`should return an empty string when encoding non-hex input`, () => {
		const id = hashids.encodeHex('z');
		assert.equal(id, '');
	});

	it(`should return an empty array when hex-decoding invalid id`, () => {
		const numbers = hashids.decodeHex('f');
		assert.deepEqual(numbers, []);
	});

});
