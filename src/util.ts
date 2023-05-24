export type NumberLike = bigint | number

export const keepUnique = <T>(content: Iterable<T>): T[] => [
  ...new Set(content),
]

export const withoutChars = (
  chars: string[],
  charsToExclude: string[],
): string[] => chars.filter((char) => !charsToExclude.includes(char))

export const onlyChars = (chars: string[], keepChars: string[]): string[] =>
  chars.filter((char) => keepChars.includes(char))

export const isIntegerNumber = (n: NumberLike | string) =>
  typeof n === 'bigint' ||
  (!Number.isNaN(Number(n)) && Math.floor(Number(n)) === n)

export const isPositiveAndFinite = (n: NumberLike) =>
  typeof n === 'bigint' || (n >= 0 && Number.isSafeInteger(n))

export function shuffle(
  alphabetChars: string[],
  saltChars: string[],
): string[] {
  if (saltChars.length === 0) {
    return alphabetChars
  }

  let integer: number
  const transformed = [...alphabetChars]

  for (let i = transformed.length - 1, v = 0, p = 0; i > 0; i--, v++) {
    v %= saltChars.length
    // eslint-disable-next-line no-multi-assign
    p += integer = saltChars[v]!.codePointAt(0)!
    const j = (integer + v + p) % i

    // swap characters at positions i and j
    const a = transformed[i]!
    const b = transformed[j]!
    transformed[j] = a
    transformed[i] = b
  }

  return transformed
}

export const toAlphabet = (
  input: NumberLike,
  alphabetChars: string[],
): string[] => {
  const id: string[] = []
  let value = input

  if (typeof value === 'bigint') {
    const alphabetLength = BigInt(alphabetChars.length)
    do {
      id.unshift(alphabetChars[Number(value % alphabetLength)]!)
      value /= alphabetLength
    } while (value > BigInt(0))
  } else {
    do {
      id.unshift(alphabetChars[value % alphabetChars.length]!)
      value = Math.floor(value / alphabetChars.length)
    } while (value > 0)
  }

  return id
}

export const fromAlphabet = (
  inputChars: string[],
  alphabetChars: string[],
): NumberLike =>
  inputChars.reduce<NumberLike>((carry, item) => {
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
    }

    throwIfBigIntNotAvailable(
      `Unable to decode the provided string, due to lack of support for BigInt numbers in the current environment`,
    )

    return BigInt(carry) * BigInt(alphabetChars.length) + BigInt(index)
  }, 0)

const safeToParseNumberRegExp = /^\+?\d+$/

export const safeParseInt10 = (str: string) => {
  if (!safeToParseNumberRegExp.test(str)) {
    return Number.NaN
  }

  const int10 = Number.parseInt(str, 10)

  if (Number.isSafeInteger(int10)) {
    return int10
  }

  throwIfBigIntNotAvailable(
    'Unable to encode the provided BigInt string without loss of information due to lack of support for BigInt type in the current environment',
  )

  return BigInt(str)
}

export const splitAtIntervalAndMap = <T>(
  str: string,
  nth: number,
  map: (n: string) => T,
): T[] =>
  Array.from<never, T>({ length: Math.ceil(str.length / nth) }, (_, index) =>
    map(str.slice(index * nth, (index + 1) * nth)),
  )

export const makeAnyOfCharsRegExp = (chars: string[]) =>
  new RegExp(
    chars
      .map((char) => escapeRegExp(char))
      // we need to sort these from longest to shortest,
      // as they may contain multibyte unicode characters (these should come first)
      .sort((a, b) => b.length - a.length)
      .join('|'),
  )

export const makeAtLeastSomeCharRegExp = (chars: string[]) =>
  new RegExp(
    `^[${chars
      .map((char) => escapeRegExp(char))
      // we need to sort these from longest to shortest,
      // as they may contain multibyte unicode characters (these should come first)
      .sort((a, b) => b.length - a.length)
      .join('')}]+$`,
  )

const escapeRegExp = (text: string) =>
  text.replace(/[\s#$()*+,.?[\\\]^{|}-]/g, '\\$&')

const throwIfBigIntNotAvailable = (
  errorMessage: string = 'BigInt is not available in this environment',
) => {
  if (typeof BigInt !== 'function') {
    throw new TypeError(errorMessage)
  }
}
