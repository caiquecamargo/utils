import { flushPromises } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useFetch } from "..";

describe("use-fetch unit test", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return the fetch function", async () => {
    Date.now = vi.fn(() => 1599091000);

    const callback = vi
      .fn()
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce({});
    const successCallback = vi.fn();
    const errorCallback = vi.fn();
    const { loading, fetch } = useFetch(callback, {
      success: successCallback,
      error: errorCallback,
    });

    expect(loading.value).toBe(false);

    await fetch();
    await flushPromises();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(errorCallback).toHaveBeenCalledTimes(0);
    expect(successCallback).toHaveBeenCalledTimes(1);
    expect(loading.value).toBe(false);

    vi.useFakeTimers();
    await new Promise((resolve) => {
      fetch();
      vi.runAllTimers();
      resolve({});
    });
    vi.useRealTimers();
    await flushPromises();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(successCallback).toHaveBeenCalledTimes(1);
    expect(loading.value).toBe(false);

    Date.now = vi.fn(() => 1599093000);

    await fetch();
    await flushPromises();
    expect(callback).toHaveBeenCalledTimes(2);
    expect(successCallback).toHaveBeenCalledTimes(2);
    expect(loading.value).toBe(false);

    Date.now = vi.fn(() => 1599095000);

    await fetch();
    await flushPromises();
    expect(callback).toHaveBeenCalledTimes(3);
    expect(successCallback).toHaveBeenCalledTimes(2);
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(loading.value).toBe(false);
  });
});
