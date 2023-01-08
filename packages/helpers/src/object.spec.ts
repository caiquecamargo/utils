import { describe, expect, it } from "vitest";
import { getProp } from "./object";

describe("object helpers", () => {
  it.each([
    [{ a: 1, b: { c: 2 } }, "a", 1],
    [{ a: 1, b: { c: 2 } }, "b.c", 2],
    [{ a: 1, b: { c: 2 } }, "b.d", undefined],
    [{ a: 1, b: { c: 2 } }, "b", { c: 2 }],
  ])(
    "should return the value of a prop or undefined",
    (obj, prop, expected) => {
      expect(getProp(obj, prop as keyof typeof obj)).toEqual(expected);
    }
  );
});
