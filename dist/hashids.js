(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['module', 'exports'], factory);
	} else if (typeof exports !== "undefined") {
		factory(module, exports);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod, mod.exports);
		global.Hashids = mod.exports;
	}
})(this, function (module, exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var Hashids = function () {
		function Hashids() {
			var salt = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
			var minLength = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
			var alphabet = arguments.length <= 2 || arguments[2] === undefined ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890' : arguments[2];

			_classCallCheck(this, Hashids);

			var minAlphabetLength = 16;
			var sepDiv = 3.5;
			var guardDiv = 12;

			var errorAlphabetLength = 'error: alphabet must contain at least X unique characters';
			var errorAlphabetSpace = 'error: alphabet cannot contain spaces';

			var uniqueAlphabet = '',
			    sepsLength = void 0,
			    diff = void 0;

			/* funcs */

			this.escapeRegExp = function (s) {
				return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
			};
			this.parseInt = function (v, radix) {
				return (/^(\-|\+)?([0-9]+|Infinity)$/.test(v) ? parseInt(v, radix) : NaN
				);
			};

			/* alphabet vars */

			this.seps = 'cfhistuCFHISTU';
			this.minLength = parseInt(minLength, 10) > 0 ? minLength : 0;
			this.salt = typeof salt === 'string' ? salt : '';

			if (typeof alphabet === 'string') {
				this.alphabet = alphabet;
			}

			for (var i = 0; i !== this.alphabet.length; i++) {
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

			for (var _i = 0; _i !== this.seps.length; _i++) {

				var j = this.alphabet.indexOf(this.seps.charAt(_i));
				if (j === -1) {
					this.seps = this.seps.substr(0, _i) + ' ' + this.seps.substr(_i + 1);
				} else {
					this.alphabet = this.alphabet.substr(0, j) + ' ' + this.alphabet.substr(j + 1);
				}
			}

			this.alphabet = this.alphabet.replace(/ /g, '');

			this.seps = this.seps.replace(/ /g, '');
			this.seps = this._shuffle(this.seps, this.salt);

			if (!this.seps.length || this.alphabet.length / this.seps.length > sepDiv) {

				sepsLength = Math.ceil(this.alphabet.length / sepDiv);

				if (sepsLength > this.seps.length) {

					diff = sepsLength - this.seps.length;
					this.seps += this.alphabet.substr(0, diff);
					this.alphabet = this.alphabet.substr(diff);
				}
			}

			this.alphabet = this._shuffle(this.alphabet, this.salt);
			var guardCount = Math.ceil(this.alphabet.length / guardDiv);

			if (this.alphabet.length < 3) {
				this.guards = this.seps.substr(0, guardCount);
				this.seps = this.seps.substr(guardCount);
			} else {
				this.guards = this.alphabet.substr(0, guardCount);
				this.alphabet = this.alphabet.substr(guardCount);
			}
		}

		_createClass(Hashids, [{
			key: 'encode',
			value: function encode() {
				for (var _len = arguments.length, numbers = Array(_len), _key = 0; _key < _len; _key++) {
					numbers[_key] = arguments[_key];
				}

				var ret = '';

				if (!numbers.length) {
					return ret;
				}

				if (numbers[0] && numbers[0].constructor === Array) {
					numbers = numbers[0];
					if (!numbers.length) {
						return ret;
					}
				}

				for (var i = 0; i !== numbers.length; i++) {
					numbers[i] = this.parseInt(numbers[i], 10);
					if (numbers[i] >= 0) {
						continue;
					} else {
						return ret;
					}
				}

				return this._encode(numbers);
			}
		}, {
			key: 'decode',
			value: function decode(id) {

				var ret = [];

				if (!id || !id.length || typeof id !== 'string') {
					return ret;
				}

				return this._decode(id, this.alphabet);
			}
		}, {
			key: 'encodeHex',
			value: function encodeHex(hex) {

				hex = hex.toString();
				if (!/^[0-9a-fA-F]+$/.test(hex)) {
					return '';
				}

				var numbers = hex.match(/[\w\W]{1,12}/g);

				for (var i = 0; i !== numbers.length; i++) {
					numbers[i] = parseInt('1' + numbers[i], 16);
				}

				return this.encode.apply(this, numbers);
			}
		}, {
			key: 'decodeHex',
			value: function decodeHex(id) {

				var ret = [];

				var numbers = this.decode(id);

				for (var i = 0; i !== numbers.length; i++) {
					ret += numbers[i].toString(16).substr(1);
				}

				return ret;
			}
		}, {
			key: '_encode',
			value: function _encode(numbers) {

				var ret = void 0,
				    alphabet = this.alphabet,
				    numbersIdInt = 0;

				for (var i = 0; i !== numbers.length; i++) {
					numbersIdInt += numbers[i] % (i + 100);
				}

				ret = alphabet.charAt(numbersIdInt % alphabet.length);
				var lottery = ret;

				for (var _i2 = 0; _i2 !== numbers.length; _i2++) {

					var number = numbers[_i2];
					var buffer = lottery + this.salt + alphabet;

					alphabet = this._shuffle(alphabet, buffer.substr(0, alphabet.length));
					var last = this._toAlphabet(number, alphabet);

					ret += last;

					if (_i2 + 1 < numbers.length) {
						number %= last.charCodeAt(0) + _i2;
						var sepsIndex = number % this.seps.length;
						ret += this.seps.charAt(sepsIndex);
					}
				}

				if (ret.length < this.minLength) {

					var guardIndex = (numbersIdInt + ret[0].charCodeAt(0)) % this.guards.length;
					var guard = this.guards[guardIndex];

					ret = guard + ret;

					if (ret.length < this.minLength) {

						guardIndex = (numbersIdInt + ret[2].charCodeAt(0)) % this.guards.length;
						guard = this.guards[guardIndex];

						ret += guard;
					}
				}

				var halfLength = parseInt(alphabet.length / 2, 10);
				while (ret.length < this.minLength) {

					alphabet = this._shuffle(alphabet, alphabet);
					ret = alphabet.substr(halfLength) + ret + alphabet.substr(0, halfLength);

					var excess = ret.length - this.minLength;
					if (excess > 0) {
						ret = ret.substr(excess / 2, this.minLength);
					}
				}

				return ret;
			}
		}, {
			key: '_decode',
			value: function _decode(id, alphabet) {

				var ret = [],
				    i = 0,
				    r = new RegExp('[' + this.escapeRegExp(this.guards) + ']', 'g'),
				    idBreakdown = id.replace(r, ' '),
				    idArray = idBreakdown.split(' ');

				if (idArray.length === 3 || idArray.length === 2) {
					i = 1;
				}

				idBreakdown = idArray[i];
				if (typeof idBreakdown[0] !== 'undefined') {

					var lottery = idBreakdown[0];
					idBreakdown = idBreakdown.substr(1);

					r = new RegExp('[' + this.escapeRegExp(this.seps) + ']', 'g');
					idBreakdown = idBreakdown.replace(r, ' ');
					idArray = idBreakdown.split(' ');

					for (var j = 0; j !== idArray.length; j++) {

						var subId = idArray[j];
						var buffer = lottery + this.salt + alphabet;

						alphabet = this._shuffle(alphabet, buffer.substr(0, alphabet.length));
						ret.push(this._fromAlphabet(subId, alphabet));
					}

					if (this._encode(ret) !== id) {
						ret = [];
					}
				}

				return ret;
			}
		}, {
			key: '_shuffle',
			value: function _shuffle(alphabet, salt) {

				var integer = void 0;

				if (!salt.length) {
					return alphabet;
				}

				for (var i = alphabet.length - 1, v = 0, p = 0, j = 0; i > 0; i--, v++) {

					v %= salt.length;
					p += integer = salt.charAt(v).charCodeAt(0);
					j = (integer + v + p) % i;

					var tmp = alphabet[j];
					alphabet = alphabet.substr(0, j) + alphabet.charAt(i) + alphabet.substr(j + 1);
					alphabet = alphabet.substr(0, i) + tmp + alphabet.substr(i + 1);
				}

				return alphabet;
			}
		}, {
			key: '_toAlphabet',
			value: function _toAlphabet(input, alphabet) {

				var id = '';

				do {
					id = alphabet.charAt(input % alphabet.length) + id;
					input = parseInt(input / alphabet.length, 10);
				} while (input);

				return id;
			}
		}, {
			key: '_fromAlphabet',
			value: function _fromAlphabet(input, alphabet) {

				var number = 0;

				for (var i = 0; i < input.length; i++) {
					var pos = alphabet.indexOf(input[i]);
					number += pos * Math.pow(alphabet.length, input.length - i - 1);
				}

				return number;
			}
		}]);

		return Hashids;
	}();

	exports.default = Hashids;
	module.exports = exports['default'];
});
