
/* creating class object */
var hashids = new Hashids("this is my salt");

/* encoding several numbers into one hash */
var id = hashids.encode(1337, 5, 77, 12345678);

/* decoding that id */
var numbers = hashids.decode(id);

/* numbers is always an array */
console.log(id, numbers);
