import { describe, expect, it } from "vitest";
import { diff } from "./diff";

describe("diff", () => {
  it.each([
    [{ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }, []],
    [
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: 3 } },
      [{ path: "b.c", type: "CHANGE", value: 3, oldValue: 2 }],
    ],
    [
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: { d: "string" } } },
      [
        {
          path: "b.c",
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
          path: "b.d",
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
          path: "b.d",
          type: "CREATE",
          value: { e: "string" },
        },
      ],
    ],
    [
      { a: 1, b: { c: 2, d: 3 } },
      { a: 1, b: { c: 2 } },
      [{ path: "b.d", type: "REMOVE", oldValue: 3 }],
    ],
    [
      { a: 1, b: { c: 2, d: 3 } },
      { a: 2, b: { c: 2 } },
      [
        { path: "a", type: "CHANGE", oldValue: 1, value: 2 },
        { path: "b.d", type: "REMOVE", oldValue: 3 },
      ],
    ],
    [
      [1, 2, 3],
      [1, 2, 4],
      [{ path: "2", type: "CHANGE", oldValue: 3, value: 4 }],
    ],
    [
      [1, 2, 3],
      [[1, 2], 2, 4],
      [
        { path: "0", type: "CHANGE", oldValue: 1, value: [1, 2] },
        { path: "2", type: "CHANGE", oldValue: 3, value: 4 },
      ],
    ],
    [
      [[1, 3], 2, 3],
      [[1, 2], 2, 3],
      [{ path: "0", type: "CHANGE", oldValue: [1, 3], value: [1, 2] }],
    ],
  ])("should return the diff between two objects", (o1, o2, expected) => {
    expect(diff(o1, o2)).toEqual(expected);
  });
});
