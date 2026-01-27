import { renderHook, act } from '@testing-library/react';
import { useVirtualList } from '../index';

describe('useVirtualList', () => {
  // 创建测试用的数据列表
  const createTestList = (length: number) =>
    Array.from({ length }, (_, i) => ({ id: i, name: `Item ${i}` }));

  describe('基本功能', () => {
    it('应该正确初始化', () => {
      const list = createTestList(100);
      const { result } = renderHook(() =>
        useVirtualList(list, {
          containerHeight: 400,
          itemHeight: 50,
        }),
      );

      expect(result.current.list).toBeDefined();
      expect(result.current.totalHeight).toBe(100 * 50); // 100个项目 * 50px
      expect(result.current.containerProps).toBeDefined();
      expect(result.current.scrollTo).toBeDefined();
      expect(result.current.scrollToOffset).toBeDefined();
    });

    it('应该只渲染可见区域的项目', () => {
      const list = createTestList(1000);
      const { result } = renderHook(() =>
        useVirtualList(list, {
          containerHeight: 400,
          itemHeight: 50,
        }),
      );

      // 容器高度400px，项目高度50px，可见项目约8个，加上overscan应该更多
      expect(result.current.list.length).toBeGreaterThan(0);
      expect(result.current.list.length).toBeLessThan(1000);
    });

    it('应该正确计算总高度', () => {
      const list = createTestList(50);
      const { result } = renderHook(() =>
        useVirtualList(list, {
          containerHeight: 400,
          itemHeight: 50,
        }),
      );

      expect(result.current.totalHeight).toBe(50 * 50);
    });
  });

  describe('固定高度', () => {
    it('应该正确处理固定高度的项目', () => {
      const list = createTestList(100);
      const { result } = renderHook(() =>
        useVirtualList(list, {
          containerHeight: 400,
          itemHeight: 50,
        }),
      );

      // 检查第一个项目的偏移位置
      if (result.current.list.length > 0) {
        expect(result.current.list[0].offset).toBe(0);
        expect(result.current.list[0].index).toBe(0);
      }
    });

    it('应该正确计算项目的偏移位置', () => {
      const list = createTestList(100);
      const { result } = renderHook(() =>
        useVirtualList(list, {
          containerHeight: 400,
          itemHeight: 50,
        }),
      );

      result.current.list.forEach((item) => {
        expect(item.offset).toBe(item.index * 50);
      });
    });
  });

  describe('动态高度', () => {
    it('应该正确处理动态高度的项目', () => {
      const list = createTestList(100);
      const getItemHeight = (index: number) => (index % 2 === 0 ? 50 : 80);

      const { result } = renderHook(() =>
        useVirtualList(list, {
          containerHeight: 400,
          itemHeight: getItemHeight,
        }),
      );

      expect(result.current.list.length).toBeGreaterThan(0);
      expect(result.current.totalHeight).toBeGreaterThan(100 * 50);
    });

    it('应该正确计算动态高度的总高度', () => {
      const list = createTestList(10);
      const getItemHeight = (index: number) => index * 10 + 50;

      const { result } = renderHook(() =>
        useVirtualList(list, {
          containerHeight: 400,
          itemHeight: getItemHeight,
        }),
      );

      // 手动计算总高度: 50 + 60 + 70 + ... + 140 = 950
      const expectedHeight = Array.from(
        { length: 10 },
        (_, i) => i * 10 + 50,
      ).reduce((sum, h) => sum + h, 0);
      expect(result.current.totalHeight).toBe(expectedHeight);
    });
  });

  describe('滚动功能', () => {
    it('应该能够滚动到指定索引', () => {
      const list = createTestList(100);
      const { result } = renderHook(() =>
        useVirtualList(list, {
          containerHeight: 400,
          itemHeight: 50,
        }),
      );

      act(() => {
        result.current.scrollTo(50);
      });

      // 滚动后，可见列表应该包含索引50附近的项目
      const hasIndex50 = result.current.list.some((item) => item.index === 50);
      expect(hasIndex50).toBe(true);
    });

    it('应该能够滚动到指定偏移位置', () => {
      const list = createTestList(100);
      const { result } = renderHook(() =>
        useVirtualList(list, {
          containerHeight: 400,
          itemHeight: 50,
        }),
      );

      act(() => {
        result.current.scrollToOffset(1000);
      });

      // 滚动到1000px位置，应该能看到索引20附近的项目
      const hasIndex20 = result.current.list.some(
        (item) => item.index >= 18 && item.index <= 22,
      );
      expect(hasIndex20).toBe(true);
    });

    it('应该忽略无效的索引', () => {
      const list = createTestList(100);
      const { result } = renderHook(() =>
        useVirtualList(list, {
          containerHeight: 400,
          itemHeight: 50,
        }),
      );

      const initialList = result.current.list;

      act(() => {
        result.current.scrollTo(-1); // 无效索引
        result.current.scrollTo(1000); // 超出范围
      });

      // 列表不应该改变
      expect(result.current.list).toEqual(initialList);
    });
  });

  describe('边界情况', () => {
    it('应该处理空列表', () => {
      const { result } = renderHook(() =>
        useVirtualList([], {
          containerHeight: 400,
          itemHeight: 50,
        }),
      );

      expect(result.current.list).toEqual([]);
      expect(result.current.totalHeight).toBe(0);
    });

    it('应该处理单项目列表', () => {
      const list = createTestList(1);
      const { result } = renderHook(() =>
        useVirtualList(list, {
          containerHeight: 400,
          itemHeight: 50,
        }),
      );

      expect(result.current.list.length).toBe(1);
      expect(result.current.list[0].index).toBe(0);
      expect(result.current.totalHeight).toBe(50);
    });

    it('应该处理项目数量少于可见区域的情况', () => {
      const list = createTestList(5);
      const { result } = renderHook(() =>
        useVirtualList(list, {
          containerHeight: 400,
          itemHeight: 50,
        }),
      );

      expect(result.current.list.length).toBe(5);
      expect(result.current.totalHeight).toBe(5 * 50);
    });
  });

  describe('预渲染 (overscan)', () => {
    it('应该根据 overscan 配置预渲染项目', () => {
      const list = createTestList(100);
      const { result: resultWithoutOverscan } = renderHook(() =>
        useVirtualList(list, {
          containerHeight: 400,
          itemHeight: 50,
          overscan: 0,
        }),
      );

      const { result: resultWithOverscan } = renderHook(() =>
        useVirtualList(list, {
          containerHeight: 400,
          itemHeight: 50,
          overscan: 10,
        }),
      );

      // 有 overscan 的应该渲染更多项目
      expect(resultWithOverscan.current.list.length).toBeGreaterThan(
        resultWithoutOverscan.current.list.length,
      );
    });
  });

  describe('默认配置', () => {
    it('应该使用默认配置值', () => {
      const list = createTestList(100);
      const { result } = renderHook(() => useVirtualList(list));

      expect(result.current.list).toBeDefined();
      expect(result.current.totalHeight).toBeGreaterThan(0);
    });
  });

  describe('列表更新', () => {
    it('应该在列表更新时重新计算', () => {
      const { result, rerender } = renderHook(
        ({ list }) =>
          useVirtualList(list, {
            containerHeight: 400,
            itemHeight: 50,
          }),
        {
          initialProps: { list: createTestList(50) },
        },
      );

      const initialTotalHeight = result.current.totalHeight;

      rerender({ list: createTestList(100) });

      expect(result.current.totalHeight).toBeGreaterThan(initialTotalHeight);
      expect(result.current.totalHeight).toBe(100 * 50);
    });
  });
});
