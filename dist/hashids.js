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
    global.Hashids = mod.exports.default;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.onlyChars = _exports.withoutChars = _exports.keepUnique = _exports.default = void 0;

  function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var Hashids = /*#__PURE__*/function () {
    function Hashids(salt, minLength, alphabet, seps) {
      if (salt === void 0) {
        salt = '';
      }

      if (minLength === void 0) {
        minLength = 0;
      }

      if (alphabet === void 0) {
        alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
      }

      if (seps === void 0) {
        seps = 'cfhistuCFHISTU';
      }

      this.minLength = minLength;

      if (typeof minLength !== 'number') {
        throw new TypeError("Hashids: Provided 'minLength' has to be a number (is " + typeof minLength + ")");
      }

      if (typeof salt !== 'string') {
        throw new TypeError("Hashids: Provided 'salt' has to be a string (is " + typeof salt + ")");
      }

      if (typeof alphabet !== 'string') {
        throw new TypeError("Hashids: Provided alphabet has to be a string (is " + typeof alphabet + ")");
      }

      var saltChars = Array.from(salt);
      var alphabetChars = Array.from(alphabet);
      var sepsChars = Array.from(seps);
      this.salt = saltChars;
      var uniqueAlphabet = keepUnique(alphabetChars);

      if (uniqueAlphabet.length < minAlphabetLength) {
        throw new Error("Hashids: alphabet must contain at least " + minAlphabetLength + " unique characters, provided: " + uniqueAlphabet.join(''));
      }
      /** `alphabet` should not contains `seps` */


      this.alphabet = withoutChars(uniqueAlphabet, sepsChars);
      /** `seps` should contain only characters present in `alphabet` */

      var filteredSeps = onlyChars(sepsChars, uniqueAlphabet);
      this.seps = shuffle(filteredSeps, saltChars);
      var sepsLength;
      var diff;

      if (this.seps.length === 0 || this.alphabet.length / this.seps.length > sepDiv) {
        sepsLength = Math.ceil(this.alphabet.length / sepDiv);

        if (sepsLength > this.seps.length) {
          var _this$seps;

          diff = sepsLength - this.seps.length;

          (_this$seps = this.seps).push.apply(_this$seps, _toConsumableArray(this.alphabet.slice(0, diff)));

          this.alphabet = this.alphabet.slice(diff);
        }
      }

      this.alphabet = shuffle(this.alphabet, saltChars);
      var guardCount = Math.ceil(this.alphabet.length / guardDiv);

      if (this.alphabet.length < 3) {
        this.guards = this.seps.slice(0, guardCount);
        this.seps = this.seps.slice(guardCount);
      } else {
        this.guards = this.alphabet.slice(0, guardCount);
        this.alphabet = this.alphabet.slice(guardCount);
      }

      this.guardsRegExp = makeAnyOfCharsRegExp(this.guards);
      this.sepsRegExp = makeAnyOfCharsRegExp(this.seps);
      this.allowedCharsRegExp = makeAtLeastSomeCharRegExp([].concat(_toConsumableArray(this.alphabet), _toConsumableArray(this.guards), _toConsumableArray(this.seps)));
    }

    var _proto = Hashids.prototype;

    _proto.encode = function encode(first) {
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

      return this._encode(numbers).join('');
    };

    _proto.decode = function decode(id) {
      if (!id || typeof id !== 'string' || id.length === 0) return [];
      return this._decode(id);
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
    ;

    _proto.encodeHex = function encodeHex(hex) {
      switch (typeof hex) {
        case 'bigint':
          hex = hex.toString(16);
          break;

        case 'string':
          if (!/^[0-9a-fA-F]+$/.test(hex)) return '';
          break;

        default:
          throw new Error("Hashids: The provided value is neither a string, nor a BigInt (got: " + typeof hex + ")");
      }

      var numbers = splitAtIntervalAndMap(hex, 12, function (part) {
        return parseInt("1" + part, 16);
      });
      return this.encode(numbers);
    };

    _proto.decodeHex = function decodeHex(id) {
      return this.decode(id).map(function (number) {
        return number.toString(16).slice(1);
      }).join('');
    };

    _proto._encode = function _encode(numbers) {
      var _this = this;

      var alphabet = this.alphabet;
      var numbersIdInt = numbers.reduce(function (last, number, i) {
        return last + (typeof number === 'bigint' ? Number(number % BigInt(i + 100)) : number % (i + 100));
      }, 0);
      var ret = [alphabet[numbersIdInt % alphabet.length]];
      var lottery = ret.slice();
      var seps = this.seps;
      var guards = this.guards;
      numbers.forEach(function (number, i) {
        var _ret;

        var buffer = lottery.concat(_this.salt, alphabet);
        alphabet = shuffle(alphabet, buffer);
        var last = toAlphabet(number, alphabet);

        (_ret = ret).push.apply(_ret, _toConsumableArray(last));

        if (i + 1 < numbers.length) {
          var charCode = last[0].codePointAt(0) + i;
          var extraNumber = typeof number === 'bigint' ? Number(number % BigInt(charCode)) : number % charCode;
          ret.push(seps[extraNumber % seps.length]);
        }
      });

      if (ret.length < this.minLength) {
        var prefixGuardIndex = (numbersIdInt + ret[0].codePointAt(0)) % guards.length;
        ret.unshift(guards[prefixGuardIndex]);

        if (ret.length < this.minLength) {
          var suffixGuardIndex = (numbersIdInt + ret[2].codePointAt(0)) % guards.length;
          ret.push(guards[suffixGuardIndex]);
        }
      }

      var halfLength = Math.floor(alphabet.length / 2);

      while (ret.length < this.minLength) {
        var _ret2, _ret3;

        alphabet = shuffle(alphabet, alphabet);

        (_ret2 = ret).unshift.apply(_ret2, _toConsumableArray(alphabet.slice(halfLength)));

        (_ret3 = ret).push.apply(_ret3, _toConsumableArray(alphabet.slice(0, halfLength)));

        var excess = ret.length - this.minLength;

        if (excess > 0) {
          var halfOfExcess = excess / 2;
          ret = ret.slice(halfOfExcess, halfOfExcess + this.minLength);
        }
      }

      return ret;
    };

    _proto.isValidId = function isValidId(id) {
      return this.allowedCharsRegExp.test(id);
    };

    _proto._decode = function _decode(id) {
      if (!this.isValidId(id)) {
        throw new Error("The provided ID (" + id + ") is invalid, as it contains characters that do not exist in the alphabet (" + this.guards.join('') + this.seps.join('') + this.alphabet.join('') + ")");
      }

      var idGuardsArray = id.split(this.guardsRegExp);
      var splitIndex = idGuardsArray.length === 3 || idGuardsArray.length === 2 ? 1 : 0;
      var idBreakdown = idGuardsArray[splitIndex];
      if (idBreakdown.length === 0) return [];
      var lotteryChar = idBreakdown[Symbol.iterator]().next().value;
      var idArray = idBreakdown.slice(lotteryChar.length).split(this.sepsRegExp);
      var lastAlphabet = this.alphabet;
      var result = [];

      for (var _iterator = _createForOfIteratorHelperLoose(idArray), _step; !(_step = _iterator()).done;) {
        var subId = _step.value;
        var buffer = [lotteryChar].concat(_toConsumableArray(this.salt), _toConsumableArray(lastAlphabet));
        var nextAlphabet = shuffle(lastAlphabet, buffer.slice(0, lastAlphabet.length));
        result.push(fromAlphabet(Array.from(subId), nextAlphabet));
        lastAlphabet = nextAlphabet;
      } // if the result is different from what we'd expect, we return an empty result (malformed input):


      if (this._encode(result).join('') !== id) return [];
      return result;
    };

    return Hashids;
  }();

  _exports.default = Hashids;
  var minAlphabetLength = 16;
  var sepDiv = 3.5;
  var guardDiv = 12;

  var keepUnique = function keepUnique(content) {
    return Array.from(new Set(content));
  };

  _exports.keepUnique = keepUnique;

  var withoutChars = function withoutChars(chars, _withoutChars) {
    return chars.filter(function (char) {
      return !_withoutChars.includes(char);
    });
  };

  _exports.withoutChars = withoutChars;

  var onlyChars = function onlyChars(chars, keepChars) {
    return chars.filter(function (char) {
      return keepChars.includes(char);
    });
  };

  _exports.onlyChars = onlyChars;

  var isIntegerNumber = function isIntegerNumber(n) {
    return typeof n === 'bigint' || !Number.isNaN(Number(n)) && Math.floor(Number(n)) === n;
  };

  var isPositiveAndFinite = function isPositiveAndFinite(n) {
    return typeof n === 'bigint' || n >= 0 && Number.isSafeInteger(n);
  };

  function shuffle(alphabetChars, saltChars) {
    if (saltChars.length === 0) {
      return alphabetChars;
    }

    var integer;
    var transformed = alphabetChars.slice();

    for (var i = transformed.length - 1, v = 0, p = 0; i > 0; i--, v++) {
      v %= saltChars.length;
      p += integer = saltChars[v].codePointAt(0);
      var j = (integer + v + p) % i; // swap characters at positions i and j

      var a = transformed[i];
      var b = transformed[j];
      transformed[j] = a;
      transformed[i] = b;
    }

    return transformed;
  }

  var toAlphabet = function toAlphabet(input, alphabetChars) {
    var id = [];

    if (typeof input === 'bigint') {
      var alphabetLength = BigInt(alphabetChars.length);

      do {
        id.unshift(alphabetChars[Number(input % alphabetLength)]);
        input = input / alphabetLength;
      } while (input > BigInt(0));
    } else {
      do {
        id.unshift(alphabetChars[input % alphabetChars.length]);
        input = Math.floor(input / alphabetChars.length);
      } while (input > 0);
    }

    return id;
  };

  var fromAlphabet = function fromAlphabet(inputChars, alphabetChars) {
    return inputChars.reduce(function (carry, item) {
      var index = alphabetChars.indexOf(item);

      if (index === -1) {
        throw new Error("The provided ID (" + inputChars.join('') + ") is invalid, as it contains characters that do not exist in the alphabet (" + alphabetChars.join('') + ")");
      }

      if (typeof carry === 'bigint') {
        return carry * BigInt(alphabetChars.length) + BigInt(index);
      }

      var value = carry * alphabetChars.length + index;
      var isSafeValue = Number.isSafeInteger(value);

      if (isSafeValue) {
        return value;
      } else {
        if (typeof BigInt === 'function') {
          return BigInt(carry) * BigInt(alphabetChars.length) + BigInt(index);
        } else {
          // we do not have support for BigInt:
          throw new Error("Unable to decode the provided string, due to lack of support for BigInt numbers in the current environment");
        }
      }
    }, 0);
  };

  var safeToParseNumberRegExp = /^\+?[0-9]+$/;

  var safeParseInt10 = function safeParseInt10(str) {
    return safeToParseNumberRegExp.test(str) ? parseInt(str, 10) : NaN;
  };

  var splitAtIntervalAndMap = function splitAtIntervalAndMap(str, nth, map) {
    return Array.from({
      length: Math.ceil(str.length / nth)
    }, function (_, index) {
      return map(str.slice(index * nth, (index + 1) * nth));
    });
  };

  var makeAnyOfCharsRegExp = function makeAnyOfCharsRegExp(chars) {
    return new RegExp(chars.map(function (char) {
      return escapeRegExp(char);
    }) // we need to sort these from longest to shortest,
    // as they may contain multibyte unicode characters (these should come first)
    .sort(function (a, b) {
      return b.length - a.length;
    }).join('|'));
  };

  var makeAtLeastSomeCharRegExp = function makeAtLeastSomeCharRegExp(chars) {
    return new RegExp("^[" + chars.map(function (char) {
      return escapeRegExp(char);
    }) // we need to sort these from longest to shortest,
    // as they may contain multibyte unicode characters (these should come first)
    .sort(function (a, b) {
      return b.length - a.length;
    }).join('') + "]+$");
  };

  var escapeRegExp = function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  };
});

//# sourceMappingURL=hashids.js.map