import {
  biConditional,
  conjunction,
  disjunction,
  exclusiveDisjunction,
  implies,
  negate,
} from "./conditional";

const baseTest = [
  [true, true],
  [false, false],
  [true, false],
  [false, true],
];

const makeBaseTestEntry = (...trueIndexes: number[]) => {
  return baseTest.map((value, index) => [
    ...value,
    trueIndexes.includes(index),
  ]);
};

describe("Conditional", () => {
  it.each(makeBaseTestEntry(0, 1, 3))(
    "should return true if implies(%p, %p)",
    (a, b, expected) => {
      expect(implies(a, b)).toEqual(expected);
    }
  );

  it.each(makeBaseTestEntry(0, 1))(
    "should return true if biConditional(%p, %p)",
    (a, b, expected) => {
      expect(biConditional(a, b)).toEqual(expected);
    }
  );

  it.each(makeBaseTestEntry(0, 1, 2, 3))(
    "should return true if negate(%p, %p)",
    (a, b, expected) => {
      expect(negate(a)).toEqual(!a);
      expect(negate(b)).toEqual(!b);
      expect(negate(expected)).toEqual(!expected);
    }
  );

  it.each(makeBaseTestEntry(0))(
    "should return true if conjunction(%p, %p)",
    (a, b, expected) => {
      expect(conjunction(a, b)).toEqual(expected);
    }
  );

  it.each(makeBaseTestEntry(0, 2, 3))(
    "should return true if disjunction(%p, %p)",
    (a, b, expected) => {
      expect(disjunction(a, b)).toEqual(expected);
    }
  );

  it.each(makeBaseTestEntry(2, 3))(
    "should return true if exclusiveDisjunction(%p, %p)",
    (a, b, expected) => {
      expect(exclusiveDisjunction(a, b)).toEqual(expected);
    }
  );
});
