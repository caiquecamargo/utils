import { TYPE, useToast } from "vue-toastification";
import {
  ToastContent,
  ToastOptions,
} from "vue-toastification/dist/types/types";

export const useNotification = (timeout = 10000) => {
  const toast = useToast();

  return {
    success: (
      content: ToastContent,
      options?: ToastOptions & {
        type?: TYPE.SUCCESS | undefined;
      }
    ) => toast.success(content, { timeout, ...options }),
    error: (
      content: ToastContent,
      options?: ToastOptions & {
        type?: TYPE.ERROR | undefined;
      }
    ) => toast.error(content, { timeout, ...options }),
    warning: (
      content: ToastContent,
      options?: ToastOptions & {
        type?: TYPE.WARNING | undefined;
      }
    ) => toast.warning(content, { timeout, ...options }),
    info: (
      content: ToastContent,
      options?: ToastOptions & {
        type?: TYPE.INFO | undefined;
      }
    ) => toast.info(content, { timeout, ...options }),
  };
};
