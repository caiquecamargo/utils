import { flushPromises } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { FetchResult, ResultSet, usePagination } from "..";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

function createProduct(pos: number): Product {
  return {
    id: `${pos}`,
    name: `Product ${pos}`,
    price: pos * 10,
    description: `Product ${pos} description`,
  };
}

const productOne = createProduct(1);
const productTwo = createProduct(2);
const productThree = createProduct(3);

const resultSetFirst: ResultSet<Product> = {
  results: [productOne],
  pagination: {
    key: productTwo.id,
    hasMore: true,
  },
};

const resultSetSecond: ResultSet<Product> = {
  results: [productTwo],
  pagination: {
    key: productThree.id,
    hasMore: true,
  },
};

const resultSetThird: ResultSet<Product> = {
  results: [productThree],
  pagination: {
    key: undefined,
    hasMore: false,
  },
};

const fetchResult: FetchResult<Product> = vi
  .fn()
  .mockImplementation((key?: string) => {
    if (!key) return Promise.resolve(resultSetFirst);
    if (key === productTwo.id) return Promise.resolve(resultSetSecond);
    if (key === productThree.id) return Promise.resolve(resultSetThird);

    return Promise.resolve(resultSetFirst);
  });

describe("use-pagination unit test", () => {
  it("should return the values if has next and prior values in paginated mode", async () => {
    Date.now = vi.fn(() => 1599091000);
    const { results, hasNext, hasPrior, fetch, loadNext, loadPrior } =
      usePagination<Product>(fetchResult);

    expect(results).toEqual([]);
    expect(hasNext.value).toBe(false);
    expect(hasPrior.value).toBe(false);

    await fetch();
    await flushPromises();

    expect(results).toEqual([productOne]);
    expect(hasNext.value).toBe(true);
    expect(hasPrior.value).toBe(false);

    await loadNext();
    await flushPromises();

    expect(results).toEqual([productTwo]);
    expect(hasNext.value).toBe(true);
    expect(hasPrior.value).toBe(true);

    await loadNext();
    await flushPromises();

    expect(results).toEqual([productThree]);
    expect(hasNext.value).toBe(false);
    expect(hasPrior.value).toBe(true);

    await loadPrior();
    await flushPromises();

    expect(results).toEqual([productTwo]);
    expect(hasNext.value).toBe(true);
    expect(hasPrior.value).toBe(true);

    await loadPrior();
    await flushPromises();

    expect(results).toEqual([productOne]);
    expect(hasNext.value).toBe(true);
    expect(hasPrior.value).toBe(false);

    Date.now = vi.fn(() => 1599095000);

    await fetch();
    await flushPromises();
    vi.useFakeTimers();
    await new Promise((resolve) => {
      fetch();
      vi.runAllTimers();
      resolve({});
    });
    vi.useRealTimers();
    await flushPromises();

    expect(results).toEqual([productOne]);
  });

  it("should return the values concatened if has next infinite mode", async () => {
    Date.now = vi.fn(() => 1599091000);
    const { results, hasNext, hasPrior, fetch, loadNext } =
      usePagination<Product>(fetchResult, {
        type: "infinite",
      });

    expect(results).toEqual([]);
    expect(hasNext.value).toBe(false);
    expect(hasPrior.value).toBe(false);

    await fetch();
    await flushPromises();

    expect(results).toEqual([productOne]);
    expect(hasNext.value).toBe(true);
    expect(hasPrior.value).toBe(false);

    await loadNext();
    await flushPromises();

    expect(results).toEqual([productOne, productTwo]);
    expect(hasNext.value).toBe(true);
    expect(hasPrior.value).toBe(false);

    await loadNext();
    await flushPromises();

    expect(results).toEqual([productOne, productTwo, productThree]);
    expect(hasNext.value).toBe(false);
    expect(hasPrior.value).toBe(false);

    Date.now = vi.fn(() => 1599095000);

    await fetch();
    await flushPromises();

    expect(results).toEqual([productOne]);
  });
});
