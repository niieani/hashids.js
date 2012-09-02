
/* test for speed */

var numberOfIntsToEncryptAtOnce = 3,
	startAt = 0,
	endAt = 100;

/* this script will encrypt AND decrypt (when it decrypts it checks that hash is legit) */

var hashes = new hashids();

function microtime() {
	return new Date().getTime() / 1000;
}

var total = 0,
	timeStart = microtime()
	timeStop = 0;

var numbers, hash;
for (var i = startAt; i <= endAt; i++, total++) {
	
	numbers = [];
	for (var j = 0; j < numberOfIntsToEncryptAtOnce; j++)
		numbers[j] = i;
	
	hash = hashes.encrypt.apply(hashes, numbers);
	numbers = hashes.decrypt(hash);
	
	console.log(hash+" - "+numbers);
	
}

timeStop = microtime();
console.log("Total hashes created: "+total);
console.log("Total time: "+(timeStop - timeStart));
