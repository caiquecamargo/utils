import { RecursiveAccessKeyOf } from "./types";
import { describe, expect, it } from "vitest";
import { compareAsString, concatenate, emptyless, getProp, makeObjectWithoutPrototype, omit, pick, setProp, tryOmit, tryPick, undefinedless } from "./object";

const fn = () => ({});

describe("object", () => {
  it("should return a clean object", () => {
    expect(makeObjectWithoutPrototype()).toEqual({});
    expect(Object.getPrototypeOf(makeObjectWithoutPrototype())).toBe(null);
  });

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
    [{ a: 1, b: { c: {} } }, ["b.c"], {}],
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
    [{ b: { c: "" } }, undefined],
    [
      { a: 1, b: { c: 2, d: {} } },
      { a: 1, b: { c: 2 } },
    ],
    [
      { a: 1, b: { c: 2, d: {} }, e: true },
      { a: 1, b: { c: 2 }, e: true },
    ],
    [
      { a: 1, b: { c: 2, d: {} }, e: false },
      { a: 1, b: { c: 2 }, e: false },
    ],
    [new Date(0), undefined],
    [new Date(10), new Date(10)],
    [fn, fn],
    [{}, undefined],
    [undefined, undefined],
    ["", undefined],
    ["a", "a"],
    [0, 0],
    [[], undefined],
    [[1], [1]],
  ])(`should return am emptyless object`, (obj, expected) => {
    expect(emptyless(obj)).toEqual(expected);
  });

  it.each([
    [
      { a: 1, b: { c: 2, d: undefined } },
      { a: 1, b: { c: 2 } },
    ],
    [
      { a: 1, b: { a: undefined, c: 2, d: undefined } },
      { a: 1, b: { c: 2 } },
    ],
    [{ b: { c: {} } }, { b: { c: {} } }],
    [
      { a: 1, b: { c: 2, d: {} } },
      { a: 1, b: { c: 2, d: {} } },
    ],
    [
      { a: 1, b: { c: 2, d: {} }, e: true },
      { a: 1, b: { c: 2, d: {} }, e: true },
    ],
    [null, null],
    [
      { a: 1, b: { c: 2, d: null } },
      { a: 1, b: { c: 2 } },
    ],
    [
      { a: 1, b: { a: null, c: 2, d: null } },
      { a: 1, b: { c: 2 } },
    ],
    [{}, {}],
    [[], []],
    [[1, 2], [1, 2]],
    [[null, 1, 2], [1, 2]],
    [[null, 1, 2, null], [1, 2]],
    [[null, 1, null, 2, null], [1, 2]],
    [[1, null, 2, null], [1, 2]],
    [[null, 1, null, 2], [1, 2]],
    [[1, null, 2], [1, 2]],
    [null, null],
    [[null, 1, 2], [1, 2]],
    [[null, 1, 2, null], [1, 2]],
    [[null, 1, null, 2, null], [1, 2]],
    [[1, null, 2, null], [1, 2]],
    [[null, 1, null, 2], [1, 2]],
    [[1, null, 2], [1, 2]],
  ])(`should return am emptyless object`, (obj, expected) => {
    expect(undefinedless(obj)).toEqual(expected);
  });

  it.each([
    [{ a: 1, b: { c: 2 } }, "a", undefined, 1],
    [{ a: 1, b: { c: 2 } }, "b.c", undefined, 2],
    [{ a: 1, b: { c: 2 } }, "b.d", undefined, undefined],
    [{ a: 1, b: { c: 2 } }, "b.d", "default", "default"],
    [{ a: 1, b: { c: 2 } }, "b", undefined, { c: 2 }],
    [undefined, "b", undefined, undefined],
  ])(
    "should return the value of a prop or undefined",
    (obj, prop, def, expected) => {
      expect(getProp(obj, prop as keyof typeof obj, def)).toEqual(expected);
    }
  );

  it.each([
    [{ a: 1, b: { c: 2 } }, "a", 2, { a: 2, b: { c: 2 } }],
    [{ a: 1, b: { c: 2 } }, "b.c", 3, { a: 1, b: { c: 3 } }],
    [{ a: 1, b: { c: 2 } }, "b.d", undefined, { a: 1, b: { c: 2 } }],
    [{ a: 1, b: { c: 2 } }, "b.d", "new value", { a: 1, b: { c: 2, d: "new value" } }],
    [{ a: 1, b: { c: 2 } }, "b", { e: 5 }, { a: 1, b: { e: 5 } }],
    [{ a: 1, b: { c: 2 } }, undefined, { e: 5 }, { a: 1, b: { c: 2 } }],
    [undefined, "b", { e: 5 }, undefined],
  ])(
    "should set the value of a prop",
    (obj, prop, value, expected) => {
      setProp(obj, prop as keyof typeof obj, value)
      expect(obj).toEqual(expected);
    }
  );

  it.each([
    [undefined, undefined, {}],
    [{}, undefined, {}],
    [{}, {}, {}],
    [{ a: {} }, {}, { a: {} }],
    [{ a: "bla" }, {}, { a: "bla" }],
    [{}, { a: "bla" }, { a: "bla" }],
    [undefined, {}, {}],
    [{ a: 1, b: 3 }, { a: 1, b: 3 }, { a: 1, b: 3 }],
    [{ a: 1, b: { c: 1 } }, { a: 1, b: 3 }, { a: 1, b: 3 }],
    [{ a: 1, b: { c: 1, } }, { a: 1, b: { d: 3, e: {}, f: null } }, { a: 1, b: { c: 1, d: 3, e: {} }}],
    [{ a: 1, b: { c: 1 }, d: 4 }, { a: 1, b: 3 }, { a: 1, b: 3, d: 4 }],
    [{ a: 1, b: { c: 1 }, d: 4, e: undefined }, { a: 1, b: 3 }, { a: 1, b: 3, d: 4 }],
    [{ a: 1, b: { c: 1 }, d: 4, e: null }, { a: 1, b: 3 }, { a: 1, b: 3, d: 4, e: null }],
  ])("shoud concatenate two objects", (obj1, obj2, expected) => {
    expect(concatenate(obj1 as any, obj2 as any)).toEqual(expected);
  });

  it.each([
    [undefined, undefined, false],
    [1, undefined, false],
    [1, 2, false],
    [2, 2, true],
    ["", "", true],
    ["a", "", false],
    ["a", "a", true],
    ["a", "a", true],
    [{}, {}, true],
    [{ a: 1 }, { a: 2 }, false],
    [{ a: 1 }, { b: 1 }, false],
    [{ a: 1 }, { a: 1 }, true],
    [[], [], true],
    [[1], [2], false],
    [[1], [1], true],
    [new Date(), new Date(), true],
    [new Date(1000), new Date(), false],
    [true, true, true],
    [false, false, true],
    [false, true, false],
  ])("should compare as string", (obj1, obj2, expected) => {
    expect(compareAsString(obj1, obj2)).toEqual(expected);
  })
});
