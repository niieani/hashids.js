import type { NumberLike } from './util'
import {
  fromAlphabet,
  isIntegerNumber,
  isPositiveAndFinite,
  keepUnique,
  makeAnyOfCharsRegExp,
  makeAtLeastSomeCharRegExp,
  onlyChars,
  safeParseInt10,
  shuffle,
  splitAtIntervalAndMap,
  toAlphabet,
  withoutChars,
} from './util'

const MIN_ALPHABET_LENGTH = 16
const SEPARATOR_DIV = 3.5
const GUARD_DIV = 12
const HEXADECIMAL = 16
const SPLIT_AT_EVERY_NTH = 12

const MODULO_PART = 100
export default class Hashids {
  private alphabet: string[]
  private seps: string[]
  private guards: string[]
  private salt: string[]
  private guardsRegExp: RegExp
  private sepsRegExp: RegExp
  private allowedCharsRegExp: RegExp

  constructor(
    salt = '',
    private minLength = 0,
    alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    seps = 'cfhistuCFHISTU',
  ) {
    if (typeof minLength !== 'number') {
      throw new TypeError(
        `Hashids: Provided 'minLength' has to be a number (is ${typeof minLength})`,
      )
    }
    if (typeof salt !== 'string') {
      throw new TypeError(
        `Hashids: Provided 'salt' has to be a string (is ${typeof salt})`,
      )
    }
    if (typeof alphabet !== 'string') {
      throw new TypeError(
        `Hashids: Provided alphabet has to be a string (is ${typeof alphabet})`,
      )
    }

    const saltChars = Array.from(salt)
    const alphabetChars = Array.from(alphabet)
    const sepsChars = Array.from(seps)

    this.salt = saltChars

    const uniqueAlphabet = keepUnique(alphabetChars)

    if (uniqueAlphabet.length < MIN_ALPHABET_LENGTH) {
      throw new Error(
        `Hashids: alphabet must contain at least ${MIN_ALPHABET_LENGTH} unique characters, provided: ${uniqueAlphabet.join(
          '',
        )}`,
      )
    }

    /** `alphabet` should not contains `seps` */
    this.alphabet = withoutChars(uniqueAlphabet, sepsChars)
    /** `seps` should contain only characters present in `alphabet` */
    const filteredSeps = onlyChars(sepsChars, uniqueAlphabet)
    this.seps = shuffle(filteredSeps, saltChars)

    let sepsLength
    let diff

    if (
      this.seps.length === 0 ||
      this.alphabet.length / this.seps.length > SEPARATOR_DIV
    ) {
      sepsLength = Math.ceil(this.alphabet.length / SEPARATOR_DIV)

      if (sepsLength > this.seps.length) {
        diff = sepsLength - this.seps.length
        this.seps.push(...this.alphabet.slice(0, diff))
        this.alphabet = this.alphabet.slice(diff)
      }
    }

    this.alphabet = shuffle(this.alphabet, saltChars)
    const guardCount = Math.ceil(this.alphabet.length / GUARD_DIV)

    if (this.alphabet.length < 3) {
      this.guards = this.seps.slice(0, guardCount)
      this.seps = this.seps.slice(guardCount)
    } else {
      this.guards = this.alphabet.slice(0, guardCount)
      this.alphabet = this.alphabet.slice(guardCount)
    }

    this.guardsRegExp = makeAnyOfCharsRegExp(this.guards)
    this.sepsRegExp = makeAnyOfCharsRegExp(this.seps)
    this.allowedCharsRegExp = makeAtLeastSomeCharRegExp([
      ...this.alphabet,
      ...this.guards,
      ...this.seps,
    ])
  }

  encode(numbers: NumberLike[] | string[] | string): string
  encode(...numbers: NumberLike[]): string
  encode(...numbers: string[]): string
  encode<T extends NumberLike | string>(
    first: T | T[],
    ...inputNumbers: T[]
  ): string {
    const ret = ''

    let numbers: T[] = Array.isArray(first)
      ? first
      : [...(first != null ? [first] : []), ...inputNumbers]

    if (numbers.length === 0) {
      return ret
    }

    if (!numbers.every(isIntegerNumber)) {
      numbers = numbers.map((n) =>
        typeof n === 'bigint' || typeof n === 'number'
          ? n
          : safeParseInt10(String(n)),
      ) as T[]
    }

    if (!(numbers as NumberLike[]).every(isPositiveAndFinite)) {
      return ret
    }

    return this._encode(numbers as number[]).join('')
  }

  decode(id: string): NumberLike[] {
    if (!id || typeof id !== 'string' || id.length === 0) return []
    return this._decode(id)
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
  encodeHex(inputHex: bigint | string): string {
    let hex = inputHex
    switch (typeof hex) {
      case 'bigint':
        hex = hex.toString(HEXADECIMAL)
        break
      case 'string':
        if (!/^[\dA-Fa-f]+$/.test(hex)) return ''
        break
      default:
        throw new Error(
          `Hashids: The provided value is neither a string, nor a BigInt (got: ${typeof hex})`,
        )
    }

    const numbers = splitAtIntervalAndMap(hex, SPLIT_AT_EVERY_NTH, (part) =>
      Number.parseInt(`1${part}`, 16),
    )
    return this.encode(numbers)
  }

  decodeHex(id: string): string {
    return this.decode(id)
      .map((number) => number.toString(HEXADECIMAL).slice(1))
      .join('')
  }

  isValidId(id: string): boolean {
    return this.allowedCharsRegExp.test(id)
  }

  private _encode(numbers: NumberLike[]): string[] {
    let { alphabet } = this

    const numbersIdInt = numbers.reduce<number>(
      (last, number, i) =>
        last +
        (typeof number === 'bigint'
          ? Number(number % BigInt(i + MODULO_PART))
          : number % (i + MODULO_PART)),
      0,
    )

    let ret: string[] = [alphabet[numbersIdInt % alphabet.length]!]
    const lottery = [...ret]

    const { seps } = this
    const { guards } = this

    numbers.forEach((number, i) => {
      const buffer = lottery.concat(this.salt, alphabet)

      alphabet = shuffle(alphabet, buffer)
      const last = toAlphabet(number, alphabet)

      ret.push(...last)

      if (i + 1 < numbers.length) {
        const charCode = last[0]!.codePointAt(0)! + i
        const extraNumber =
          typeof number === 'bigint'
            ? Number(number % BigInt(charCode))
            : number % charCode
        ret.push(seps[extraNumber % seps.length]!)
      }
    })

    if (ret.length < this.minLength) {
      const prefixGuardIndex =
        (numbersIdInt + ret[0]!.codePointAt(0)!) % guards.length
      ret.unshift(guards[prefixGuardIndex]!)

      if (ret.length < this.minLength) {
        const suffixGuardIndex =
          (numbersIdInt + ret[2]!.codePointAt(0)!) % guards.length
        ret.push(guards[suffixGuardIndex]!)
      }
    }

    const halfLength = Math.floor(alphabet.length / 2)
    while (ret.length < this.minLength) {
      alphabet = shuffle(alphabet, alphabet)
      ret.unshift(...alphabet.slice(halfLength))
      ret.push(...alphabet.slice(0, halfLength))

      const excess = ret.length - this.minLength
      if (excess > 0) {
        const halfOfExcess = excess / 2
        ret = ret.slice(halfOfExcess, halfOfExcess + this.minLength)
      }
    }

    return ret
  }

  private _decode(id: string): NumberLike[] {
    if (!this.isValidId(id)) {
      throw new Error(
        `The provided ID (${id}) is invalid, as it contains characters that do not exist in the alphabet (${this.guards.join(
          '',
        )}${this.seps.join('')}${this.alphabet.join('')})`,
      )
    }
    const idGuardsArray = id.split(this.guardsRegExp)
    const splitIndex =
      idGuardsArray.length === 3 || idGuardsArray.length === 2 ? 1 : 0

    const idBreakdown = idGuardsArray[splitIndex]!
    if (idBreakdown.length === 0) return []

    const lotteryChar = idBreakdown[Symbol.iterator]().next().value as string
    const idArray = idBreakdown.slice(lotteryChar.length).split(this.sepsRegExp)

    let lastAlphabet: string[] = this.alphabet
    const result: NumberLike[] = []

    for (const subId of idArray) {
      const buffer = [lotteryChar, ...this.salt, ...lastAlphabet]
      const nextAlphabet = shuffle(
        lastAlphabet,
        buffer.slice(0, lastAlphabet.length),
      )
      result.push(fromAlphabet(Array.from(subId), nextAlphabet))
      lastAlphabet = nextAlphabet
    }

    // if the result is different from what we'd expect, we return an empty result (malformed input):
    if (this._encode(result).join('') !== id) return []
    return result
  }
}
