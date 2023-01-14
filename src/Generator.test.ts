import { describe, expect, it } from "vitest";

import Generator from "./Generator";

/**
 * Returns a random number between 0 and 1.
 */
function getRandomNumber(): number;

/**
 * Returns a random number between 0 and the specified maximum.
 * @param max The maximum value for the random number.
 */
function getRandomNumber(max: number): number;

/**
 * Returns a random number between the specified minimum and maximum.
 * @param min The minimum value for the random number.
 * @param max The maximum value for the random number.
 */
function getRandomNumber(min: number, max: number): number;

/**
 * Returns a random number between the specified minimum and maximum.
 * If only one parameter is provided, it is treated as the maximum value.
 * If no parameters are provided, the minimum value is 0 and the maximum value is 1.
 * @param min The minimum value for the random number (optional).
 * @param max The maximum value for the random number (optional).
 */
function getRandomNumber(min: number = 0, max: number = 1): number {
  if (max === undefined && min === undefined) {
    min = 0.0;
    max = 1.0;
  } else if (max === undefined) {
    max = min;
    min = 0.0;
  }
  return Math.random() * (max - min) + min;
}

describe("Generator", () => {
  it("should generate [0,1] values when called with 0 args", () => {
    const n = getRandomNumber();
    expect(n).toBeGreaterThanOrEqual(0.0);
    expect(n).toBeLessThanOrEqual(1.0);
  });

  it("should generate [0,max] values when called with 1 arg", () => {
    const n = getRandomNumber(5.0);
    expect(n).toBeGreaterThanOrEqual(0.0);
    expect(n).toBeLessThanOrEqual(5.0);
  });

  it("should generate [min,max] values when called with 2 args", () => {
    const n = getRandomNumber(10, 1000);
    expect(n).toBeGreaterThanOrEqual(1.0);
    expect(n).toBeLessThanOrEqual(1000.0);
  });
  // it("should use provided seed", () => {
  //   const generator = new Generator(3);
  //   expect(generator.state).toBe(3);
  //   // assert(generate.state === 3, "State was not equivalent to the provided seed");
  // });
  // it("should use provided seed", () => {
  //   const generator = new Generator(3);
  //   expect(generator.state).toBe(3);
  //   // assert(generate.state === 3, "State was not equivalent to the provided seed");
  // });
});

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

describe("number()", function () {
  it("0 args, should generate values in the range [0.0, 1.0]", function () {
    let generate = new Generator();
    checkGeneratedRange(
      () => {
        return generate.number();
      },
      0,
      1.0
    );
  });

  const maxOnly = 234245234.0;
  it("1 arg, should generate values in the range [0.0, max]", function () {
    let generate = new Generator();
    checkGeneratedRange(
      () => {
        return generate.integer(maxOnly);
      },
      0.0,
      maxOnly
    );
  });

  const min = -1234123423.0;
  const maxAlso = 837281.0;
  it("2 args, should generate values in the range [min, max]", function () {
    let generate = new Generator();
    checkGeneratedRange(
      () => {
        return generate.integer(min, maxAlso);
      },
      min,
      maxAlso
    );
  });

  // it("Greater than 2 args, should throw an exception", function () {
  //   let generate = new Generator();

  //   try {
  //     generate.number(1.0, 2.0, 3.0);
  //     throw new Error("Shouldn't have reached here");
  //   } catch (err) {
  //     if (err.message !== "Generator.number() only takes up to 2 parameters") {
  //       throw new Error("Generator.number() should have thrown an exception");
  //     }
  //   }
  // });
});

/**
 * Generate a random sample of numbers from the provided function. The generator
 * function provided should be designed to be called repeatedly, generating a new
 * new random value each time.
 */
function checkGeneratedRange(
  generator: () => number,
  min: number,
  max: number
) {
  // Start with a randomly seeded Generator and take 100 samples
  // that ensure generate values are in the correct range
  const sampleCount = 100;
  for (let i = 0; i < sampleCount; i++) {
    const value = generator();
    expect(value).toBeGreaterThanOrEqual(min);
    expect(value).toBeLessThan(max);
  }
}
