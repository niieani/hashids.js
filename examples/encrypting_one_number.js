
/* creating class object */
var hashids = new Hashids("this is my salt");

/* encrypting one number */
var hash = hashids.encrypt(1337);

/* hash is always a string */
console.log(hash);
