
/* creating class object */
var hashids = new Hashids("this is my salt");

/* encrypting one string */
var hash = hashids.encryptFromString("my string");

/* hash is always a string */
console.log(hash);
