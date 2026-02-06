import { renderHook, act } from '@testing-library/react';
import { useThrottle } from '../index';

describe('useThrottle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('leading 与 trailing', () => {
    it('leading: true 时，首次调用在满足间隔后执行（或 trailing 执行）', () => {
      const fn = jest.fn(() => 'result');
      const { result } = renderHook(() =>
        useThrottle(fn, { interval: 300, leading: true, trailing: true }),
      );

      act(() => {
        result.current.throttleFn();
      });
      // 首次调用：remainTime = interval，不立即执行，会设 trailing 定时器
      expect(fn).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenLastCalledWith('a');
    });

    it('leading: false 时，首次调用不执行，仅 trailing 在间隔后执行', () => {
      const fn = jest.fn();
      const { result } = renderHook(() =>
        useThrottle(fn, { interval: 300, leading: false, trailing: true }),
      );

      act(() => {
        result.current.throttleFn();
      });
      expect(fn).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('trailing: false 时，仅 leading 窗口内执行，无 trailing 补执行', () => {
      const fn = jest.fn();
      const { result } = renderHook(() =>
        useThrottle(fn, { interval: 300, leading: true, trailing: false }),
      );

      act(() => {
        result.current.throttleFn();
      });
      expect(fn).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(300);
      });
      // trailing 关闭，定时器不会执行 fn
      expect(fn).not.toHaveBeenCalled();
    });

    it('间隔内多次调用，leading+trailing 时最多执行一次（trailing）', () => {
      const fn = jest.fn();
      const { result } = renderHook(() =>
        useThrottle(fn, { interval: 300, leading: true, trailing: true }),
      );

      act(() => {
        result.current.throttleFn(1);
        result.current.throttleFn(2);
        result.current.throttleFn(3);
      });
      expect(fn).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(300);
      });
      // trailing 使用首次触发定时器时的 args
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenLastCalledWith(1);
    });
  });

  describe('interval 节流间隔', () => {
    it('应遵守 interval，间隔内不重复执行', () => {
      const fn = jest.fn();
      const { result } = renderHook(() =>
        useThrottle(fn, { interval: 500, leading: true, trailing: true }),
      );

      act(() => {
        result.current.throttleFn();
      });
      act(() => {
        jest.advanceTimersByTime(200);
      });
      act(() => {
        result.current.throttleFn();
      });
      expect(fn).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('间隔过后再次调用可执行', () => {
      const fn = jest.fn();
      const { result } = renderHook(() =>
        useThrottle(fn, { interval: 300, leading: true, trailing: true }),
      );

      act(() => {
        result.current.throttleFn('first');
      });
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(fn).toHaveBeenCalledTimes(1);

      act(() => {
        result.current.throttleFn('second');
      });
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(1, 'first');
      expect(fn).toHaveBeenNthCalledWith(2, 'second');
    });
  });

  describe('cancel', () => {
    it('cancel 应取消未执行的 trailing 定时器', () => {
      const fn = jest.fn();
      const { result } = renderHook(() =>
        useThrottle(fn, { interval: 300, leading: true, trailing: true }),
      );

      act(() => {
        result.current.throttleFn();
      });
      expect(fn).not.toHaveBeenCalled();

      act(() => {
        result.current.cancel();
      });
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(fn).not.toHaveBeenCalled();
    });

    it('cancel 后再次调用可重新触发', () => {
      const fn = jest.fn();
      const { result } = renderHook(() =>
        useThrottle(fn, { interval: 300, leading: true, trailing: true }),
      );

      act(() => {
        result.current.throttleFn();
      });
      act(() => {
        result.current.cancel();
      });
      act(() => {
        result.current.throttleFn('after-cancel');
      });
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenLastCalledWith('after-cancel');
    });
  });

  describe('resultCallback', () => {
    it('fn 执行后应调用 resultCallback 并传入返回值', () => {
      const fn = jest.fn(() => 42);
      const resultCallback = jest.fn();
      const { result } = renderHook(() =>
        useThrottle(fn, {
          interval: 300,
          leading: true,
          trailing: true,
          resultCallback,
        }),
      );

      act(() => {
        result.current.throttleFn();
      });
      expect(resultCallback).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(resultCallback).toHaveBeenCalledTimes(1);
      expect(resultCallback).toHaveBeenCalledWith(42);
    });
  });

  describe('返回值结构', () => {
    it('应返回 throttleFn 和 cancel 方法', () => {
      const fn = jest.fn();
      const { result } = renderHook(() => useThrottle(fn));

      expect(result.current).toHaveProperty('throttleFn');
      expect(result.current).toHaveProperty('cancel');
      expect(typeof result.current.throttleFn).toBe('function');
      expect(typeof result.current.cancel).toBe('function');
    });
  });

  describe('fn 更新', () => {
    it('fn 变更后应使用最新的 fn', () => {
      const fn1 = jest.fn(() => 1);
      const fn2 = jest.fn(() => 2);
      const { result, rerender } = renderHook(
        ({ fn }) =>
          useThrottle(fn, { interval: 300, leading: true, trailing: true }),
        { initialProps: { fn: fn1 } },
      );

      act(() => {
        result.current.throttleFn();
      });
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(fn1).toHaveBeenCalledTimes(1);

      rerender({ fn: fn2 });
      act(() => {
        result.current.throttleFn();
      });
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(fn2).toHaveBeenCalledTimes(1);
    });
  });
});
