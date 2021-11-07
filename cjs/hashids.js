"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const MIN_ALPHABET_LENGTH = 16;
const SEPARATOR_DIV = 3.5;
const GUARD_DIV = 12;
const HEXADECIMAL = 16;
const SPLIT_AT_EVERY_NTH = 12;
const MODULO_PART = 100;
class Hashids {
    constructor(salt = '', minLength = 0, alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', seps = 'cfhistuCFHISTU') {
        this.minLength = minLength;
        if (typeof minLength !== 'number') {
            throw new TypeError(`Hashids: Provided 'minLength' has to be a number (is ${typeof minLength})`);
        }
        if (typeof salt !== 'string') {
            throw new TypeError(`Hashids: Provided 'salt' has to be a string (is ${typeof salt})`);
        }
        if (typeof alphabet !== 'string') {
            throw new TypeError(`Hashids: Provided alphabet has to be a string (is ${typeof alphabet})`);
        }
        const saltChars = Array.from(salt);
        const alphabetChars = Array.from(alphabet);
        const sepsChars = Array.from(seps);
        this.salt = saltChars;
        const uniqueAlphabet = (0, util_1.keepUnique)(alphabetChars);
        if (uniqueAlphabet.length < MIN_ALPHABET_LENGTH) {
            throw new Error(`Hashids: alphabet must contain at least ${MIN_ALPHABET_LENGTH} unique characters, provided: ${uniqueAlphabet.join('')}`);
        }
        /** `alphabet` should not contains `seps` */
        this.alphabet = (0, util_1.withoutChars)(uniqueAlphabet, sepsChars);
        /** `seps` should contain only characters present in `alphabet` */
        const filteredSeps = (0, util_1.onlyChars)(sepsChars, uniqueAlphabet);
        this.seps = (0, util_1.shuffle)(filteredSeps, saltChars);
        let sepsLength;
        let diff;
        if (this.seps.length === 0 ||
            this.alphabet.length / this.seps.length > SEPARATOR_DIV) {
            sepsLength = Math.ceil(this.alphabet.length / SEPARATOR_DIV);
            if (sepsLength > this.seps.length) {
                diff = sepsLength - this.seps.length;
                this.seps.push(...this.alphabet.slice(0, diff));
                this.alphabet = this.alphabet.slice(diff);
            }
        }
        this.alphabet = (0, util_1.shuffle)(this.alphabet, saltChars);
        const guardCount = Math.ceil(this.alphabet.length / GUARD_DIV);
        if (this.alphabet.length < 3) {
            this.guards = this.seps.slice(0, guardCount);
            this.seps = this.seps.slice(guardCount);
        }
        else {
            this.guards = this.alphabet.slice(0, guardCount);
            this.alphabet = this.alphabet.slice(guardCount);
        }
        this.guardsRegExp = (0, util_1.makeAnyOfCharsRegExp)(this.guards);
        this.sepsRegExp = (0, util_1.makeAnyOfCharsRegExp)(this.seps);
        this.allowedCharsRegExp = (0, util_1.makeAtLeastSomeCharRegExp)([
            ...this.alphabet,
            ...this.guards,
            ...this.seps,
        ]);
    }
    encode(first, ...inputNumbers) {
        const ret = '';
        let numbers = Array.isArray(first)
            ? first
            : [...(first != null ? [first] : []), ...inputNumbers];
        if (numbers.length === 0) {
            return ret;
        }
        if (!numbers.every(util_1.isIntegerNumber)) {
            numbers = numbers.map((n) => typeof n === 'bigint' || typeof n === 'number'
                ? n
                : (0, util_1.safeParseInt10)(String(n)));
        }
        if (!numbers.every(util_1.isPositiveAndFinite)) {
            return ret;
        }
        return this._encode(numbers).join('');
    }
    decode(id) {
        if (!id || typeof id !== 'string' || id.length === 0)
            return [];
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
    encodeHex(inputHex) {
        let hex = inputHex;
        switch (typeof hex) {
            case 'bigint':
                hex = hex.toString(HEXADECIMAL);
                break;
            case 'string':
                if (!/^[\dA-Fa-f]+$/.test(hex))
                    return '';
                break;
            default:
                throw new Error(`Hashids: The provided value is neither a string, nor a BigInt (got: ${typeof hex})`);
        }
        const numbers = (0, util_1.splitAtIntervalAndMap)(hex, SPLIT_AT_EVERY_NTH, (part) => Number.parseInt(`1${part}`, 16));
        return this.encode(numbers);
    }
    decodeHex(id) {
        return this.decode(id)
            .map((number) => number.toString(HEXADECIMAL).slice(1))
            .join('');
    }
    isValidId(id) {
        return this.allowedCharsRegExp.test(id);
    }
    _encode(numbers) {
        let { alphabet } = this;
        const numbersIdInt = numbers.reduce((last, number, i) => last +
            (typeof number === 'bigint'
                ? Number(number % BigInt(i + MODULO_PART))
                : number % (i + MODULO_PART)), 0);
        let ret = [alphabet[numbersIdInt % alphabet.length]];
        const lottery = [...ret];
        const { seps } = this;
        const { guards } = this;
        numbers.forEach((number, i) => {
            const buffer = lottery.concat(this.salt, alphabet);
            alphabet = (0, util_1.shuffle)(alphabet, buffer);
            const last = (0, util_1.toAlphabet)(number, alphabet);
            ret.push(...last);
            if (i + 1 < numbers.length) {
                const charCode = last[0].codePointAt(0) + i;
                const extraNumber = typeof number === 'bigint'
                    ? Number(number % BigInt(charCode))
                    : number % charCode;
                ret.push(seps[extraNumber % seps.length]);
            }
        });
        if (ret.length < this.minLength) {
            const prefixGuardIndex = (numbersIdInt + ret[0].codePointAt(0)) % guards.length;
            ret.unshift(guards[prefixGuardIndex]);
            if (ret.length < this.minLength) {
                const suffixGuardIndex = (numbersIdInt + ret[2].codePointAt(0)) % guards.length;
                ret.push(guards[suffixGuardIndex]);
            }
        }
        const halfLength = Math.floor(alphabet.length / 2);
        while (ret.length < this.minLength) {
            alphabet = (0, util_1.shuffle)(alphabet, alphabet);
            ret.unshift(...alphabet.slice(halfLength));
            ret.push(...alphabet.slice(0, halfLength));
            const excess = ret.length - this.minLength;
            if (excess > 0) {
                const halfOfExcess = excess / 2;
                ret = ret.slice(halfOfExcess, halfOfExcess + this.minLength);
            }
        }
        return ret;
    }
    _decode(id) {
        if (!this.isValidId(id)) {
            throw new Error(`The provided ID (${id}) is invalid, as it contains characters that do not exist in the alphabet (${this.guards.join('')}${this.seps.join('')}${this.alphabet.join('')})`);
        }
        const idGuardsArray = id.split(this.guardsRegExp);
        const splitIndex = idGuardsArray.length === 3 || idGuardsArray.length === 2 ? 1 : 0;
        const idBreakdown = idGuardsArray[splitIndex];
        if (idBreakdown.length === 0)
            return [];
        const lotteryChar = idBreakdown[Symbol.iterator]().next().value;
        const idArray = idBreakdown.slice(lotteryChar.length).split(this.sepsRegExp);
        let lastAlphabet = this.alphabet;
        const result = [];
        for (const subId of idArray) {
            const buffer = [lotteryChar, ...this.salt, ...lastAlphabet];
            const nextAlphabet = (0, util_1.shuffle)(lastAlphabet, buffer.slice(0, lastAlphabet.length));
            result.push((0, util_1.fromAlphabet)(Array.from(subId), nextAlphabet));
            lastAlphabet = nextAlphabet;
        }
        // if the result is different from what we'd expect, we return an empty result (malformed input):
        if (this._encode(result).join('') !== id)
            return [];
        return result;
    }
}
exports.default = Hashids;
//# sourceMappingURL=hashids.js.map