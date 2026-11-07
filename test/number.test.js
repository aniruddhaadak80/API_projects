const test = require("node:test");
const assert = require("node:assert");
const { numberFacts, isPrime, toRoman, isFib, divisors } = require("../number.js");

test("isPrime", () => {
  assert.deepEqual([0, 1, 2, 3, 4, 17, 21, 97].map(isPrime), [false, false, true, true, false, true, false, true]);
});
test("divisors", () => assert.deepEqual(divisors(28), [1, 2, 4, 7, 14, 28]));
test("toRoman", () => {
  assert.equal(toRoman(1994), "MCMXCIV");
  assert.equal(toRoman(0), null);
});
test("isFib", () => assert.deepEqual([0, 1, 8, 13, 14, 144].map(isFib), [true, true, true, true, false, true]));
test("numberFacts finds perfect numbers, squares and cubes", () => {
  assert.match(numberFacts(28), /perfect number/);
  assert.match(numberFacts(64), /perfect square \(8²\).*perfect cube \(4³\)/);
  assert.match(numberFacts(7), /prime number/);
  assert.match(numberFacts(-9), /odd/);
});
