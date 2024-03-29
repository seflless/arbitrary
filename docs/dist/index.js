(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.arbitrary = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _Long = require('./Long');

var _Long2 = _interopRequireDefault(_Long);

var _MaxU = require('./MaxU32');

var _MaxU2 = _interopRequireDefault(_MaxU);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// See https://en.wikipedia.org/wiki/Linear_congruential_generator#Period_length
// for why we picked these numbers. We copied the 'Numerical Recipes' numbers from here
// https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
// Creates a period length of [0, 2^32 - 1 ]
var c = 1013904223;
var m = 4294967296; // = Math.pow(2,32);
var a = 1664525;

// This is the inverse of 'a' above for modolo multiplicative needed for calculating
// the inverse of the standard linear congruent generator state update function.
// For a good primer/starting point, see: http://stackoverflow.com/a/16630535.
// The contribution of this library is making this approach work in Javascript
// which has bit operators, multiplication, and modolo operation semantics
// different than the 2s-complement integer math of languages like C/C++
var aInverse = -18851643;

var Generator = function () {

    // Creates a new Generator
    // takes a seed or defaults to Math.random()
    function Generator(seed) {
        _classCallCheck(this, Generator);

        seed = seed || Math.floor(Math.random() * _MaxU2.default);
        this.state = seed;
    }

    /**
     * @returns A number between the [0, 1);
     */


    _createClass(Generator, [{
        key: 'percent',
        value: function percent() {
            return this._state / _MaxU2.default;
        }

        /**
         * @min (optional) Lowest value 
         * @max (optional) Highest value
         * @returns A float between the min/max
         * 
         * Note: 
         *  - If 0 args are passed, range is [0.0, 1.0]
         *  - If 1 arg is passed, range is [0.0, max]
         *  - If 2 args are passed, range is [min, max]
         */

    }, {
        key: 'number',
        value: function number(min, max) {
            if (arguments.length === 0) {
                min = 0.0;
                max = 1.0;
            } else if (arguments.length === 1) {
                min = 0.0;
                max = min;
            } else if (arguments.length === 2) {
                // Do nothing, min and max are set
            } else {
                throw new Error("Generator.number() only takes up to 2 parameters");
            }
            return this._state / _MaxU2.default * (max - min) + min;
        }

        /**
         * /**
         * @min (optional) Lowest value 
         * @max (optional) Highest value
         * @returns An integer between the min/max
         * 
         * Note: 
         *  - If 0 args are passed, range is [0, Math.pow(2, 32)]
         *  - If 1 arg is passed, range is [0, max]
         *  - If 2 args are passed, range is [min, max]
         */

    }, {
        key: 'integer',
        value: function integer(min, max) {
            if (arguments.length === 0) {
                min = 0;
                max = _MaxU2.default;
            } else if (arguments.length === 1) {
                min = 0;
                max = min;
            } else if (arguments.length === 2) {
                // Do nothing, min and max are set
            } else {
                throw new Error("Generator.integer() only takes up to 2 parameters");
            }
            return Math.round(this._state / _MaxU2.default * (max - min)) + min;
        }

        /**
         * @returns A u32 between the min/max;
         */
        /*u32(min, max){
            if(arguments.length === 0){
                return this._state;
            }
            // TODO: Put in constraints that guarantee if it's an integer,
            // that min/max are integers, and that the result and min/max
            // are in the allowed range of values for u32s
            return Math.floor( this.number(min, max) );
        }*/

        /**
         * Generate random bits. Up to 32, this is intended for 32 bit bit
         * operation use cases
         */

    }, {
        key: 'bits',
        value: function bits(bitCount) {
            if (bitCount <= 0 || bitCount > 32) {
                throw new Error('Generator.bits()\'s bitCount parameter must be in the range [1 - 32]. Provided bitCount=' + bitCount);
            }
            // Use the higher bits as the lower bits have a low period. I haven't looked into the exact
            // math of why, but in my tests in masking off the lower bits and graphing them it tended
            // to loop very quickly.
            // TODO: Test the above concern and in general do some analysis of the quality of generated
            // numbers using different places of the number.
            return this._state >>> 32 - bitCount;
        }

        // Move the generators internal state
        // forward one step

    }, {
        key: 'next',
        get: function get() {
            this._state = lcg(this._state);
            return this;
        }

        // Move the generators internal state
        // forward one step

    }, {
        key: 'prev',
        get: function get() {
            this._state = rlcg(this._state);
            return this;
        }

        // Set the state of the generator. Must be a valid u32 integer

    }, {
        key: 'state',
        set: function set(state) {
            if (state < 0 || state >= _MaxU2.default) {
                throw new Error('Generator.state must be a number between 0 and (2^32 - 1). Provided state was ' + state + '.');
            }
            this._state = state;
        }

        // Get the current internal state
        ,
        get: function get() {
            return this._state;
        }
    }]);

    return Generator;
}();

exports.default = Generator;


function lcg(state) {
    state = (a * state + c) % m;
    return state;
}

function rlcg(state) {
    var result = _Long2.default.fromInt(aInverse).multiply(_Long2.default.fromNumber(state - 1013904223)); //
    var pow2to32 = new _Long2.default(0, 1);

    // Modulo doesn't work as we want (negatives stay negatives, we want wrapping around )
    if (result.isNegative()) {
        result = pow2to32.add(result.modulo(pow2to32));
    } else {
        result = result.modulo(pow2to32);
    }

    result = result.toNumber();
    state = result;
    return state;
}

},{"./Long":2,"./MaxU32":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Copyright 2009 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Defines a Long class for representing a 64-bit two's-complement
 * integer value, which faithfully simulates the behavior of a Java "long". This
 * implementation is derived from LongLib in GWT.
 *
 */

/**
 * Constructs a 64-bit two's-complement integer, given its low and high 32-bit
 * values as *signed* integers.  See the from* functions below for more
 * convenient ways of constructing Longs.
 *
 * The internal representation of a long is the two given signed, 32-bit values.
 * We use 32-bit pieces because these are the size of integers on which
 * Javascript performs bit-operations.  For operations like addition and
 * multiplication, we split each number into 16-bit pieces, which can easily be
 * multiplied within Javascript's floating-point representation without overflow
 * or change in sign.
 *
 * In the algorithms below, we frequently reduce the negative case to the
 * positive case by negating the input(s) and then post-processing the result.
 * Note that we must ALWAYS check specially whether those values are MIN_VALUE
 * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
 * a positive number, it overflows back into a negative).  Not handling this
 * case would often result in infinite recursion.
 *
 * @param {number} low  The low (signed) 32 bits of the long.
 * @param {number} high  The high (signed) 32 bits of the long.
 * @struct
 * @constructor
 * @final
 */
var Long = function Long(low, high) {
  /**
   * @type {number}
   * @private
   */
  this.low_ = low | 0; // force into 32 signed bits.

  /**
   * @type {number}
   * @private
   */
  this.high_ = high | 0; // force into 32 signed bits.
};

/**
 * Returns a Long representing the given (32-bit) integer value.
 * @param {number} value The 32-bit integer in question.
 * @return {!Long} The corresponding Long value.
 */
Long.fromInt = function (value) {
  return new Long(value | 0, value < 0 ? -1 : 0);
};

/**
 * Returns a Long representing the given value.
 * NaN will be returned as zero. Infinity is converted to max value and
 * -Infinity to min value.
 * @param {number} value The number in question.
 * @return {!Long} The corresponding Long value.
 */
Long.fromNumber = function (value) {
  if (isNaN(value)) {
    return Long.getZero();
  } else if (value <= -Long.TWO_PWR_63_DBL_) {
    return Long.getMinValue();
  } else if (value + 1 >= Long.TWO_PWR_63_DBL_) {
    return Long.getMaxValue();
  } else if (value < 0) {
    return Long.fromNumber(-value).negate();
  } else {
    return new Long(value % Long.TWO_PWR_32_DBL_ | 0, value / Long.TWO_PWR_32_DBL_ | 0);
  }
};

/**
 * Returns a Long representing the 64-bit integer that comes by concatenating
 * the given high and low bits.  Each is assumed to use 32 bits.
 * @param {number} lowBits The low 32-bits.
 * @param {number} highBits The high 32-bits.
 * @return {!Long} The corresponding Long value.
 */
Long.fromBits = function (lowBits, highBits) {
  return new Long(lowBits, highBits);
};

/**
 * Returns a Long representation of the given string, written using the given
 * radix.
 * @param {string} str The textual representation of the Long.
 * @param {number=} opt_radix The radix in which the text is written.
 * @return {!Long} The corresponding Long value.
 */
Long.fromString = function (str, opt_radix) {
  if (str.length == 0) {
    throw Error('number format error: empty string');
  }

  var radix = opt_radix || 10;
  if (radix < 2 || 36 < radix) {
    throw Error('radix out of range: ' + radix);
  }

  if (str.charAt(0) == '-') {
    return Long.fromString(str.substring(1), radix).negate();
  } else if (str.indexOf('-') >= 0) {
    throw Error('number format error: interior "-" character: ' + str);
  }

  // Do several (8) digits each time through the loop, so as to
  // minimize the calls to the very expensive emulated div.
  var radixToPower = Long.fromNumber(Math.pow(radix, 8));

  var result = Long.getZero();
  for (var i = 0; i < str.length; i += 8) {
    var size = Math.min(8, str.length - i);
    var value = parseInt(str.substring(i, i + size), radix);
    if (size < 8) {
      var power = Long.fromNumber(Math.pow(radix, size));
      result = result.multiply(power).add(Long.fromNumber(value));
    } else {
      result = result.multiply(radixToPower);
      result = result.add(Long.fromNumber(value));
    }
  }
  return result;
};

// NOTE: the compiler should inline these constant values below and then remove
// these variables, so there should be no runtime penalty for these.


/**
 * Number used repeated below in calculations.  This must appear before the
 * first call to any from* function below.
 * @type {number}
 * @private
 */
Long.TWO_PWR_16_DBL_ = 1 << 16;

/**
 * @type {number}
 * @private
 */
Long.TWO_PWR_32_DBL_ = Long.TWO_PWR_16_DBL_ * Long.TWO_PWR_16_DBL_;

/**
 * @type {number}
 * @private
 */
Long.TWO_PWR_64_DBL_ = Long.TWO_PWR_32_DBL_ * Long.TWO_PWR_32_DBL_;

/**
 * @type {number}
 * @private
 */
Long.TWO_PWR_63_DBL_ = Long.TWO_PWR_64_DBL_ / 2;

/**
 * @return {!Long}
 * @public
 */
Long.getZero = function () {
  return Long.fromInt(0);
};

/**
 * @return {!Long}
 * @public
 */
Long.getOne = function () {
  return Long.fromInt(1);
};

/**
 * @return {!Long}
 * @public
 */
Long.getNegOne = function () {
  return Long.fromInt(-1);
};

/**
 * @return {!Long}
 * @public
 */
Long.getMaxValue = function () {
  return Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);
};

/**
 * @return {!Long}
 * @public
 */
Long.getMinValue = function () {
  return Long.fromBits(0, 0x80000000 | 0);
};

/**
 * @return {!Long}
 * @public
 */
Long.getTwoPwr24 = function () {
  return Long.fromInt(1 << 24);
};

/** @return {number} The value, assuming it is a 32-bit integer. */
Long.prototype.toInt = function () {
  return this.low_;
};

/** @return {number} The closest floating-point representation to this value. */
Long.prototype.toNumber = function () {
  return this.high_ * Long.TWO_PWR_32_DBL_ + this.getLowBitsUnsigned();
};

/**
 * @param {number=} opt_radix The radix in which the text should be written.
 * @return {string} The textual representation of this value.
 * @override
 */
Long.prototype.toString = function (opt_radix) {
  var radix = opt_radix || 10;
  if (radix < 2 || 36 < radix) {
    throw Error('radix out of range: ' + radix);
  }

  if (this.isZero()) {
    return '0';
  }

  if (this.isNegative()) {
    if (this.equals(Long.getMinValue())) {
      // We need to change the Long value before it can be negated, so we remove
      // the bottom-most digit in this base and then recurse to do the rest.
      var radixLong = Long.fromNumber(radix);
      var div = this.div(radixLong);
      var rem = div.multiply(radixLong).subtract(this);
      return div.toString(radix) + rem.toInt().toString(radix);
    } else {
      return '-' + this.negate().toString(radix);
    }
  }

  // Do several (6) digits each time through the loop, so as to
  // minimize the calls to the very expensive emulated div.
  var radixToPower = Long.fromNumber(Math.pow(radix, 6));

  var rem = this;
  var result = '';
  while (true) {
    var remDiv = rem.div(radixToPower);
    // The right shifting fixes negative values in the case when
    // intval >= 2^31; for more details see
    // https://github.com/google/closure-library/pull/498
    var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt() >>> 0;
    var digits = intval.toString(radix);

    rem = remDiv;
    if (rem.isZero()) {
      return digits + result;
    } else {
      while (digits.length < 6) {
        digits = '0' + digits;
      }
      result = '' + digits + result;
    }
  }
};

/** @return {number} The high 32-bits as a signed value. */
Long.prototype.getHighBits = function () {
  return this.high_;
};

/** @return {number} The low 32-bits as a signed value. */
Long.prototype.getLowBits = function () {
  return this.low_;
};

/** @return {number} The low 32-bits as an unsigned value. */
Long.prototype.getLowBitsUnsigned = function () {
  return this.low_ >= 0 ? this.low_ : Long.TWO_PWR_32_DBL_ + this.low_;
};

/**
 * @return {number} Returns the number of bits needed to represent the absolute
 *     value of this Long.
 */
Long.prototype.getNumBitsAbs = function () {
  if (this.isNegative()) {
    if (this.equals(Long.getMinValue())) {
      return 64;
    } else {
      return this.negate().getNumBitsAbs();
    }
  } else {
    var val = this.high_ != 0 ? this.high_ : this.low_;
    for (var bit = 31; bit > 0; bit--) {
      if ((val & 1 << bit) != 0) {
        break;
      }
    }
    return this.high_ != 0 ? bit + 33 : bit + 1;
  }
};

/** @return {boolean} Whether this value is zero. */
Long.prototype.isZero = function () {
  return this.high_ == 0 && this.low_ == 0;
};

/** @return {boolean} Whether this value is negative. */
Long.prototype.isNegative = function () {
  return this.high_ < 0;
};

/** @return {boolean} Whether this value is odd. */
Long.prototype.isOdd = function () {
  return (this.low_ & 1) == 1;
};

/**
 * @param {Long} other Long to compare against.
 * @return {boolean} Whether this Long equals the other.
 */
Long.prototype.equals = function (other) {
  return this.high_ == other.high_ && this.low_ == other.low_;
};

/**
 * @param {Long} other Long to compare against.
 * @return {boolean} Whether this Long does not equal the other.
 */
Long.prototype.notEquals = function (other) {
  return this.high_ != other.high_ || this.low_ != other.low_;
};

/**
 * @param {Long} other Long to compare against.
 * @return {boolean} Whether this Long is less than the other.
 */
Long.prototype.lessThan = function (other) {
  return this.compare(other) < 0;
};

/**
 * @param {Long} other Long to compare against.
 * @return {boolean} Whether this Long is less than or equal to the other.
 */
Long.prototype.lessThanOrEqual = function (other) {
  return this.compare(other) <= 0;
};

/**
 * @param {Long} other Long to compare against.
 * @return {boolean} Whether this Long is greater than the other.
 */
Long.prototype.greaterThan = function (other) {
  return this.compare(other) > 0;
};

/**
 * @param {Long} other Long to compare against.
 * @return {boolean} Whether this Long is greater than or equal to the other.
 */
Long.prototype.greaterThanOrEqual = function (other) {
  return this.compare(other) >= 0;
};

/**
 * Compares this Long with the given one.
 * @param {Long} other Long to compare against.
 * @return {number} 0 if they are the same, 1 if the this is greater, and -1
 *     if the given one is greater.
 */
Long.prototype.compare = function (other) {
  if (this.equals(other)) {
    return 0;
  }

  var thisNeg = this.isNegative();
  var otherNeg = other.isNegative();
  if (thisNeg && !otherNeg) {
    return -1;
  }
  if (!thisNeg && otherNeg) {
    return 1;
  }

  // at this point, the signs are the same, so subtraction will not overflow
  if (this.subtract(other).isNegative()) {
    return -1;
  } else {
    return 1;
  }
};

/** @return {!Long} The negation of this value. */
Long.prototype.negate = function () {
  if (this.equals(Long.getMinValue())) {
    return Long.getMinValue();
  } else {
    return this.not().add(Long.getOne());
  }
};

/**
 * Returns the sum of this and the given Long.
 * @param {Long} other Long to add to this one.
 * @return {!Long} The sum of this and the given Long.
 */
Long.prototype.add = function (other) {
  // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

  var a48 = this.high_ >>> 16;
  var a32 = this.high_ & 0xFFFF;
  var a16 = this.low_ >>> 16;
  var a00 = this.low_ & 0xFFFF;

  var b48 = other.high_ >>> 16;
  var b32 = other.high_ & 0xFFFF;
  var b16 = other.low_ >>> 16;
  var b00 = other.low_ & 0xFFFF;

  var c48 = 0,
      c32 = 0,
      c16 = 0,
      c00 = 0;
  c00 += a00 + b00;
  c16 += c00 >>> 16;
  c00 &= 0xFFFF;
  c16 += a16 + b16;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c32 += a32 + b32;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c48 += a48 + b48;
  c48 &= 0xFFFF;
  return Long.fromBits(c16 << 16 | c00, c48 << 16 | c32);
};

/**
 * Returns the difference of this and the given Long.
 * @param {Long} other Long to subtract from this.
 * @return {!Long} The difference of this and the given Long.
 */
Long.prototype.subtract = function (other) {
  return this.add(other.negate());
};

/**
 * Returns the product of this and the given long.
 * @param {Long} other Long to multiply with this.
 * @return {!Long} The product of this and the other.
 */
Long.prototype.multiply = function (other) {
  if (this.isZero()) {
    return Long.getZero();
  } else if (other.isZero()) {
    return Long.getZero();
  }

  if (this.equals(Long.getMinValue())) {
    return other.isOdd() ? Long.getMinValue() : Long.getZero();
  } else if (other.equals(Long.getMinValue())) {
    return this.isOdd() ? Long.getMinValue() : Long.getZero();
  }

  if (this.isNegative()) {
    if (other.isNegative()) {
      return this.negate().multiply(other.negate());
    } else {
      return this.negate().multiply(other).negate();
    }
  } else if (other.isNegative()) {
    return this.multiply(other.negate()).negate();
  }

  // If both longs are small, use float multiplication
  if (this.lessThan(Long.getTwoPwr24()) && other.lessThan(Long.getTwoPwr24())) {
    return Long.fromNumber(this.toNumber() * other.toNumber());
  }

  // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
  // We can skip products that would overflow.

  var a48 = this.high_ >>> 16;
  var a32 = this.high_ & 0xFFFF;
  var a16 = this.low_ >>> 16;
  var a00 = this.low_ & 0xFFFF;

  var b48 = other.high_ >>> 16;
  var b32 = other.high_ & 0xFFFF;
  var b16 = other.low_ >>> 16;
  var b00 = other.low_ & 0xFFFF;

  var c48 = 0,
      c32 = 0,
      c16 = 0,
      c00 = 0;
  c00 += a00 * b00;
  c16 += c00 >>> 16;
  c00 &= 0xFFFF;
  c16 += a16 * b00;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c16 += a00 * b16;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c32 += a32 * b00;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c32 += a16 * b16;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c32 += a00 * b32;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
  c48 &= 0xFFFF;
  return Long.fromBits(c16 << 16 | c00, c48 << 16 | c32);
};

/**
 * Returns this Long divided by the given one.
 * @param {Long} other Long by which to divide.
 * @return {!Long} This Long divided by the given one.
 */
Long.prototype.div = function (other) {
  if (other.isZero()) {
    throw Error('division by zero');
  } else if (this.isZero()) {
    return Long.getZero();
  }

  if (this.equals(Long.getMinValue())) {
    if (other.equals(Long.getOne()) || other.equals(Long.getNegOne())) {
      return Long.getMinValue(); // recall -MIN_VALUE == MIN_VALUE
    } else if (other.equals(Long.getMinValue())) {
      return Long.getOne();
    } else {
      // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
      var halfThis = this.shiftRight(1);
      var approx = halfThis.div(other).shiftLeft(1);
      if (approx.equals(Long.getZero())) {
        return other.isNegative() ? Long.getOne() : Long.getNegOne();
      } else {
        var rem = this.subtract(other.multiply(approx));
        var result = approx.add(rem.div(other));
        return result;
      }
    }
  } else if (other.equals(Long.getMinValue())) {
    return Long.getZero();
  }

  if (this.isNegative()) {
    if (other.isNegative()) {
      return this.negate().div(other.negate());
    } else {
      return this.negate().div(other).negate();
    }
  } else if (other.isNegative()) {
    return this.div(other.negate()).negate();
  }

  // Repeat the following until the remainder is less than other:  find a
  // floating-point that approximates remainder / other *from below*, add this
  // into the result, and subtract it from the remainder.  It is critical that
  // the approximate value is less than or equal to the real value so that the
  // remainder never becomes negative.
  var res = Long.getZero();
  var rem = this;
  while (rem.greaterThanOrEqual(other)) {
    // Approximate the result of division. This may be a little greater or
    // smaller than the actual value.
    var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));

    // We will tweak the approximate result by changing it in the 48-th digit or
    // the smallest non-fractional digit, whichever is larger.
    var log2 = Math.ceil(Math.log(approx) / Math.LN2);
    var delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);

    // Decrease the approximation until it is smaller than the remainder.  Note
    // that if it is too large, the product overflows and is negative.
    var approxRes = Long.fromNumber(approx);
    var approxRem = approxRes.multiply(other);
    while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
      approx -= delta;
      approxRes = Long.fromNumber(approx);
      approxRem = approxRes.multiply(other);
    }

    // We know the answer can't be zero... and actually, zero would cause
    // infinite recursion since we would make no progress.
    if (approxRes.isZero()) {
      approxRes = Long.getOne();
    }

    res = res.add(approxRes);
    rem = rem.subtract(approxRem);
  }
  return res;
};

/**
 * Returns this Long modulo the given one.
 * @param {Long} other Long by which to mod.
 * @return {!Long} This Long modulo the given one.
 */
Long.prototype.modulo = function (other) {
  return this.subtract(this.div(other).multiply(other));
};

/** @return {!Long} The bitwise-NOT of this value. */
Long.prototype.not = function () {
  return Long.fromBits(~this.low_, ~this.high_);
};

/**
 * Returns the bitwise-AND of this Long and the given one.
 * @param {Long} other The Long with which to AND.
 * @return {!Long} The bitwise-AND of this and the other.
 */
Long.prototype.and = function (other) {
  return Long.fromBits(this.low_ & other.low_, this.high_ & other.high_);
};

/**
 * Returns the bitwise-OR of this Long and the given one.
 * @param {Long} other The Long with which to OR.
 * @return {!Long} The bitwise-OR of this and the other.
 */
Long.prototype.or = function (other) {
  return Long.fromBits(this.low_ | other.low_, this.high_ | other.high_);
};

/**
 * Returns the bitwise-XOR of this Long and the given one.
 * @param {Long} other The Long with which to XOR.
 * @return {!Long} The bitwise-XOR of this and the other.
 */
Long.prototype.xor = function (other) {
  return Long.fromBits(this.low_ ^ other.low_, this.high_ ^ other.high_);
};

/**
 * Returns this Long with bits shifted to the left by the given amount.
 * @param {number} numBits The number of bits by which to shift.
 * @return {!Long} This shifted to the left by the given amount.
 */
Long.prototype.shiftLeft = function (numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var low = this.low_;
    if (numBits < 32) {
      var high = this.high_;
      return Long.fromBits(low << numBits, high << numBits | low >>> 32 - numBits);
    } else {
      return Long.fromBits(0, low << numBits - 32);
    }
  }
};

/**
 * Returns this Long with bits shifted to the right by the given amount.
 * The new leading bits match the current sign bit.
 * @param {number} numBits The number of bits by which to shift.
 * @return {!Long} This shifted to the right by the given amount.
 */
Long.prototype.shiftRight = function (numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var high = this.high_;
    if (numBits < 32) {
      var low = this.low_;
      return Long.fromBits(low >>> numBits | high << 32 - numBits, high >> numBits);
    } else {
      return Long.fromBits(high >> numBits - 32, high >= 0 ? 0 : -1);
    }
  }
};

/**
 * Returns this Long with bits shifted to the right by the given amount, with
 * zeros placed into the new leading bits.
 * @param {number} numBits The number of bits by which to shift.
 * @return {!Long} This shifted to the right by the given amount, with
 *     zeros placed into the new leading bits.
 */
Long.prototype.shiftRightUnsigned = function (numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var high = this.high_;
    if (numBits < 32) {
      var low = this.low_;
      return Long.fromBits(low >>> numBits | high << 32 - numBits, high >>> numBits);
    } else if (numBits == 32) {
      return Long.fromBits(high, 0);
    } else {
      return Long.fromBits(high >>> numBits - 32, 0);
    }
  }
};

/**
 * @enum {number} Ids of commonly requested Long instances.
 * @private
 */
Long.ValueCacheId_ = {
  MAX_VALUE: 1,
  MIN_VALUE: 2,
  ZERO: 3,
  ONE: 4,
  NEG_ONE: 5,
  TWO_PWR_24: 6
};

exports.default = Long;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var MAX_U32 = Math.pow(2, 32);

exports.default = MAX_U32;

},{}],4:[function(require,module,exports){
"use strict";

/*
   **Francois**:
   Based on an implementation that's based on further implementations, most significant
   change is removing the use of Buffers and ArrayBuffers. Original implementation was forked
   here (hopefully the original repo still exists, to play it safe I've forked it)
   https://github.com/francoislaberge/node-skip32

   ** Original Comments in skip32.js's implementation **
   Skip32PureJS.js - public domain javascript implementation of:

   SKIP32 -- 32 bit block cipher based on SKIPJACK.
   Written by Greg Rose, QUALCOMM Australia, 1999/04/27.

   In common: F-table, G-permutation, key schedule.
   Different: 24 round feistel structure.
   Based on:  Unoptimized test implementation of SKIPJACK algorithm
              Panu Rissanen <bande@lut.fi>

   SKIPJACK and KEA Algorithm Specifications
   Version 2.0
   29 May 1998

   Not copyright, no rights reserved.
*/
function Skip32() {
  // Francois: I have modified the code to have a hardcoded key. values
  // were taken from the example code in the node-skip32 project:
  // https://github.com/0x4139/node-skip32#example
  this.key = [0x9b, 0x21, 0x96, 0xe, 0x1a, 0xcf, 0x24, 0x5f, 0x14, 0x93];
};

Skip32.prototype.init = function () {};

// Francois: I have modified the code to remove the use of Buffers and ArrayBuffers
// so that the code is more portable to other browsers and environments
var ftable = [0xa3, 0xd7, 0x09, 0x83, 0xf8, 0x48, 0xf6, 0xf4, 0xb3, 0x21, 0x15, 0x78, 0x99, 0xb1, 0xaf, 0xf9, 0xe7, 0x2d, 0x4d, 0x8a, 0xce, 0x4c, 0xca, 0x2e, 0x52, 0x95, 0xd9, 0x1e, 0x4e, 0x38, 0x44, 0x28, 0x0a, 0xdf, 0x02, 0xa0, 0x17, 0xf1, 0x60, 0x68, 0x12, 0xb7, 0x7a, 0xc3, 0xe9, 0xfa, 0x3d, 0x53, 0x96, 0x84, 0x6b, 0xba, 0xf2, 0x63, 0x9a, 0x19, 0x7c, 0xae, 0xe5, 0xf5, 0xf7, 0x16, 0x6a, 0xa2, 0x39, 0xb6, 0x7b, 0x0f, 0xc1, 0x93, 0x81, 0x1b, 0xee, 0xb4, 0x1a, 0xea, 0xd0, 0x91, 0x2f, 0xb8, 0x55, 0xb9, 0xda, 0x85, 0x3f, 0x41, 0xbf, 0xe0, 0x5a, 0x58, 0x80, 0x5f, 0x66, 0x0b, 0xd8, 0x90, 0x35, 0xd5, 0xc0, 0xa7, 0x33, 0x06, 0x65, 0x69, 0x45, 0x00, 0x94, 0x56, 0x6d, 0x98, 0x9b, 0x76, 0x97, 0xfc, 0xb2, 0xc2, 0xb0, 0xfe, 0xdb, 0x20, 0xe1, 0xeb, 0xd6, 0xe4, 0xdd, 0x47, 0x4a, 0x1d, 0x42, 0xed, 0x9e, 0x6e, 0x49, 0x3c, 0xcd, 0x43, 0x27, 0xd2, 0x07, 0xd4, 0xde, 0xc7, 0x67, 0x18, 0x89, 0xcb, 0x30, 0x1f, 0x8d, 0xc6, 0x8f, 0xaa, 0xc8, 0x74, 0xdc, 0xc9, 0x5d, 0x5c, 0x31, 0xa4, 0x70, 0x88, 0x61, 0x2c, 0x9f, 0x0d, 0x2b, 0x87, 0x50, 0x82, 0x54, 0x64, 0x26, 0x7d, 0x03, 0x40, 0x34, 0x4b, 0x1c, 0x73, 0xd1, 0xc4, 0xfd, 0x3b, 0xcc, 0xfb, 0x7f, 0xab, 0xe6, 0x3e, 0x5b, 0xa5, 0xad, 0x04, 0x23, 0x9c, 0x14, 0x51, 0x22, 0xf0, 0x29, 0x79, 0x71, 0x7e, 0xff, 0x8c, 0x0e, 0xe2, 0x0c, 0xef, 0xbc, 0x72, 0x75, 0x6f, 0x37, 0xa1, 0xec, 0xd3, 0x8e, 0x62, 0x8b, 0x86, 0x10, 0xe8, 0x08, 0x77, 0x11, 0xbe, 0x92, 0x4f, 0x24, 0xc5, 0x32, 0x36, 0x9d, 0xcf, 0xf3, 0xa6, 0xbb, 0xac, 0x5e, 0x6c, 0xa9, 0x13, 0x57, 0x25, 0xb5, 0xe3, 0xbd, 0xa8, 0x3a, 0x01, 0x05, 0x59, 0x2a, 0x46];

Skip32.prototype.round16 = function (k, n) {
  var g1, g2, g3, g4, g5, g6;
  g1 = n >> 8 & 0xff;
  g2 = n >> 0 & 0xff;
  g3 = ftable[g2 ^ this.key[(4 * k + 0) % 10]] ^ g1;
  g4 = ftable[g3 ^ this.key[(4 * k + 1) % 10]] ^ g2;
  g5 = ftable[g4 ^ this.key[(4 * k + 2) % 10]] ^ g3;
  g6 = ftable[g5 ^ this.key[(4 * k + 3) % 10]] ^ g4;
  return (g5 << 8) + g6;
};

Skip32.prototype.core = function (n, k, d) {
  var i, k, wl, wr;
  wl = ((n >> 24 & 0xff) << 8) + ((n >> 16 & 0xff) << 0);
  wr = ((n >> 8 & 0xff) << 8) + ((n >> 0 & 0xff) << 0);
  for (i = 0; i < 24 / 2; i++) {
    wr ^= this.round16(k, wl) ^ k;
    k += d;
    wl ^= this.round16(k, wr) ^ k;
    k += d;
  }
  return (wr << 16 | wl) >>> 0;
};

Skip32.prototype.encrypt = function (n) {
  return this.core(n, 0, 1);
};

Skip32.prototype.decrypt = function (n) {
  return this.core(n, 23, -1);
};

module.exports.Skip32 = Skip32;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Generator = require('./Generator');

var _Generator2 = _interopRequireDefault(_Generator);

var _scrambler = require('./scrambler');

var _MaxU = require('./MaxU32');

var _MaxU2 = _interopRequireDefault(_MaxU);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var arbitrary = {
    MAX_U32: _MaxU2.default,
    Generator: _Generator2.default,
    scramble: _scrambler.scramble,
    descramble: _scrambler.descramble
};

exports.default = arbitrary;

},{"./Generator":1,"./MaxU32":3,"./scrambler":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scramble = scramble;
exports.descramble = descramble;
var Skip32 = require('./Skip32PureJS').Skip32;
var cypher = new Skip32();

/*
 * Takes a unsigned 32 bit integer and returns an unsigned 32 bit integer
 * with it's bits scrambled.
 *
 * Ideal for taking a series of incrementing numbers and creating a pseudo random version.
 * Is reversible via calling descramble() on a scrambled number.
 */
function scramble(number) {
  return cypher.encrypt(number);
}

/*
 * Takes a scrambled unsigned 32 bit integer and returns the unscrambled unsigned 32 bit
 * integer version.
 *
 * Ideal for taking a series of incrementing numbers and creating a pseudo random version.
 * Use this to figure out the original number crated from calls to scramble()
 */
function descramble(scrambledNumber) {
  return cypher.decrypt(scrambledNumber);
}

},{"./Skip32PureJS":4}]},{},[5])(5)
});

//# sourceMappingURL=index.js.map