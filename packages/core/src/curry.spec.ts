import { describe, expect, it, vi } from "vitest";
import { chain } from "./curry";

describe("curry", () => {
  it("should run all functions", () => {
    const funcOne = vi.fn();
    const funcTwo = vi.fn();
    const funcThree = vi.fn();

    const chained = chain(funcOne, funcTwo, funcThree);
    chained();

    expect(funcOne).toHaveBeenCalled();
    expect(funcTwo).toHaveBeenCalled();
    expect(funcThree).toHaveBeenCalled();
  });
});
