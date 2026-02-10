import { useEffect, useState } from 'react';

type StorageType = 'local' | 'session';

type UseStorageReturn<T> = [
  T | undefined, // 当前值
  (value: T, expire?: number | null) => void, // 设置值（可覆盖过期时间）
  () => void, // 删除值
];

interface UseStorageOptions<T> {
  key: string; // 存储 key
  expire?: number | null; // 过期时间（毫秒），null = 永不过期
  type?: StorageType; // local / session，默认 local
  defaultValue?: T; // 默认值
}

interface StorageState<T> {
  value: T | undefined;
  expireTime: number | null;
}

export function useStorage<T>(
  options: UseStorageOptions<T>,
): UseStorageReturn<T> {
  const { key, expire = null, type = 'local', defaultValue } = options;

  const getStorage = (): Storage | null => {
    if (typeof window === 'undefined') return null;
    return type === 'local' ? window.localStorage : window.sessionStorage;
  };

  const [state, setState] = useState<StorageState<T>>(() => {
    try {
      const storage = getStorage();
      if (!storage) {
        return { value: defaultValue, expireTime: null };
      }
      const stored = storage.getItem(key);
      if (!stored) {
        return { value: defaultValue, expireTime: null };
      }
      const parsed = JSON.parse(stored) as {
        value: T;
        expireTime: number | null;
      };
      const { value, expireTime } = parsed;

      // 初始化时也要判断是否已过期
      if (expireTime && Date.now() > expireTime) {
        storage.removeItem(key);
        return { value: defaultValue, expireTime: null };
      }
      return { value, expireTime };
    } catch {
      return { value: defaultValue, expireTime: null };
    }
  });

  const setToken = (value: T, customExpire?: number | null) => {
    try {
      const storage = getStorage();
      const finalExpire = customExpire ?? expire;
      const expireTime =
        typeof finalExpire === 'number' && finalExpire > 0
          ? Date.now() + finalExpire
          : null;

      if (storage) {
        const storedValue = JSON.stringify({ value, expireTime });
        storage.setItem(key, storedValue);
      }

      setState({ value, expireTime });
    } catch (err) {
      console.error('设置存储失败：', err);
    }
  };

  const removeToken = () => {
    try {
      const storage = getStorage();
      if (storage) {
        storage.removeItem(key);
      }
      setState({ value: defaultValue, expireTime: null });
    } catch (e) {
      console.error('删除存储失败：', e);
    }
  };

  // 当前标签页内自动过期
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const { expireTime } = state;
    if (!expireTime) return;

    const now = Date.now();
    if (expireTime <= now) {
      // 已经过期，立即清理
      removeToken();
      return;
    }

    const timeout = expireTime - now;
    const timer = window.setTimeout(() => {
      removeToken();
    }, timeout);

    return () => {
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.expireTime, key, type]);

  // 跨标签页同步
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storage = getStorage();
    if (!storage) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== storage) return;

      const stored = storage.getItem(key);
      if (!stored) {
        setState({ value: defaultValue, expireTime: null });
        return;
      }

      try {
        const parsed = JSON.parse(stored) as {
          value: T;
          expireTime: number | null;
        };
        const { value, expireTime } = parsed;

        if (expireTime && Date.now() > expireTime) {
          storage.removeItem(key);
          setState({ value: defaultValue, expireTime: null });
        } else {
          setState({ value, expireTime });
        }
      } catch {
        setState({ value: defaultValue, expireTime: null });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, type, defaultValue]);

  return [state.value, setToken, removeToken];
}
