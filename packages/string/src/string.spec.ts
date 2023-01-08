import { describe, expect, it } from "vitest";
import {
  asNormals,
  fromBase64,
  getLocale,
  isConsonant,
  isVowel,
  s3Key,
  sanitize,
  toBase64,
  tokenizer,
} from "./string";

describe("string", () => {
  it("should convert string to s3 path", () => {
    const actual = s3Key("some+small+string");
    expect(actual).toEqual("some small string");
  });

  it.each([
    ["some small string", false],
    [{ some: "small string" }, true],
  ])("should convert to and from base 64", (original, parse) => {
    const base64 = toBase64(original);
    const actual = fromBase64(base64, parse);
    expect(actual).toEqual(original);
  });

  it("should convert string to s3 path", async () => {
    const actual = s3Key("some+small+string");
    expect(actual).toEqual("some small string");
  });

  it("should return the string tokens one by one", async () => {
    const string = "(some small string value with `accent à and a', |ok)";
    const tokens = [];
    for await (const { token } of tokenizer(string)) {
      tokens.push(token);
    }

    expect(tokens).toEqual([
      "s",
      "o",
      "m",
      "e",
      "s",
      "m",
      "a",
      "l",
      "l",
      "s",
      "t",
      "r",
      "i",
      "n",
      "g",
      "v",
      "a",
      "l",
      "u",
      "e",
      "w",
      "i",
      "t",
      "h",
      "`",
      "a",
      "c",
      "c",
      "e",
      "n",
      "t",
      "à",
      "a",
      "n",
      "d",
      "a'",
      "o",
      "k",
    ]);
  });

  it("should return the normalized string and accent", async () => {
    const string = "é è ë ê Á À Ä Ã Â ç b d'";
    const normalizeds = string
      .split(" ")
      .map((n) => n.toLowerCase().normalize("NFD"));
    const values = ["e", "e", "e", "e", "a", "a", "a", "a", "a", "ç", "b", "d"];
    const accents = [
      "301",
      "300",
      "308",
      "302",
      "301",
      "300",
      "308",
      "303",
      "302",
      undefined,
      undefined,
      "27",
    ];

    const actualNormalizeds = [];
    const actualValues = [];
    const actualAccents = [];

    for await (const { token } of tokenizer(string)) {
      const { normalized, root, accent } = asNormals(token);
      actualNormalizeds.push(normalized);
      actualValues.push(root);
      actualAccents.push(accent);
    }

    expect(actualNormalizeds).toEqual(normalizeds);
    expect(actualValues).toEqual(values);
    expect(actualAccents).toEqual(accents);
  });

  it.each([
    ["a", true],
    ["e", true],
    ["i", true],
    ["o", true],
    ["u", true],
    ["c", false],
    ["ç", false],
    ["b", false],
    ["", false],
  ])("should return %p as a vowel", (vowel, expected) => {
    expect(isVowel(vowel)).toEqual(expected);
  });

  it.each([
    ["a", false],
    ["e", false],
    ["i", false],
    ["o", false],
    ["u", false],
    ["c", true],
    ["ç", true],
    ["b", true],
    ["z", true],
    ["", false],
  ])("should return %p as a consonant", (consonant, expected) => {
    expect(isConsonant(consonant)).toEqual(expected);
  });

  it.each([
    ["en-US,en;q=0.9,pt;q=0.8", "en-US"],
    ["pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6", "pt-BR"],
    ["eu-EU,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6", "pt-BR"],
    ["", "pt-BR"],
  ])("should return %p as a locale", (locale, expected) => {
    expect(getLocale(locale, "pt-BR")).toEqual(expected);
  });

  it.each([
    ["Maria das Graças", "Maria das Graças", false],
    ["Maria-=!|#$%79)(*%$@) das Graças;825098", "Maria das Graças", false],
    ["áàâãaºäa'´`^~º'", "áàâãaºäa'´`^~º'", false],
    ["áàâãaºäa'´`^~º'23456", "áàâãaºäa'´`^~º'23456", true],
    ["Maria das Graças23456", "Maria das Graças23456", true],
    ["testea\u0300", "testea\u0300", true],
  ])(
    "should sanitize the %p to %p with numbers $p",
    (string, expected, withNumbers) => {
      expect(sanitize(string, withNumbers)).toEqual(expected);
    }
  );
});
