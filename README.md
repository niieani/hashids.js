[![hashids](http://hashids.org/public/img/hashids.gif 'Hashids')](http://hashids.org/)

[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![NPM version][npm-version-image]][npm-url]
[![License][license-image]][license-url]
[![Chat][chat-image]][chat-url]

**Hashids** is small JavaScript library to generate YouTube-like ids from numbers. Use it when you don't want to expose your database ids to the user: [http://hashids.org/javascript](http://hashids.org/javascript)

[![Play with it using CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/hashids-demo-54qvc?fontsize=14&hidenavigation=1&module=%2Fsrc%2Findex.ts&theme=dark)

## Getting started

Install Hashids via:

```shell
yarn add hashids
```

(or just directly use the code at `dist/hashids.js`)

#### Use in **ESM-compatible** environments (webpack, modern browsers)

```javascript
import Hashids from 'hashids'
const hashids = new Hashids()

console.log(hashids.encode(1))
```

#### Use in **CommonJS** environments (most often **Node.js**)

```javascript
const Hashids = require('hashids/cjs')
const hashids = new Hashids()

console.log(hashids.encode(1))
```

Note: When using Node that supports [conditional exports](https://nodejs.org/api/esm.html#esm_conditional_exports), `require('hashids')` (version >=13) will also work.

#### Use as global in the browser (wherever **ES6** is supported; 5KB)

```javascript
<script type="text/javascript" src="hashids.min.js"></script>
<script type="text/javascript">

    var hashids = new Hashids();
    console.log(hashids.encode(1));

</script>
```

#### Use in **TypeScript**:

`import` or `require`, based on the environment (see above). If you want to use the CommonJS module syntax (`require`), you'll need to install the Node.js types from the `DefinitelyTyped` repository.

```
npm install @types/node
```

If you want to use the ESM syntax (`import Hashids from 'hashids'`), you will need to include the following options in your `tsconfig.json`.

```json
{
  "allowSyntheticDefaultImports": true,
  "esModuleInterop": true
}
```

The above is not required if you import the CommonJS version directly: `import Hashids from 'hashids/cjs'`.

If you get errors stating: `Cannot find name 'BigInt'`, add [`"esnext.bigint"`](https://github.com/microsoft/TypeScript/blob/master/src/lib/esnext.bigint.d.ts) or [`"esnext"`](https://github.com/microsoft/TypeScript/blob/master/src/lib/esnext.d.ts) to your `tsconfig.json` file, under `"lib"`:

```json
{
  "compilerOptions": {
    ...
    "lib": [
      "esnext.bigint",
      ...
    ]
  }
}
```

Note that your environment doesn't actually have to support `BigInt` for hashids to function.

## Quick example

```javascript
const hashids = new Hashids()

const id = hashids.encode(1, 2, 3) // o2fXhV
const numbers = hashids.decode(id) // [1, 2, 3]
```

## More options

**A few more ways to pass to `encode()`:**

```javascript
const hashids = new Hashids()

console.log(hashids.encode(1, 2, 3)) // o2fXhV
console.log(hashids.encode([1, 2, 3])) // o2fXhV
// strings containing integers are coerced to numbers:
console.log(hashids.encode('1', '2', '3')) // o2fXhV
console.log(hashids.encode(['1', '2', '3'])) // o2fXhV
// BigInt support:
console.log(hashids.encode([1n, 2n, 3n])) // o2fXhV
// Hex notation BigInt:
console.log(hashids.encode([0x1n, 0x2n, 0x3n])) // o2fXhV
```

**Make your ids unique:**

Pass a "salt" to make your ids unique (e.g. a project name):

```javascript
var hashids = new Hashids('My Project')
console.log(hashids.encode(1, 2, 3)) // Z4UrtW

var hashids = new Hashids('My Other Project')
console.log(hashids.encode(1, 2, 3)) // gPUasb
```

**Use padding to make your ids longer:**

Note that ids are only padded to fit **at least** a certain length. It doesn't mean that your ids will be _exactly_ that length.

```javascript
const hashids = new Hashids() // no padding
console.log(hashids.encode(1)) // jR

const hashids = new Hashids('', 10) // pad to length 10
console.log(hashids.encode(1)) // VolejRejNm
```

**Pass a custom alphabet:**

```javascript
const hashids = new Hashids('', 0, 'abcdefghijklmnopqrstuvwxyz') // all lowercase
console.log(hashids.encode(1, 2, 3)) // mdfphx
```

Default alphabet is `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`.

Since v2.0 you can even use emojis as the alphabet.

**Encode hex instead of numbers:**

Useful if you want to encode numbers like [Mongo](https://www.mongodb.com/)'s ObjectIds.

Note that there is _no_ limit on how large of a hex number you can pass.

```javascript
var hashids = new Hashids()

var id = hashids.encodeHex('507f1f77bcf86cd799439011') // y42LW46J9luq3Xq9XMly
var hex = hashids.decodeHex(id) // 507f1f77bcf86cd799439011
```

Please note that this is not the equivalent of:

```javascript
const hashids = new Hashids()

const id = Hashids.encode(BigInt('0x507f1f77bcf86cd799439011')) // y8qpJL3ZgzJ8lWk4GEV
const hex = Hashids.decode(id)[0].toString(16) // 507f1f77bcf86cd799439011
```

The difference between the two is that the built-in `encodeHex` will
always result in the same length, even if it contained leading zeros.

For example `hashids.encodeHex('00000000')` would encode to `qExOgK7` and decode back to `'00000000'` (length information is preserved).

## Pitfalls

1. When decoding, output is always an array of numbers (even if you encode only one number):

   ```javascript
   const hashids = new Hashids()

   const id = hashids.encode(1)
   console.log(hashids.decode(id)) // [1]
   ```

2. Encoding negative numbers is not supported.
3. If you pass bogus input to `encode()`, an empty string will be returned:

   ```javascript
   const hashids = new Hashids()

   const id = hashids.encode('123a')
   console.log(id === '') // true
   ```

4. Do not use this library as a security tool and do not encode sensitive data. This is **not** an encryption library.

## Randomness

The primary purpose of Hashids is to obfuscate ids. It's not meant or tested to be used as a security or compression tool. Having said that, this algorithm does try to make these ids random and unpredictable:

No repeating patterns showing there are 3 identical numbers in the id:

```javascript
const hashids = new Hashids()
console.log(hashids.encode(5, 5, 5)) // A6t1tQ
```

Same with incremented numbers:

```javascript
const hashids = new Hashids()

console.log(hashids.encode(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)) // wpfLh9iwsqt0uyCEFjHM

console.log(hashids.encode(1)) // jR
console.log(hashids.encode(2)) // k5
console.log(hashids.encode(3)) // l5
console.log(hashids.encode(4)) // mO
console.log(hashids.encode(5)) // nR
```

## Curses! #\$%@

This code was written with the intent of placing created ids in visible places, like the URL. Therefore, by default the algorithm tries to avoid generating most common English curse words by generating ids that never have the following letters next to each other:

    c, f, h, i, s, t, u

You may customize the chars that shouldn't be placed next to each other by providing a 4th argument to the Hashids constructor:

```js
// first 4 arguments will fallback to defaults (empty salt, no minimum length, default alphabet)
const hashids = new Hashids(undefined, undefined, undefined, 'zyxZYX')
```

## BigInt

If your environment supports `BigInt`, you can use the standard API
to encode and decode them the same way as ordinary numbers.

Trying to decode a `BigInt`-encoded hashid on an unsupported environment will throw an error.

## License

MIT License. See the [LICENSE](LICENSE) file.
You can use Hashids in open source projects and commercial products.
Don't break the Internet. Kthxbye.

[travis-url]: https://travis-ci.org/niieani/hashids.js
[travis-image]: https://travis-ci.org/niieani/hashids.js.svg
[coveralls-url]: https://coveralls.io/github/niieani/hashids.js
[coveralls-image]: https://coveralls.io/repos/github/niieani/hashids.js/badge.svg
[npm-downloads-image]: https://img.shields.io/npm/dm/hashids.svg?style=flat-square
[npm-version-image]: https://img.shields.io/npm/v/hashids.svg
[npm-url]: https://www.npmjs.com/package/hashids
[license-url]: https://github.com/niieani/hashids.js/blob/master/LICENSE
[license-image]: https://img.shields.io/packagist/l/hashids/hashids.svg?style=flat
[chat-url]: https://gitter.im/hashids/hashids?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[chat-image]: https://badges.gitter.im/Join%20Chat.svg
