import { is } from "typia";
import { isDate, isNil } from "./existence";
import { Maybe, RecursiveAccessKeyOf } from "./types";

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
  defaultValue: Maybe<K>
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

  return obj[prop] as unknown as Maybe<K>;
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
  if (is<number>(a) && is<number>(b)) {
    return a.toString() === b.toString();
  }

  if (isDate(a) && isDate(b)) {
    const dateA = new Date(a).toISOString().split("T")[0];
    const dateB = new Date(b).toISOString().split("T")[0];

    return dateA === dateB;
  }

  if (is<string>(a) && is<string>(b)) {
    return a.toLowerCase() === b.toLowerCase();
  }

  if (is<boolean>(a) && is<boolean>(b)) {
    return a.valueOf() === b.valueOf();
  }

  if (is<object>(a) && is<object>(b)) {
    const aObject = typeof a === "object" ? JSON.stringify(a) : a;
    const bObject = typeof b === "object" ? JSON.stringify(b) : b;

    return aObject === bObject;
  }

  return false;
};
