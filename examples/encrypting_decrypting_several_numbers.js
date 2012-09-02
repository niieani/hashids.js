
/* creating class object */
var hashes = new hashids("this is my salt");

/* encrypting several numbers into one hash */
var hash = hashes.encrypt(1337, 5, 77, 12345678);

/* decrypting that hash */
var numbers = hashes.decrypt(hash);

/* numbers is always an array */
console.log(hash, numbers);
