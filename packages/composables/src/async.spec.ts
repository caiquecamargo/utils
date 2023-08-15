import { flushPromises } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAsync } from "./async";

const firstValue = "firstValue";
const secondValue = "secondValue";

describe("use-async unit test", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return the fetch function", async () => {
    Date.now = vi.fn(() => 1599091000);

    const callback = vi
      .fn()
      .mockResolvedValueOnce(firstValue)
      .mockResolvedValueOnce(secondValue)
      .mockRejectedValueOnce({});
    const successCallback = vi.fn();
    const errorCallback = vi.fn();
    const { loading, execute, isReady, state } = useAsync(callback, {
      success: successCallback,
      error: errorCallback,
    });

    expect(loading.value).toBe(false);
    expect(isReady.value).toBe(true);
    expect(state.value).toBe(undefined);

    const firstResult = await execute();
    expect(firstResult).toBe(firstValue);
    expect(state.value).toBe(firstValue);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(errorCallback).toHaveBeenCalledTimes(0);
    expect(successCallback).toHaveBeenCalledTimes(1);
    expect(loading.value).toBe(false);
    expect(isReady.value).toBe(true);

    vi.useFakeTimers();
    await new Promise((resolve) => {
      execute();
      execute();
      vi.runAllTimers();
      resolve({});
    });
    vi.useRealTimers();
    await flushPromises();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(state.value).toBe(firstValue);
    expect(successCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback).toHaveBeenCalledWith("timeout");
    expect(loading.value).toBe(false);
    expect(isReady.value).toBe(true);

    Date.now = vi.fn(() => 1599093000);

    const secondResult = await execute();
    expect(callback).toHaveBeenCalledTimes(2);
    expect(secondResult).toBe(secondValue);
    expect(state.value).toBe(secondValue);
    expect(successCallback).toHaveBeenCalledTimes(2);
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(loading.value).toBe(false);
    expect(isReady.value).toBe(true);

    Date.now = vi.fn(() => 1599095000);

    const result = await execute();
    expect(callback).toHaveBeenCalledTimes(3);
    expect(state.value).toBe(secondValue);
    expect(result).toEqual({});
    expect(successCallback).toHaveBeenCalledTimes(2);
    expect(errorCallback).toHaveBeenCalledTimes(2);
    expect(errorCallback).toHaveBeenLastCalledWith({});
    expect(loading.value).toBe(false);
    expect(isReady.value).toBe(true);
  });
});
