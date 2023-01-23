import { describe, expect, it } from "vitest";
import { notification } from "./notification";

describe("notification", () => {
  it("should work", () => {
    expect(notification()).toEqual("notification");
  });
});
