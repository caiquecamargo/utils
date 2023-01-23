import { FetchOptions, useFetch } from "@caiquecamargo/fetch";
import { Ref, computed, reactive, ref } from "vue";

type PageInfo = {
  hasNext?: boolean;
  hasPrev?: boolean;
  next?: string;
  prev?: string;
};

export type ResultSet<T> = {
  nodes?: T[];
  pageInfo?: PageInfo;
};

export type FetchResult<T> = (
  next?: string
) => Promise<ResultSet<T> | undefined>;

export type PaginationType = "infinite" | "paginated";

export interface PaginationOptions {
  type?: PaginationType;
  fetchOptions?: FetchOptions;
}

const defaultPagination: PageInfo = {
  hasNext: false,
  hasPrev: false,
  next: undefined,
  prev: undefined,
};

export const usePagination = <T>(
  fetchResult: FetchResult<T>,
  options?: PaginationOptions
) => {
  const type = options?.type ?? "paginated";
  const nodes: Ref<T[]> = ref([]);
  const page = ref(1);
  const history = ref<string[]>([]);
  const pageInfo = reactive<PageInfo>({ ...defaultPagination });
  const hasNext = computed(() => !!pageInfo.hasNext);
  const hasPrev = computed(
    () => history.value.length > 0 && type === "paginated"
  );

  function persist(resultSet?: ResultSet<T>) {
    if (!resultSet) return clear();

    Object.assign(pageInfo, resultSet.pageInfo);
    type === "infinite"
      ? nodes.value.push(...(resultSet.nodes ?? []))
      : (nodes.value = resultSet.nodes ?? []);
  }

  function clear() {
    Object.assign(pageInfo, { ...defaultPagination });
    history.value = [];
    nodes.value = [];
  }

  async function callback(key?: string) {
    if (key) history.value.push(key);
    const resultSet = await fetchResult(key);
    persist(resultSet);
  }

  const { fetch, loading } = useFetch(async () => {
    clear();
    await callback();
  }, options?.fetchOptions);

  async function loadNext() {
    if (hasNext.value) {
      page.value++;
      loading.value = true;
      await callback(pageInfo.next);
      loading.value = false;
    }
  }

  async function loadPrev() {
    if (hasPrev.value) {
      history.value.pop();
      page.value = Math.max(1, page.value - 1);
      loading.value = true;
      await callback(history.value.pop());
      loading.value = false;
    }
  }

  return {
    loading,
    nodes,
    fetch,
    loadNext,
    loadPrev,
    page,
    hasNext,
    hasPrev,
  };
};
