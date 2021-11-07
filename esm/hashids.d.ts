import type { NumberLike } from './util';
export default class Hashids {
    private minLength;
    private alphabet;
    private seps;
    private guards;
    private salt;
    private guardsRegExp;
    private sepsRegExp;
    private allowedCharsRegExp;
    constructor(salt?: string, minLength?: number, alphabet?: string, seps?: string);
    encode(numbers: NumberLike[] | string[] | string): string;
    encode(...numbers: NumberLike[]): string;
    encode(...numbers: string[]): string;
    decode(id: string): NumberLike[];
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
    encodeHex(inputHex: bigint | string): string;
    decodeHex(id: string): string;
    isValidId(id: string): boolean;
    private _encode;
    private _decode;
}
