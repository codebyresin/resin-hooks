import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  type UIEvent,
  type RefObject,
  type MutableRefObject,
} from 'react';

/** 分类滚动容器的元素类型（需支持 scrollTo、scrollTop） */
export type ScrollContainerElement = HTMLElement | null;

/** 分类区块元素类型（需支持 offsetHeight） */
export type SectionElement = HTMLElement | null;

/** useCategoryScroll 的配置 */
export interface UseCategoryScrollOptions<T = unknown> {
  /** 异步获取列表数据，用于计算区块高度与数量 */
  fetchDataFn: () => Promise<T[]>;
}

/** useCategoryScroll 的返回值 */
export interface UseCategoryScrollReturn<T = unknown> {
  /** 当前列表数据 */
  data: T[];
  /** 当前高亮分类索引 */
  activeIndex: number;
  /** 右侧滚动容器 ref */
  containerRef: RefObject<ScrollContainerElement>;
  /** 各分类区块 DOM ref 数组，按顺序与 data 对应 */
  sectionRefs: MutableRefObject<SectionElement[]>;
  /** 右侧滚动时调用，用于同步 activeIndex */
  onScroll: (e: UIEvent<HTMLElement>) => void;
  /** 点击左侧分类时滚动到对应区块 */
  scrollToIndex: (index: number) => void;
  /** 重新计算各区块起始高度（如图片 onLoad 后调用） */
  calculateHeights: () => void;
}

/**
 * useCategoryScroll - 工程级分类滚动 Hook
 */
export function useCategoryScroll<T = unknown>(
  fetchDataFn: () => Promise<T[]>,
): UseCategoryScrollReturn<T> {
  const [data, setData] = useState<T[]>([]); // 商品数据
  const [activeIndex, setActiveIndex] = useState(0); // 当前高亮分类

  const containerRef = useRef<ScrollContainerElement>(null); // 右侧滚动容器
  const sectionRefs = useRef<SectionElement[]>([]); // 分类区块 DOM
  const heightsRef = useRef<number[]>([]); // 每个区块起始高度
  const tickingRef = useRef(false); // scroll 节流

  // ----------------------------
  // 1️⃣ 请求数据
  // ----------------------------
  useEffect(() => {
    async function loadData() {
      const result = await fetchDataFn();
      setData(result);
    }
    loadData();
  }, [fetchDataFn]);

  // ----------------------------
  // 2️⃣ 计算高度
  // ----------------------------
  const calculateHeights = useCallback(() => {
    if (!sectionRefs.current.length) return;
    const heights: number[] = [];
    let total = 0;
    sectionRefs.current.forEach((el) => {
      if (!el) return;
      heights.push(total);
      total += el.offsetHeight;
    });
    heightsRef.current = heights;
  }, []);

  // 数据长度变化时，将 sectionRefs.current 裁剪为与 data 一致，避免残留旧索引
  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, data.length);
  }, [data.length]);

  // ----------------------------
  // 3️⃣ 数据渲染完成 + DOM 更新后，计算高度
  // ----------------------------
  useLayoutEffect(() => {
    if (!data.length) return;
    calculateHeights();

    // 窗口 resize 重新计算
    const handleResize = () => calculateHeights();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data, calculateHeights]);

  // ----------------------------
  // 4️⃣ 右侧滚动事件（节流）
  // ----------------------------
  const onScroll = (e: UIEvent<HTMLElement>) => {
    if (tickingRef.current) return;

    tickingRef.current = true;
    const target = e.target as HTMLElement;
    requestAnimationFrame(() => {
      const scrollTop = target.scrollTop;
      const heights = heightsRef.current;

      for (let i = 0; i < heights.length; i++) {
        if (
          scrollTop >= heights[i] &&
          scrollTop < (heights[i + 1] ?? Infinity)
        ) {
          setActiveIndex(i);
          break;
        }
      }
      tickingRef.current = false;
    });
  };

  // ----------------------------
  // 5️⃣ 点击左侧分类滚动到对应区块
  // ----------------------------
  const scrollToIndex = (index: number) => {
    const top = heightsRef.current[index] ?? 0;
    containerRef.current?.scrollTo({
      top,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  return {
    data,
    activeIndex,
    containerRef,
    sectionRefs,
    onScroll,
    scrollToIndex,
    calculateHeights, // 图片 onLoad 时使用
  };
}

// useLayoutEffect 会在 DOM 更新后、浏览器绘制前执行；
// useEffect 会在页面绘制完成后执行。
// 首次渲染时数据为空，是因为数据请求在 useEffect 中异步发起，
// 请求返回后通过 setState 触发二次渲染，
// 此时 useLayoutEffect 会再次执行，才能拿到有数据的 DOM。
