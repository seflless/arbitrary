# Overview
[![Build Status](https://api.travis-ci.org/francoislaberge/arbitrary.svg)

# Installation

      npm install arbitrary

# Usage

## Basics

```js
import arbitrary from 'arbitrary';
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
