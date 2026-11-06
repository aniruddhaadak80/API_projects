const test = require("node:test");
const assert = require("node:assert");
const { isLeapYear } = require("../leapYear.js");

test("Gregorian leap-year rule", () => {
  assert.deepEqual([1900, 2000, 2024, 2026, 2100, 2400].map(isLeapYear), [false, true, true, false, false, true]);
});
