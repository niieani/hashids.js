
# CHANGELOG

**1.1.1**:

- Enforce stricter integer parsing on encode function ([PR #24](https://github.com/ivanakimov/hashids.js/pull/24))
- Moved source from `hashids.js` to `lib/hashids.js`
- Minor `README.md` cleanup

**1.1.0**:

- ES6 source; ES5 dist
- UMD support ([Node.js repo](https://github.com/ivanakimov/hashids.node.js) is merging into this one)
- Added Eslint (npm run lint)
- Added Mocha (npm run test)
- Added Coveralls (npm run coverage)
- Added build script (npm run build)
- Moved CHANGELOG out of `README.md`
- `README.md` completely updated
- `examples/` folder removed; all examples are now in the README
- [Bug fix](https://github.com/ivanakimov/hashids.node.js/issues/26): escaping regex
- Improvement: relaxed parameter checks to `encode()`. All of these are allowed:

	```javascript
	var hashids = new Hashids();

	hashids.encode(1, 2, 3); // o2fXhV
	hashids.encode([1, 2, 3]); // o2fXhV
	hashids.encode('1', '2', '3'); // o2fXhV
	hashids.encode(['1', '2', '3']); // o2fXhV
	```

**1.0.2**:

- Support for older browsers (using `charAt`) by [@tauanz](https://github.com/tauanz): <https://github.com/ivanakimov/hashids.js/pull/15>

**1.0.1**:

- *require.js* support by [@nleclerc](https://github.com/nleclerc): <https://github.com/ivanakimov/hashids.js/pull/12>

**1.0.0**:

- Several public functions are renamed to be more appropriate:
	- Function `encrypt()` changed to `encode()`
	- Function `decrypt()` changed to `decode()`
	- Function `encryptHex()` changed to `encodeHex()`
	- Function `decryptHex()` changed to `decodeHex()`

	Hashids was designed to encode integers, primary ids at most. We've had several requests to encrypt sensitive data with Hashids and this is the wrong algorithm for that. So to encourage more appropriate use, `encrypt/decrypt` is being "downgraded" to `encode/decode`.

- Version tag added: `1.0`
- `README.md` updated

**0.3.0**:

**PRODUCED HASHES IN THIS VERSION ARE DIFFERENT THAN IN 0.1.4, DO NOT UPDATE IF YOU NEED THEM TO KEEP WORKING:**

- Same algorithm as [PHP](https://github.com/ivanakimov/hashids.php) and [Node.js](https://github.com/ivanakimov/hashids.node.js) versions now
- Overall approximately **4x** faster
- Consistent shuffle function uses slightly modified version of [Fisher–Yates algorithm](http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm)
- Generate large hash strings faster (where _minHashLength_ is more than 1000 chars)
- When using _minHashLength_, hash character disorder has been improved
- Basic English curse words will now be avoided even with custom alphabet
- _encrypt_ function now also accepts array of integers as input
- Passing JSLint now
- Support for [Bower](http://bower.io/) package manager

**0.1.4**:

- Global var leak for hashSplit (thanks to [@BryanDonovan](https://github.com/BryanDonovan))
- Class capitalization (thanks to [@BryanDonovan](https://github.com/BryanDonovan))

**0.1.3**:

	Warning: If you are using 0.1.2 or below, updating to this version will change your hashes.

- Updated default alphabet (thanks to [@speps](https://github.com/speps))
- Constructor removes duplicate characters for default alphabet as well (thanks to [@speps](https://github.com/speps))

**0.1.2**:

	Warning: If you are using 0.1.1 or below, updating to this version will change your hashes.

- Minimum hash length can now be specified
- Added more randomness to hashes
- Added unit tests
- Added example files
- Changed warnings that can be thrown
- Renamed `encode/decode` to `encrypt/decrypt`
- Consistent shuffle does not depend on md5 anymore
- Speed improvements

**0.1.1**:

- Speed improvements
- Bug fixes

**0.1.0**:

- First commit
