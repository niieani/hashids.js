export default class Hashids {
  private alphabet: string
  private seps: string
  private guards: string

  constructor(
    private salt = '',
    private minLength = 0,
    alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    seps = 'cfhistuCFHISTU',
  ) {
    if (typeof minLength !== 'number') {
      throw new Error(
        `Provided 'minLength' has to be a number (is ${typeof minLength})`,
      )
    }
    if (typeof salt !== 'string') {
      throw new Error(`Provided 'salt' has to be a string (is ${typeof salt})`)
    }
    if (typeof alphabet !== 'string') {
      throw new Error(
        `Provided alphabet has to be a string (is ${typeof alphabet})`,
      )
    }

    if (alphabet.indexOf(' ') !== -1) {
      throw new Error('error: alphabet cannot contain spaces')
    }

    const uniqueAlphabet = keepUniqueChars(alphabet)

    if (uniqueAlphabet.length < minAlphabetLength) {
      throw new Error(
        `error: alphabet must contain at least ${minAlphabetLength} unique characters, provided: ${uniqueAlphabet}`,
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

  encode(numbers: string): string
  // eslint-disable-next-line no-dupe-class-members
  encode(numbers: Array<number>): string
  // eslint-disable-next-line no-dupe-class-members
  encode(...numbers: Array<number>): string
  // eslint-disable-next-line no-dupe-class-members
  encode(numbers: Array<string>): string
  // eslint-disable-next-line no-dupe-class-members
  encode(...numbers: Array<string>): string
  // eslint-disable-next-line no-dupe-class-members
  encode<T extends string | number>(
    first: Array<T> | T,
    ...numbers: Array<T>
  ): string {
    const ret = ''

    if (Array.isArray(first)) {
      // @ts-ignore
      numbers = first
    } else {
      // eslint-disable-next-line eqeqeq
      numbers = [...(first != null ? [first] : []), ...numbers]
    }

    if (!numbers.length) {
      return ret
    }

    if (!numbers.every(isIntegerNumber)) {
      // @ts-ignore
      numbers = numbers.map((n) => safeParseInt10(String(n), 10))
    }

    // @ts-ignore
    if (!numbers.every(isPositiveAndFinite)) {
      return ret
    }

    return this._encode(numbers as Array<number>)
  }

  decode(id: string) {
    const ret: Array<number> = []

    if (!id || !id.length || typeof id !== 'string') {
      return ret
    }

    return this._decode(id, this.alphabet)
  }

  encodeHex(hex: string): string {
    hex = hex.toString()
    if (!/^[0-9a-fA-F]+$/.test(hex)) {
      return ''
    }

    const numbers = hex.match(/[\w\W]{1,12}/g)
    if (!numbers) return ''

    const decNumbers = Array.from(numbers, (value) => parseInt(`1${value}`, 16))
    return this.encode(decNumbers)
  }

  decodeHex(id: string) {
    const numbers = this.decode(id)
    return numbers.map((number) => number.toString(16).substr(1)).join('')
  }

  _encode(numbers: Array<number>): string {
    let ret: string
    let alphabet = this.alphabet
    let numbersIdInt = 0

    for (let i = 0; i !== numbers.length; i++) {
      numbersIdInt += numbers[i] % (i + 100)
    }

    ret = alphabet.charAt(numbersIdInt % alphabet.length)
    const lottery = ret

    for (let i = 0; i !== numbers.length; i++) {
      let number = numbers[i]
      const buffer = lottery + this.salt + alphabet

      alphabet = shuffle(alphabet, unicodeSubstr(buffer, 0))
      const last = toAlphabet(number, alphabet)

      ret += last

      if (i + 1 < numbers.length) {
        number %= last.charCodeAt(0) + i
        const sepsIndex = number % this.seps.length
        ret += this.seps.charAt(sepsIndex)
      }
    }

    if (ret.length < this.minLength) {
      let guardIndex =
        (numbersIdInt + ret[0].charCodeAt(0)) % this.guards.length
      let guard = this.guards[guardIndex]

      ret = guard + ret

      if (ret.length < this.minLength) {
        guardIndex = (numbersIdInt + ret[2].charCodeAt(0)) % this.guards.length
        guard = this.guards[guardIndex]

        ret += guard
      }
    }

    const halfLength = Math.floor(alphabet.length / 2)
    while (ret.length < this.minLength) {
      alphabet = shuffle(alphabet, alphabet)
      ret = alphabet.substr(halfLength) + ret + alphabet.substr(0, halfLength)

      const excess = ret.length - this.minLength
      if (excess > 0) {
        ret = ret.substr(excess / 2, this.minLength)
      }
    }

    return ret
  }

  _decode(id: string, alphabet: string): Array<number> {
    let ret: Array<number> = []
    let i = 0

    let idBreakdown = replaceGuardsWithSpaces(id, this.guards)
    let idArray = idBreakdown.split(' ')

    if (idArray.length === 3 || idArray.length === 2) {
      i = 1
    }

    idBreakdown = idArray[i]
    if (typeof idBreakdown[0] !== 'undefined') {
      const lottery = idBreakdown[0]
      idBreakdown = replaceGuardsWithSpaces(idBreakdown.substr(1), this.seps)
      idArray = idBreakdown.split(' ')

      for (let j = 0; j !== idArray.length; j++) {
        const subId = idArray[j]
        const buffer = lottery + this.salt + alphabet

        alphabet = shuffle(alphabet, buffer.substr(0, alphabet.length))
        ret.push(fromAlphabet(subId, alphabet))
      }

      if (this.encode(ret) !== id) {
        ret = []
      }
    }

    return ret
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
  str.slice(from, to).join('')

const isIntegerNumber = (n: number | string) =>
  !Number.isNaN(Number(n)) && Math.floor(Number(n)) === n
const isPositiveAndFinite = (n: number) => n >= 0 && Number.isFinite(n)

function shuffle(alphabet: string, salt: string) {
  let integer: number

  if (!salt.length) {
    return alphabet
  }

  const alphabetChars = [...alphabet]

  for (let i = alphabetChars.length - 1, v = 0, p = 0, j = 0; i > 0; i--, v++) {
    v %= salt.length
    p += integer = salt.charCodeAt(v)
    j = (integer + v + p) % i

    const tmp = alphabetChars[j]
    alphabetChars[j] = alphabetChars[i]
    alphabetChars[i] = tmp
  }

  return alphabetChars.join('')
}

const toAlphabet = (input: number, alphabet: string) => {
  let id = ''

  do {
    id = alphabet.charAt(input % alphabet.length) + id
    input = Math.floor(input / alphabet.length)
  } while (input)

  return id
}

const fromAlphabet = (input: string, alphabet: string) =>
  [...input]
    .map((item) => alphabet.indexOf(item))
    .reduce((carry, item) => carry * alphabet.length + item, 0)

const replaceGuardsWithSpaces = ([...chars]: string, guards: string) =>
  chars.map((char) => (guards.includes(char) ? ' ' : char)).join('')

const safeNumberRegExp = /^(-|\+)?([0-9]+|Infinity)$/
const safeParseInt10 = (str: string) =>
  safeNumberRegExp.test(str) ? parseInt(str, 10) : NaN
