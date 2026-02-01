import { useEffect, useRef, useMemo } from 'react';

export interface UseThrottleOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

type ThrottledFn<T extends (...args: any[]) => any> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) & {
  cancel: () => void;
  flush: () => ReturnType<T> | undefined;
};

export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  options: UseThrottleOptions = {},
): ThrottledFn<T> {
  const { wait = 300, leading = true, trailing = true } = options;

  const fnRef = useRef(fn);
  const throttledRef = useRef<ThrottledFn<T> | null>(null);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastCallTime = 0;
    let lastArgs: Parameters<T> | null = null;
    let result: ReturnType<T> | undefined;

    function invoke(time: number) {
      lastCallTime = time;
      result = fnRef.current(...(lastArgs as Parameters<T>));
      lastArgs = null;
      return result;
    }

    function remainingWait(time: number) {
      return wait - (time - lastCallTime);
    }

    function shouldInvoke(time: number) {
      return lastCallTime === 0 || time - lastCallTime >= wait;
    }

    function timerExpired() {
      const time = Date.now();
      if (shouldInvoke(time)) {
        if (trailing && lastArgs) {
          invoke(time);
        }
        timer = null;
      } else {
        timer = setTimeout(timerExpired, remainingWait(time));
      }
    }

    const throttledImpl = ((...args: Parameters<T>) => {
      const time = Date.now();
      const isInvoking = shouldInvoke(time);

      lastArgs = args;

      if (isInvoking) {
        if (!timer) {
          if (leading) {
            invoke(time);
          }
          timer = setTimeout(timerExpired, wait);
        }
      }

      if (!timer && trailing) {
        timer = setTimeout(timerExpired, wait);
      }

      return result;
    }) as ThrottledFn<T>;

    throttledImpl.cancel = () => {
      if (timer) clearTimeout(timer);
      timer = null;
      lastCallTime = 0;
      lastArgs = null;
    };

    throttledImpl.flush = () => {
      if (timer && lastArgs) {
        clearTimeout(timer);
        timer = null;
        return invoke(Date.now());
      }
      return result;
    };

    throttledRef.current = throttledImpl;

    return () => {
      throttledImpl.cancel();
    };
  }, [wait, leading, trailing]);

  // render 阶段返回“壳函数”及 cancel/flush，在 useMemo 内一次构造，避免修改 hook 返回值
  return useMemo(() => {
    const stableFn = (...args: Parameters<T>) =>
      throttledRef.current?.(...args);
    stableFn.cancel = () => throttledRef.current?.cancel();
    stableFn.flush = () => throttledRef.current?.flush();
    return stableFn as ThrottledFn<T>;
  }, []);
}
