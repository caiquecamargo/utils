import {
  DeepOmit,
  ObjectLike,
  RecursiveAccessKeyOf,
  isArray,
  isArrayNullOrEmpty,
  isDate,
  isNil,
  isNotNil,
  isObjectNullOrEmpty,
  isStringNullOrEmpty,
} from "@caiquecamargo/helpers";
import { is } from "typia";

export const makeObjectWithoutPrototype = () => Object.create(null);

export const emptyless = <T>(object?: T): T | undefined => {
  if (is<number>(object)) return object;
  if (is<boolean>(object)) return object;
  if (is<Function>(object)) return object;
  if (isNil(object)) return undefined;

  if (is<string>(object)) {
    return isStringNullOrEmpty(object) ? undefined : object;
  }

  if (isArray(object)) {
    return isArrayNullOrEmpty(object) ? undefined : object;
  }

  if (isDate(object)) {
    return object.getTime() === 0 ? undefined : object;
  }

  if (is<ObjectLike>(object)) {
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

  return object;
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

export const undefinedless = <T extends ObjectLike | ArrayLike<unknown>>(
  obj: T
): T => {
  if (isNil(obj)) {
    return obj;
  }

  if (isArray(obj)) {
    return obj.filter((e) => isNotNil(e)) as unknown as T;
  }

  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => {
        const recursive = is<ObjectLike<unknown>>(v);
        return [k, recursive ? undefinedless(v) : v];
      })
      .filter(([, v]) => isNotNil(v))
  );
};

export const concatenate = <T1 extends ObjectLike, T2 extends ObjectLike>(
  a: T1,
  b: T2
): T1 & T2 => {
  if (isObjectNullOrEmpty(b)) return a as T1 & T2;
  if (isObjectNullOrEmpty(a)) return b as T1 & T2;

  Object.keys(b).forEach((key) => {
    const _key = key as keyof T2;
    if (isObjectNullOrEmpty(b[key])) return;

    const bKey = b[_key];
    const aKey = a[_key];

    if (is<ObjectLike>(bKey) && is<ObjectLike>(aKey)) {
      a[_key] = { ...aKey, ...undefinedless(bKey) };
      return;
    }

    a[_key] = b[_key] as T1[keyof T1] & T2[keyof T2];
  });

  return a as T1 & T2;
};
