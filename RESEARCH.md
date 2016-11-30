### Research
These are my backed up notes as I tried out various random generators and read prio art.

TODO
  - Tests
    - Shouldn't we be dividing by (MAX_U32-1), so that we can actually hit 1.0?
      - Need to think this out, want to make sure we are absolutely as close to
        unbiased in a direction as possible in generators such as (inclusive of both min/max)
        [-1,1]  that want values between
    - Run exhaustive tests? (Maybe separately from main tests)
      - Run for both next/prev but also scramble/unscramble
    - Prelimary tests of calling generate.next 2^32 times took 70s, so it's entirely feasible
      to do exhaustive tests of properties
      - Note: To ensure every value was hit and only once: `new Array(Math.pow(2,32))` fails,
        but using `new Array(Math.pow(2,32)/32)` and then using a u32 and bit checks should work
  - Add shuffling at some point
    - [Fisher-Yates Shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
      - As found in here Mike Bostock's [Visualizing Algorithms](https://bost.ocks.org/mike/algorithms/#sorting)
  - Cleanup API/module structure, support functional and OO styles
    - Functional:
    ```
    import {seed, next, prev, scramble, unscramble, range, percent, float, bits, integer} from 'arbitrary';
    let state = seed(state|undefined); // undefined is equivalent to 0. any non positive integer throws an exception
    const bitMask = bits(state, bitCount)
    // Roll the state forward one step before generating more values
    state = next(state);
    // Create a new stream of random numbers by deriving a new state from the existing one
    const fork = scramble(state);
    const anotherNumber = integer(forkedState, 0, 10);
    ```
    - OO:
      ```
      import {Generator} from 'arbitrary';
      const generator = new Generator(state|undefined); // undefined is equivalent to 0. any non positive integer throws an exception

      // Generate a number between 0 and bitCount^2 - 1 (Using current generator state, AND advancing the state);
      generator.bits(bitCount);
      // Step the generator forward one step
      generator.next();
      // Step the generator backwards one step
      generator.next();
      - generate
      ```

  - Find a good two way 32 bit hash
    - [This conversation looks very promising, lots of leads](https://www.quora.com/How-do-you-symmetrically-encrypt-32-bit-auto-increment-IDs-to-avoid-using-64-bit-UUIDs-to-conceal-the-size-and-order-of-a-database-table)
      - https://github.com/0x4139/node-skip32
    - https://stackoverflow.com/questions/959916/way-to-encrypt-a-single-int
      - ISAAC
        - https://www.npmjs.com/package/isaac
        - https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator
    - Don't forget to make it invertible too for bonus points
      - Allows going backwards from a hash to it's index
  - Goal builds an entire game world that is purely reversible
    - See if we can make card games reversible
    - Card game strategies
    - Character movement
    - Everything! (Or maybe make single simple game test beds. Especially classics like boids, A*, etc)
  - First test that this approach works for all number ranges
  - Then strip down use of Long library code
  - Really document and get it understood (Defer, maybe it's time to move on)
  - Now start thinking about a good API design
  - I prefer the var generate = arbitrary.Generator() and arbitrary.float(min|min,max)
  - Can we make it both play well with immutable style APIs and the convenience of a self mutating one?
  - Add an entry here (pointing to my implementation):
    - https://stackoverflow.com/questions/2911432/reversible-pseudo-random-sequence-generator
  - Consider making a generalized library for reversible applications (T-Functions (or is that just for bit oriented ones), T-Applications?)
  - Do try out xorshift
    - https://bitbucket.org/runevision/random-numbers-testing/src/16491c9dfa60417a5b25bd496e06a8f75b8f4f50/Assets/Implementations/RandomNumberGenerators/XorShift.cs?at=default&fileviewer=file-view-default
    - Does it have [0, 2^32) range?
    - Is it reversible in Javascript
    - Is it more performant?

Generate random numbers.

  - More leads
    - Goldmine in Google Closure library:
      - https://github.com/google/closure-library/blob/master/closure/goog/math/long.js#L53
    - https://en.wikipedia.org/wiki/Inversive_congruential_generator

Using LCG First
  - Verify algorithm works at each range of values (no small walks because of integer precision issues)
  - Make sure all math works as expected for u32, addition and multiplication operations need to wrap correctly
    - Pretty sure multiplication blows past the precision needed when the state is near the top of the value range
    - Also the addition of the increment should wrap in 32 bit space I believe (Actually maybe not)
  - Add u32
  - Add i32
  - Add u32Range
  - Add i32Range
  - Make sure that the if we add a true random number generator that pulls from say Math.random() that we log a warning
    to indicate that you should only use it once

LESSONS LEARNED SO FAR
  - Build everything with T-Functions (bijective operations on n-bit ring numbers)
  - You could likely build many structured generators such as spiral, hilbert space, random full coverage 2D sample, etc

Search for algorithms with some or all of the following properties:
  - algorithm is reversible (you can go back to a previous state given a current state)
  - algorithm is random access (you can provide an index [0, 2^32) that generates a good random value)
  - fast
  - maximum period length for state bit size (ie 32 bit state should generate 2^32 unique values before looping again)
  - lastly but less important: the usual ideal PRNG properties


TODO:
  - Explain each algorithm, cleanly and visually
  - Keep looking into this:
    - https://rosettacode.org/wiki/Random_number_generator_(included)#C.2B.2B
  - These seems good
    - https://www.npmjs.com/package/rng
    - https://www.npmjs.com/package/ivoire-one-of
    - https://www.npmjs.com/package/random-js
    - http://stackoverflow.com/questions/17625232/custom-linear-congruential-generator-in-javascript
    - http://jsfiddle.net/AbdiasSoftware/7VmR9/12/
    - https://bocoup.com/weblog/random-numbers
        - https://gist.github.com/Protonk/5367430 (Gold it looks like)
        - I really like the sound of the webkit invertible mapping generator
            - https://en.wikipedia.org/wiki/T-function
              - https://eprint.iacr.org/2011/547.pdf
            - https://gist.github.com/Protonk/5367430#file-prng-js-L91-L109
            - https://gist.github.com/Protonk/5367497 (includes link to C++ source)
    - Near random access (Log(n) n being skipp amount)
      - http://stackoverflow.com/a/38495314 (I believe this was mentioned in the above log too)
    - This looks promising (Sounds like you can jump to any point to generated a value)
      - http://stackoverflow.com/a/19508103
      - Source: https://code.google.com/archive/p/javarng/source/default/source
    - this too
      - https://github.com/bobbaluba/rlcg
    - Reversible LCG
      - http://stackoverflow.com/a/16630535
    - Why is it difficult to write a good PRNG in javascript?
      - https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
    - http://number-none.com/blow/blog/programming/2016/07/13/braid_particles_2.html
      - https://marc-b-reynolds.github.io/shf/2016/04/19/prns.html
    - https://github.com/davidbau/xsrand
    - Looks very fast
      - https://github.com/davidbau/xsrand/blob/master/xor128.js#L4
  - Bit operations subtlties
    - https://stackoverflow.com/questions/14061999/why-does-0x80000000-1-in-javascript-produce-a-negative-value
    - Learning a lot here:
      - http://www.ecma-international.org/ecma-262/7.0/index.html#sec-binary-bitwise-operators-runtime-semantics-evaluation
      - Use >>> where possible
        - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Unsigned_right_shift

  - Test (For each power of two bit range: 1, 2, 4, 8, 16, 32 bit range)
    - First looping
    - Coverage
    - Uniformity
    - Standard tests?
      - https://en.wikipedia.org/wiki/Randomness_tests

# Installation

      npm install arbitrary

# Usage

## Basics

```js
var arbitrary = require('arbitrary');

console.log(arbitrary.float());
console.log(arbitrary.integer());
console.log(arbitrary.shuffle([1, 2, 3, 4]));
console.log(arbitrary.choice([1, 2, 3, 4]));
console.log(arbitrary.sample([1, 2, 3, 4], 2));
```

Manage your own instances:

```js
var arbitrary = require('arbitrary'),
    generate = new arbitrary.Generator();

console.log(generate.float());
console.log(generate.integer());
console.log(generate.shuffle([1, 2, 3, 4]));
console.log(generate.choice([1, 2, 3, 4]));
console.log(generate.sample([1, 2, 3, 4], 2));
```

# Project Goals
 - Be able to easily clone a generator instance
 - Be able to step a generator backward (soft requirement, as it's 28 bytes for the total state. But that could add up if you want to go backwards in time and rollback generator state.)
 - Be efficient.
 - Provide Module Distributions
   - Vanilla .js file
   - Browserfy
   - Require
   - Bower

# Todo

  - [ ] Add noise, shuffle, serialize(getState() instead?), deserialize(setState() instead?), functions. Also look for my other notes.
  - [ ] Should we add support for generating higher dimensional and compound objects like: Vector2D, Vector3D, rgb (compatible with svg/canvas/dom), rgba(compatible with svg/canvas/dom), normal2D, normal3D, quaternion, etc?
  - [ ] Checkout other PRNG libraries.
    - [Python's](https://docs.python.org/2/library/random.html#random.getstate)
  - [ ] Explain the benefits better. Is performance reason enough? Probably, espcially in Javascript.
  - [x] Reserve ```arbitrary``` npm module name
  - [ ] Use [WebCryptoAPI](http://www.w3.org/TR/WebCryptoAPI/) instead of time for original seed? Doesn't really make sense considering security is not
        our use case.
  - [ ] Try porting to javascript using emscripten
  - [ ] If emscripten doesn't work out well or at all, port it manually to Javascript.
  - [ ] Write tests
    - [ ] Make sure integer range parameters make sense
    - [ ] Make sure shuffles shuffle every element (Also that the last element is sometimes shuffled to, not just from which is guaranteed from our looping approach)
    - [ ] Sanity check distribution, performance, and anything else that adds integrity
    - [ ] Should we start guaranteeing backward compatible determism? (This might be too high of a constraint)
    - [ ] What about just general cross environment determinism (ie, same seed same outputs in every browser and node etc)
  - [ ] Give a [list of references](http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/ARTICLES/earticles.html) and history lessong for the general MT work as well as the TinyMT implementation.
  - [ ] Read through: [PCG, A Family of Better Random Number Generators](http://www.pcg-random.org/)


# References
  - [Mersenne Twister Home Page](http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html)
  - [TinyMT is a new small-sized variant of Mersenne Twister (MT) introduced by Mutsuo Saito and Makoto Matsumoto in 2011](http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/TINYMT/index.html)
  - C/C++ implementation: [github.com/jj1bdx/TinyMT](https://github.com/jj1bdx/TinyMT)
