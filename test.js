"use strict";
const arbitrary = require('./lib/index').default;

// Create a Generator with a seed
let generate = new arbitrary.Generator();

console.log( generate.next.number(0, 10000) );
console.log( generate.next.number(-10, 10) );
console.log( generate.next.percent() );
console.log( generate.next.bits(1) );
console.log( generate.next.bits(32) );

// Now generate the reverse stream of the above numbers
console.log( generate.prev.bits(1) );
console.log( generate.prev.percent() );
console.log( generate.prev.number(-10, 10) );
console.log( generate.prev.number(0, 10000) );
