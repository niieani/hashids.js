
export default class Hashids {

	constructor(salt = '', minLength = 0, alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890') {

		const minAlphabetLength = 16;
		const sepDiv = 3.5;
		const guardDiv = 12;

		const errorAlphabetLength = 'error: alphabet must contain at least X unique characters';
		const errorAlphabetSpace = 'error: alphabet cannot contain spaces';

		let uniqueAlphabet = '', sepsLength, diff;

		/* funcs */

		this.escapeRegExp = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
		this.parseInt = (v, radix) => (/^(-|\+)?([0-9]+|Infinity)$/.test(v)) ? parseInt(v, radix) : NaN;

		/* alphabet vars */

		this.seps = 'cfhistuCFHISTU';
		this.minLength = parseInt(minLength, 10) > 0 ? minLength : 0;
		this.salt = (typeof salt === 'string') ? salt : '';

		if (typeof alphabet === 'string') {
			this.alphabet = alphabet;
		}

		for (let i = 0; i !== this.alphabet.length; i++) {
			if (uniqueAlphabet.indexOf(this.alphabet.charAt(i)) === -1) {
				uniqueAlphabet += this.alphabet.charAt(i);
			}
		}

		this.alphabet = uniqueAlphabet;

		if (this.alphabet.length < minAlphabetLength) {
			throw errorAlphabetLength.replace('X', minAlphabetLength);
		}

		if (this.alphabet.search(' ') !== -1) {
			throw errorAlphabetSpace;
		}

		/*
			`this.seps` should contain only characters present in `this.alphabet`
			`this.alphabet` should not contains `this.seps`
		*/

		for (let i = 0; i !== this.seps.length; i++) {

			const j = this.alphabet.indexOf(this.seps.charAt(i));
			if (j === -1) {
				this.seps = this.seps.substr(0, i) + ' ' + this.seps.substr(i + 1);
			} else {
				this.alphabet = this.alphabet.substr(0, j) + ' ' + this.alphabet.substr(j + 1);
			}

		}

		this.alphabet = this.alphabet.replace(/ /g, '');

		this.seps = this.seps.replace(/ /g, '');
		this.seps = this._shuffle(this.seps, this.salt);

		if (!this.seps.length || (this.alphabet.length / this.seps.length) > sepDiv) {

			sepsLength = Math.ceil(this.alphabet.length / sepDiv);

			if (sepsLength > this.seps.length) {

				diff = sepsLength - this.seps.length;
				this.seps += this.alphabet.substr(0, diff);
				this.alphabet = this.alphabet.substr(diff);

			}

		}

		this.alphabet = this._shuffle(this.alphabet, this.salt);
		const guardCount = Math.ceil(this.alphabet.length / guardDiv);

		if (this.alphabet.length < 3) {
			this.guards = this.seps.substr(0, guardCount);
			this.seps = this.seps.substr(guardCount);
		} else {
			this.guards = this.alphabet.substr(0, guardCount);
			this.alphabet = this.alphabet.substr(guardCount);
		}

	}

	encode(...numbers) {

		const ret = '';

		if (!numbers.length) {
			return ret;
		}

		if (numbers[0] && numbers[0].constructor === Array) {
			numbers = numbers[0];
			if (!numbers.length) {
				return ret;
			}
		}

		for (let i = 0; i !== numbers.length; i++) {
			numbers[i] = this.parseInt(numbers[i], 10);
			if (numbers[i] >= 0) {
				continue;
			} else {
				return ret;
			}
		}

		return this._encode(numbers);

	}

	decode(id) {

		const ret = [];

		if (!id || !id.length || typeof id !== 'string') {
			return ret;
		}

		return this._decode(id, this.alphabet);

	}

	encodeHex(hex) {

		hex = hex.toString();
		if (!/^[0-9a-fA-F]+$/.test(hex)) {
			return '';
		}

		const numbers = hex.match(/[\w\W]{1,12}/g);

		for (let i = 0; i !== numbers.length; i++) {
			numbers[i] = parseInt('1' + numbers[i], 16);
		}

		return this.encode.apply(this, numbers);

	}

	decodeHex(id) {

		let ret = [];

		const numbers = this.decode(id);

		for (let i = 0; i !== numbers.length; i++) {
			ret += (numbers[i]).toString(16).substr(1);
		}

		return ret;

	}

	_encode(numbers) {

		let ret,
			alphabet = this.alphabet,
			numbersIdInt = 0;

		for (let i = 0; i !== numbers.length; i++) {
			numbersIdInt += (numbers[i] % (i + 100));
		}

		ret = alphabet.charAt(numbersIdInt % alphabet.length);
		const lottery = ret;

		for (let i = 0; i !== numbers.length; i++) {

			let number = numbers[i];
			const buffer = lottery + this.salt + alphabet;

			alphabet = this._shuffle(alphabet, buffer.substr(0, alphabet.length));
			const last = this._toAlphabet(number, alphabet);

			ret += last;

			if (i + 1 < numbers.length) {
				number %= (last.charCodeAt(0) + i);
				const sepsIndex = number % this.seps.length;
				ret += this.seps.charAt(sepsIndex);
			}

		}

		if (ret.length < this.minLength) {

			let guardIndex = (numbersIdInt + ret[0].charCodeAt(0)) % this.guards.length;
			let guard = this.guards[guardIndex];

			ret = guard + ret;

			if (ret.length < this.minLength) {

				guardIndex = (numbersIdInt + ret[2].charCodeAt(0)) % this.guards.length;
				guard = this.guards[guardIndex];

				ret += guard;

			}

		}

		const halfLength = parseInt(alphabet.length / 2, 10);
		while (ret.length < this.minLength) {

			alphabet = this._shuffle(alphabet, alphabet);
			ret = alphabet.substr(halfLength) + ret + alphabet.substr(0, halfLength);

			const excess = ret.length - this.minLength;
			if (excess > 0) {
				ret = ret.substr(excess / 2, this.minLength);
			}

		}

		return ret;

	}

	_decode(id, alphabet) {

		let ret = [], i = 0,
			r = new RegExp(`[${this.escapeRegExp(this.guards)}]`, 'g'),
			idBreakdown = id.replace(r, ' '),
			idArray = idBreakdown.split(' ');

		if (idArray.length === 3 || idArray.length === 2) {
			i = 1;
		}

		idBreakdown = idArray[i];
		if (typeof idBreakdown[0] !== 'undefined') {

			const lottery = idBreakdown[0];
			idBreakdown = idBreakdown.substr(1);

			r = new RegExp(`[${this.escapeRegExp(this.seps)}]`, 'g');
			idBreakdown = idBreakdown.replace(r, ' ');
			idArray = idBreakdown.split(' ');

			for (let j = 0; j !== idArray.length; j++) {

				const subId = idArray[j];
				const buffer = lottery + this.salt + alphabet;

				alphabet = this._shuffle(alphabet, buffer.substr(0, alphabet.length));
				ret.push(this._fromAlphabet(subId, alphabet));

			}

			if (this.encode(ret) !== id) {
				ret = [];
			}

		}

		return ret;

	}

	_shuffle(alphabet, salt) {

		let integer;

		if (!salt.length) {
			return alphabet;
		}

		alphabet = alphabet.split("");

		for (let i = alphabet.length - 1, v = 0, p = 0, j = 0; i > 0; i--, v++) {

			v %= salt.length;
			p += integer = salt.charCodeAt(v);
			j = (integer + v + p) % i;

			const tmp = alphabet[j];
			alphabet[j] = alphabet[i];
			alphabet[i] = tmp;

		}

		alphabet = alphabet.join("");

		return alphabet;

	}

	_toAlphabet(input, alphabet) {

		let id = '';

		do {
			id = alphabet.charAt(input % alphabet.length) + id;
			input = parseInt(input / alphabet.length, 10);
		} while (input);

		return id;

	}

	_fromAlphabet(input, alphabet) {

		return input.split("").map(
			(item) => alphabet.indexOf(item)
		).reduce(
			(carry, item) => carry * alphabet.length + item,
			0
		);

	}

}
