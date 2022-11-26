export const isNil = (object: unknown) => {
  return object === null || object === undefined;
};

export const isNotNil = (object: unknown) => {
  return !isNil(object);
};

export const isString = (object: unknown): object is string => {
  return typeof object === "string";
};

export const isStringNullOrEmpty = (object?: unknown) => {
  return isNil(object) || (isString(object) && object.length === 0);
};

export const isObject = (object: unknown): object is object => {
  return !isNil(object) && typeof object === "object" && !isArray(object);
};

export const isObjectNullOrEmpty = (object?: unknown) => {
  return (
    isNil(object) || (isObject(object) && Object.keys(object).length === 0)
  );
};

export const isFunction = (object: unknown): object is Function => {
  return typeof object === "function";
};

export const isArray = <T>(object?: Array<T> | unknown): object is Array<T> => {
  return Array.isArray(object);
};

export const isArrayNullOrEmpty = (array?: unknown) => {
  return isNil(array) || (isArray(array) && array.length === 0);
};

export const isInt = (value: unknown): value is number => {
  return isNumber(value) && value % 1 === 0;
};

export const isFloat = (value: unknown): value is number => {
  return isNumber(value) && value % 1 !== 0 && !isNaN(value % 1);
};

export const isNumber = (object: unknown): object is number => {
  return typeof object === "number" && !isNaN(object);
};

export const isBoolean = (object: unknown): object is boolean => {
  return typeof object === "boolean";
};
