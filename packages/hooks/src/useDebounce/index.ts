import { useRef, useCallback, useEffect } from 'react';

interface useDebounceOptions {
  delay?: number;
  immediate?: boolean;
  resultCallback?: (result: any) => any;
}
type useDebounceFn<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => ReturnType<T> | undefined;

export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  options: useDebounceOptions = { delay: 2000, immediate: false },
): { debounceFn: useDebounceFn<T>; cancel: () => void } {
  const { immediate, delay, resultCallback } = options;

  /** 保存定时器 */
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /**是否立即执行 */
  const isInvokeRef = useRef<boolean>(false);
  /**保存最新的fn */
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const debounceFn = function (...args: any[]) {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (immediate && !isInvokeRef.current) {
      const result = fnRef.current(...args);
      if (resultCallback) resultCallback(result);
      isInvokeRef.current = true;

      timerRef.current = setTimeout(() => {
        isInvokeRef.current = false;
        timerRef.current = null;
      }, delay);
    } else {
      timerRef.current = setTimeout(() => {
        const result = fnRef.current(...args);
        if (resultCallback) resultCallback(result);
        isInvokeRef.current = false;
        timerRef.current = null;
      }, delay);
    }
    return undefined;
  };
  /**取消请求 */
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      isInvokeRef.current = false;
    }
    isInvokeRef.current = false;
  }, []);
  return { debounceFn, cancel };
}
