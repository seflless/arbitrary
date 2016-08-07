var state =

// See https://en.wikipedia.org/wiki/Linear_congruential_generator#Period_length
// for why we picked these numbers.
let a, m, c;

// Based on: (Numerical Recipes)
// https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
var c = 1013904223;
var m = 4294967296; // = Math.pow(2,32);
var a = 1664525;

export function next(state) {
    state = (a * state + c) % m;
    return state;
}

export function startNonDeterministic(){
    return Math.floor( Math.random() * Math.pow(2, 32) );
}

export function start(){
    return 0;
}

var state = arbitrary.startNonDeterministic();

var arbitrary.start();

state = arbitrary.next(state);
arbitrary.float()
