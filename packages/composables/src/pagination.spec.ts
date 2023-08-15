import { flushPromises } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { FetchResult, ResultSet, usePagination } from "./pagination";

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
  nodes: [productOne],
  pageInfo: {
    next: productTwo.id,
    hasNext: true,
  },
};

const resultSetSecond: ResultSet<Product> = {
  nodes: [productTwo],
  pageInfo: {
    next: productThree.id,
    hasNext: true,
  },
};

const resultSetThird: ResultSet<Product> = {
  nodes: [productThree],
  pageInfo: {
    next: undefined,
    hasNext: false,
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
    const { nodes, hasNext, hasPrev, fetch, loadNext, loadPrev } =
      usePagination<Product>(fetchResult);

    expect(nodes.value).toEqual([]);
    expect(hasNext.value).toBe(false);
    expect(hasPrev.value).toBe(false);

    await fetch();
    await flushPromises();

    expect(nodes.value).toEqual([productOne]);
    expect(hasNext.value).toBe(true);
    expect(hasPrev.value).toBe(false);

    await loadNext();
    await flushPromises();

    expect(nodes.value).toEqual([productTwo]);
    expect(hasNext.value).toBe(true);
    expect(hasPrev.value).toBe(true);

    await loadNext();
    await flushPromises();

    expect(nodes.value).toEqual([productThree]);
    expect(hasNext.value).toBe(false);
    expect(hasPrev.value).toBe(true);

    await loadPrev();
    await flushPromises();

    expect(nodes.value).toEqual([productTwo]);
    expect(hasNext.value).toBe(true);
    expect(hasPrev.value).toBe(true);

    await loadPrev();
    await flushPromises();

    expect(nodes.value).toEqual([productOne]);
    expect(hasNext.value).toBe(true);
    expect(hasPrev.value).toBe(false);

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

    expect(nodes.value).toEqual([productOne]);
  });

  it("should return the values concatened if has next infinite mode", async () => {
    Date.now = vi.fn(() => 1599091000);
    const { nodes, hasNext, hasPrev, fetch, loadNext } =
      usePagination<Product>(fetchResult, {
        type: "infinite",
      });

    expect(nodes.value).toEqual([]);
    expect(hasNext.value).toBe(false);
    expect(hasPrev.value).toBe(false);

    await fetch();
    await flushPromises();

    expect(nodes.value).toEqual([productOne]);
    expect(hasNext.value).toBe(true);
    expect(hasPrev.value).toBe(false);

    await loadNext();
    await flushPromises();

    expect(nodes.value).toEqual([productOne, productTwo]);
    expect(hasNext.value).toBe(true);
    expect(hasPrev.value).toBe(false);

    await loadNext();
    await flushPromises();

    expect(nodes.value).toEqual([productOne, productTwo, productThree]);
    expect(hasNext.value).toBe(false);
    expect(hasPrev.value).toBe(false);

    Date.now = vi.fn(() => 1599095000);

    await fetch();
    await flushPromises();

    expect(nodes.value).toEqual([productOne]);
  });
});
