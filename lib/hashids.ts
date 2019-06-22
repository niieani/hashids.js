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
      throw new Error(`Provided 'minLength' has to be a number (is ${typeof minLength})`)
    }
    if (typeof salt !== 'string') {
      throw new Error(`Provided 'salt' has to be a string (is ${typeof salt})`)
    }
    if (typeof alphabet !== 'string') {
      throw new Error(`Provided alphabet has to be a string (is ${typeof alphabet})`)
    }

    /** `alphabet` should not contains `seps` */
    const filteredAlpabet = withoutChars(alphabet, seps)
    this.alphabet = keepUniqueChars(filteredAlpabet)

    if (this.alphabet.length < minAlphabetLength) {
      throw new Error(`error: alphabet must contain at least ${minAlphabetLength} unique characters`)
    }

    if (this.alphabet.indexOf(' ') !== -1) {
      throw new Error('error: alphabet cannot contain spaces')
    }

    /** `seps` should contain only characters present in `alphabet` */
    const filteredSeps = withoutChars(seps, this.alphabet)
    this.seps = shuffle(filteredSeps, salt)

    let sepsLength
    let diff

    if (!this.seps.length || (this.alphabet.length / this.seps.length) > sepDiv) {
      sepsLength = Math.ceil(this.alphabet.length / sepDiv)

      if (sepsLength > this.seps.length) {
        diff = sepsLength - this.seps.length
        this.seps += unicodeSubstr(this.alphabet, 0, diff)
        this.alphabet = unicodeSubstr(this.alphabet, diff)
      }
    }

    this.alphabet = shuffle(this.alphabet, salt)
    const guardCount = Math.ceil(this.alphabet.length / guardDiv)

    if (this.alphabet.length < 3) {
      this.guards = unicodeSubstr(seps, 0, guardCount)
      this.seps = unicodeSubstr(seps, guardCount)
    } else {
      this.guards = unicodeSubstr(alphabet, 0, guardCount)
      this.alphabet = unicodeSubstr(alphabet, guardCount)
    }
  }

  encode(...numbers) {
    const ret = ''

    if (!numbers.length) {
      return ret
    }

    if (numbers[0] && numbers[0].constructor === Array) {
      numbers = numbers[0]
      if (!numbers.length) {
        return ret
      }
    }

    for (let i = 0; i !== numbers.length; i++) {
      numbers[i] = _parseInt(numbers[i], 10)
      if (numbers[i] >= 0) {
        continue
      } else {
        return ret
      }
    }

    return this._encode(numbers)
  }

  decode(id: string) {
    const ret = []

    if (!id || !id.length || typeof id !== 'string') {
      return ret
    }

    return this._decode(id, this.alphabet)
  }

  encodeHex(hex) {
    hex = hex.toString()
    if (!/^[0-9a-fA-F]+$/.test(hex)) {
      return ''
    }

    const numbers = hex.match(/[\w\W]{1,12}/g)

    for (let i = 0; i !== numbers.length; i++) {
      numbers[i] = parseInt('1' + numbers[i], 16)
    }

    return this.encode.apply(this, numbers)
  }

  decodeHex(id) {
    let ret = []

    const numbers = this.decode(id)

    for (let i = 0; i !== numbers.length; i++) {
      ret += numbers[i].toString(16).substr(1)
    }

    return ret
  }

  _encode(numbers) {
    let ret,
      alphabet = this.alphabet,
      numbersIdInt = 0

    for (let i = 0; i !== numbers.length; i++) {
      numbersIdInt += numbers[i] % (i + 100)
    }

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

    const halfLength = parseInt(alphabet.length / 2, 10)
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

  _decode(id, alphabet) {
    let ret = [],
      i = 0,
      r = new RegExp(`[${escapeRegExp(this.guards)}]`, 'g'),
      idBreakdown = id.replace(r, ' '),
      idArray = idBreakdown.split(' ')

    if (idArray.length === 3 || idArray.length === 2) {
      i = 1
    }

    idBreakdown = idArray[i]
    if (typeof idBreakdown[0] !== 'undefined') {
      const lottery = idBreakdown[0]
      idBreakdown = idBreakdown.substr(1)

      r = new RegExp(`[${escapeRegExp(this.seps)}]`, 'g')
      idBreakdown = idBreakdown.replace(r, ' ')
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

export const keepUniqueChars = (str: string) => Array.from(new Set(str)).join('')

export const withoutChars = ([...str]: string, [...without]: string) =>
  str.filter((char) => !without.includes(char)).join('')

export const unicodeSubstr = ([...str]: string, from: number, to?: number) => str.slice(from, to).join('')

function shuffle(alphabet: string, salt: string) {
  let integer

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

const escapeRegExp = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
const _parseInt = (v: string, radix: number) =>
  /^(-|\+)?([0-9]+|Infinity)$/.test(v) ? parseInt(v, radix) : NaN

const toAlphabet = (input: number, alphabet: string) => {
  let id = ''

  do {
    id = alphabet.charAt(input % alphabet.length) + id
    input = parseInt(input / alphabet.length, 10)
  } while (input)

  return id
}

const fromAlphabet = (input: string, alphabet: string) =>
  [...input]
    .map((item) => alphabet.indexOf(item))
    .reduce((carry, item) => carry * alphabet.length + item, 0)
