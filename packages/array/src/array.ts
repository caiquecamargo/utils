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
  if (!target || !target.length) return unordered;

  return target.reduce((acc, curr) => {
    const found = unordered.filter((item) => {
      if (is<Record<PropertyKey, unknown>>(item) && prop) {
        return (
          getProp(item, prop as RecursiveAccessKeyOf<typeof item>, "") === curr
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

export const inChunks = <T>(array: T[], size: number): T[][] => {
  return array.reduce((all, one, i) => {
    const ch = Math.floor(i / size);
    all[ch] = [...(all[ch] || []), one];

    return all;
  }, [] as T[][]);
};

export const sift = <T>(
  list: readonly T[],
  condition?: (item: T) => boolean
): NonNullable<T>[] => {
  return (
    (list?.filter((x) =>
      condition ? condition(x) : !!x
    ) as NonNullable<T>[]) ?? []
  );
};

/**
 * Select performs a filter and a mapper inside of a reduce,
 * only iterating the list one time.
 *
 * @example
 * select([1, 2, 3, 4], x => x*x, x > 2) == [9, 16]
 */
export const select = <T, K>(
  array: readonly T[],
  mapper: (item: T, index: number) => K,
  condition: (item: T, index: number) => boolean
) => {
  if (!array) return []
  return array.reduce((acc, item, index) => {
    if (!condition(item, index)) return acc
    acc.push(mapper(item, index))
    return acc
  }, [] as K[])
}

/**
 * Go through a list of items, starting with the first item,
 * and comparing with the second. Keep the one you want then
 * compare that to the next item in the list with the same
 *
 * Ex. const greatest = () => boil(numbers, (a, b) => a > b)
 */
export const boil = <T>(
  array: readonly T[],
  compareFunc: (a: T, b: T) => T
) => {
  if (!array || (array.length ?? 0) === 0) return null
  return array.reduce(compareFunc)
}

/**
 * Sum all numbers in an array. Optionally provide a function
 * to convert objects in the array to number values.
 */
export const sum = <T extends number | object>(
  array: readonly T[],
  fn?: (item: T) => number
) => {
  return (array || []).reduce(
    (acc, item) => acc + (fn ? fn(item) : (item as number)),
    0
  )
}

/**
 * Max gets the greatest value from a list
 *
 * Ex. max([{ num: 1 }, { num: 2 }], x => x.num) == 2
 */
export const max = <T extends number | object>(
  array: readonly T[],
  getter?: (item: T) => number
) => {
  const get = getter ? getter : (v: any) => v
  return boil(array, (a, b) => (get(a) > get(b) ? a : b))
}

/**
 * Min gets the smallest value from a list
 *
 * Ex. max([{ num: 1 }, { num: 2 }], x => x.num) == 1
 */
export const min = <T extends number | object>(
  array: readonly T[],
  getter?: (item: T) => number
) => {
  const get = getter ? getter : (v: any) => v
  return boil(array, (a, b) => (get(a) < get(b) ? a : b))
}

/**
 * Splits a single list into many lists of the desired size. If
 * given a list of 10 items and a size of 2, it will return 5
 * lists with 2 items each
 */
export const cluster = <T>(list: readonly T[], size: number = 2): T[][] => {
  const clusterCount = Math.ceil(list.length / size)
  return new Array(clusterCount).fill(null).map((_c: null, i: number) => {
    return list.slice(i * size, i * size + size)
  })
}

/**
 * Given a list of items returns a new list with only
 * unique items. Accepts an optional identity function
 * to convert each item in the list to a comparable identity
 * value
 */
export const unique = <T, K extends string | number | symbol>(
  array: readonly T[],
  toKey?: (item: T) => K
): T[] => {
  const valueMap = array.reduce((acc, item) => {
    const key = toKey ? toKey(item) : (item as any as string | number | symbol)
    if (acc[key]) return acc
    acc[key] = item
    return acc
  }, {} as Record<string | number | symbol, T>)
  return Object.values(valueMap)
}

/**
 * Get the first item in an array or a default value
 */
export const first = <T>(
  array: readonly T[],
  defaultValue: T | null | undefined = undefined
) => {
  return array?.length > 0 ? array[0] : defaultValue
}

/**
 * Get the last item in an array or a default value
 */
export const last = <T>(
  array: readonly T[],
  defaultValue: T | null | undefined = undefined
) => {
  return array?.length > 0 ? array[array.length - 1] : defaultValue
}

/**
 * Sorts an array of items into groups. The return value is a map where the keys are
 * the group ids the given getGroupId function produced and the value is an array of
 * each item in that group.
 */
export const group = <T, Key extends string | number | symbol>(
  array: readonly T[],
  getGroupId: (item: T) => Key
): Partial<Record<Key, T[]>> => {
  return array.reduce((acc, item) => {
    const groupId = getGroupId(item)
    if (!acc[groupId]) acc[groupId] = []
    acc[groupId].push(item)
    return acc
  }, {} as Record<Key, T[]>)
}

export const counting = <T, TId extends string | number | symbol>(
  list: readonly T[],
  identity: (item: T) => TId
): Record<TId, number> => {
  if (!list) return {} as Record<TId, number>
  return list.reduce((acc, item) => {
    const id = identity(item)
    acc[id] = (acc[id] ?? 0) + 1
    return acc
  }, {} as Record<TId, number>)
}

/**
 * Split an array into two array based on
 * a true/false condition function
 */
export const fork = <T>(
  list: readonly T[],
  condition: (item: T) => boolean
): [T[], T[]] => {
  if (!list) return [[], []]
  return list.reduce(
    (acc, item) => {
      const [a, b] = acc
      if (condition(item)) {
        return [[...a, item], b]
      } else {
        return [a, [...b, item]]
      }
    },
    [[], []] as [T[], T[]]
  )
}
