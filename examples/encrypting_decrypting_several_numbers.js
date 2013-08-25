
/* creating class object */
var hashids = new Hashids("this is my salt");

/* encrypting several numbers into one hash */
var hash = hashids.encrypt(1337, 5, 77, 12345678);

/* decrypting that hash */
var numbers = hashids.decrypt(hash);

/* numbers is always an array */
console.log(hash, numbers);
