import { computed, reactive, Ref, ref } from "vue";

export type PageInfo = {
  hasNext?: boolean;
  hasPrev?: boolean;
  next?: string;
  prev?: string;
};

export type ResultSet<T, K> = {
  nodes?: T[];
  pageInfo?: K;
};

export type FetchResult<T, K> = (
  next?: string
) => Promise<ResultSet<T, K> | undefined>;

export type PaginationType = "infinite" | "paginated";

export interface PaginationOptions {
  type?: PaginationType;
}

const defaultPagination: PageInfo = {
  hasNext: false,
  hasPrev: false,
  next: undefined,
  prev: undefined,
};

export const usePagination = <T, K = PageInfo>(
  fetchResult: FetchResult<T, K>,
  options?: PaginationOptions
) => {
  const type = options?.type ?? "paginated";
  const nodes: Ref<T[]> = ref([]);
  const page = ref(1);
  const history = ref<string[]>([]);
  const pageInfo = reactive({ ...defaultPagination });
  const hasNext = computed(() => !!pageInfo.hasNext);
  const hasPrev = computed(
    () => history.value.length > 0 && type === "paginated"
  );
  const loading = ref(false);

  function persist(resultSet?: ResultSet<T, K>) {
    if (!resultSet || !resultSet.nodes) return clear();

    Object.assign(pageInfo, resultSet.pageInfo);
    type === "infinite"
      ? nodes.value.push(...resultSet.nodes)
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

  const fetch = async () => {
    clear();
    await callback();
  };

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
