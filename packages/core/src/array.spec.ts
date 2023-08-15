import { describe, expect, it } from "vitest";
import {
  boil,
  cluster,
  counting,
  first,
  fork,
  group,
  inChunks,
  last,
  list,
  max,
  min,
  moveTo,
  range,
  reversedList,
  select,
  sift,
  sortByTarget,
  sum,
  swap,
  unique,
} from "./array";

describe("array", () => {
  it.each([
    [[{ id: 1, name: "A" }], undefined, "id", [{ id: 1, name: "A" }]],
    [[{ id: 1, name: "A" }], [], "id", [{ id: 1, name: "A" }]],
    [
      [
        { id: 1, name: "A" },
        { id: 2, name: "D" },
        { id: 3, name: "B" },
        { id: 4, name: "C" },
      ],
      [1, 3, 4],
      "id",
      [
        { id: 1, name: "A" },
        { id: 3, name: "B" },
        { id: 4, name: "C" },
      ],
    ],
    [
      [
        { id: 1, name: "A" },
        { id: 2, name: "D" },
        { id: 3, name: "B" },
        { id: 4, name: "C" },
      ],
      [1, 3, 4, 2],
      "id",
      [
        { id: 1, name: "A" },
        { id: 3, name: "B" },
        { id: 4, name: "C" },
        { id: 2, name: "D" },
      ],
    ],
    [["A", "B", "C"], ["A", "C", "B"], undefined, ["A", "C", "B"]],
    [[1, 2, 3], [1, 3, 2], undefined, [1, 3, 2]],
  ])(
    "should order the given array by a target array",
    (unordered, target, prop, expected) => {
      expect(
        sortByTarget(unordered as any, target as any, prop as any)
      ).toEqual(expected);
    }
  );

  it.each([
    [[1, 2, 3, 4], 2, 1, [1, 3, 2, 4]],
    [[1, 2, 3, 4], undefined, 1, [1, 2, 3, 4]],
    [[1, 2, 3, 4], 2, undefined, [1, 2, 3, 4]],
    [[1, 2, 3, 4], 2, 3, [1, 2, 4, 3]],
    [[1, 2, 3, 4], 1, 3, [1, 4, 3, 2]],
    [[1, 2, 3, 4], 2, 0, [3, 2, 1, 4]],
    [[1, 2, 3, 4], -1, 3, [1, 2, 3, 4]],
    [[1, 2, 3, 4], 2, 4, [1, 2, 3, 4]],
    [[1, 2, 3, 4], 2, 2, [1, 2, 3, 4]],
  ])(
    "should swap the elements in the specified ids",
    (entry, id1, id2, expected) => {
      expect(swap(entry, id1, id2)).toStrictEqual(expected);
    }
  );

  it.each([
    [[1, 2, 3, 4], 2, 1, [1, 3, 2, 4]],
    [[1, 2, 3, 4], undefined, 1, [1, 2, 3, 4]],
    [[1, 2, 3, 4], 2, undefined, [1, 2, 3, 4]],
    [[1, 2, 3, 4], 2, 3, [1, 2, 4, 3]],
    [[1, 2, 3, 4], 1, 3, [1, 3, 4, 2]],
    [[1, 2, 3, 4], 2, 0, [3, 1, 2, 4]],
    [[1, 2, 3, 4], -1, 3, [1, 2, 3, 4]],
    [[1, 2, 3, 4], 2, 4, [1, 2, 3, 4]],
    [[1, 2, 3, 4], 2, 2, [1, 2, 3, 4]],
  ])(
    "should swap the elements in the specified ids",
    (entry, id1, id2, expected) => {
      expect(moveTo(entry, id1, id2)).toStrictEqual(expected);
    }
  );

  it.each([
    [0, 10, undefined, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    [0, 10, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    [0, 10, 2, [0, 2, 4, 6, 8, 10]],
  ])(
    "should return an array of numbers from start to end",
    (start, end, step, expected) => {
      const result = [];

      for (const i of range(start, end, step)) {
        result.push(i);
      }

      expect(result).toStrictEqual(expected);
    }
  );

  it.each([
    [0, 10, undefined, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    [0, 10, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    [0, 10, 2, [0, 2, 4, 6, 8, 10]],
  ])(
    "should return an array of numbers from start to end",
    (start, end, step, expected) => {
      expect(list(start, end, step)).toStrictEqual(expected);
    }
  );

  it.each([
    [0, 10, undefined, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    [0, 10, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    [0, 10, 2, [0, 2, 4, 6, 8, 10]],
  ])(
    "should return an array of numbers from start to end reversed",
    (start, end, step, expected) => {
      expect(reversedList(start, end, step)).toStrictEqual(expected.reverse());
    }
  );

  it.each([
    [[1, 2, 3], 1, [[1], [2], [3]]], //
    [[1, 2, 3], 2, [[1, 2], [3]]],
    [[1, 2, 3], 3, [[1, 2, 3]]],
    [[1, 2, 3], 4, [[1, 2, 3]]],
  ])("should chunk array %s in size %s as %o", (array, size, expected) => {
    const actual = inChunks(array, size);
    expect(actual).toEqual(expected);
  });

  it.each([
    [[1, 2, 3, null, undefined], undefined, [1, 2, 3]],
    [[], undefined, []],
    [undefined, undefined, []],
    [[1, 2, 3, null, undefined], (i: number | null | undefined) => !!i && i > 2, [3]],
  ])("should filter nullable items from array or filter by a given condition", (array, condition, expected) => {
    const actual = sift(array as any, condition);
    expect(actual).toEqual(expected);
  });

  it.each([
    [[1, 2, 3, null, undefined], (i: number | null | undefined) => i ? i**2 : 0, (i: number | null | undefined) => !!i, [1, 4, 9]],
    [[], (i: number | null | undefined) => i ? i**2 : 0, (i: number | null | undefined) => !!i, []],
    [undefined, (i: number | null | undefined) => i ? i**2 : 0, (i: number | null | undefined) => !!i, []],
  ])("should select", (array, mapper, condition, expected) => {
    const actual = select(array as any, mapper, condition);
    expect(actual).toEqual(expected);
  });

  it.each([
    [[1, 2, 3], (a: any, b: any) => a > b ? a : b, 3],
    [[], (a: any, b: any) => a > b ? a : b, null],
    [undefined, (a: any, b: any) => a > b ? a : b, null],
    [null, (a: any, b: any) => a > b ? a : b, null],
  ])("should boil", (array, compare, expected) => {
    const actual = boil(array as any, compare);
    expect(actual).toEqual(expected);
  });

  it.each([
    [[{ a: 1 }, { a: 2 }, { a: 3 }], (a: any) => a["a"], 6],
    [[1, 2, 3], undefined, 6],
    [[], undefined, 0],
    [undefined, undefined, 0],
    [null, undefined, 0],
  ])("should sum", (array, compare, expected) => {
    const actual = sum(array as any, compare);
    expect(actual).toEqual(expected);
  });

  it.each([
    [[{ a: 1 }, { a: 2 }, { a: 3 }], (a: any) => a["a"], { a: 3}],
    [[1, 2, 3], undefined, 3],
    [[1, 3, 2], undefined, 3],
    [[], undefined, null],
    [undefined, undefined, null],
    [null, undefined, null],
  ])("should max", (array, compare, expected) => {
    const actual = max(array as any, compare);
    expect(actual).toEqual(expected);
  });

  it.each([
    [[{ a: 1 }, { a: 2 }, { a: 3 }], (a: any) => a["a"], { a: 1}],
    [[1, 2, 3], undefined, 1],
    [[2, -1, 3], undefined, -1],
    [[], undefined, null],
    [undefined, undefined, null],
    [null, undefined, null],
  ])("should min", (array, compare, expected) => {
    const actual = min(array as any, compare);
    expect(actual).toEqual(expected);
  });

  it.each([
    [[1, 2, 3, 4, 5, 6, 7], undefined, [[1, 2], [3, 4], [5, 6], [7]]],
    [[1, 2, 3, 4, 5, 6, 7], 3, [[1, 2, 3], [4, 5, 6], [7]]],
  ])("should cluster", (array, compare, expected) => {
    const actual = cluster(array, compare);
    expect(actual).toEqual(expected);
  });

  it.each([
    [[1, 2, 2, 3, 4, 4, 5, 6, 7], undefined, [1, 2, 3, 4, 5, 6, 7]],
    [[{ a: 1 }, { a: 2 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }], (a: any) => a["a"], [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }]],
  ])("should unique", (array, identity, expected) => {
    const actual = unique(array, identity);
    expect(actual).toEqual(expected);
  });

  it.each([
    [[{ a: 1 }, { a: 2 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }], undefined, [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }]],
  ])("should unique", (array, identity, expected) => {
    const actual = () => { unique(array, identity) };
    expect(actual).toThrow();
  });

  it.each([
    [[1, 2, 3, 4, 5, 6, 7], undefined, 1],
    [[1], undefined, 1],
    [[], undefined, undefined],
    [[], 1, 1],
    [[{ a: 1 }], undefined, { a: 1 }],
  ])("should first", (array, def, expected) => {
    const actual = first(array as any, def);
    expect(actual).toEqual(expected);
  });

  it.each([
    [[1, 2, 3, 4, 5, 6, 7], undefined, 7],
    [[], undefined, undefined],
    [[], 1, 1],
    [[{ a: 1 }, { a: 2 }], undefined, { a: 2 }],
  ])("should last", (array, def, expected) => {
    const actual = last(array as any, def);
    expect(actual).toEqual(expected);
  });

  it.each([
    [[{ a: "ok" }, { a: "error"}, { a: "ok", b: "whatever" }, { a: "error", b: "whatever"}], (a: any) => a["a"], { ok: [{ a: "ok" }, { a: "ok", b: "whatever" }], error: [{ a: "error" }, { a: "error", b: "whatever" }] }],
  ])("should group", (array, identity, expected) => {
    const actual = group(array as any, identity);
    expect(actual).toEqual(expected);
  });

  it.each([
    [[{ a: "ok" }, { a: "error"}, { a: "ok", b: "whatever" }, { a: "error", b: "whatever"}], (a: any) => a["a"], { ok: 2, error: 2 }],
    [undefined, (a: any) => a["a"], {}],
  ])("should counting", (array, identity, expected) => {
    const actual = counting(array as any, identity);
    expect(actual).toEqual(expected);
  });

  it.each([
    [[{ a: "ok" }, { a: "error"}, { a: "ok", b: "whatever" }, { a: "error", b: "whatever"}], (a: any) => a["a"] === "ok", [[{ a: "ok" }, { a: "ok", b: "whatever" }], [{ a: "error" }, { a: "error", b: "whatever" }]]],
    [undefined, (a: any) => a["a"] === "ok", [[], []]],
  ])("should fork", (array, identity, expected) => {
    const actual = fork(array as any, identity);
    expect(actual).toEqual(expected);
  });
});
