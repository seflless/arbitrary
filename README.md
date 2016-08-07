# Overview
![Build Status](https://api.travis-ci.org/francoislaberge/arbitrary.svg)

Library for generating a stream of random numbers efficiently. Ideal for generative art/animation as well as game entity behavior.
  - Is deterministic (provide the same seed, and get the same stream of random values)
  - Has a period length of 2 ^ 32
  - Exhaustively covers each value of [0, 2 ^ 32)
  - Internal state only takes up 32bits of space.
  - Is reversible (see `.next` and `.prev` in [Reversing](#reversing) section)
  - Great test coverage (More to come)

# Installation

      npm install arbitrary

# Usage

## Basics

```js
import arbitrary from 'arbitrary';

// Creates a Generator with a random seed.
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
```

## Deterministic
```js
import arbitrary from 'arbitrary';
// Create a Generator with a seed
let deterministic = new arbitrary.Generator(42);

// Will always be: 0.2523451747838408
console.log( deterministic.next.percent() );
// Will always be: 22
console.log( deterministic.next.bits(8) );
// Will always be: 5772.811982315034
console.log( deterministic.next.number(0, 10000) );
```

## Reversing

```js
import arbitrary from 'arbitrary';

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
```

## API Reference
Coming soon. See examples above.
