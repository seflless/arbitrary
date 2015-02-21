(function(){
'use strict';

  // Constants
  var MIN_LOOP = 8,
      PRE_LOOP = 8,
      TINYMT32_SH0 = 1,
      TINYMT32_SH1 = 10,
      TINYMT32_SH8 = 8,
      TINYMT32_MASK = 0x7fffffff,
      TINYMT32_MUL = 1.0 / 4294967296;

function Generator(seed) {
  // If a seed was not provided use the current time as the seed
  seed = seed ? seed: (new Date()).getTime();

  // Remember the seed
  // TODO: We should remove this soon enough.
  this.seed = seed ? seed: (new Date()).getTime();

  // TODO: Understand these parameters more. We're hard coding them for now.
  // Need to read through the tinymt academic paper.
  this.mat1 = 0x8f7011ee;
  this.mat2 = 0xfc78ff1f;
  this.tmat = 0x3793fdff;

  this.status = [
    seed,
    this.mat1,
    this.mat2,
    this.tmat
  ];
  
  var i;
  for(i = 1; i < MIN_LOOP; i++) {
    this.status[i & 3] ^= i + 1812433253
      * (this.status[(i - 1) & 3]
         ^ (this.status[(i - 1) & 3] >> 30));
    }
  
  period_certification.apply(this);

  for(i = 0; i < PRE_LOOP; i++) {
    tinymt32_next_state.apply(this);
  }
}

Generator.prototype = {

  float: function(){
        // max defaults to 1.0 if not provided
    var max = arguments.length>=1 ? arguments[0] : 1.0,
        // min defaults to 0.0 if not provided
        min = arguments.length>=2 ? arguments[1] : 0.0,
        value = tinymt32_generate_float.apply(this);
    return value * (max-min) + min;
  },

  integer: function(){
        // max defaults to 9007199254740992 if not provided
        // This number was based on this Stackoverflow answer:
        // http://stackoverflow.com/questions/307179/what-is-javascripts-highest-integer-value-that-a-number-can-go-to-without-losin#answer-11639621
    var max = arguments.length>=1 ? arguments[0] : 9007199254740992,
        // min defaults to 0 if not provided
        min = arguments.length>=2 ? arguments[1] : 0,
        value = tinymt32_generate_float.apply(this);
    return Math.floor(value * (max-min) + min);
  }
};

/*-----------------------------------
 * Internal implementation functions
 *-----------------------------------*/

/**
 * This function certificate the period of 2^127-1.
 * @param random tinymt state vector.
 */
function period_certification(){
  if( (this.status[0] & TINYMT32_MASK) == 0 &&
      this.status[1] == 0 &&
      this.status[2] == 0 &&
      this.status[3] == 0) {
    this.status[0] = 'T'.charCodeAt(0);
    this.status[1] = 'I'.charCodeAt(0);
    this.status[2] = 'N'.charCodeAt(0);
    this.status[3] = 'Y'.charCodeAt(0);
  }
}

/**
 * This function changes internal state of tinymt32.
 * Users should not call this function directly.
 * @param random tinymt internal status
 */
function tinymt32_next_state() {
    var x,y;

    y = this.status[3];
    x = (this.status[0] & TINYMT32_MASK)
        ^ this.status[1]
        ^ this.status[2];
    x ^= (x << TINYMT32_SH0);
    y ^= (y >> TINYMT32_SH0) ^ x;

    this.status[0] = this.status[1];
    this.status[1] = this.status[2];
    this.status[2] = x ^ (y << TINYMT32_SH1);
    this.status[3] = y;
    // Need to figure out how to properly translate the original code
    // this.status[1] ^= -((int32_t)(y & 1)) & this.mat1;
    // this.status[2] ^= -((int32_t)(y & 1)) & this.mat2;
    this.status[1] ^= -(y & 1) & this.mat1;
    this.status[2] ^= -(y & 1) & this.mat2;
}

/**
 * This function outputs 32-bit unsigned integer from internal state.
 * Users should not call this function directly.
 * @param random tinymt internal status
 * @return 32-bit unsigned pseudorandom number
 */
function tinymt32_temper() {
    var t0, t1;
    t0 = this.status[3];
    t1 = this.status[0]
         + (this.status[2] >> TINYMT32_SH8);

    t0 ^= t1;
    // Proper translation:
    // t0 ^= -((int32_t)(t1 & 1)) & this.tmat;
    t0 ^= -(t1 & 1) & this.tmat;
    return t0;
}

/**
 * This function outputs floating point number from internal state.
 * This function is implemented using multiplying by 1 / 2^32.
 * floating point multiplication is faster than using union trick in
 * my Intel CPU.
 * @param random tinymt internal status
 * @return floating point number r (0.0 <= r < 1.0)
 */
function tinymt32_generate_float() {
    tinymt32_next_state.apply(this);
    // The 0.5 is a hack I added temporarily to make the range [0.0, 1.0] instad
    // of [-0.5,0.5]. Still trying to figure out the subtlies of the original
    // c implementation behavior that used multiple uint32/int32 casts and bit
    // tricks.
    return tinymt32_temper.apply(this) * TINYMT32_MUL + 0.5;
}

// Create a global generator that people can use by default.
window.arbitrary = new Generator();

// Make the Generator constructor available for those wanting
// to manage their own instances.
window.arbitrary.Generator = Generator;

})();