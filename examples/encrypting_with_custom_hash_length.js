
/* creating class object with hash length of 8 */
var hashes = new hashids("this is my salt", 8);

/* encrypting several numbers into one hash (length of hash is going to be at least 8) */
var hash = hashes.encrypt(1337, 5);

/* decrypting the same hash */
var numbers = hashes.decrypt(hash);

/* numbers is always an array */
console.log(hash, numbers);
