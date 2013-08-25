
/* creating class object with custom alphabet */
var hashids = new Hashids("this is my salt", 0, "abcdefgh123456789");

/* encrypting several numbers into one hash */
var hash = hashids.encrypt(1, 2, 3, 4);

/* decrypting the same hash */
var numbers = hashids.decrypt(hash);

/* numbers is always an array */
console.log(hash, numbers);
