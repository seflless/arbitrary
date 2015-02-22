# Overview
Javascript module for generating pseudo random numbers based on the TinyMT algorithm. It's benefit over normal
Messener Twister generators is it's state space is very small (~8bytes). This is useful for use cases where you want to backup, clone, or branch
an existing ```arbitrary.Generator``` instance.

# Installation

      npm install arbitrary

# Usage 

## Basics

```js
var arbitrary = require('arbitrary');

console.log(arbitrary.float());
console.log(arbitrary.integer());
```

Manage your own instances:

```js
var arbitrary = require('arbitrary'),
    generate = new arbitrary.Generator();

console.log(generate.float());
console.log(generate.integer());
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

  - [ ] Add noise, shuffle, serialize, deserialize, functions. Also look for my other notes.
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


# Credits

Originally based off of: [github.com/jj1bdx/TinyMT](https://github.com/jj1bdx/TinyMT)
