/*
 * Test that it works as an node module
 */

var arbitrary = require('../arbitrary.js');

console.log(arbitrary.float());

console.log(arbitrary.integer());

console.log(arbitrary.shuffle([1, 2, 3, 4]));

console.log(arbitrary.choice([1, 2, 3, 4]));

console.log(arbitrary.sample([1, 2, 3, 4], 2));