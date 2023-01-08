import { RecursiveAccessKeyOf, getProp, isNil } from "@caiquecamargo/helpers";
import { is } from "typia";

/**
 *
 * Ordena um array de objetos a partir de um array de referência
 * retirando os itens do array de origem que não se encontram
 * na referência
 *
 * @param unordered
 * @param target
 * @param prop
 *
 * @example
 * const unordered = [
 *  { id: 1, name: 'A' },
 *  { id: 2, name: 'D' },
 *  { id: 3, name: 'B' },
 *  { id: 4, name: 'C' },
 * ]
 *
 * const target = [1, 3, 4]
 *
 * sortByTarget(unordered, target, 'id') // [{ id: 1, name: 'A' }, { id: 3, name: 'B' }, { id: 4, name: 'C' }]
 */
export const sortByTarget = <
  T extends Record<PropertyKey, unknown> | string | number,
  K extends string | number
>(
  unordered: T[],
  target: K[],
  prop?: T extends Record<PropertyKey, unknown>
    ? RecursiveAccessKeyOf<T>
    : never
) => {
  return target.reduce((acc, curr) => {
    const found = unordered.filter((item) => {
      if (is<Record<PropertyKey, unknown>>(item) && prop) {
        return (
          getProp(item, prop as RecursiveAccessKeyOf<typeof item>) === curr
        );
      }

      if (is<string | number>(item)) return item === curr;

      return false;
    });

    if (found && found.length) {
      acc.push(...found);
    }

    return acc;
  }, [] as T[]);
};

/**
 *
 * Swap an item from one position to another
 *
 * @param arr
 * @param indexA
 * @param indexB
 */
export const swap = <T>(arr: T[], indexA?: number, indexB?: number) => {
  if (isNil(indexA) || isNil(indexB)) return arr;
  if (indexA >= arr.length || indexB >= arr.length) return arr;
  if (indexA < 0 || indexB < 0) return arr;
  if (indexA === indexB) return arr;
  const temp = arr[indexA];

  arr[indexA] = arr[indexB];
  arr[indexB] = temp;

  return arr;
};

/**
 *
 * Move one item from one position to another
 *
 * @param arr
 * @param indexA
 * @param indexB
 */
export const moveTo = <T>(arr: T[], indexA?: number, indexB?: number) => {
  if (isNil(indexA) || isNil(indexB)) return arr;
  if (indexA >= arr.length || indexB >= arr.length) return arr;
  if (indexA < 0 || indexB < 0) return arr;
  if (indexA === indexB) return arr;

  const temp = arr[indexA];
  arr.splice(indexA, 1);
  arr.splice(indexB, 0, temp);

  return arr;
};

/**
 *
 * create an iterator of numbers between a range
 *
 * @param start
 * @param end
 * @param step
 */
export function* range(start: number, end: number, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
    if (i + step > end) break;
  }
}

/**
 *
 * Create an array of numbers between a range
 *
 * @param start
 * @param end
 * @param step
 */
export const list = (start: number, end: number, step = 1) => {
  return Array.from(range(start, end, step));
};

/**
 *
 * Create an array of numbers between a range in reverse order
 *
 * @param start
 * @param end
 * @param step
 */
export const reversedList = (start: number, end: number, step = 1) => {
  return list(start, end, step).reverse();
};

export const addZeros = (num: number | string, size: number) => {
  if (!is<number | string>(num)) return num;

  let s = num.toString();
  while (s.length < size) s = "0" + s;

  return s;
};

export const inChunks = <T>(array: T[], size: number): T[][] => {
  return array.reduce((all, one, i) => {
    const ch = Math.floor(i / size);
    all[ch] = [...(all[ch] || []), one];

    return all;
  }, [] as T[][]);
};
