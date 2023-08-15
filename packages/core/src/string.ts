import { isArray, isFunction, isObject, isString } from "./existence";

export const split = (str?: string, separator = ""): string[] =>
  str?.split(separator) ?? [];

export const normalize = (
  value: string,
  form: "NFC" | "NFD" | "NFKC" | "NFKD" = "NFC"
) => value.normalize(form);

export const findAll = (
  target: string | ((str: string) => boolean),
  arr: string,
  separator = ""
) =>
  split(arr, separator).reduce((acc: number[], letter, index) => {
    if (isString(target) && letter === target) {
      acc.push(index);
    }

    if (isFunction(target) && target(letter)) {
      acc.push(index);
    }

    return acc;
  }, []);

export const toBase64 = (object: unknown) => {
  if (isObject(object) || isArray(object)) {
    const buffer = Buffer.from(JSON.stringify(object));
    return buffer.toString("base64");
  }

  if (isString(object)) {
    const buffer = Buffer.from(object);
    return buffer.toString("base64");
  }

  return undefined;
};

export function base64Encoder(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export const fromBase64 = (object: unknown, parse = true) => {
  if (isString(object)) {
    const string = Buffer.from(object, "base64").toString();
    return parse ? JSON.parse(string) : string;
  }

  return undefined;
};

export const getStringSizeInBytes = (string = "") => {
  return Buffer.byteLength(string, "utf8");
};

interface InterpolateOptions {
  emptyOnNotFound?: boolean;
  regex?: RegExp;
}

export const interpolate = (
  string: string,
  vars: Record<string, string> = {},
  options: InterpolateOptions = {}
) => {
  const { emptyOnNotFound = true, regex = /{(.*?)}/g } = options;
  return string.replace(regex, (_match, offset) => {
    return offset in vars ? vars[offset] : emptyOnNotFound ? "" : `{${offset}}`;
  });
};

export function createRandomString(length: number) {
  const rnd = Math.random().toString(36);
  return (toBase64(rnd) as string).slice(0, length);
}

export const isVowel = (char: string) => {
  return /[aeiouy]/.test(char);
};

export const isConsonant = (char: string) => {
  return /[bcçdfghjklmnpqrstvwxz]/.test(char);
};

// key is not exactly the key on S3
// https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example-deployment-pkg.html#with-s3-example-deployment-pkg-nodejs
export const s3Key = (key?: string) => {
  if (key) return decodeURIComponent(key.replace(/\+/g, " "));

  return "";
};

export const sanitize = (string: string, withNumbers = false) => {
  const regex = withNumbers
    ? /[-!@#$%¨&*()_+=|[\]{}:;.,ª\/?]/g
    : /[-!@#$%¨&*()_+=|[\]{}:;.,ª\/?0-9]/g;
  return string.replace(regex, "").trim();
};

export const getLocale = (languageHeader: string, def: string) => {
  const locale = languageHeader.split(",").shift() ?? "";
  return ["pt-BR", "en-US"].indexOf(locale) > 0 ? locale : def;
};

interface TokenizerOptions {
  clean?: boolean;
}

export function* tokenizer(string: string, options?: TokenizerOptions) {
  const { clean = true } = options ?? {};

  let index = 0;
  const cleanString = clean ? string.replace(/[\s|,|.|-|\(|\)|\\|\|]/g, "") : string;
  
  while (index < cleanString.length) {
    const hasAppostrophe =
      index + 1 < cleanString.length && cleanString[index + 1] === "'";
    const token = hasAppostrophe
      ? cleanString.slice(index, index + 2)
      : cleanString[index];
    const nextToken =
      index + 1 < cleanString.length ? cleanString[index + 1] : undefined;
    yield { token, index, nextToken };
    index += hasAppostrophe ? 2 : 1;
  }
}

export type Normalized = {
  normalized: string;
  root: string;
  accent?: string;
  hasAccent: boolean;
};

export const asNormals = (
  string: string,
  anotherAccent?: string
): Normalized => {
  const specialCases = {
    "\u0063\u0327": {
      normalized: "\u0063\u0327",
      root: "ç",
      accent: undefined,
      hasAccent: false,
    },
  };

  const normalized = string.toLowerCase().normalize("NFD");

  if (specialCases[normalized as keyof typeof specialCases])
    return specialCases[normalized as keyof typeof specialCases];

  const root = normalized[0];
  const _accent =
    normalized.length === 2
      ? normalized.codePointAt(1)?.toString(16)
      : undefined;
  const accent = _accent
    ? _accent
    : anotherAccent
    ? anotherAccent.codePointAt(0)?.toString(16)
    : undefined;

  return {
    normalized:
      normalized.length === 1 && !!accent
        ? normalized + anotherAccent
        : normalized,
    root,
    accent,
    hasAccent: !!accent,
  };
};

export function generateId() {
  return Math.random().toString(36).slice(0, 7);
}
