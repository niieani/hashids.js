
[![hashids](http://hashids.org/public/img/hashids.gif "Hashids")](http://hashids.org/)

[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![NPM version][npm-version-image]][npm-url]
[![License][license-image]][license-url]
[![Chat][chat-image]][chat-url]

**Hashids** is small JavaScript library to generate YouTube-like ids from numbers. Use it when you don't want to expose your database ids to the user: [http://hashids.org/javascript](http://hashids.org/javascript)

Getting started
-------

Install Hashids via:

- [node.js](https://nodejs.org): `npm install --save hashids`
- [bower](http://bower.io/): `bower install hashids`
- [jam](http://jamjs.org/): `jam install hashids`

(or just use the code at `dist/hashids.js`)

Use in the browser (wherever ES5 is supported; 5KB):

```javascript
<script type="text/javascript" src="hashids.min.js"></script>
<script type="text/javascript">

    var hashids = new Hashids();
    console.log(hashids.encode(1));

</script>
```

Use in Node.js:

```javascript
var Hashids = require('hashids');
var hashids = new Hashids();

console.log(hashids.encode(1));
```

Quick example
-------

```javascript
var hashids = new Hashids();

var id = hashids.encode(1, 2, 3); // o2fXhV
var numbers = hashids.decode(id); // [1, 2, 3]
```

More options
-------

**A few more ways to pass to `encode()`:**

```javascript
var hashids = new Hashids();

console.log(hashids.encode(1, 2, 3)); // o2fXhV
console.log(hashids.encode([1, 2, 3])); // o2fXhV
console.log(hashids.encode('1', '2', '3')); // o2fXhV
console.log(hashids.encode(['1', '2', '3'])); // o2fXhV
```

**Make your ids unique:**

Pass a project name to make your ids unique:

```javascript
var hashids = new Hashids('My Project');
console.log(hashids.encode(1, 2, 3)); // Z4UrtW

var hashids = new Hashids('My Other Project');
console.log(hashids.encode(1, 2, 3)); // gPUasb
```

**Use padding to make your ids longer:**

Note that ids are only padded to fit **at least** a certain length. It doesn't mean that your ids will be *exactly* that length.

```javascript
var hashids = new Hashids(); // no padding
console.log(hashids.encode(1)); // jR

var hashids = new Hashids('', 10); // pad to length 10
console.log(hashids.encode(1)); // VolejRejNm
```

**Pass a custom alphabet:**

```javascript
var hashids = new Hashids('', 0, 'abcdefghijklmnopqrstuvwxyz'); // all lowercase
console.log(hashids.encode(1, 2, 3)); // mdfphx
```

Default alphabet is `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`.

**Encode hex instead of numbers:**

Useful if you want to encode [Mongo](https://www.mongodb.com/)'s ObjectIds. Note that *there is no limit* on how large of a hex number you can pass (it does not have to be Mongo's ObjectId).

```javascript
var hashids = new Hashids();

var id = hashids.encodeHex('507f1f77bcf86cd799439011'); // y42LW46J9luq3Xq9XMly
var hex = hashids.decodeHex(id); // 507f1f77bcf86cd799439011
```

Pitfalls
-------

1. When decoding, output is always an array of numbers (even if you encode only one number):

	```javascript
	var hashids = new Hashids();

	var id = hashids.encode(1);
	console.log(hashids.decode(id)); // [1]
	```

2. Encoding negative numbers is not supported.
3. If you pass bogus input to `encode()`, an empty string will be returned:

	```javascript
	var hashids = new Hashids();

	var id = hashids.encode('123a');
	console.log(id === ''); // true
	```

4. Do not use this library as a security tool and do not encode sensitive data. This is **not** an encryption library.

Randomness
-------

The primary purpose of Hashids is to obfuscate ids. It's not meant or tested to be used as a security or compression tool. Having said that, this algorithm does try to make these ids random and unpredictable:

No repeating patterns showing there are 3 identical numbers in the id:

```javascript
var hashids = new Hashids();
console.log(hashids.encode(5, 5, 5)); // A6t1tQ
```

Same with incremented numbers:

```javascript
var hashids = new Hashids();

console.log(hashids.encode(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)); // wpfLh9iwsqt0uyCEFjHM

console.log(hashids.encode(1)); // jR
console.log(hashids.encode(2)); // k5
console.log(hashids.encode(3)); // l5
console.log(hashids.encode(4)); // mO
console.log(hashids.encode(5)); // nR
```

Curses! #$%@
-------

This code was written with the intent of placing created ids in visible places, like the URL. Therefore, the algorithm tries to avoid generating most common English curse words by generating ids that never have the following letters next to each other:

	c, f, h, i, s, t, u

License
-------

MIT License. See the [LICENSE](LICENSE) file. You can use Hashids in open source projects and commercial products. Don't break the Internet. Kthxbye.

[travis-url]: https://travis-ci.org/ivanakimov/hashids.js
[travis-image]: https://travis-ci.org/ivanakimov/hashids.js.svg

[coveralls-url]: https://coveralls.io/github/ivanakimov/hashids.js
[coveralls-image]: https://coveralls.io/repos/github/ivanakimov/hashids.js/badge.svg

[npm-downloads-image]: https://img.shields.io/npm/dm/hashids.svg?style=flat-square
[npm-version-image]: https://img.shields.io/npm/v/hashids.svg
[npm-url]: https://www.npmjs.com/package/hashids

[license-url]: https://github.com/ivanakimov/hashids.js/blob/master/LICENSE
[license-image]: https://img.shields.io/packagist/l/hashids/hashids.svg?style=flat

[chat-url]: https://gitter.im/hashids/hashids?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[chat-image]: https://badges.gitter.im/Join%20Chat.svg
