export function timeoutPromise<T>(promise: Promise<T>, timeout: number = 8000) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve("timeout"), timeout)),
  ]);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
