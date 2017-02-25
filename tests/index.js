import assert from 'assert';
import arbitrary from '../src/index';

describe('arbitrary', function() {
    describe('module', function() {
        it('should be commonjs compatible', function () {
            const arbitraryRequired = require('../src/index').default;
            assert(arbitraryRequired === arbitrary, `ES6 module and commonjs module should have been equivalent. es6=${arbitrary}, commonjs=${arbitraryRequired}`);
        });
    });
    describe('Generator', function () {
        describe('constructor()', function () {
            it('should use provided seed', function () {
                const generate = new arbitrary.Generator(3);
                assert(generate.state === 3, "State was not equivalent to the provided seed");
            });
            it('should generate random seed if no seed was provided', function () {

                // Test 10 randomly initialized generators
                // NOTE: It's technically possible but unlikely that a test run
                // could have collisions. If this ends up being an issue, then we
                // we could switch to calculating how many were different and consider
                // say 9 out of 10 to be sufficient
                const sampleCount = 10;
                let prevState = (new arbitrary.Generator()).state;
                for ( let i = 0; i < sampleCount; i++ ) {
                    let nextState = (new arbitrary.Generator()).state;
                    assert(nextState !== prevState, `Generated seed was not random. prevState=${prevState}/nextState=${nextState}` );
                    prevState = nextState;
                }
            });
        });

        describe('percent()', function () {
            it('should generate values in the range [0, 1)', function () {
                let generate = new arbitrary.Generator();
                checkGeneratedRange( () => {
                    return generate.next.percent();
                }, 0.0, 1.0);
            });
        });

        describe('bits()', function () {
            it('should generate values in correct range regardless of bitCount', function () {
                let generate = new arbitrary.Generator();

                // Test each bitCount exhaustively
                for(let bitCount = 1; bitCount <= 32; bitCount++ ) {
                    checkGeneratedRange( () => {
                        return generate.next.bits(bitCount);
                    }, 0, Math.pow(2, bitCount) );
                }
            });
        });

        describe('next() / prev()', function () {
            it('should be inverses of each other', function () {
                // Note: We use a random seeded generator to have tests
                // act as an effective fuzzer by running a different seed each run
                let generate = new arbitrary.Generator();

                const sampleCount = 100;
                let samples = [];

                for( let i = 0; i < sampleCount; i++ ) {
                    samples.push( generate.state );
                    generate.next;
                }

                for( let i = 0; i < sampleCount; i++ ) {
                    generate.prev;
                    assert( samples[ (sampleCount - 1) - i] === generate.state,
                        `Reversed state didn't match sample. sample[${sampleCount - i}]=${samples[ (sampleCount - 1) - i]}, reversed state=${generate.state}. All samples:\n${samples}` );
                }
            });

            it('should work with the largest possible state values', function () {

                // Sample the top 100 highest values of the state space and make
                // they are still inverses of each other
                // TODO: Add explicit hand calculated tests that at least next()
                // values are correctly which we then can test reverses on
                const sampleCount = 100;

                for( let i = 0; i < sampleCount; i++ ) {
                    const seed = Math.pow(2,32) - 1 - i;
                    let generate = new arbitrary.Generator( seed );

                    // Go forward one update, then backwards one, the state
                    // should now be equal to the seed state
                    generate.next.prev;
                    assert( generate.state === seed, `State was not restored to seed as expected. Seed=${seed}, restoredState=${generate.state} ` );
                }
            });
        });

        describe('scramble() / descramble()', function () {
            it('should be versible', function () {

                // Test a bunch of sample numbers to see if they scramble and descramble correctly
                const scramblingSamples = [
                    // Low range numbers
                    0, 1, 2, 4, 8, 16, 32, 64,
                    // High range numbers
                    Math.pow(2, 32) - 1,
                    Math.pow(2, 32) - 1 - 2,
                    Math.pow(2, 32) - 1 - 4,
                    Math.pow(2, 32) - 1 - 8,
                    Math.pow(2, 32) - 1 - 16,
                    Math.pow(2, 32) - 1 - 32,
                    Math.pow(2, 32) - 1 - 64,
                    // Also some randomly generated numbers, using the following console statement:
                    // for(let i = 0; i<10; i++){console.log( Math.floor( Math.random() * Math.pow(2, 32) ) ); }
                    2599597252,
                    4153347228,
                    1043597882,
                    1408751830,
                    2053248205,
                    2484325525,
                    2803278095,
                    1224986032,
                    2895711202,
                    3376187439
                ];

                scramblingSamples.forEach( (sample) => {
                    const scrambled = arbitrary.scramble(sample);
                    assert( isValidUnsigned32BitInteger(scrambled), `scramble(${sample}) wasn't a valid u32` );

                    const unscrambled = arbitrary.descramble(scrambled);
                    assert( unscrambled === sample, `unscramble(scramble(${sample})) should have been reversible`);
                });
            });
        });
    });
});

/**
 * Check that a number is a valid unsigned 32 bit integer
 */
function isValidUnsigned32BitInteger(n){
        // Can it cast to a number
    return Number(n) === n  &&
        // Make sure it has no decimal places
        n % 1 === 0 &&
        // Make sure it's in the range [0, 2^32 - 1]
        n >= 0 &&
        n < Math.pow(2,32);
}

/**
 * Generate a random sample of numbers from the provided function. The generator
 * function provided should be designed to be called repeatedly, generating a new
 * new random value each time.
 */
function checkGeneratedRange(generator, min, max){
    // Start with a randomly seeded Generator and take 100 samples
    // that ensure generate values are in the correct range
    const sampleCount = 100;
    for( let i = 0; i < sampleCount; i++ ) {
        const value = generator();
        assert( value >= min, `Value returned was below ${min}. value=${value}` );
        assert( value < max, `Value returned was above or equal to ${max}. value=${value}` );
    }
}
