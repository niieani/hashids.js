
import Hashids from '../lib/hashids';
import { assert } from 'chai';

const minLength = 30;
const hashids = new Hashids('this is my salt', minLength, 'xzal86grmb4jhysfoqp3we7291kuct5iv0nd');

const map = {
	'0dbq3jwa8p4b3gk6gb8bv21goerm96': '3735928559',
	'190obdnk4j02pajjdande7aqj628mr': '188900967593046',
	'a1nvl5d9m3yo8pj1fqag8p9pqw4dyl': '12981155274522450858012398',
	'1nvlml93k3066oas3l9lr1wn1k67dy': '24912482966938930280208240657',
	'mgyband33ye3c6jj16yq1jayh6krqjbo': '19938421193860583634706025513334057899',
	'9mnwgllqg1q2tdo63yya35a9ukgl6bbn6qn8': '14966276559563682702364767401166784150254678',
	'edjrkn9m6o69s0ewnq5lqanqsmk6loayorlohwd963r53e63xmml29': '6170642089954522658081134434590064393685259496125924487557283855',
	'grekpy53r2pjxwyjkl9aw0k3t5la1b8d5r1ex9bgeqmy93eata0eq0': '6582018229284824168619876730229402019930943462534319453394436095'
};

describe('encodeBI/decodeBI using custom params', () => {

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

		it(`id length should be at least ${minLength}`, () => {
			assert.isAtLeast(hashids.encodeBI(bi).length, minLength);
		});

	}

});
