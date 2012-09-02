
/* creating class object */
var hashes = new hashids("this is my salt");

/* encrypting one number */
var hash = hashes.encrypt(1337);

/* hash is always a string */
console.log(hash);
