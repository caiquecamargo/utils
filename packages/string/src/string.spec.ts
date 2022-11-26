import { describe, expect, it } from "vitest";
import { fromBase64, s3Key, toBase64 } from "./string";

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
});
