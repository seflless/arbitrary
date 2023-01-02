import Generator from "./Generator";

describe("constructor()", () => {
  it("should use provided seed", () => {
    const generator = new Generator(3);
    expect(generator.state).toBe(3);
    // assert(generate.state === 3, "State was not equivalent to the provided seed");
  });

  it("should generate random seed if no seed was provided", () => {
    // There's a very small chance this test would fail, if Math.random()
    // returned the same value twice in a row.
    // TODO: Mock Math.random() to return known values
    let state = new Generator().state;
    let otherState = new Generator().state;
    expect(state).not.toBe(otherState);
  });
});

// describe("number()", function () {
//   it("0 args, should generate values in the range [0.0, 1.0]", function () {
//     let generate = new Generator();
//     checkGeneratedRange(
//       () => {
//         return generate.number();
//       },
//       0,
//       1.0
//     );
//   });

//   const maxOnly = 234245234.0;
//   it("1 arg, should generate values in the range [0.0, max]", function () {
//     let generate = new Generator();
//     checkGeneratedRange(
//       () => {
//         return generate.integer(maxOnly);
//       },
//       0.0,
//       maxOnly
//     );
//   });

//   const min = -1234123423.0;
//   const maxAlso = 837281.0;
//   it("2 args, should generate values in the range [min, max]", function () {
//     let generate = new Generator();
//     checkGeneratedRange(
//       () => {
//         return generate.integer(min, maxAlso);
//       },
//       min,
//       maxAlso
//     );
//   });

//   it("Greater than 2 args, should throw an exception", function () {
//     let generate = new Generator();

//     try {
//       generate.number(1.0, 2.0, 3.0);
//       throw new Error("Shouldn't have reached here");
//     } catch (err) {
//       if (err.message !== "Generator.number() only takes up to 2 parameters") {
//         throw new Error("Generator.number() should have thrown an exception");
//       }
//     }
//   });
// });

/**
 * Generate a random sample of numbers from the provided function. The generator
 * function provided should be designed to be called repeatedly, generating a new
 * new random value each time.
 */
// function checkGeneratedRange(
//   generator: () => number,
//   min: number,
//   max: number
// ) {
//   // Start with a randomly seeded Generator and take 100 samples
//   // that ensure generate values are in the correct range
//   const sampleCount = 100;
//   for (let i = 0; i < sampleCount; i++) {
//     const value = generator();
//     expect(value).toBeGreaterThanOrEqual(min);
//     expect(value).toBeLessThan(max);
//   }
// }
