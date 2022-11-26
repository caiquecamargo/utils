import { describe, expect, it } from "vitest";
import { composables } from "./composables";

describe("composables", () => {
  it("should work", () => {
    expect(composables()).toEqual("composables");
  });
});
