(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("Hashids", ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.Hashids = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.unicodeSubstr = _exports.onlyChars = _exports.withoutChars = _exports.keepUniqueChars = _exports.default = void 0;

  function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Hashids =
  /*#__PURE__*/
  function () {
    function Hashids() {
      var salt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var minLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var alphabet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
      var seps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'cfhistuCFHISTU';

      _classCallCheck(this, Hashids);

      this.salt = salt;
      this.minLength = minLength;

      if (typeof minLength !== 'number') {
        throw new Error("Hashids: Provided 'minLength' has to be a number (is ".concat(_typeof(minLength), ")"));
      }

      if (typeof salt !== 'string') {
        throw new Error("Hashids: Provided 'salt' has to be a string (is ".concat(_typeof(salt), ")"));
      }

      if (typeof alphabet !== 'string') {
        throw new Error("Hashids: Provided alphabet has to be a string (is ".concat(_typeof(alphabet), ")"));
      }

      var uniqueAlphabet = keepUniqueChars(alphabet);

      if (uniqueAlphabet.length < minAlphabetLength) {
        throw new Error("Hashids: alphabet must contain at least ".concat(minAlphabetLength, " unique characters, provided: ").concat(uniqueAlphabet));
      }
      /** `alphabet` should not contains `seps` */


      this.alphabet = withoutChars(uniqueAlphabet, seps);
      /** `seps` should contain only characters present in `alphabet` */

      var filteredSeps = onlyChars(seps, uniqueAlphabet);
      this.seps = shuffle(filteredSeps, salt);
      var sepsLength;
      var diff;

      if (_toConsumableArray(this.seps).length === 0 || _toConsumableArray(this.alphabet).length / _toConsumableArray(this.seps).length > sepDiv) {
        sepsLength = Math.ceil(_toConsumableArray(this.alphabet).length / sepDiv);

        if (sepsLength > _toConsumableArray(this.seps).length) {
          diff = sepsLength - _toConsumableArray(this.seps).length;
          this.seps += unicodeSubstr(this.alphabet, 0, diff);
          this.alphabet = unicodeSubstr(this.alphabet, diff);
        }
      }

      this.alphabet = shuffle(this.alphabet, salt);
      var guardCount = Math.ceil(_toConsumableArray(this.alphabet).length / guardDiv);

      if (_toConsumableArray(this.alphabet).length < 3) {
        this.guards = unicodeSubstr(this.seps, 0, guardCount);
        this.seps = unicodeSubstr(this.seps, guardCount);
      } else {
        this.guards = unicodeSubstr(this.alphabet, 0, guardCount);
        this.alphabet = unicodeSubstr(this.alphabet, guardCount);
      }
    }

    _createClass(Hashids, [{
      key: "encode",
      value: function encode(first) {
        for (var _len = arguments.length, numbers = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          numbers[_key - 1] = arguments[_key];
        }

        var ret = '';

        if (Array.isArray(first)) {
          numbers = first;
        } else {
          // eslint-disable-next-line eqeqeq
          numbers = [].concat(_toConsumableArray(first != null ? [first] : []), _toConsumableArray(numbers));
        }

        if (!numbers.length) {
          return ret;
        }

        if (!numbers.every(isIntegerNumber)) {
          numbers = numbers.map(function (n) {
            return typeof n === 'bigint' || typeof n === 'number' ? n : safeParseInt10(String(n));
          });
        }

        if (!numbers.every(isPositiveAndFinite)) {
          return ret;
        }

        return this._encode(numbers);
      }
    }, {
      key: "decode",
      value: function decode(id) {
        if (!id || typeof id !== 'string' || id.length === 0) return [];
        return this._decode(id, this.alphabet);
      }
      /**
       * @description Splits a hex string into groups of 12-digit hexadecimal numbers,
       * then prefixes each with '1' and encodes the resulting array of numbers
       *
       * Encoding '00000000000f00000000000f000f' would be the equivalent of:
       * Hashids.encode([0x100000000000f, 0x100000000000f, 0x1000f])
       *
       * This means that if your environment supports BigInts,
       * you will get different (shorter) results if you provide
       * a BigInt representation of your hex and use `encode` directly, e.g.:
       * Hashids.encode(BigInt(`0x${hex}`))
       *
       * To decode such a representation back to a hex string, use the following snippet:
       * Hashids.decode(id)[0].toString(16)
       */

    }, {
      key: "encodeHex",
      value: function encodeHex(hex) {
        switch (_typeof(hex)) {
          case 'bigint':
            hex = hex.toString(16);
            break;

          case 'string':
            if (!/^[0-9a-fA-F]+$/.test(hex)) return '';
            break;

          default:
            throw new Error("Hashids: The provided value is neither a string, nor a BigInt (got: ".concat(_typeof(hex), ")"));
        }

        var numbers = splitAtIntervalAndMap(hex, 12, function (part) {
          return parseInt("1".concat(part), 16);
        });
        return this.encode(numbers);
      }
    }, {
      key: "decodeHex",
      value: function decodeHex(id) {
        return this.decode(id).map(function (number) {
          return number.toString(16).slice(1);
        }).join('');
      }
    }, {
      key: "_encode",
      value: function _encode(numbers) {
        var _this = this;

        var ret;
        var alphabet = this.alphabet;
        var numbersIdInt = numbers.reduce(function (last, number, i) {
          return last + (typeof number === 'bigint' ? Number(number % BigInt(i + 100)) : number % (i + 100));
        }, 0);
        ret = _toConsumableArray(alphabet)[numbersIdInt % _toConsumableArray(alphabet).length];
        var lottery = ret;

        var seps = _toConsumableArray(this.seps);

        var guards = _toConsumableArray(this.guards);

        numbers.forEach(function (number, i) {
          var buffer = lottery + _this.salt + alphabet;
          alphabet = shuffle(alphabet, unicodeSubstr(buffer, 0));
          var last = toAlphabet(number, alphabet);
          ret += last;

          if (i + 1 < numbers.length) {
            var charCode = last.codePointAt(0) + i;
            var extraNumber = typeof number === 'bigint' ? Number(number % BigInt(charCode)) : number % charCode;
            ret += seps[extraNumber % seps.length];
          }
        });

        if (_toConsumableArray(ret).length < this.minLength) {
          var prefixGuardIndex = (numbersIdInt + _toConsumableArray(ret)[0].codePointAt(0)) % guards.length;
          ret = guards[prefixGuardIndex] + ret;

          if (_toConsumableArray(ret).length < this.minLength) {
            var suffixGuardIndex = (numbersIdInt + _toConsumableArray(ret)[2].codePointAt(0)) % guards.length;
            ret = ret + guards[suffixGuardIndex];
          }
        }

        var halfLength = Math.floor(_toConsumableArray(alphabet).length / 2);

        while (_toConsumableArray(ret).length < this.minLength) {
          alphabet = shuffle(alphabet, alphabet);
          ret = unicodeSubstr(alphabet, halfLength) + ret + unicodeSubstr(alphabet, 0, halfLength);
          var excess = _toConsumableArray(ret).length - this.minLength;

          if (excess > 0) {
            ret = unicodeSubstr(ret, excess / 2, this.minLength);
          }
        }

        return ret;
      }
    }, {
      key: "_decode",
      value: function _decode(id, alphabet) {
        var _this2 = this;

        var idGuardsArray = splitAtMatch(id, function (char) {
          return _this2.guards.includes(char);
        });
        var splitIndex = idGuardsArray.length === 3 || idGuardsArray.length === 2 ? 1 : 0;
        var idBreakdown = idGuardsArray[splitIndex];

        var idBreakdownArray = _toConsumableArray(idBreakdown);

        if (idBreakdownArray.length === 0) return [];

        var _idBreakdownArray = _toArray(idBreakdownArray),
            lotteryChar = _idBreakdownArray[0],
            chars = _idBreakdownArray.slice(1);

        var rest = chars.join('');
        var idArray = splitAtMatch(rest, function (char) {
          return _this2.seps.includes(char);
        });

        var _idArray$reduce = idArray.reduce(function (_ref, subId) {
          var result = _ref.result,
              lastAlphabet = _ref.lastAlphabet;
          var buffer = lotteryChar + _this2.salt + lastAlphabet;
          var nextAlphabet = shuffle(lastAlphabet, unicodeSubstr(buffer, 0, _toConsumableArray(lastAlphabet).length));
          return {
            result: [].concat(_toConsumableArray(result), [fromAlphabet(subId, nextAlphabet)]),
            lastAlphabet: nextAlphabet
          };
        }, {
          result: [],
          lastAlphabet: alphabet
        }),
            result = _idArray$reduce.result;

        if (this._encode(result) !== id) return [];
        return result;
      }
    }]);

    return Hashids;
  }();

  _exports.default = Hashids;
  var minAlphabetLength = 16;
  var sepDiv = 3.5;
  var guardDiv = 12;

  var keepUniqueChars = function keepUniqueChars(str) {
    return Array.from(new Set(str)).join('');
  };

  _exports.keepUniqueChars = keepUniqueChars;

  var withoutChars = function withoutChars(_ref2, _ref3) {
    var _ref4 = _toArray(_ref2),
        str = _ref4.slice(0);

    var _ref5 = _toArray(_ref3),
        without = _ref5.slice(0);

    return str.filter(function (char) {
      return !without.includes(char);
    }).join('');
  };

  _exports.withoutChars = withoutChars;

  var onlyChars = function onlyChars(_ref6, _ref7) {
    var _ref8 = _toArray(_ref6),
        str = _ref8.slice(0);

    var _ref9 = _toArray(_ref7),
        only = _ref9.slice(0);

    return str.filter(function (char) {
      return only.includes(char);
    }).join('');
  };

  _exports.onlyChars = onlyChars;

  var unicodeSubstr = function unicodeSubstr(_ref10, from, to) {
    var _ref11 = _toArray(_ref10),
        str = _ref11.slice(0);

    return str.slice(from, to === undefined ? undefined : from + to).join('');
  };

  _exports.unicodeSubstr = unicodeSubstr;

  var isIntegerNumber = function isIntegerNumber(n) {
    return typeof n === 'bigint' || !Number.isNaN(Number(n)) && Math.floor(Number(n)) === n;
  };

  var isPositiveAndFinite = function isPositiveAndFinite(n) {
    return typeof n === 'bigint' || n >= 0 && Number.isSafeInteger(n);
  };

  function shuffle(alphabet, _ref12) {
    var _ref13 = _toArray(_ref12),
        salt = _ref13.slice(0);

    var integer;

    if (!salt.length) {
      return alphabet;
    }

    var alphabetChars = _toConsumableArray(alphabet);

    for (var i = alphabetChars.length - 1, v = 0, p = 0; i > 0; i--, v++) {
      v %= salt.length;
      p += integer = salt[v].codePointAt(0);
      var j = (integer + v + p) % i // swap characters at positions i and j
      ;
      var _ref14 = [alphabetChars[i], alphabetChars[j]];
      alphabetChars[j] = _ref14[0];
      alphabetChars[i] = _ref14[1];
    }

    return alphabetChars.join('');
  }

  var toAlphabet = function toAlphabet(input, _ref15) {
    var _ref16 = _toArray(_ref15),
        alphabet = _ref16.slice(0);

    var id = '';

    if (typeof input === 'bigint') {
      var alphabetLength = BigInt(alphabet.length);

      do {
        id = alphabet[Number(input % alphabetLength)] + id;
        input = input / alphabetLength;
      } while (input);
    } else {
      do {
        id = alphabet[input % alphabet.length] + id;
        input = Math.floor(input / alphabet.length);
      } while (input);
    }

    return id;
  };

  var fromAlphabet = function fromAlphabet(_ref17, _ref18) {
    var _ref19 = _toArray(_ref17),
        input = _ref19.slice(0);

    var _ref20 = _toArray(_ref18),
        alphabet = _ref20.slice(0);

    return input.map(function (item) {
      return alphabet.indexOf(item);
    }).reduce(function (carry, index) {
      if (typeof carry === 'bigint') {
        return carry * BigInt(alphabet.length) + BigInt(index);
      }

      var value = carry * alphabet.length + index;
      var isSafeValue = Number.isSafeInteger(value);

      if (isSafeValue) {
        return value;
      } else {
        if (typeof BigInt === 'function') {
          return BigInt(carry) * BigInt(alphabet.length) + BigInt(index);
        } else {
          // we do not have support for BigInt:
          throw new Error("Unable to decode the provided string, due to lack of support for BigInt numbers in the current environment");
        }
      }
    }, 0);
  };

  var splitAtMatch = function splitAtMatch(_ref21, match) {
    var _ref22 = _toArray(_ref21),
        chars = _ref22.slice(0);

    return chars.reduce(function (groups, char) {
      return match(char) ? [].concat(_toConsumableArray(groups), ['']) : [].concat(_toConsumableArray(groups.slice(0, -1)), [groups[groups.length - 1] + char]);
    }, ['']);
  };

  var safeToParseNumberRegExp = /^\+?[0-9]+$/;

  var safeParseInt10 = function safeParseInt10(str) {
    return safeToParseNumberRegExp.test(str) ? parseInt(str, 10) : NaN;
  };
  /** note: this doesn't need to support unicode, since it's used to split hex strings only */


  var splitAtIntervalAndMap = function splitAtIntervalAndMap(str, nth, map) {
    return Array.from({
      length: Math.ceil(str.length / nth)
    }, function (_, index) {
      return map(str.slice(index * nth, (index + 1) * nth));
    });
  };
});

//# sourceMappingURL=hashids.js.map