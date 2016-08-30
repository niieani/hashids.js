
import Hashids from '../lib/hashids';
import { assert } from 'chai';

const hashids = new Hashids();

const map = {
	'wpVL4j9g': 'deadbeef',
	'kmP69lB3xv': 'abcdef123456',
	'47JWg0kv4VU0G2KBO2': 'ABCDDD6666DDEEEEEEEEE',
	'y42LW46J9luq3Xq9XMly': '507f1f77bcf86cd799439011',
	'm1rO8xBQNquXmLvmO65BUO9KQmj': 'f00000fddddddeeeee4444444ababab',
	'wBlnMA23NLIQDgw7XxErc2mlNyAjpw': 'abcdef123456abcdef123456abcdef123456',
	'VwLAoD9BqlT7xn4ZnBXJFmGZ51ZqrBhqrymEyvYLIP199': 'f000000000000000000000000000000000000000000000000000f',
	'nBrz1rYyV0C0XKNXxB54fWN0yNvVjlip7127Jo3ri0Pqw': 'fffffffffffffffffffffffffffffffffffffffffffffffffffff'
};

describe('encodeHex/decodeHex using default params', () => {

	for (const id in map) {

		const hex = map[id];

		it(`should encode '0x${hex.toUpperCase()}' to '${id}'`, () => {
			assert.equal(id, hashids.encodeHex(hex));
		});

		it(`should encode '0x${hex.toUpperCase()}' to '${id}' and decode back correctly`, () => {

			const encodedId = hashids.encodeHex(hex);
			const decodedHex = hashids.decodeHex(encodedId);

			assert.deepEqual(hex.toLowerCase(), decodedHex);

		});

	}

});
