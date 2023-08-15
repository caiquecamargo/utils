import {
  isArray,
  isArrayNullOrEmpty,
  isNotNil,
  isObjectNullOrEmpty,
  isStringNullOrEmpty,
  isNil,
  isDate,
  isNumber,
  isString,
  isObject,
  isBoolean,
  isFunction,
} from "./existence";
import {
  DeepOmit,
  ObjectLike,
  RecursiveAccessKeyOf,
  Maybe
} from "./types";

export const makeObjectWithoutPrototype = (): {} => Object.create(null);

export const emptyless = <T>(object?: T): T | undefined => {
  if (isNumber(object)) return object;
  if (isBoolean(object)) return object;
  if (isFunction(object)) return object;
  if (isNil(object)) return undefined;

  if (isString(object)) {
    return isStringNullOrEmpty(object) ? undefined : object;
  }

  if (isArray(object)) {
    return isArrayNullOrEmpty(object) ? undefined : object;
  }

  if (isDate(object)) {
    return object.getTime() === 0 ? undefined : object;
  }

  if (isObject(object)) {
    if (isObjectNullOrEmpty(object)) return undefined;

    const _object = undefinedless(
      Object.keys(object).reduce((acc, key) => {
        const _key = key as keyof T;
        const reduced = emptyless(object[_key]);
        acc[_key] = isObjectNullOrEmpty(reduced) ? undefined : reduced;

        return acc;
      }, {} as ObjectLike)
    );

    return isObjectNullOrEmpty(_object) ? undefined : (_object as T);
  }
};

export const omit = <
  T extends Record<PropertyKey, unknown>,
  TKeys extends RecursiveAccessKeyOf<T>
>(
  object: T,
  keys: TKeys[]
): DeepOmit<T, TKeys> => {
  return Object.keys(object).reduce((acc, key) => {
    const _key = key as TKeys;

    if (keys.includes(_key)) return acc;
    else acc[_key] = object[_key];

    if (keys.some((k) => k.startsWith(`${key}.`))) {
      const _keys = keys.filter((k: any) => k.startsWith(key));

      acc[_key] = omit(
        object[_key] as Record<PropertyKey, unknown>,
        _keys.map((k) => k.replace(`${key}.`, ""))
      ) as T[TKeys];

      return acc;
    }

    return acc;
  }, {} as T) as DeepOmit<T, TKeys>;
};

export const tryOmit = <T extends Record<PropertyKey, unknown>>(
  object: T,
  keys: string[]
): T => {
  return omit(object, keys as RecursiveAccessKeyOf<T>[]) as unknown as T;
};

/**
 * Pick a list of properties from an object
 * into a new object
 */
export const pick = <
  T extends ObjectLike,
  TKeys extends RecursiveAccessKeyOf<T>
>(
  object: T,
  keys: TKeys[]
): Pick<T, TKeys> => {
  return Object.keys(object).reduce((acc, key) => {
    const _key = key as TKeys;

    if (keys.includes(_key)) {
      const maybeEmpty = emptyless(object[_key]);
      acc[_key] = isObjectNullOrEmpty(maybeEmpty)
        ? ({} as T[TKeys])
        : maybeEmpty;

      return undefinedless(acc);
    }

    if (keys.some((k) => k.startsWith(`${key}.`))) {
      const _keys = keys.filter((k: any) => k.startsWith(key));

      acc[_key] = {} as T[TKeys];

      const maybeEmpty = emptyless(
        pick(
          object[_key] as Record<PropertyKey, unknown>,
          _keys.map((k) => k.replace(`${key}.`, ""))
        ) as T[TKeys]
      );

      acc[_key] = maybeEmpty as T[TKeys];

      return undefinedless(acc);
    }

    return undefinedless(acc);
  }, {} as T);
};

export const tryPick = <T extends Record<PropertyKey, unknown>>(
  object: T,
  keys: string[]
): T => {
  return pick(object, keys as RecursiveAccessKeyOf<T>[]) as unknown as T;
};

export const undefinedless = <T extends ObjectLike | ArrayLike<unknown> | null | undefined>(
  obj: T
): T => {
  if (isNil(obj)) {
    return obj;
  }

  if (isArray(obj)) {
    return obj.filter(isNotNil) as unknown as T;
  }

  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => {
        const recursive = isObject(v);
        return [k, recursive ? undefinedless(v as ObjectLike) : v];
      })
      .filter(([, v]) => isNotNil(v))
  );
};

export const concatenate = <T1 extends ObjectLike, T2 extends ObjectLike>(
  a: T1,
  b: T2
): T1 & T2 => {
  if (isObjectNullOrEmpty(a) && isObjectNullOrEmpty(b)) return {} as T1 & T2;
  if (isObjectNullOrEmpty(b)) return a as T1 & T2;
  if (isObjectNullOrEmpty(a)) return b as T1 & T2;

  Object.keys(b).forEach((key) => {
    const _key = key as keyof T2;
    if (isObjectNullOrEmpty(b[key])) return;

    const bKey = b[_key];
    const aKey = a[_key];

    if (isObject(bKey) && isObject(aKey)) {
      a[_key] = { ...aKey, ...undefinedless(bKey as ObjectLike) };
      return;
    }

    a[_key] = b[_key] as T1[keyof T1] & T2[keyof T2];
  });

  return a as T1 & T2;
};

/**
 *
 * Devolve a propriedade de um objeto, se existir
 * Aceita propriedades aninhadas do tipo 'prop1.prop2.prop3'
 *
 * @param obj
 * @param prop
 *
 * @example
 * const obj = {
 *  prop1: {
 *    prop2: {
 *      prop3: 'value'
 *    }
 *  }
 * }
 *
 * getProp(obj, 'prop1.prop2.prop3') // 'value'
 */
export const getProp = <T extends Record<PropertyKey, unknown>, K = unknown>(
  obj: T | undefined,
  prop: RecursiveAccessKeyOf<T>,
  defaultValue?: K
): Maybe<K> => {
  if (isNil(obj) || isNil(prop)) return defaultValue;

  if (prop.includes(".")) {
    const [first, ...rest] = prop.split(".");

    return getProp(
      obj[first] as T,
      rest.join(".") as RecursiveAccessKeyOf<T>,
      defaultValue
    );
  }

  return (obj[prop] ?? defaultValue) as unknown as K;
};

export const setProp = <T extends Record<PropertyKey, unknown>, K = unknown>(
  obj: T | undefined,
  prop: RecursiveAccessKeyOf<T>,
  value: Maybe<K>
): void => {
  if (isNil(obj) || isNil(prop)) return;

  if (prop.includes(".")) {
    const [first, ...rest] = prop.split(".");

    return setProp(
      obj[first] as T,
      rest.join(".") as RecursiveAccessKeyOf<T>,
      value
    );
  }

  obj[prop] = value as any;
};

export const compareAsString = <T, K>(a: T, b: K) => {
  if (isNumber(a) && isNumber(b)) {
    return a.toString() === b.toString();
  }

  if (isDate(a) && isDate(b)) {
    const dateA = new Date(a).toISOString().split("T")[0];
    const dateB = new Date(b).toISOString().split("T")[0];

    return dateA === dateB;
  }

  if (isString(a) && isString(b)) {
    return a.toLowerCase() === b.toLowerCase();
  }

  if (isBoolean(a) && isBoolean(b)) {
    return a.valueOf() === b.valueOf();
  }

  if (isArray(a) && isArray(b)) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  if (isObject(a) && isObject(b)) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  return false;
};

