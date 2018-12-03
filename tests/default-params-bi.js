
import Hashids from '../lib/hashids';
import { assert } from 'chai';

const hashids = new Hashids();

const map = {
	'wpVL4j9g': '3735928559',
	'kmP69lB3xv': '188900967593046',
	'47JWg0kv4VU0G2KBO2': '12981155274522450858012398',
	'y42LW46J9luq3Xq9XMly': '24912482966938930280208240657',
	'm1rO8xBQNquXmLvmO65BUO9KQmj': '19938421193860583634706025513334057899',
	'wBlnMA23NLIQDgw7XxErc2mlNyAjpw': '14966276559563682702364767401166784150254678',
	'VwLAoD9BqlT7xn4ZnBXJFmGZ51ZqrBhqrymEyvYLIP199': '6170642089954522658081134434590064393685259496125924487557283855',
	'nBrz1rYyV0C0XKNXxB54fWN0yNvVjlip7127Jo3ri0Pqw': '6582018229284824168619876730229402019930943462534319453394436095'
};

describe('encodeBI/decodeBI using default params', () => {

	for (const id in map) {

		const bi = map[id];

		it(`should encode '${bi}' to '${id}'`, () => {
			assert.equal(id, hashids.encodeBI(bi));
		});

		it(`should encode '${bi}' to '${id}' and decode back correctly`, () => {

			const encodedId = hashids.encodeBI(bi);
			const decodedBI = hashids.decodeBI(encodedId);

			assert.deepEqual(bi, decodedBI);

		});

	}

});
