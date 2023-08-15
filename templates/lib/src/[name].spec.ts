import { describe, expect, it } from "vitest";
import {
  {{ name }}
} from "./{{ name }}";

describe("{{ name }}", () => {
  it(
    "should return 'Hello, {{ name }}!'",
    () => {
      expect(
        {{ name }}()
      ).toEqual("Hello, {{ name }}!");
    }
  );
});
