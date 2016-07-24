var state = Math.floor( Math.random() * Math.pow(2, 32) );
console.log(`Initialize state: ${state}`);

// See https://en.wikipedia.org/wiki/Linear_congruential_generator#Period_length
// for why we picked these numbers.
let a, m, c;
let which = 'NUMERICAL_RECIPES';

if( which === 'SIMPLE' ) {
    // Based on:
    // https://gist.github.com/mmalone/6ef9fabe1a7540ae89e8
    c = 3;
    m = 5;
    a = 16;
}
else if( which === 'NUMERICAL_RECIPES' ) {
    // Based on: (Numerical Recipes)
    // https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
    c = 1013904223;
    m = 4294967296; // = Math.pow(2,32);
    a = 1664525;
}
else if( which === 'GLIBC' ) {
    // Based on: (glibc)
    // https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
    c = 12345;
    m = 2147483648; // = Math.pow(2,31);
    a = 1103515245;
}
else if( which === 'BSD' ) {
    // Based on: (BSD formula)
    // https://rosettacode.org/wiki/Linear_congruential_generator
    c = 12345;
    m = 1103515245;
    a = Math.pow(2, 31);
}
else if( which === 'PROTONK' ) {
    // Based on: (lcg version)
    // https://gist.github.com/Protonk/5367430#file-prng-js
    c = 1013904223;
    m = 4294967296;
    a = 1664525;
}
else if( which === 'ABDIAS' ) {
    // Based on: (BSD formula)
    // http://jsfiddle.net/AbdiasSoftware/7VmR9/12/
    c = 1013904223;
    m = 4294967296;
    a = 1664525;
}
console.log(`c: ${c}, m: ${m}, a: ${a}`);

export function lcg() {
    state = (a * state + c) % m;
    return state;
}

export function lcgIndexed(index) {
    index = (a * index + c) % m;
    return index;
}
