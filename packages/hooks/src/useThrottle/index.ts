import { useRef, useCallback, useEffect } from 'react';

/**
 * useThrottle
 * @param fn 需要节流的函数
 * @param options 配置项
 */

export interface UseThrottleOptions {
  interval?: number; // 间隔时间
  leading?: boolean; // 是否第一次立即执行
  trailing?: boolean; // 是否在最后一次补执行
  resultCallback?: (res: any) => void; // fn 执行结果回调
}

type throttleFn<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => ReturnType<T> | undefined;

export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  options: UseThrottleOptions = {
    interval: 1000,
    leading: true,
    trailing: false,
  },
): { throttleFn: throttleFn<T>; cancel: () => void } {
  const {
    interval = 1000,
    leading = true,
    trailing = false,
    resultCallback,
  } = options;

  /** 保存上一次真正执行 fn 的时间 */
  const lastTimeRef = useRef(0);
  /** 保存 trailing 定时器 */
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** 保存最新的 fn，避免闭包问题 */
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  /** 组件卸载时清理 trailing 定时器，避免在已卸载组件上执行 fn */
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const throttleFn = useCallback(
    (...args: any[]) => {
      const nowTime = new Date().getTime();

      /**
       * 如果是：
       *  - 第一次触发
       *  - 并且 leading = false
       * 那么把 lastTime 设置为当前时间
       * 目的：禁止第一次立刻执行
       */
      if (!lastTimeRef.current && !leading) {
        lastTimeRef.current = nowTime;
      }
      /**
       * 计算剩余时间
       * interval - (当前时间 - 上次执行时间)
       */
      const remainTime = interval - (nowTime - lastTimeRef.current);

      if (remainTime <= 0) {
        // 如果之前有 trailing 定时器，清掉
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        const result = fnRef.current(...args);
        // 执行结果回调
        if (resultCallback) resultCallback(result);
        // 更新上一次执行时间
        lastTimeRef.current = nowTime;
        return;
      }
      /**
       * 没到时间 && 开启 trailing
       * 且当前没有定时器
       * → 开一个定时器兜底执行
       */

      if (!timerRef.current && trailing) {
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          /**
           * 如果 leading=false：
           * trailing 执行完后要重置 lastTime
           * 保证下次还能正常触发
           */
          lastTimeRef.current = !leading ? 0 : new Date().getTime();
          const result = fnRef.current(...args);
          if (resultCallback) resultCallback(result);
        }, remainTime);
      }
      return undefined;
    },
    [interval, trailing, leading, resultCallback],
  );
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    lastTimeRef.current = 0;
  }, []);
  return { throttleFn, cancel };
}
