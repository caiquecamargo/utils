import { describe, expect, it } from "vitest";
import { diff } from "./diff";

describe("diff", () => {
  it.each([
    [{ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }, []],
    [
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: 3 } },
      [{ path: ["b", "c"], type: "CHANGE", value: 3, oldValue: 2 }],
    ],
    [
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: { d: "string" } } },
      [
        {
          path: ["b", "c"],
          type: "CHANGE",
          value: { d: "string" },
          oldValue: 2,
        },
      ],
    ],
    [
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: 2, d: 3 } },
      [
        {
          path: ["b", "d"],
          type: "CREATE",
          value: 3,
        },
      ],
    ],
    [
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: 2, d: { e: "string" } } },
      [
        {
          path: ["b", "d"],
          type: "CREATE",
          value: { e: "string" },
        },
      ],
    ],
    [
      { a: 1, b: { c: 2, d: 3 } },
      { a: 1, b: { c: 2 } },
      [{ path: ["b", "d"], type: "REMOVE", oldValue: 3 }],
    ],
  ])("should return the diff between two objects", (o1, o2, expected) => {
    expect(diff(o1, o2)).toEqual(expected);
  });
});
