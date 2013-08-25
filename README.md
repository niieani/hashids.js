
![hashids](http://www.hashids.org.s3.amazonaws.com/public/img/hashids.png "Hashids")

======

Full Documentation
-------

A small JavaScript class to generate YouTube-like hashes from one or many numbers. Use hashids when you do not want to expose your database ids to the user. Read full documentation at: [http://www.hashids.org/javascript/](http://www.hashids.org/javascript/)

If you are looking for a **Node.js version**, there's a separate repo: [https://github.com/ivanakimov/hashids.node.js](https://github.com/ivanakimov/hashids.node.js)

Installation
-------

1. Bower it up: [http://bower.io/](http://bower.io/)
2. Install:
	
	`bower install hashids`
	
Or just:

	<script type="text/javascript" src="lib/hashids.min.js"></script>


Usage
-------

#### Encrypting one number

You can pass a unique salt value so your hashes differ from everyone else's. I use "this is my salt" as an example.

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var hash = hashids.encrypt(12345);
```

`hash` is now going to be:
	
	NkK9

#### Decrypting

Notice during decryption, same salt value is used:

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var numbers = hashids.decrypt("NkK9");
```

`numbers` is now going to be:
	
	[ 12345 ]

#### Decrypting with different salt

Decryption will not work if salt is changed:

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my pepper");

var numbers = hashids.decrypt("NkK9");
```

`numbers` is now going to be:
	
	[]
	
#### Encrypting several numbers

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var hash = hashids.encrypt(683, 94108, 123, 5);
```

`hash` is now going to be:
	
	aBMswoO2UB3Sj
	
You can also pass an array:

```javascript

var arr = [683, 94108, 123, 5];
var hash = hashids.encrypt(arr);
```

#### Decrypting is done the same way

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var numbers = hashids.decrypt("aBMswoO2UB3Sj");
```

`numbers` is now going to be:
	
	[ 683, 94108, 123, 5 ]
	
#### Encrypting and specifying minimum hash length

Here we encrypt integer 1, and set the **minimum** hash length to **8** (by default it's **0** -- meaning hashes will be the shortest possible length).

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt", 8);

var hash = hashids.encrypt(1);
```

`hash` is now going to be:
	
	gB0NV05e
	
#### Decrypting

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt", 8);

var numbers = hashids.decrypt("gB0NV05e");
```

`numbers` is now going to be:
	
	[ 1 ]
	
#### Specifying custom hash alphabet

Here we set the alphabet to consist of valid hex characters: "0123456789abcdef"

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt", 0, "0123456789abcdef");

var hash = hashids.encrypt(1234567);
```

`hash` is now going to be:
	
	b332db5
	
Randomness
-------

The primary purpose of hashids is to obfuscate ids. It's not meant or tested to be used for security purposes or compression.
Having said that, this algorithm does try to make these hashes unguessable and unpredictable:

#### Repeating numbers

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var hash = hashids.encrypt(5, 5, 5, 5);
```

You don't see any repeating patterns that might show there's 4 identical numbers in the hash:

	1Wc8cwcE

Same with incremented numbers:

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var hash = hashids.encrypt(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
```

`hash` will be :
	
	kRHnurhptKcjIDTWC3sx
	
#### Incrementing number hashes:

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var hash1 = hashids.encrypt(1), /* NV */
	hash2 = hashids.encrypt(2), /* 6m */
	hash3 = hashids.encrypt(3), /* yD */
	hash4 = hashids.encrypt(4), /* 2l */
	hash5 = hashids.encrypt(5); /* rD */
```

Curses! #$%@
-------

This code was written with the intent of placing created hashes in visible places - like the URL. Which makes it unfortunate if generated hashes accidentally formed a bad word.

Therefore, the algorithm tries to avoid generating most common English curse words. This is done by never placing the following letters next to each other:
	
	c, C, s, S, f, F, h, H, u, U, i, I, t, T
	
Changelog
-------

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