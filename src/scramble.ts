const Skip32 = require("./Skip32PureJS").Skip32;
const cypher = new Skip32();

/*
 * Takes a unsigned 32 bit integer and returns an unsigned 32 bit integer
 * with it's bits scrambled.
 *
 * Ideal for taking a series of incrementing numbers and creating a pseudo random version.
 * Is reversible via calling descramble() on a scrambled number.
 */
export function scramble(num: number) {
  return cypher.encrypt(num);
}

/*
 * Takes a scrambled unsigned 32 bit integer and returns the unscrambled unsigned 32 bit
 * integer version.
 *
 * Ideal for taking a series of incrementing numbers and creating a pseudo random version.
 * Use this to figure out the original number crated from calls to scramble()
 */
export function descramble(scrambledNumber: number) {
  return cypher.decrypt(scrambledNumber);
}
