
/* creating class object */
var hashids = new Hashids("this is my salt");

/* encoding one number */
var id = hashids.encode(1337);

/* id is always a string */
console.log(id);
