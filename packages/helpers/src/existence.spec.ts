import { describe, expect, it } from "vitest";
import {
  isArrayNullOrEmpty,
  isFloat,
  isInt,
  isNil,
  isNotNil,
  isObjectNullOrEmpty,
  isStringNullOrEmpty,
} from "./existence";

const baseEntry = [
  null, // 0
  undefined, // 1
  0, // 2
  1, // 3
  "", // 4
  "a", // 5
  false, // 6
  true, // 7
  {}, // 8
  { a: "bla" }, // 9
  [], // 10
  ["foo"], // 11
  () => ({}), // 12
  NaN, // 13
  Infinity, // 14
  -Infinity, // 15
  0.11, // 16
  -0.11, // 17
];

const makeBaseTestEntry = (...trueIndexes: number[]) => {
  return baseEntry.map((value, index) => [value, trueIndexes.includes(index)]);
};

describe("existence", () => {
  it.each(makeBaseTestEntry(0, 1))(
    "should return true if %s is null or undefined",
    (value, expected) => {
      expect(isNil(value)).toEqual(expected);
      expect(isNotNil(value)).toEqual(!expected);
    }
  );

  it.each(makeBaseTestEntry(0, 1, 4))(
    "should return true if %p is a null, undefined or empty string",
    (value, expected) => {
      expect(isStringNullOrEmpty(value)).toEqual(expected);
    }
  );

  it.each(makeBaseTestEntry(0, 1, 8))(
    "should return true is %p is null, undefined or empty object",
    (value, expected) => {
      expect(isObjectNullOrEmpty(value)).toEqual(expected);
    }
  );

  it.each(makeBaseTestEntry(0, 1, 10))(
    "should return true if %p is null, undefined or empty array",
    (value, expected) => {
      expect(isArrayNullOrEmpty(value)).toEqual(expected);
    }
  );

  it.each(makeBaseTestEntry(2, 3))(
    "should return true if %p is an integer",
    (value, expected) => {
      expect(isInt(value)).toEqual(expected);
    }
  );

  it.each(makeBaseTestEntry(16, 17))(
    "should return true if %p is a float",
    (value, expected) => {
      expect(isFloat(value)).toEqual(expected);
    }
  );
});
