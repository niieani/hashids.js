type NumberLike = number | bigint

export default class Hashids {
  private alphabet: string[]
  private seps: string[]
  private guards: string[]
  private salt: string[]
  private guardsRegExp: RegExp
  private sepsRegExp: RegExp
  private allowedCharsRegExp: RegExp

  public constructor(
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

    if (uniqueAlphabet.length < minAlphabetLength) {
      throw new Error(
        `Hashids: alphabet must contain at least ${minAlphabetLength} unique characters, provided: ${uniqueAlphabet.join(
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
      this.alphabet.length / this.seps.length > sepDiv
    ) {
      sepsLength = Math.ceil(this.alphabet.length / sepDiv)

      if (sepsLength > this.seps.length) {
        diff = sepsLength - this.seps.length
        this.seps.push(...this.alphabet.slice(0, diff))
        this.alphabet = this.alphabet.slice(diff)
      }
    }

    this.alphabet = shuffle(this.alphabet, saltChars)
    const guardCount = Math.ceil(this.alphabet.length / guardDiv)

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

  public encode(numbers: string): string
  public encode(numbers: NumberLike[]): string
  public encode(...numbers: NumberLike[]): string
  public encode(numbers: string[]): string
  public encode(...numbers: string[]): string
  public encode<T extends string | NumberLike>(
    first: T[] | T,
    ...numbers: T[]
  ): string {
    const ret = ''

    if (Array.isArray(first)) {
      numbers = first
    } else {
      // eslint-disable-next-line eqeqeq
      numbers = [...(first != null ? [first] : []), ...numbers]
    }

    if (!numbers.length) {
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

  public decode(id: string): NumberLike[] {
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
  public encodeHex(hex: string | bigint): string {
    switch (typeof hex) {
      case 'bigint':
        hex = hex.toString(16)
        break
      case 'string':
        if (!/^[0-9a-fA-F]+$/.test(hex)) return ''
        break
      default:
        throw new Error(
          `Hashids: The provided value is neither a string, nor a BigInt (got: ${typeof hex})`,
        )
    }

    const numbers = splitAtIntervalAndMap(hex, 12, (part) =>
      parseInt(`1${part}`, 16),
    )
    return this.encode(numbers)
  }

  public decodeHex(id: string): string {
    return this.decode(id)
      .map((number) => number.toString(16).slice(1))
      .join('')
  }

  private _encode(numbers: NumberLike[]): string[] {
    let alphabet = this.alphabet

    const numbersIdInt = numbers.reduce<number>(
      (last, number, i) =>
        last +
        (typeof number === 'bigint'
          ? Number(number % BigInt(i + 100))
          : number % (i + 100)),
      0,
    )

    let ret: string[] = [alphabet[numbersIdInt % alphabet.length]]
    const lottery = ret.slice()

    const seps = this.seps
    const guards = this.guards

    numbers.forEach((number, i) => {
      const buffer = lottery.concat(this.salt, alphabet)

      alphabet = shuffle(alphabet, buffer)
      const last = toAlphabet(number, alphabet)

      ret.push(...last)

      if (i + 1 < numbers.length) {
        const charCode = last[0].codePointAt(0)! + i
        const extraNumber =
          typeof number === 'bigint'
            ? Number(number % BigInt(charCode))
            : number % charCode
        ret.push(seps[extraNumber % seps.length])
      }
    })

    if (ret.length < this.minLength) {
      const prefixGuardIndex =
        (numbersIdInt + ret[0].codePointAt(0)!) % guards.length
      ret.unshift(guards[prefixGuardIndex])

      if (ret.length < this.minLength) {
        const suffixGuardIndex =
          (numbersIdInt + ret[2].codePointAt(0)!) % guards.length
        ret.push(guards[suffixGuardIndex])
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

  public isValidId(id: string): boolean {
    return this.allowedCharsRegExp.test(id)
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

    const idBreakdown = idGuardsArray[splitIndex]
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

const minAlphabetLength = 16
const sepDiv = 3.5
const guardDiv = 12

export const keepUnique = <T>(content: Iterable<T>): T[] =>
  Array.from(new Set(content))

export const withoutChars = (
  chars: string[],
  withoutChars: string[],
): string[] => chars.filter((char) => !withoutChars.includes(char))

export const onlyChars = (chars: string[], keepChars: string[]): string[] =>
  chars.filter((char) => keepChars.includes(char))

const isIntegerNumber = (n: NumberLike | string) =>
  typeof n === 'bigint' ||
  (!Number.isNaN(Number(n)) && Math.floor(Number(n)) === n)

const isPositiveAndFinite = (n: NumberLike) =>
  typeof n === 'bigint' || (n >= 0 && Number.isSafeInteger(n))

function shuffle(alphabetChars: string[], saltChars: string[]): string[] {
  if (saltChars.length === 0) {
    return alphabetChars
  }

  let integer: number
  const transformed = alphabetChars.slice()

  for (let i = transformed.length - 1, v = 0, p = 0; i > 0; i--, v++) {
    v %= saltChars.length
    p += integer = saltChars[v].codePointAt(0)!
    const j = (integer + v + p) % i

    // swap characters at positions i and j
    const a = transformed[i]
    const b = transformed[j]
    transformed[j] = a
    transformed[i] = b
  }

  return transformed
}

const toAlphabet = (input: NumberLike, alphabetChars: string[]): string[] => {
  const id: string[] = []

  if (typeof input === 'bigint') {
    const alphabetLength = BigInt(alphabetChars.length)
    do {
      id.unshift(alphabetChars[Number(input % alphabetLength)])
      input = input / alphabetLength
    } while (input > BigInt(0))
  } else {
    do {
      id.unshift(alphabetChars[input % alphabetChars.length])
      input = Math.floor(input / alphabetChars.length)
    } while (input > 0)
  }

  return id
}

const fromAlphabet = (
  inputChars: string[],
  alphabetChars: string[],
): NumberLike =>
  inputChars.reduce((carry, item) => {
    const index = alphabetChars.indexOf(item)
    if (index === -1) {
      throw new Error(
        `The provided ID (${inputChars.join(
          '',
        )}) is invalid, as it contains characters that do not exist in the alphabet (${alphabetChars.join(
          '',
        )})`,
      )
    }
    if (typeof carry === 'bigint') {
      return carry * BigInt(alphabetChars.length) + BigInt(index)
    }
    const value = carry * alphabetChars.length + index
    const isSafeValue = Number.isSafeInteger(value)
    if (isSafeValue) {
      return value
    } else {
      if (typeof BigInt === 'function') {
        return BigInt(carry) * BigInt(alphabetChars.length) + BigInt(index)
      } else {
        // we do not have support for BigInt:
        throw new Error(
          `Unable to decode the provided string, due to lack of support for BigInt numbers in the current environment`,
        )
      }
    }
  }, 0 as NumberLike)

const safeToParseNumberRegExp = /^\+?[0-9]+$/
const safeParseInt10 = (str: string) =>
  safeToParseNumberRegExp.test(str) ? parseInt(str, 10) : NaN

const splitAtIntervalAndMap = <T>(
  str: string,
  nth: number,
  map: (n: string) => T,
): T[] =>
  Array.from<never, T>({length: Math.ceil(str.length / nth)}, (_, index) =>
    map(str.slice(index * nth, (index + 1) * nth)),
  )

const makeAnyOfCharsRegExp = (chars: string[]) =>
  new RegExp(
    chars
      .map((char) => escapeRegExp(char))
      // we need to sort these from longest to shortest,
      // as they may contain multibyte unicode characters (these should come first)
      .sort((a, b) => b.length - a.length)
      .join('|'),
  )

const makeAtLeastSomeCharRegExp = (chars: string[]) =>
  new RegExp(
    `^[${chars
      .map((char) => escapeRegExp(char))
      // we need to sort these from longest to shortest,
      // as they may contain multibyte unicode characters (these should come first)
      .sort((a, b) => b.length - a.length)
      .join('')}]+$`,
  )

const escapeRegExp = (text: string) =>
  text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
