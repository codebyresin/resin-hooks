import { renderHook, act } from '@testing-library/react';
import { useBoolean } from '../index';

describe('useBoolean', () => {
  describe('初始化', () => {
    it('应该使用默认值 false 初始化', () => {
      const { result } = renderHook(() => useBoolean());
      expect(result.current[0]).toBe(false);
    });

    it('应该使用传入的初始值 true 初始化', () => {
      const { result } = renderHook(() => useBoolean(true));
      expect(result.current[0]).toBe(true);
    });

    it('应该使用传入的初始值 false 初始化', () => {
      const { result } = renderHook(() => useBoolean(false));
      expect(result.current[0]).toBe(false);
    });
  });

  describe('setTrue', () => {
    it('应该将值设置为 true', () => {
      const { result } = renderHook(() => useBoolean(false));
      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1].setTrue();
      });
      expect(result.current[0]).toBe(true);
    });

    it('应该将值从 true 保持为 true', () => {
      const { result } = renderHook(() => useBoolean(true));
      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1].setTrue();
      });

      expect(result.current[0]).toBe(true);
    });
  });

  describe('setFalse', () => {
    it('应该将值设置为 false', () => {
      const { result } = renderHook(() => useBoolean(true));
      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1].setFalse();
      });

      expect(result.current[0]).toBe(false);
    });

    it('应该将值从 false 保持为 false', () => {
      const { result } = renderHook(() => useBoolean(false));
      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1].setFalse();
      });

      expect(result.current[0]).toBe(false);
    });
  });

  describe('toggle', () => {
    it('应该将 false 切换为 true', () => {
      const { result } = renderHook(() => useBoolean(false));
      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1].toggle();
      });

      expect(result.current[0]).toBe(true);
    });

    it('应该将 true 切换为 false', () => {
      const { result } = renderHook(() => useBoolean(true));
      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1].toggle();
      });

      expect(result.current[0]).toBe(false);
    });

    it('应该支持多次切换', () => {
      const { result } = renderHook(() => useBoolean(false));
      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1].toggle();
      });
      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1].toggle();
      });
      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1].toggle();
      });
      expect(result.current[0]).toBe(true);
    });
  });

  describe('set', () => {
    it('应该将值设置为 true', () => {
      const { result } = renderHook(() => useBoolean(false));
      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1].set(true);
      });

      expect(result.current[0]).toBe(true);
    });

    it('应该将值设置为 false', () => {
      const { result } = renderHook(() => useBoolean(true));
      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1].set(false);
      });

      expect(result.current[0]).toBe(false);
    });

    it('应该支持多次设置不同的值', () => {
      const { result } = renderHook(() => useBoolean(false));

      act(() => {
        result.current[1].set(true);
      });
      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1].set(false);
      });
      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1].set(true);
      });
      expect(result.current[0]).toBe(true);
    });
  });

  describe('actions 对象', () => {
    it('应该返回包含所有方法的 actions 对象', () => {
      const { result } = renderHook(() => useBoolean());
      const actions = result.current[1];

      expect(actions).toHaveProperty('setTrue');
      expect(actions).toHaveProperty('setFalse');
      expect(actions).toHaveProperty('set');
      expect(actions).toHaveProperty('toggle');
      expect(typeof actions.setTrue).toBe('function');
      expect(typeof actions.setFalse).toBe('function');
      expect(typeof actions.set).toBe('function');
      expect(typeof actions.toggle).toBe('function');
    });

    it('actions 对象的引用应该保持稳定', () => {
      const { result, rerender } = renderHook(() => useBoolean());
      const firstActions = result.current[1];

      rerender();
      const secondActions = result.current[1];

      expect(firstActions).toBe(secondActions);
    });
  });

  describe('组合使用', () => {
    it('应该支持多种方法的组合使用', () => {
      const { result } = renderHook(() => useBoolean(false));

      act(() => {
        result.current[1].setTrue();
      });
      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1].toggle();
      });
      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1].set(true);
      });
      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1].setFalse();
      });
      expect(result.current[0]).toBe(false);
    });
  });
});
