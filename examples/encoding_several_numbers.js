
/* creating class object */
var hashids = new Hashids("this is my salt");

/* encoding several numbers into one hash */
var id = hashids.encode(45, 434, 1313, 99);

/* id is always a string */
console.log(id);
