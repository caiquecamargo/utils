export type Func<TArgs = unknown, KReturn = unknown | void> = (
  ...args: TArgs[]
) => KReturn;

export const chain =
  <T, K>(...funcs: Func<T, K>[]) =>
  (...args: T[]) => {
    return funcs
      .slice(1)
      .reduce((acc, fn) => fn(acc as unknown as T), funcs[0](...args));
  };
