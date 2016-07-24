// Linear Congruential Generator
// Variant of a Lehman Generator
var lcg = (function() {
  // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
      // m is basically chosen to be large (as it is the max period)
      // and for its relationships to a and c
  var m = 4294967296,
      // a - 1 should be divisible by m's prime factors
      a = 1664525,
      // c and m should be co-prime
      c = 1013904223,
      seed, z;
  return {
    setSeed : function(val) {
      z = seed = val || Math.round(Math.random() * m);
    },
    getSeed : function() {
      return seed;
    },
    rand : function() {
      // define the recurrence relationship
      z = (a * z + c) % m;
      // return a float in [0, 1)
      // if z = m then z / m = 0 therefore (z % m) / m < 1 always
      return z / m;
    }
  };
}());

// Complementary Multiply-With-Carry of lag 1
// similar to Chrome's implementation (structured more traditionally)
var mwc = (function() {
  // Set two seed values.
  var carry, x,
      // Value of modulus and multiplier are chosen together
      // 2^32 is chosen because it's similar to the others
      // but we don't use bitwise operations to take advantage of this
      max = Math.pow(2, 32),
      a = 3636507990;
  return {
    setSeed : function(arr) {
      var seed = arr || [0,1].map(function() {
        return Math.round(Math.random() * max);
      });
      carry = seed[0];
      x = seed[1];
    },
    getSeed : function() {
      return [carry, x];
    },
    rand : function() {
      // Two multiplications
      // create carry with division, x with mod
      // The first part is the "carry" where we're
      // using both parts of the residue
      carry = ((a * x) + carry) / max;
      // subtracting from the max is what makes it the compliment
      x = (max - 1) - ((a * x) + carry) % max;
      return x / max;
    }
  };
}());

// 16 bit Linear feedback shift register
var lfsr = (function(){
  var max = Math.pow(2, 16),
      period = 0,
      seed, out;
  return {
    setSeed : function(val) {
      out = seed = val || Math.round(Math.random() * max);
    },
    getSeed : function() {
      return seed;
    },
    getPeriod : function() {
      return period;
    },
    rand : function() {
      var bit;
      // From http://en.wikipedia.org/wiki/Linear_feedback_shift_register
      bit  = ((out >> 0) ^ (out >> 2) ^ (out >> 3) ^ (out >> 5) ) & 1;
      out =  (out >> 1) | (bit << 15);
      period++;
      return out / max;
    }
  };
}());

//Webkit2's crazy invertible mapping generator
var invwk = (function() {
  var max = Math.pow(2, 32),
      seed;
  return {
    setSeed : function(val) {
      seed = val || Math.round(Math.random() * max);
    },
    getSeed : function() {
      return seed;
    },
    rand : function() {
      // creates randomness...somehow...
      seed += (seed * seed) | 5;
      // Shift off bits, discarding the sign. Discarding the sign is
      // important because OR w/ 5 can give us + or - numbers.
      return (seed >>> 32) / max;
    }
  };
}());

// von Neumann's middle square
// This is a terrible generator, never use it
var middlesq = (function() {
  var seed = 4563;
  return {
    setSeed : function(val) {
      seed = val || Math.round(Math.random() * 99980001);
    },
    rand : function () {
      // Square the seed, pad to 8 digits
      var middle = (seed * seed).toString();
      while(middle.length < 8) {
        middle = "0" + middle;
      }
      // Select the middle 4 digits as the new
      // seed
      seed = parseInt(middle.slice(2, 6), 10);
      // return a number on [0, 1)
      return seed / 10000;
    }
  };
}());
