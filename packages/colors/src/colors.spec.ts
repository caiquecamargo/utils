import { describe, expect, it } from "vitest";
import { colors } from "./colors";

describe("colors", () => {
  it("should work", () => {
    expect(colors()).toEqual("colors");
  });
});
