export const implies = (a: unknown, b: unknown): boolean => !a || !!b;
export const biConditional = (a: unknown, b: unknown): boolean => a === b;
export const negate = (a: unknown): boolean => !a;
export const conjunction = (a: unknown, b: unknown): boolean => !!a && !!b;
export const disjunction = (a: unknown, b: unknown): boolean => !!a || !!b;
export const exclusiveDisjunction = (a: unknown, b: unknown): boolean =>
  a !== b;

export const onlyIf = <T>(condition: boolean, value: T): T | undefined => {
  if (condition) return value;

  return;
};
