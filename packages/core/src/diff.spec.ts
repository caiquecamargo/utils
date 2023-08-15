import { describe, expect, it } from "vitest";
import { adds, changes, diff, removes } from "./diff";

describe("diff", () => {
  it.each([
    [undefined, { a: 1, b: { c: 2 } }, []],
    [{ a: 1, b: { c: 2 } }, undefined, []],
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
    expect(diff(o1 as any, o2 as any)).toEqual(expected);
  });

  it.each([
    [undefined, { a: 1, b: { c: 2 } }, []],
    [{ a: 1, b: { c: 2 } }, undefined, []],
    [{ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }, []],
    [
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: 3 } },
      [],
    ],
    [
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: { d: "string" } } },
      [
      ],
    ],
    [
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: 2, d: 3 } },
      [
      ],
    ],
    [
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: 2, d: { e: "string" } } },
      [
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
        { path: "b.d", type: "REMOVE", oldValue: 3 },
      ],
    ],
    [
      [1, 2, 3],
      [1, 2, 4],
      [],
    ],
    [
      [1, 2, 3],
      [[1, 2], 2, 4],
      [
      ],
    ],
    [
      [[1, 3], 2, 3],
      [[1, 2], 2, 3],
      [],
    ],
  ])("should return the removes between two objects", (o1, o2, expected) => {
    expect(removes(o1, o2)).toEqual(expected);
  });

  it.each([
    [undefined, { a: 1, b: { c: 2 } }, []],
    [{ a: 1, b: { c: 2 } }, undefined, []],
    [{ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }, []],
    [
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: 3 } },
      [],
    ],
    [
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: { d: "string" } } },
      [
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
      [],
    ],
    [
      { a: 1, b: { c: 2, d: 3 } },
      { a: 2, b: { c: 2 } },
      [
      ],
    ],
    [
      [1, 2, 3],
      [1, 2, 4],
      [],
    ],
    [
      [1, 2, 3],
      [[1, 2], 2, 4],
      [
      ],
    ],
    [
      [[1, 3], 2, 3],
      [[1, 2], 2, 3],
      [],
    ],
  ])("should return the adds between two objects", (o1, o2, expected) => {
    expect(adds(o1, o2)).toEqual(expected);
  });

  it.each([
    [undefined, { a: 1, b: { c: 2 } }, []],
    [{ a: 1, b: { c: 2 } }, undefined, []],
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
      ],
    ],
    [
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: 2, d: { e: "string" } } },
      [
      ],
    ],
    [
      { a: 1, b: { c: 2, d: 3 } },
      { a: 1, b: { c: 2 } },
      [],
    ],
    [
      { a: 1, b: { c: 2, d: 3 } },
      { a: 2, b: { c: 2 } },
      [
        { path: "a", type: "CHANGE", oldValue: 1, value: 2 }
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
  ])("should return the changes between two objects", (o1, o2, expected) => {
    expect(changes(o1, o2)).toEqual(expected);
  });
});
