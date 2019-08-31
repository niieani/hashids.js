type NumberLike = number | bigint

export default class Hashids {
  private alphabet: string
  private seps: string
  private guards: string

  public constructor(
    private salt = '',
    private minLength = 0,
    alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    seps = 'cfhistuCFHISTU',
  ) {
    if (typeof minLength !== 'number') {
      throw new Error(
        `Hashids: Provided 'minLength' has to be a number (is ${typeof minLength})`,
      )
    }
    if (typeof salt !== 'string') {
      throw new Error(
        `Hashids: Provided 'salt' has to be a string (is ${typeof salt})`,
      )
    }
    if (typeof alphabet !== 'string') {
      throw new Error(
        `Hashids: Provided alphabet has to be a string (is ${typeof alphabet})`,
      )
    }

    const uniqueAlphabet = keepUniqueChars(alphabet)

    if (uniqueAlphabet.length < minAlphabetLength) {
      throw new Error(
        `Hashids: alphabet must contain at least ${minAlphabetLength} unique characters, provided: ${uniqueAlphabet}`,
      )
    }

    /** `alphabet` should not contains `seps` */
    this.alphabet = withoutChars(uniqueAlphabet, seps)
    /** `seps` should contain only characters present in `alphabet` */
    const filteredSeps = onlyChars(seps, uniqueAlphabet)
    this.seps = shuffle(filteredSeps, salt)

    let sepsLength
    let diff

    if (
      [...this.seps].length === 0 ||
      [...this.alphabet].length / [...this.seps].length > sepDiv
    ) {
      sepsLength = Math.ceil([...this.alphabet].length / sepDiv)

      if (sepsLength > [...this.seps].length) {
        diff = sepsLength - [...this.seps].length
        this.seps += unicodeSubstr(this.alphabet, 0, diff)
        this.alphabet = unicodeSubstr(this.alphabet, diff)
      }
    }

    this.alphabet = shuffle(this.alphabet, salt)
    const guardCount = Math.ceil([...this.alphabet].length / guardDiv)

    if ([...this.alphabet].length < 3) {
      this.guards = unicodeSubstr(this.seps, 0, guardCount)
      this.seps = unicodeSubstr(this.seps, guardCount)
    } else {
      this.guards = unicodeSubstr(this.alphabet, 0, guardCount)
      this.alphabet = unicodeSubstr(this.alphabet, guardCount)
    }
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

    return this._encode(numbers as number[])
  }

  public decode(id: string): NumberLike[] {
    if (!id || typeof id !== 'string' || id.length === 0) return []
    return this._decode(id, this.alphabet)
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

  public decodeHex(id: string) {
    return this.decode(id)
      .map((number) => number.toString(16).slice(1))
      .join('')
  }

  private _encode(numbers: NumberLike[]): string {
    let ret: string
    let alphabet = this.alphabet

    const numbersIdInt = numbers.reduce<number>(
      (last, number, i) =>
        last +
        (typeof number === 'bigint'
          ? Number(number % BigInt(i + 100))
          : number % (i + 100)),
      0,
    )

    ret = [...alphabet][numbersIdInt % [...alphabet].length]
    const lottery = ret

    const seps = [...this.seps]
    const guards = [...this.guards]

    numbers.forEach((number, i) => {
      const buffer = lottery + this.salt + alphabet

      alphabet = shuffle(alphabet, unicodeSubstr(buffer, 0))
      const last = toAlphabet(number, alphabet)

      ret += last

      if (i + 1 < numbers.length) {
        const charCode = last.codePointAt(0)! + i
        const extraNumber =
          typeof number === 'bigint'
            ? Number(number % BigInt(charCode))
            : number % charCode
        ret += seps[extraNumber % seps.length]
      }
    })

    if ([...ret].length < this.minLength) {
      const prefixGuardIndex =
        (numbersIdInt + [...ret][0].codePointAt(0)!) % guards.length
      ret = guards[prefixGuardIndex] + ret

      if ([...ret].length < this.minLength) {
        const suffixGuardIndex =
          (numbersIdInt + [...ret][2].codePointAt(0)!) % guards.length
        ret = ret + guards[suffixGuardIndex]
      }
    }

    const halfLength = Math.floor([...alphabet].length / 2)
    while ([...ret].length < this.minLength) {
      alphabet = shuffle(alphabet, alphabet)
      ret =
        unicodeSubstr(alphabet, halfLength) +
        ret +
        unicodeSubstr(alphabet, 0, halfLength)

      const excess = [...ret].length - this.minLength
      if (excess > 0) {
        ret = unicodeSubstr(ret, excess / 2, this.minLength)
      }
    }

    return ret
  }

  private _decode(id: string, alphabet: string): NumberLike[] {
    const idGuardsArray = splitAtMatch(id, (char) => this.guards.includes(char))
    const splitIndex =
      idGuardsArray.length === 3 || idGuardsArray.length === 2 ? 1 : 0

    const idBreakdown = idGuardsArray[splitIndex]
    const idBreakdownArray = [...idBreakdown]
    if (idBreakdownArray.length === 0) return []

    const [lotteryChar, ...chars] = idBreakdownArray
    const rest = chars.join('')
    const idArray = splitAtMatch(rest, (char) => this.seps.includes(char))

    const {result} = idArray.reduce(
      ({result, lastAlphabet}, subId) => {
        const buffer = lotteryChar + this.salt + lastAlphabet
        const nextAlphabet = shuffle(
          lastAlphabet,
          unicodeSubstr(buffer, 0, [...lastAlphabet].length),
        )
        return {
          result: [...result, fromAlphabet(subId, nextAlphabet)],
          lastAlphabet: nextAlphabet,
        }
      },
      {result: [] as NumberLike[], lastAlphabet: alphabet},
    )

    if (this._encode(result) !== id) return []
    return result
  }
}

const minAlphabetLength = 16
const sepDiv = 3.5
const guardDiv = 12

export const keepUniqueChars = (str: string) =>
  Array.from(new Set(str)).join('')

export const withoutChars = ([...str]: string, [...without]: string) =>
  str.filter((char) => !without.includes(char)).join('')

export const onlyChars = ([...str]: string, [...only]: string) =>
  str.filter((char) => only.includes(char)).join('')

export const unicodeSubstr = ([...str]: string, from: number, to?: number) =>
  str.slice(from, to === undefined ? undefined : from + to).join('')

const isIntegerNumber = (n: NumberLike | string) =>
  typeof n === 'bigint' ||
  (!Number.isNaN(Number(n)) && Math.floor(Number(n)) === n)

const isPositiveAndFinite = (n: NumberLike) =>
  typeof n === 'bigint' || (n >= 0 && Number.isSafeInteger(n))

function shuffle(alphabet: string, [...salt]: string) {
  let integer: number

  if (!salt.length) {
    return alphabet
  }

  const alphabetChars = [...alphabet]

  for (let i = alphabetChars.length - 1, v = 0, p = 0; i > 0; i--, v++) {
    v %= salt.length
    p += integer = salt[v].codePointAt(0)!
    const j = (integer + v + p) % i

      // swap characters at positions i and j
    ;[alphabetChars[j], alphabetChars[i]] = [alphabetChars[i], alphabetChars[j]]
  }

  return alphabetChars.join('')
}

const toAlphabet = (input: NumberLike, [...alphabet]: string) => {
  let id = ''

  if (typeof input === 'bigint') {
    const alphabetLength = BigInt(alphabet.length)
    do {
      id = alphabet[Number(input % alphabetLength)] + id
      input = input / alphabetLength
    } while (input)
  } else {
    do {
      id = alphabet[input % alphabet.length] + id
      input = Math.floor(input / alphabet.length)
    } while (input)
  }

  return id
}

const fromAlphabet = ([...input]: string, [...alphabet]: string) =>
  input
    .map((item) => alphabet.indexOf(item))
    .reduce(
      (carry, index) => {
        if (typeof carry === 'bigint') {
          return carry * BigInt(alphabet.length) + BigInt(index)
        }
        const value = carry * alphabet.length + index
        const isSafeValue = Number.isSafeInteger(value)
        if (isSafeValue) {
          return value
        } else {
          if (typeof BigInt === 'function') {
            return BigInt(carry) * BigInt(alphabet.length) + BigInt(index)
          } else {
            // we do not have support for BigInt:
            throw new Error(
              `Unable to decode the provided string, due to lack of support for BigInt numbers in the current environment`,
            )
          }
        }
      },
      0 as NumberLike,
    )

const splitAtMatch = ([...chars]: string, match: (char: string) => boolean) =>
  chars.reduce(
    (groups, char) =>
      match(char)
        ? [...groups, '']
        : [...groups.slice(0, -1), groups[groups.length - 1] + char],
    [''],
  )

const safeToParseNumberRegExp = /^\+?[0-9]+$/
const safeParseInt10 = (str: string) =>
  safeToParseNumberRegExp.test(str) ? parseInt(str, 10) : NaN

/** note: this doesn't need to support unicode, since it's used to split hex strings only */
const splitAtIntervalAndMap = <T>(
  str: string,
  nth: number,
  map: (n: string) => T,
): T[] =>
  Array.from<never, T>({length: Math.ceil(str.length / nth)}, (_, index) =>
    map(str.slice(index * nth, (index + 1) * nth)),
  )
