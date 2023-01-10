import { RecursiveAccessKeyOf } from "@caiquecamargo/helpers";
import { describe, expect, it } from "vitest";
import { emptyless, omit, pick, tryOmit, tryPick } from "./object";

describe("object", () => {
  it.each([
    [{ a: 1, b: { c: 2 } }, ["a"], { b: { c: 2 } }],
    [{ a: 1, b: { c: 2 } }, ["b.c"], { a: 1, b: {} }],
    [{ a: 1, b: { c: 2 } }, ["b.d"], { a: 1, b: { c: 2 } }],
    [{ a: 1, b: { c: 2 } }, ["b"], { a: 1 }],
    [{ a: 1, b: { c: 2 } }, ["b", "a"], {}],
    [{ a: 1, b: { c: 2 } }, ["b.c", "a"], { b: {} }],
    [{ a: 1, b: { c: 2 } }, ["b.c", "b"], { a: 1 }],
    [
      { a: { b: { c: { d: { e: 1, f: 1 } } } } },
      ["a.b.c.d.e"],
      { a: { b: { c: { d: { f: 1 } } } } },
    ],
  ])(`should omit the given keys`, (obj, keys, expected) => {
    expect(omit(obj, keys as RecursiveAccessKeyOf<typeof obj>[])).toEqual(
      expected
    );
    expect(tryOmit(obj, keys as RecursiveAccessKeyOf<typeof obj>[])).toEqual(
      expected
    );
  });

  it.each([
    [{}, [], {}],
    [{ a: 1 }, ["b"], {}],
    [{ a: 1 }, ["a"], { a: 1 }],
    [{ a: 1, b: 2 }, ["b"], { b: 2 }],
    [{ a: 1, b: 2 }, ["b", "a"], { b: 2, a: 1 }],
    [{ a: 1, b: { c: 2 } }, ["a"], { a: 1 }],
    [{ a: 1, b: { c: 2 } }, ["b.c"], { b: { c: 2 } }],
    [{ a: 1, b: { c: 2 } }, ["b.d"], {}],
    [{ a: 1, b: { c: 2 } }, ["b"], { b: { c: 2 } }],
    [{ a: 1, b: { c: 2 } }, ["b", "a"], { a: 1, b: { c: 2 } }],
    [{ a: 1, b: { c: 2 } }, ["b.c", "a"], { a: 1, b: { c: 2 } }],
    [{ a: 1, b: { c: 2, d: 3 } }, ["b.c", "b"], { b: { c: 2, d: 3 } }],
    [
      { a: { b: { c: { d: { e: 1, f: 1 } } } } },
      ["a.b.c.d.e"],
      { a: { b: { c: { d: { e: 1 } } } } },
    ],
  ])("should pick from %o props %o", (object: any, fields: any[], expected) => {
    expect(pick(object, fields)).toEqual(expected);
    expect(tryPick(object, fields)).toEqual(expected);
  });

  it.each([
    [
      { a: 1, b: { c: 2, d: undefined } },
      { a: 1, b: { c: 2 } },
    ],
    [{ b: { c: {} } }, undefined],
    [
      { a: 1, b: { c: 2, d: {} } },
      { a: 1, b: { c: 2 } },
    ],
    [{}, undefined],
    [undefined, undefined],
    ["", undefined],
    [0, 0],
    [[], undefined],
  ])(`should return am emptyless object`, (obj, expected) => {
    expect(emptyless(obj)).toEqual(expected);
  });
});
