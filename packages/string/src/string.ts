import { isFunction, isObject, isString } from "@utils/types-utils";
import { createHash, randomBytes } from "crypto";

export const split = (str?: string, separator = ""): string[] =>
  str?.split(separator) ?? [];

export const normalize = (
  value: string,
  form: "NFC" | "NFD" | "NFKC" | "NFKD" = "NFC"
) => value.normalize(form);

export const findAll = (
  target: string | ((str: string) => boolean),
  arr: string[]
) =>
  arr.reduce((acc: number[], letter, index) => {
    if (isString(target) && letter === target) {
      acc.push(index);
    }

    if (isFunction(target) && target(letter)) {
      acc.push(index);
    }

    return acc;
  }, []);

export const toBase64 = (object: unknown) => {
  if (isObject(object)) {
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

export const interpolate = (
  string: string,
  vars: Record<string, string> = {},
  emptyOnNotFound = true
) => {
  return string.replace(/{(.*?)}/g, (match, offset) => {
    return offset in vars ? vars[offset] : emptyOnNotFound ? "" : `{${offset}}`;
  });
};

export function createRandomString(length: number) {
  const rnd = randomBytes(length);
  return toBase64(rnd);
}

export function sha256(str: string) {
  return createHash("sha256").update(str).digest();
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

  return undefined;
};
