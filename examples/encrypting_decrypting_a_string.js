
/* creating class object */
var hashids = new Hashids("this is my salt");

/* encrypting a string */
var hash = hashids.encryptFromString("this is my string");

/* decrypting that hash */
var myString = hashids.decryptToString(hash);

console.log(hash, myString);
