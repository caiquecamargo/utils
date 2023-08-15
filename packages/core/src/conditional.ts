import { isFunction } from "./existence";

/**
 * A -> B
 * 
 * | A | B | A → B |
 * |---|---|-------|
 * | V | V |   V   |
 * | V | F |   F   |
 * | F | V |   V   |
 * | F | F |   V   |
 * 
 * @param a 
 * @param b 
 * @returns a -> b
 */
export const implies = (a: unknown, b: unknown): boolean => !a || !!b;

/**
 * A <-> B
 * 
 * | A | B | A ↔ B |
 * |---|---|-------|
 * | V | V |   V   |
 * | V | F |   F   |
 * | F | V |   F   |
 * | F | F |   V   |
 * 
 * @param a 
 * @param b 
 * @returns a <-> b
 */
export const biConditional = (a: unknown, b: unknown): boolean => a === b;

/**
 * ¬A
 * 
 * | A | ¬A |
 * |---|----|
 * | V |  F |
 * | F |  V |
 * 
 * @param a 
 * @returns ¬a
 */
export const negate = (a: unknown): boolean => !a;

/**
 * A ∧ B
 * 
 * | A | B | A ∧ B |
 * |---|---|-------|
 * | V | V |   V   |
 * | V | F |   F   |
 * | F | V |   F   |
 * | F | F |   F   |
 * 
 * @param a 
 * @param b 
 * @returns a ∧ b
 */
export const conjunction = (a: unknown, b: unknown): boolean => !!a && !!b;

/**
 * A ∨ B
 * 
 * | A | B | A ∨ B |
 * |---|---|-------|
 * | V | V |   V   |
 * | V | F |   V   |
 * | F | V |   V   |
 * | F | F |   F   |
 * 
 * @param a 
 * @param b 
 * @returns a ∨ b
 */
export const disjunction = (a: unknown, b: unknown): boolean => !!a || !!b;

/**
 * A ⊕ B
 * 
 * | A | B | A ⊕ B |
 * |---|---|-------|
 * | V | V |   F   |
 * | V | F |   V   |
 * | F | V |   V   |
 * | F | F |   F   |
 * 
 * @param a 
 * @param b 
 * @returns a ⊕ b
 */
export const exclusiveConjunction = (a: unknown, b: unknown): boolean =>
  a !== b;

/**
 * A ⊻ B
 * 
 * | A | B | A ⊻ B |
 * |---|---|-------|
 * | V | V |   F   |
 * | V | F |   V   |
 * | F | V |   V   |
 * | F | F |   F   |
 * 
 * @param a 
 * @param b 
 * @returns a ⊻ b
 */
export const exclusiveDisjunction = (a: unknown, b: unknown): boolean =>
  a !== b;

/**
 * A ^ (A v B)
 * 
 * | A | B | A ^ (A v B) |
 * |---|---|-------|
 * | V | V |   V   |
 * | V | F |   V   |
 * | F | V |   F   |
 * | F | F |   F   |
 * 
 * @param a 
 * @param b 
 * @returns a ^ (a v b)
 */
export const firstOrBoth = (a: unknown, _b: unknown): boolean =>
  !!a;

export const onlyIf = <T>(condition: boolean, value: T | (() => T)): T | undefined => {
  if (condition && isFunction(value)) return value();
  if (condition && !isFunction(value)) return value;

  return;
};
