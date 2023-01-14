/*
 *
 */

import Long from "./Long";
import MAX_U32 from "./MaxU32";

// See https://en.wikipedia.org/wiki/Linear_congruential_generator#Period_length
// for why we picked these numbers. We copied the 'Numerical Recipes' numbers from here
// https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
// Creates a period length of [0, 2^32 - 1 ]
const c = 1013904223;
const m = 4294967296; // = Math.pow(2,32);
const a = 1664525;

// This is the inverse of 'a' above for modolo multiplicative needed for calculating
// the inverse of the standard linear congruent generator state update function.
// For a good primer/starting point, see: http://stackoverflow.com/a/16630535.
// The contribution of this library is making this approach work in Javascript
// which has bit operators, multiplication, and modolo operation semantics
// different than the 2s-complement integer math of languages like C/C++
const aInverse = -18851643;

export default class Generator {
  #state: number;

  // Creates a new Generator
  // takes a seed or defaults to Math.random()
  constructor(seed?: number) {
    seed = seed || Math.floor(Math.random() * MAX_U32);
    this.#state = seed;
  }

  /**
   * @returns A number between the [0, 1);
   */
  percent() {
    return this.#state / MAX_U32;
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

  number(min?: number, max?: number): number {
    if (min === undefined && max === undefined) {
      min = 0.0;
      max = 1.0;
    } else if (max === undefined) {
      min = 0.0;
      max = min;
    }
    return (this.#state / MAX_U32) * (max - (min as number)) + (min as number);
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
  integer(min: number, max: number) {
    if (arguments.length === 0) {
      min = 0;
      max = MAX_U32;
    } else if (arguments.length === 1) {
      min = 0;
      max = min;
    } else if (arguments.length === 2) {
      // Do nothing, min and max are set
    } else {
      throw new Error("Generator.integer() only takes up to 2 parameters");
    }
    return Math.round((this.#state / MAX_U32) * (max - min)) + min;
  }

  /**
   * @returns A u32 between the min/max;
   */
  /*u32(min, max){
        if(arguments.length === 0){
            return this.#state;
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
  bits(bitCount: number) {
    if (bitCount <= 0 || bitCount > 32) {
      throw new Error(
        `Generator.bits()'s bitCount parameter must be in the range [1 - 32]. Provided bitCount=${bitCount}`
      );
    }
    // Use the higher bits as the lower bits have a low period. I haven't looked into the exact
    // math of why, but in my tests in masking off the lower bits and graphing them it tended
    // to loop very quickly.
    // TODO: Test the above concern and in general do some analysis of the quality of generated
    // numbers using different places of the number.
    return this.#state >>> (32 - bitCount);
  }

  // Move the generators internal state
  // forward one step
  get next() {
    this.#state = lcg(this.#state);
    return this;
  }

  // Move the generators internal state
  // forward one step
  get prev() {
    this.#state = rlcg(this.#state);
    return this;
  }

  // Set the state of the generator. Must be a valid u32 integer
  set state(state: number) {
    if (state < 0 || state >= MAX_U32) {
      throw new Error(
        `Generator.state must be a number between 0 and (2^32 - 1). Provided state was ${state}.`
      );
    }
    this.#state = state;
  }

  // Get the current internal state
  get state() {
    return this.#state;
  }
}

function lcg(state: number) {
  state = (a * state + c) % m;
  return state;
}

function rlcg(state: number) {
  var result = Long.fromInt(aInverse).multiply(
    Long.fromNumber(state - 1013904223)
  ); //
  var pow2to32 = new Long(0, 1);

  // Modulo doesn't work as we want (negatives stay negatives, we want wrapping around )
  if (result.isNegative()) {
    result = pow2to32.add(result.modulo(pow2to32));
  } else {
    result = result.modulo(pow2to32);
  }
  return result.toNumber();
}
