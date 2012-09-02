
/* creating class object */
var hashes = new hashids("this is my salt");

/* encrypting several numbers into one hash */
var hash = hashes.encrypt(45, 434, 1313, 99);

/* hash is always a string */
console.log(hash);
