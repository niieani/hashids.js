
/* creating class object */
var hashids = new Hashids("this is my salt");

/* encrypting several numbers into one hash */
var hash = hashids.encrypt(45, 434, 1313, 99);

/* hash is always a string */
console.log(hash);
