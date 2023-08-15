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

export type Primitive =
  | string
  | Function
  | number
  | boolean
  | Symbol
  | undefined
  | null;

export type UnDot<T extends string> = T extends `${infer A}.${infer B}`
  ? [A, ...UnDot<B>]
  : [T];

export type Dot<T extends string[]> = T["length"] extends 0
  ? never
  : T["length"] extends 1
  ? `${T[0]}`
  : `${T[0]}.${Dot<Tail<T>>}`;

// type undotted = UnDot<"a.b.c">;
// type tailed = Tail<undotted>;
// type dotted = Dot<tailed>;

type Tail<T extends any[]> = ((...t: T) => void) extends (
  h: any,
  ...r: infer R
) => void
  ? R
  : never;

export type DeepOmit<T, K extends string> = T extends object
  ? {
      [P in keyof T as P extends K ? never : P]: DeepOmit<
        T[P],
        K extends `${Exclude<P, symbol>}.${infer R}` ? R : never
      >;
    }
  : T;

// type Input = {
//   a: string;
//   b: {
//     c: string;
//     d: string;
//     e: string;
//     f: {
//       g: string;
//       h: string;
//     };
//   };
// };

// type Output = DeepOmit<Input, "b.c" | "b.d" | "b.f.g" | "a">;
