import { describe, expect, it } from "vitest";
import { name } from "./name";

describe("name", () => {
  it("should work", () => {
    expect(name()).toEqual("name");
  });
});
