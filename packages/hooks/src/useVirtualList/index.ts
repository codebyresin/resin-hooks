import { useState, useMemo, useRef, useCallback } from 'react';
import { useLatest } from '../useLatest';

/**
 * 虚拟列表配置选项
 */
export interface UseVirtualListOptions {
  /**
   * 容器高度（像素）
   * @default 400
   */
  containerHeight?: number;
  /**
   * 每个项目的高度（像素）
   * 如果提供函数，则支持动态高度
   * @default 50
   */
  itemHeight?: number | ((index: number) => number);
  /**
   * 预渲染的项目数量（在可见区域前后额外渲染的项目数）
   * 用于平滑滚动体验
   * @default 5
   */
  overscan?: number;
}

/**
 * 虚拟列表返回的单个项目信息
 */
export interface VirtualListItem<T> {
  /**
   * 项目数据
   */
  data: T;
  /**
   * 项目在原始列表中的索引
   */
  index: number;
  /**
   * 项目在容器中的偏移位置（像素）
   */
  offset: number;
}

/**
 * 虚拟列表返回值
 */
export interface UseVirtualListReturn<T> {
  /**
   * 可见区域的项目列表
   */
  list: VirtualListItem<T>[];
  /**
   * 容器样式对象，需要应用到滚动容器上
   */
  containerProps: {
    style: React.CSSProperties;
    onScroll: (e: React.UIEvent<HTMLElement>) => void;
    ref: (element: HTMLElement | null) => void;
  };
  /**
   * 总高度（像素），用于设置占位元素的高度
   */
  totalHeight: number;
  /**
   * 滚动到指定索引
   */
  scrollTo: (index: number) => void;
  /**
   * 滚动到指定偏移位置
   */
  scrollToOffset: (offset: number) => void;
}

/**
 * useVirtualList Hook
 *
 * 虚拟列表 Hook，用于高效渲染大量数据列表。
 * 只渲染可见区域的项目，大幅提升性能。
 *
 * @template T - 列表项数据类型
 * @param {T[]} list - 要渲染的数据列表
 * @param {UseVirtualListOptions} options - 配置选项
 * @returns {UseVirtualListReturn<T>} 返回虚拟列表的相关数据和方法
 *
 * @example
 * ```tsx
 * function VirtualListExample() {
 *   const [list] = useState(() =>
 *     Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }))
 *   );
 *
 *   const { list: visibleList, containerProps, totalHeight } = useVirtualList(list, {
 *     containerHeight: 400,
 *     itemHeight: 50,
 *   });
 *
 *   return (
 *     <div {...containerProps} style={{ height: 400, overflow: 'auto' }}>
 *       <div style={{ height: totalHeight, position: 'relative' }}>
 *         {visibleList.map((item) => (
 *           <div
 *             key={item.index}
 *             style={{
 *               position: 'absolute',
 *               top: item.offset,
 *               height: 50,
 *               width: '100%',
 *             }}
 *           >
 *             {item.data.name}
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example 动态高度
 * ```tsx
 * const { list: visibleList, containerProps, totalHeight } = useVirtualList(list, {
 *   containerHeight: 400,
 *   itemHeight: (index) => index % 2 === 0 ? 50 : 80, // 动态高度
 * });
 * ```
 */
export function useVirtualList<T>(
  list: T[],
  options: UseVirtualListOptions = {},
): UseVirtualListReturn<T> {
  const { containerHeight = 400, itemHeight = 50, overscan = 5 } = options;

  // 使用 useLatest 保存最新的列表，避免闭包问题
  const latestList = useLatest(list);

  // 滚动位置
  const [scrollTop, setScrollTop] = useState(0);
  // 容器元素引用
  const containerRef = useRef<HTMLElement | null>(null);

  // 判断是否为固定高度
  const isFixedHeight = typeof itemHeight === 'number';

  // 计算每个项目的偏移位置和总高度
  const { offsets, totalHeight } = useMemo(() => {
    if (isFixedHeight) {
      // 固定高度：快速计算
      const height = itemHeight as number;
      const offsets = list.map((_, index) => index * height);
      const totalHeight = list.length * height;
      return { offsets, totalHeight };
    } else {
      // 动态高度：需要逐个计算
      const offsets: number[] = [];
      let currentOffset = 0;
      const getHeight = itemHeight as (index: number) => number;

      for (let i = 0; i < list.length; i++) {
        offsets.push(currentOffset);
        currentOffset += getHeight(i);
      }

      return { offsets, totalHeight: currentOffset };
    }
  }, [list, itemHeight, isFixedHeight]);

  // 计算可见区域的项目范围
  const { startIndex, endIndex } = useMemo(() => {
    if (list.length === 0) {
      return { startIndex: 0, endIndex: 0 };
    }

    // 计算可见区域的起始索引
    let startIndex = 0;
    if (isFixedHeight) {
      const height = itemHeight as number;
      startIndex = Math.floor(scrollTop / height);
    } else {
      // 二分查找起始位置
      let left = 0;
      let right = offsets.length - 1;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (offsets[mid] <= scrollTop) {
          startIndex = mid;
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
    }

    // 计算可见区域的结束索引
    const visibleEnd = scrollTop + containerHeight;
    let endIndex = startIndex;
    if (isFixedHeight) {
      const height = itemHeight as number;
      endIndex = Math.ceil(visibleEnd / height);
    } else {
      // 查找结束位置
      for (let i = startIndex; i < offsets.length; i++) {
        if (offsets[i] >= visibleEnd) {
          endIndex = i;
          break;
        }
        if (i === offsets.length - 1) {
          endIndex = i + 1;
        }
      }
    }

    // 添加预渲染区域
    const overscanStart = Math.max(0, startIndex - overscan);
    const overscanEnd = Math.min(list.length, endIndex + overscan);

    return {
      startIndex: overscanStart,
      endIndex: overscanEnd,
    };
  }, [
    scrollTop,
    containerHeight,
    list.length,
    offsets,
    itemHeight,
    isFixedHeight,
    overscan,
  ]);

  // 生成可见项目列表
  const visibleList = useMemo<VirtualListItem<T>[]>(() => {
    const result: VirtualListItem<T>[] = [];
    const currentList = latestList.current;

    for (let i = startIndex; i < endIndex; i++) {
      if (i >= 0 && i < currentList.length) {
        result.push({
          data: currentList[i],
          index: i,
          offset: offsets[i] || 0,
        });
      }
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startIndex, endIndex, offsets]);

  // 滚动处理函数
  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const newScrollTop = target.scrollTop;
    setScrollTop(newScrollTop);
  }, []);

  // 设置容器引用
  const setContainerRef = useCallback((element: HTMLElement | null) => {
    containerRef.current = element;
  }, []);

  // 滚动到指定偏移位置
  const scrollToOffset = useCallback((offset: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = offset;
      setScrollTop(offset);
    }
  }, []);

  // 滚动到指定索引
  const scrollTo = useCallback(
    (index: number) => {
      const currentList = latestList.current;
      if (index < 0 || index >= currentList.length) {
        return;
      }

      const offset = offsets[index] || 0;
      scrollToOffset(offset);
    },
    [offsets, latestList, scrollToOffset],
  );

  // 容器属性
  const containerProps = {
    style: {
      height: containerHeight,
      overflow: 'auto',
    } as React.CSSProperties,
    onScroll: handleScroll,
    ref: setContainerRef,
  };

  return {
    list: visibleList,
    containerProps,
    totalHeight,
    scrollTo,
    scrollToOffset,
  };
}
