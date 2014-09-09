
/* creating class object with minimum id length of 8 */
var hashids = new Hashids("this is my salt", 8);

/* encoding several numbers into one id (length of hashid is going to be at least 8) */
var id = hashids.encode(1337, 5);

/* decoding the same id */
var numbers = hashids.decode(id);

/* numbers is always an array */
console.log(id, numbers);
