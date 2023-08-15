import { timeoutPromise } from "@caiquecamargo/core";
import { useThrottleFn } from "@vueuse/core";
import { Ref, ref } from "vue";

export interface AsyncOptions<T = any> {
  success?: <T>(result?: T) => void;
  error?: (error?: Error | "timeout") => void;
}

export const useAsync = <T = any>(
  callback: () => Promise<T> | T,
  options?: AsyncOptions
) => {
  const loading: Ref<boolean> = ref(false);
  const isReady: Ref<boolean> = ref(true);
  const state: Ref<T | undefined> = ref();

  const fn = useThrottleFn(
    async (resolve: (value: unknown) => void) => {
      loading.value = true;
      try {
        state.value = await callback();
        options?.success?.(state.value);
        resolve(state.value);
      } catch (error) {
        options?.error?.(error as Error);
        resolve(error);
      } finally {
        loading.value = false;
      }
    },
    50,
    false,
    true
  );

  const execute = async () => {
    if (!isReady.value) return;

    isReady.value = false;
    const result = await timeoutPromise(
      new Promise((resolve) => {
        fn(resolve);
      })
    );

    if (result === "timeout" || result instanceof Error) {
      options?.error?.("timeout");
      isReady.value = true;
      return;
    }

    isReady.value = true;
    return result as T;
  };

  return { loading, execute, isReady, state };
};
