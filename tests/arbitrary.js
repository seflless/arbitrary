var assert = require('assert'),
    arbitrary = require('../arbitrary');
describe('arbitrary', function() {
  describe('#integer()', function () {
    it('should return an integer', function () {
      assert(isInt(arbitrary.integer()), "wasn't an integer");
    });
  });
});

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return n === Number(n) && n % 1 !== 0;
}
