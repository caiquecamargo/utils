import { describe, expect, it } from "vitest";
import {
  inChunks,
  list,
  moveTo,
  range,
  reversedList,
  sortByTarget,
  swap,
} from "./array";

describe("array", () => {
  it.each([
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
});
