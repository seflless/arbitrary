/*
constexpr uint64_t extendedEuclidX(uint64_t a, uint64_t b){
    return (b==0)
        ?   1
        :   extendedEuclidY(
                b,
                a - b * (a / b)
            );
}
constexpr uint64_t extendedEuclidY(uint64_t a, uint64_t b){
    return (b==0)
        ?   0
        :   extendedEuclidX(
                b,
                a -
                b * (a / b)
            ) -
            (a / b) *
            extendedEuclidY(
                b,
                a -
                b * (a / b)
            );
}
*/

function extendedEuclidX(a, b){
    return (b === 0)
        ?
            1
        :
            extendedEuclidY(
                b,
                u32Subtract(
                    a,
                    b * Math.floor(a / b)
                )
            );
}

function extendedEuclidY(a, b){
    return ( b === 0)
        ?
            0
        :
            u32Subtract(
                extendedEuclidX(
                    b,
                    u32Subtract(
                        a,
                        b * Math.floor(a / b)
                    )
                ),
                Math.floor(a / b) * extendedEuclidY(
                    b,
                    u32Subtract(
                        a,
                        b * Math.floor(a / b)
                    )
                )
            )
}

var c = 1013904223;
var m = 4294967296;
var a = 1664525;
function lcg(state) {
    state = (a * state + c) % m;
    return state;
}

var ainverse = extendedEuclidX(a, m);
console.log(ainverse);
function ilcg(state) {
    state = (ainverse * u32Subtract(state,c)) % m;
    return state;
}

// See:
//  - http://stackoverflow.com/questions/7221409/is-unsigned-integer-subtraction-defined-behavior
//  - http://stackoverflow.com/questions/7221409/is-unsigned-integer-subtraction-defined-behavior
function u32Subtract(a, b){
    var result = a - b;
    if( result >= 0 ) {
        return result;
    } else {
        return 4294967296 + result;
    }
}

function u3Subtract(a, b){
    var result = a - b;
    if( result >= 0 ) {
        return result;
    } else {
        return Math.pow(2,3) + result;
    }
}

var state = 0;
var samples = 5;
var output = [];
for(var i = 0; i<samples; i++){
    state = lcg(state);
    output.push(state);
}
console.log( output.join(',') );

output = [];
for(var i = 0; i<samples; i++){
    state = ilcg(state);
    output.push(state);
}
console.log( output.join(',') );
