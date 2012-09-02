
/* test for collisions with 3 integers */

var startAt = 0,
	endAt = 15;

/* this script will create hashes and check against each other to make sure there are no collisions */

var hashes = new hashids("this is my salt");

var hashObj = {},
	total = 0,
	hash = "";

for (var i = startAt; i <= endAt; i++) {
	for (var j = startAt; j <= endAt; j++) {
		for (var k = startAt; k <= endAt; k++, total++) {
			
			hash = hashes.encrypt(i, j, k);
			console.log(hash+" - "+i+", "+j+", "+k);
			
			if (hash in hashObj) {
				console.log("Collision for "+hash+": "+i+", "+j+", "+k+" and "+hashObj[hash]);
				hashObj = {};
				break;
			} else {
				hashObj[hash] = i+", "+j+", "+k;
			}
			
		}
	}
}

console.log("Ran through "+total+" hashes.");
