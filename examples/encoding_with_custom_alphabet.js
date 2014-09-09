
/* creating class object with custom alphabet */
var hashids = new Hashids("this is my salt", 0, "abcdefgh123456789");

/* encoding several numbers into one id */
var id = hashids.encode(1, 2, 3, 4);

/* decoding the same id */
var numbers = hashids.decode(id);

/* numbers is always an array */
console.log(id, numbers);
