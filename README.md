
# hashids

A small JavaScript class to generate YouTube-like hashes from one or many numbers. This is a client-side version: [http://www.hashids.org/javascript/](http://www.hashids.org/javascript/)

If you are looking for a Node.js library, there's a separate version for that: [http://www.hashids.org/node-js/](http://www.hashids.org/node-js/)

## What is it?

hashids (Hash ID's) creates short, unique, decryptable hashes from unsigned integers.

It was designed for websites to use in URL shortening, tracking stuff, or making pages private (or at least unguessable).

This algorithm tries to satisfy the following requirements:

1. Hashes must be unique and decryptable.
2. They should be able to contain more than one integer (so you can use them in complex or clustered systems).
3. You should be able to specify minimum hash length.
4. Hashes should not contain basic English curse words (since they are meant to appear in public places - like the URL).

Instead of showing items as `1`, `2`, or `3`, you could show them as `U6dc`, `u87U`, and `HMou`.
You don't have to store these hashes in the database, but can encrypt + decrypt on the fly.

All integers need to be greater than or equal to zero.

## Usage

#### Encrypting one number

You can pass a unique salt value so your hashes differ from everyone else's. I use "**this is my salt**" as an example.

```javascript

var hashes = new hashids("this is my salt"),
	hash = hashes.encrypt(12345);
```

`hash` is now going to be:
	
	ryKo

#### Decrypting

Notice during decryption, same salt value is used:

```javascript

var hashes = new hashids("this is my salt"),
	numbers = hashes.decrypt("ryKo");
```

`numbers` is now going to be:
	
	[ 12345 ]

#### Decrypting with different salt

Decryption will not work if salt is changed:

```javascript

var hashes = new hashids("this is my pepper"),
	numbers = hashes.decrypt("ryKo");
```

`numbers` is now going to be:
	
	[]
	
#### Encrypting several numbers

```javascript

var hashes = new hashids("this is my salt"),
	hash = hashes.encrypt(683, 94108, 123, 5);
```

`hash` is now going to be:
	
	zKphM54nuAyu5
	
#### Decrypting is done the same way

```javascript

var hashes = new hashids("this is my salt"),
	numbers = hashes.decrypt("zKphM54nuAyu5");
```

`numbers` is now going to be:
	
	[ 683, 94108, 123, 5 ]
	
#### Encrypting and specifying minimum hash length

Here we encrypt integer 1, and set the minimum hash length to **8** (by default it's **0** -- meaning hashes will be the shortest possible length).

```javascript

var hashes = new hashids("this is my salt", 8),
	hash = hashes.encrypt(1);
```

`hash` is now going to be:
	
	rjiMRirL
	
#### Decrypting

```javascript

var hashes = new hashids("this is my salt", 8),
	numbers = hashes.decrypt("rjiMRirL");
```

`numbers` is now going to be:
	
	[ 1 ]
	
#### Specifying custom hash alphabet

Here we set the alphabet to consist of only four letters: "abcd"

```javascript

var hashes = new hashids("this is my salt", 0, "abcd"),
	hash = hashes.encrypt(1, 2, 3, 4, 5);
```

`hash` is now going to be:
	
	adcdacddcdaacdad
	
## Randomness

The primary purpose of hashids is to obfuscate ids. It's not meant or tested to be used for security purposes or compression.
Having said that, this algorithm does try to make these hashes unguessable and unpredictable:

#### Repeating numbers

```javascript

var hashes = new hashids("this is my salt"),
	hash = hashes.encrypt(5, 5, 5, 5);
```

You don't see any repeating patterns that might show there's 4 identical numbers in the hash:

	GMh5SAt9

Same with incremented numbers:

```javascript

var hashes = new hashids("this is my salt"),
	hash = hashes.encrypt(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
```

`hash` will be :
	
	zEUzHySGIpuyhpF6Tasj
	
### Incrementing number hashes:

```javascript

var hashes = new hashids("this is my salt"),
	hash1 = hashes.encrypt(1), /* MR */
	hash2 = hashes.encrypt(2), /* ed */
	hash3 = hashes.encrypt(3), /* o9 */
	hash4 = hashes.encrypt(4), /* 4n */
	hash5 = hashes.encrypt(5); /* a5 */
```

## Bad hashes

I wrote this class with the intent of placing these hashes in visible places - like the URL. If I create a unique hash for each user, it would be unfortunate if the hash ended up accidentally being a bad word. Imagine auto-creating a URL with hash for your user that looks like this - `http://example.com/user/a**hole`

Therefore, this algorithm tries to avoid generating most common English curse words with the default alphabet. This is done by never placing the following letters next to each other:
	
	c, C, s, S, f, F, h, H, u, U, i, I, t, T
	
## Changelog

**0.1.3 - Current Stable**

	Warning: If you are using 0.1.2 or below, updating to this version will change your hashes.

- Updated default alphabet
- Constructor removes duplicate characters for default alphabet as well

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

## Contact

Follow me [@IvanAkimov](http://twitter.com/ivanakimov)

Or [http://ivanakimov.com](http://ivanakimov.com)

## License

MIT License. See the `LICENSE` file.