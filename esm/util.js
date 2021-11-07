export const keepUnique = (content) => [
    ...new Set(content),
];
export const withoutChars = (chars, charsToExclude) => chars.filter((char) => !charsToExclude.includes(char));
export const onlyChars = (chars, keepChars) => chars.filter((char) => keepChars.includes(char));
export const isIntegerNumber = (n) => typeof n === 'bigint' ||
    (!Number.isNaN(Number(n)) && Math.floor(Number(n)) === n);
export const isPositiveAndFinite = (n) => typeof n === 'bigint' || (n >= 0 && Number.isSafeInteger(n));
export function shuffle(alphabetChars, saltChars) {
    if (saltChars.length === 0) {
        return alphabetChars;
    }
    let integer;
    const transformed = [...alphabetChars];
    for (let i = transformed.length - 1, v = 0, p = 0; i > 0; i--, v++) {
        v %= saltChars.length;
        // eslint-disable-next-line no-multi-assign
        p += integer = saltChars[v].codePointAt(0);
        const j = (integer + v + p) % i;
        // swap characters at positions i and j
        const a = transformed[i];
        const b = transformed[j];
        transformed[j] = a;
        transformed[i] = b;
    }
    return transformed;
}
export const toAlphabet = (input, alphabetChars) => {
    const id = [];
    let value = input;
    if (typeof value === 'bigint') {
        const alphabetLength = BigInt(alphabetChars.length);
        do {
            id.unshift(alphabetChars[Number(value % alphabetLength)]);
            value /= alphabetLength;
        } while (value > BigInt(0));
    }
    else {
        do {
            id.unshift(alphabetChars[value % alphabetChars.length]);
            value = Math.floor(value / alphabetChars.length);
        } while (value > 0);
    }
    return id;
};
export const fromAlphabet = (inputChars, alphabetChars) => inputChars.reduce((carry, item) => {
    const index = alphabetChars.indexOf(item);
    if (index === -1) {
        throw new Error(`The provided ID (${inputChars.join('')}) is invalid, as it contains characters that do not exist in the alphabet (${alphabetChars.join('')})`);
    }
    if (typeof carry === 'bigint') {
        return carry * BigInt(alphabetChars.length) + BigInt(index);
    }
    const value = carry * alphabetChars.length + index;
    const isSafeValue = Number.isSafeInteger(value);
    if (isSafeValue) {
        return value;
    }
    if (typeof BigInt === 'function') {
        return BigInt(carry) * BigInt(alphabetChars.length) + BigInt(index);
    }
    // we do not have support for BigInt:
    throw new Error(`Unable to decode the provided string, due to lack of support for BigInt numbers in the current environment`);
}, 0);
const safeToParseNumberRegExp = /^\+?\d+$/;
export const safeParseInt10 = (str) => safeToParseNumberRegExp.test(str) ? Number.parseInt(str, 10) : Number.NaN;
export const splitAtIntervalAndMap = (str, nth, map) => Array.from({ length: Math.ceil(str.length / nth) }, (_, index) => map(str.slice(index * nth, (index + 1) * nth)));
export const makeAnyOfCharsRegExp = (chars) => new RegExp(chars
    .map((char) => escapeRegExp(char))
    // we need to sort these from longest to shortest,
    // as they may contain multibyte unicode characters (these should come first)
    .sort((a, b) => b.length - a.length)
    .join('|'));
export const makeAtLeastSomeCharRegExp = (chars) => new RegExp(`^[${chars
    .map((char) => escapeRegExp(char))
    // we need to sort these from longest to shortest,
    // as they may contain multibyte unicode characters (these should come first)
    .sort((a, b) => b.length - a.length)
    .join('')}]+$`);
const escapeRegExp = (text) => text.replace(/[\s#$()*+,.?[\\\]^{|}-]/g, '\\$&');
//# sourceMappingURL=util.js.map