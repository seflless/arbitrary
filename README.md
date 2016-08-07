# Overview
![Build Status](https://api.travis-ci.org/francoislaberge/arbitrary.svg)

Efficient Reversible Number Generator.

Ideal for generative art, as well as games for varied entity behavior.
  - Is deterministic (provide the same seed to get same stream of random values)
  - Is reversible (see `.next` and `.prev` in [Reversing](#reversing) section)
  - Internal state only takes up 32bits of space.
  - Has a period length of 2 ^ 32
  - Exhaustively covers each value of [0, 2 ^ 32)
  - Great test coverage (More to come)

# Installation

      npm install arbitrary

# Usage

## Basics

```js
import arbitrary from 'arbitrary';

// Creates a Generator with a random seed.
let generate = new arbitrary.Generator();

console.log( generate.next.number(-10, 10) );
console.log( generate.next.percent() );
console.log( generate.next.bits(1) );
console.log( generate.next.bits(32) );
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
