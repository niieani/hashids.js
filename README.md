
![hashids](http://www.hashids.org.s3.amazonaws.com/public/img/hashids.png "Hashids")

======

Full Documentation
-------

A small JavaScript class to generate YouTube-like ids from one or many numbers. Use hashids when you do not want to expose your database ids to the user. Read full documentation at: [http://hashids.org/javascript](http://hashids.org/javascript)

Node.js
-------

If you are looking for a backend **Node.js version**, there's a separate repo: [https://github.com/ivanakimov/hashids.node.js](https://github.com/ivanakimov/hashids.node.js)

Installation
-------

1. Bower it up: [http://bower.io/](http://bower.io/)
2. Install:
	
	`bower install hashids`
	
Or just:

	<script type="text/javascript" src="lib/hashids.min.js"></script>


Usage
-------

#### Encoding one number

You can pass a unique salt value so your hashids differ from everyone else's. I use "this is my salt" as an example.

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var id = hashids.encode(12345);
```

`id` is now going to be:
	
	NkK9

#### Decoding

Notice during decoding, same salt value is used:

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var numbers = hashids.decode("NkK9");
```

`numbers` is now going to be:
	
	[ 12345 ]

#### Decoding with different salt

Decoding will not work if salt is changed:

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my pepper");

var numbers = hashids.decode("NkK9");
```

`numbers` is now going to be:
	
	[]
	
#### Encoding several numbers

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var id = hashids.encode(683, 94108, 123, 5);
```

`id` is now going to be:
	
	aBMswoO2UB3Sj
	
You can also pass an array:

```javascript

var arr = [683, 94108, 123, 5];
var id = hashids.encode(arr);
```

#### Decoding is done the same way

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var numbers = hashids.decode("aBMswoO2UB3Sj");
```

`numbers` is now going to be:
	
	[ 683, 94108, 123, 5 ]
	
#### Encoding and specifying minimum id length

Here we encode integer 1, and set the **minimum** id length to **8** (by default it's **0** -- meaning hashes will be the shortest possible length).

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt", 8);

var id = hashids.encode(1);
```

`id` is now going to be:
	
	gB0NV05e
	
#### Decoding

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt", 8);

var numbers = hashids.decode("gB0NV05e");
```

`numbers` is now going to be:
	
	[ 1 ]
	
#### Specifying custom id alphabet

Here we set the alphabet to consist of valid hex characters: "0123456789abcdef"

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt", 0, "0123456789abcdef");

var id = hashids.encode(1234567);
```

`id` is now going to be:
	
	b332db5
	
Randomness
-------

The primary purpose of hashids is to obfuscate ids. It's not meant or tested to be used for security purposes or compression.
Having said that, this algorithm does try to make these hashes unguessable and unpredictable:

#### Repeating numbers

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var id = hashids.encode(5, 5, 5, 5);
```

You don't see any repeating patterns that might show there's 4 identical numbers in the hash:

	1Wc8cwcE

Same with incremented numbers:

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var id = hashids.encode(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
```

`id` will be :
	
	kRHnurhptKcjIDTWC3sx
	
#### Incrementing number ids:

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var id1 = hashids.encode(1), /* NV */
	id2 = hashids.encode(2), /* 6m */
	id3 = hashids.encode(3), /* yD */
	id4 = hashids.encode(4), /* 2l */
	id5 = hashids.encode(5); /* rD */
```

Curses! #$%@
-------

This code was written with the intent of placing created hashes in visible places - like the URL. Which makes it unfortunate if generated hashes accidentally formed a bad word.

Therefore, the algorithm tries to avoid generating most common English curse words. This is done by never placing the following letters next to each other:
	
	c, C, s, S, f, F, h, H, u, U, i, I, t, T
	
Changelog
-------

**1.0.0**

- Several public functions are renamed to be more appropriate:
	- Function `encrypt()` changed to `encode()`
	- Function `decrypt()` changed to `decode()`
	- Function `encryptHex()` changed to `encodeHex()`
	- Function `decryptHex()` changed to `decodeHex()`
	
	Hashids was designed to encode integers, primary ids at most. We've had several requests to encrypt sensitive data with Hashids and this is the wrong algorithm for that. So to encourage more appropriate use, `encrypt/decrypt` is being "downgraded" to `encode/decode`.

- Version tag added: `1.0`
- `README.md` updated

**0.3.0 - Current Stable**

**PRODUCED HASHES IN THIS VERSION ARE DIFFERENT THAN IN 0.1.4, DO NOT UPDATE IF YOU NEED THEM TO KEEP WORKING:**

- Same algorithm as [PHP](https://github.com/ivanakimov/hashids.php) and [Node.js](https://github.com/ivanakimov/hashids.php) versions now
- Overall approximately **4x** faster
- Consistent shuffle function uses slightly modified version of [Fisher–Yates algorithm](http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm)
- Generate large hash strings faster (where _minHashLength_ is more than 1000 chars)
- When using _minHashLength_, hash character disorder has been improved
- Basic English curse words will now be avoided even with custom alphabet
- _encrypt_ function now also accepts array of integers as input
- Passing JSLint now
- Support for [Bower](http://bower.io/) package manager

**0.1.4**

- Global var leak for hashSplit (thanks to [@BryanDonovan](https://github.com/BryanDonovan))
- Class capitalization (thanks to [@BryanDonovan](https://github.com/BryanDonovan))

**0.1.3**

	Warning: If you are using 0.1.2 or below, updating to this version will change your hashes.

- Updated default alphabet (thanks to [@speps](https://github.com/speps))
- Constructor removes duplicate characters for default alphabet as well (thanks to [@speps](https://github.com/speps))

**0.1.2**

	Warning: If you are using 0.1.1 or below, updating to this version will change your hashes.

- Minimum hash length can now be specified
- Added more randomness to hashes
- Added unit tests
- Added example files
- Changed warnings that can be thrown
- Renamed `encode/decode` to `encrypt/decrypt`
- Consistent shuffle does not depend on md5 anymore
- Speed improvements

**0.1.1**

- Speed improvements
- Bug fixes

**0.1.0**
	
- First commit

Contact
-------

Follow me [@IvanAkimov](http://twitter.com/ivanakimov)

Or [http://ivanakimov.com](http://ivanakimov.com)

License
-------

MIT License. See the `LICENSE` file. You can use Hashids in open source projects and commercial products. Don't break the Internet. Kthxbye.