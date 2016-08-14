/**
 * 
 */
var arbitrary = require('./lib/').default;
console.log(arbitrary);

var startTime = Date.now();
var start = 0;
var samples = 16777216;
var generate = new arbitrary.Generator();
function next(){
	for(var i = 0; i<samples; i++){
		//generate.next;
	}
	start += samples;
	if( start >= Math.pow(2,32) ) {
		console.log('Took ' + (Date.now() - startTime) + 'ms')
		return;
	}
	process.stdout.write('.');
	setImmediate(next);
}

next();
