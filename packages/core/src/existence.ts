import { is } from "typia";

export const isNil = (object: unknown): object is undefined | null => {
  return object === null || object === undefined;
};

export const isNotNil = (object: unknown) => {
  return !isNil(object);
};

export const isString = (object: unknown): object is string => {
  return is<string>(object);
};

export const isStringNullOrEmpty = (
  object?: unknown
): object is null | undefined | "" => {
  return isNil(object) || (is<string>(object) && object.length === 0);
};

export const isObjectNullOrEmpty = (
  object?: unknown
): object is null | undefined => {
  return (
    isNil(object) ||
    (!isArray(object) && is<object>(object) && Object.keys(object).length === 0)
  );
};

export const isObject = (object: unknown): object is object => {
  return is<object>(object) && !isArray(object) && !isDate(object) && !isFunction(object);
};

export const isArray = (object: unknown): object is Array<unknown> => {
  return is<Array<unknown>>(object);
};

export const isArrayNullOrEmpty = (
  array?: unknown
): array is null | undefined | [] => {
  return isNil(array) || (isArray(array) && array.length === 0);
};

export const isFunction = (object: unknown): object is Function => {
  return typeof object === "function";
}

export const isNumber = (object: unknown): object is number => {
  return is<number>(object);
}

export const isInt = (value: unknown): value is number => {
  return is<number>(value) && value % 1 === 0;
};

export const isFloat = (value: unknown): value is number => {
  return is<number>(value) && value % 1 !== 0 && !isNaN(value % 1);
};

export const isDate = (object: unknown): object is Date => {
  return is<Date>(object) && !isNaN(object.getTime());
};

export const isBoolean = (object: unknown): object is boolean => {
  return is<boolean>(object);
}
