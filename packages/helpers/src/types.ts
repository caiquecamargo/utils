export type Maybe<T> = T | undefined;

export type ObjectLike<T = unknown> = Record<PropertyKey, T>;

export type Id<T> = {} & { [P in keyof T]: T[P] }; // Cosmetic use only makes the tooltips expad the type can be removed

export type OmitDistributive<T, K extends PropertyKey> = T extends any
  ? T extends object
    ? Id<OmitRecursively<T, K>>
    : T
  : never;

/**
 * Omits all props that maths the given keys
 */
export type OmitRecursively<T extends any, K extends PropertyKey> = Omit<
  { [P in keyof T]: OmitDistributive<T[P], K> },
  K
>;

export type OmitAccessRecursively<T extends object, K extends PropertyKey> = {
  [P in keyof T]: T[P] extends object ? OmitAccessRecursively<T[P], K> : T[P];
};

/**
 * Gets all keys of an object recursively
 * @example
 * type T = {
 *  a: string;
 *  b: {
 *    c: string;
 *  };
 *  d: string;
 * };
 *
 * type TKeys = RecursiveAccessKeyOf<T>; // "a" | "b" | "c" | "d"
 */
export type RecursiveKeyOf<T> = T extends object
  ? T extends readonly any[]
    ? RecursiveKeyOf<T[number]>
    : keyof T | RecursiveKeyOf<T[keyof T]>
  : never;

/**
 * Gets all access keys of an object recursively
 *
 * @example
 * type T = {
 *  a: string;
 *  b: {
 *    c: string;
 *  };
 *  d: string;
 * };
 *
 * type TKeys = RecursiveAccessKeyOf<T>; // "a" | "b.c" | "d"
 */
export type RecursiveAccessKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: TObj[TKey] extends any[]
    ? `${TKey}`
    : TObj[TKey] extends object
    ? `${TKey}` | `${TKey}.${RecursiveAccessKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & (string | number)];

export type OnlyRequired<T> = T extends object
  ? { [K in keyof T as {} extends Pick<T, K> ? never : K]: OnlyRequired<T[K]> }
  : T;
