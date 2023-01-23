import { timeoutPromise } from "@caiquecamargo/promises";
import { useThrottleFn } from "@vueuse/core";
import { Ref, ref } from "vue";

export interface FetchOptions {
  success?: () => void;
  error?: (error?: any) => void;
}

export const useFetch = (
  callback: () => Promise<any> | any,
  options?: FetchOptions
) => {
  const loading: Ref<boolean> = ref(false);

  const fn = useThrottleFn(
    async (resolve) => {
      loading.value = true;
      try {
        await callback();
        options?.success?.();
      } catch (error) {
        options?.error?.(error);
      } finally {
        loading.value = false;
        resolve();
      }
    },
    50,
    false,
    true
  );

  const fetch = () => {
    return timeoutPromise(
      new Promise((resolve) => {
        fn(resolve);
      })
    );
  };

  return { loading, fetch };
};
