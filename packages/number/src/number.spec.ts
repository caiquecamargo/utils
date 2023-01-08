import { describe, expect, it } from "vitest";
import { between, decompose, round } from "./number";

describe("number", () => {
  it.each([
    [11, 1, 11],
    [11.1, 1, 11.1],
    [11.111, 0, 11],
    [11.111, 1, 11.1],
    [11.111, 2, 11.11],
    [11.111, 3, 11.111],
  ])(
    "should round %s with precision %s to %s",
    (value, precision, expected) => {
      const actual = round(value, precision);
      expect(actual).toEqual(expected);
    }
  );

  it("should true if value between two numbers", () => {
    const actual = between(11, 1, 11);
    expect(actual).toBeTruthy();

    const actual2 = between(11, 1, 10);
    expect(actual2).toBeFalsy();

    const actual3 = between(1, 1, 11);
    expect(actual3).toBeTruthy();

    const actual4 = between(1, 2, 10);
    expect(actual4).toBeFalsy();
  });

  it.each([
    [11, [1, 1]],
    [6345, [6, 3, 4, 5]],
    [7893834, [7, 8, 9, 3, 8, 3, 4]],
    [0, [0]],
    [undefined, []],
  ])("should return a decomposition of a number", (number, decomposed) => {
    const actual = decompose(number);
    expect(actual).toEqual(decomposed);
  });
});
