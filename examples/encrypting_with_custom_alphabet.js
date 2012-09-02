
/* creating class object with custom alphabet */
var hashes = new hashids("this is my salt", 0, "abcdefgh123456789");

/* encrypting several numbers into one hash */
var hash = hashes.encrypt(1, 2, 3, 4);

/* decrypting the same hash */
var numbers = hashes.decrypt(hash);

/* numbers is always an array */
console.log(hash, numbers);
